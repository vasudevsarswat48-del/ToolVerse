import React from "react";
import { notFound } from "next/navigation";
import { ALL_TOOLS } from "@/lib/constants/tools";

import JsonFormatter from "@/components/tools/json-formatter";
import WordCounter from "@/components/tools/word-counter";
import QrCodeGenerator from "@/components/tools/qr-code-generator";
import PasswordGenerator from "@/components/tools/password-generator";
import ColorPicker from "@/components/tools/color-picker";
import BmiCalculator from "@/components/tools/bmi-calculator";
import ImageToPdf from "@/components/tools/image-to-pdf";
import MergePdf from "@/components/tools/merge-pdf";
import SplitPdf from "@/components/tools/split-pdf";
import RotatePdf from "@/components/tools/rotate-pdf";
import RemovePdfPages from "@/components/tools/remove-pdf-pages";
import CompressPdf from "@/components/tools/compress-pdf";
import PdfToWord from "@/components/tools/pdf-to-word";
import PdfToExcel from "@/components/tools/pdf-to-excel";

const toolComponents: Record<string, React.ReactNode> = {
  "json-formatter": <JsonFormatter />,
  "word-counter": <WordCounter />,
  "qr-code-generator": <QrCodeGenerator />,
  "password-generator": <PasswordGenerator />,
  "color-picker": <ColorPicker />,
  "bmi-calculator": <BmiCalculator />,
  "image-to-pdf": <ImageToPdf />,
  "merge-pdf": <MergePdf />,
  "split-pdf": <SplitPdf />,
  "rotate-pdf": <RotatePdf />,
  "remove-pdf-pages": <RemovePdfPages />,
  "compress-pdf": <CompressPdf />,
  "pdf-to-word": <PdfToWord />,
  "pdf-to-excel": <PdfToExcel />,
};

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = ALL_TOOLS.find((t) => t.slug === slug);

  if (!tool) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">{tool.name}</h1>
        <p className="text-gray-400 text-sm">{tool.description}</p>
      </div>
      <div className="glass-panel p-6 rounded-2xl">
        {toolComponents[slug] || (
          <div className="text-amber-400">Tool interface is loading or under maintenance.</div>
        )}
      </div>
    </div>
  );
}