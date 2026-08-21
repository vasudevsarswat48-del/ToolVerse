import { PDFDocument, PDFName, PDFDict, PDFRawStream } from "pdf-lib";

export type CompressionLevel = "low" | "medium" | "high";

const LEVEL_QUALITY: Record<CompressionLevel, number> = {
  low: 0.85,
  medium: 0.65,
  high: 0.4,
};

/**
 * Re-encodes embedded JPEG (DCTDecode) images at a lower quality via canvas.
 * This is the part that actually shrinks file size — saving with
 * useObjectStreams alone barely helps if the PDF has photos in it.
 */
async function recompressImages(pdfDoc: PDFDocument, quality: number) {
  const seen = new Set<string>();

  for (const page of pdfDoc.getPages()) {
    const resources = page.node.Resources();
    if (!resources) continue;
    const xObjects = resources.lookup(PDFName.of("XObject"));
    if (!(xObjects instanceof PDFDict)) continue;

    for (const [, ref] of xObjects.entries()) {
      const key = ref.toString();
      if (seen.has(key)) continue;
      seen.add(key);

      const obj = pdfDoc.context.lookup(ref);
      if (!(obj instanceof PDFRawStream)) continue;

      const subtype = obj.dict.get(PDFName.of("Subtype"));
      if (!subtype || subtype.toString() !== "/Image") continue;

      const filter = obj.dict.get(PDFName.of("Filter"));
      const filterName = filter ? filter.toString() : "";
      if (!filterName.includes("DCTDecode")) continue; // only handles JPEGs

      try {
        const bytes = obj.getContents();
        const blob = new Blob([bytes], { type: "image/jpeg" });
        const bitmap = await createImageBitmap(blob);
        const canvas = document.createElement("canvas");
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) continue;
        ctx.drawImage(bitmap, 0, 0);

        const newBlob: Blob | null = await new Promise((resolve) =>
          canvas.toBlob((b) => resolve(b), "image/jpeg", quality)
        );
        if (newBlob && newBlob.size < bytes.byteLength) {
          const newBytes = new Uint8Array(await newBlob.arrayBuffer());
          obj.dict.set(PDFName.of("Filter"), PDFName.of("DCTDecode"));
          obj.dict.set(PDFName.of("Length"), pdfDoc.context.obj(newBytes.length));
          (obj as any).contents = newBytes;
        }
      } catch {
        // skip images that fail to decode (e.g. CMYK JPEGs)
      }
    }
  }
}

/**
 * Compresses a PDF File/Blob and returns the compressed bytes as a Blob.
 *
 * Usage:
 *   const compressed = await compressPdf(file, "medium");
 *   const url = URL.createObjectURL(compressed);
 */
export async function compressPdf(
  file: File | Blob,
  level: CompressionLevel = "medium"
): Promise<Blob> {
  const bytes = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });

  await recompressImages(pdfDoc, LEVEL_QUALITY[level]);

  const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
  return new Blob([pdfBytes as BlobPart], { type: "application/pdf" });
}
