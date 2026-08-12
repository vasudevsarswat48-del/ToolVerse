import React from "react";
import { notFound } from "next/navigation";
import { ALL_TOOLS } from "@/lib/constants/tools";

// Existing Tools
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
import ChmodPermissionsCalculator from "@/components/tools/chmod-calculator";
import CronExpressionParser from "@/components/tools/cron-parser";

// Developer Utilities
import Base64EncoderorDecoder from "@/components/tools/base64";
import JwtDecoder from "@/components/tools/jwt-decoder";
import DiffChecker from "@/components/tools/diff-checker";
import SqlFormatter from "@/components/tools/sql-formatter";
import RegexTester from "@/components/tools/regex-tester";
import MarkdownEditorandPreviewer from "@/components/tools/markdown-editor";
import CodeMinifierandUnminifier from "@/components/tools/code-minifier";
import CURLtoFetchConverter from "@/components/tools/curl-to-fetch";

// Text & String Manipulation
import CaseConverter from "@/components/tools/case-converter";
import SlugGenerator from "@/components/tools/slug-generator";
import LoremIpsumGenerator from "@/components/tools/lorem-ipsum-generator";
import StringInspectorandByteCounter from "@/components/tools/string-inspector";
import DuplicateLineRemover from "@/components/tools/duplicate-line-remover";

// Web & Network Utilities
import UrlEncoderorDecoder from "@/components/tools/url-encoder";
import UrlQueryParser from "@/components/tools/url-parser";
import MetaTagGeneratorandOpenGraphGenerator from "@/components/tools/meta-tag-generator";
import UserAgentParser from "@/components/tools/user-agent-parser";
import HashGenerator from "@/components/tools/hash-generator";

// Image & Media Processing
import ImageCompressor from "@/components/tools/image-compressor";
import ImageConverter from "@/components/tools/image-converter";
import ImageResizerandCropper from "@/components/tools/image-resizer";
import SvgMinifier from "@/components/tools/svg-minifier";
import FaviconGenerator from "@/components/tools/favicon-generator";

// Calculators & Converters
import AspectRatioCalculator from "@/components/tools/aspect-ratio";
import PxToRemorEMConverter from "@/components/tools/px-to-rem";
import UnixTimestampConverter from "@/components/tools/unix-timestamp";

const toolComponents: Record<string, React.ReactNode> = {
  // Existing Tools
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

  // Developer Utilities
  "base64": <Base64EncoderorDecoder />,
  "jwt-decoder": <JwtDecoder />,
  "diff-checker": <DiffChecker />,
  "sql-formatter": <SqlFormatter />,
  "regex-tester": <RegexTester />,
  "markdown-editor": <MarkdownEditorandPreviewer />,
  "code-minifier": <CodeMinifierandUnminifier />,
  "curl-to-converter": <cURLtoFetchConverter />,

  // Text & String Manipulation
  "case-converter": <CaseConverter />,
  "slug-generator": <SlugGenerator />,
  "lorem-ipsum-generator": <LoremIpsumGenerator />,
  "string-inspector": <StringInspectorandByteCounter />,
  "duplicate-line-remover": <DuplicateLineRemover />,

  // Web & Network Utilities
  "url-encoder": <UrlEncoderorDecoder />,
  "url-parser": <UrlQueryParser />,
  "meta-generator": <MetaTagGeneratorandOpenGraphGenerator />,
  "user-agent-parser": <UserAgentParser />,
  "hash-generator": <HashGenerator />,

  // Image & Media Processing
  "image-compressor": <ImageCompressor />,
  "image-converter": <ImageConverter />,
  "image-resizer": <ImageResizerandCropper />,
  "svg-minifier": <SvgMinifier />,
  "favicon-generator": <FaviconGenerator />,

  // Calculators & Converters
  "aspect-ratio": <AspectRatioCalculator />,
  "px-to-rem": <PxToRemorEMConverter />,
  "unix-timestamp": <UnixTimestampConverter />,
  "chmod-calculator": <ChmodPermissionCalculator />,
  "cron-parser": <CronExpressionParser />,
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
          <div className="text-center py-12 text-slate-400">
            Tool module coming soon!
          </div>
        )}
      </div>
    </div>
  );
}
