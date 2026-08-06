export interface Tool {
  name: string;
  slug: string;
  description: string;
}

export const ALL_TOOLS: Tool[] = [
  {
    name: "JSON Formatter",
    slug: "json-formatter",
    description: "Format, validate, and beautify JSON strings instantly.",
  },
  {
    name: "Word Counter",
    slug: "word-counter",
    description: "Count words, characters, sentences, and paragraphs.",
  },
  {
    name: "QR Code Generator",
    slug: "qr-code-generator",
    description: "Generate downloadable high-resolution QR codes.",
  },
  {
    name: "Password Generator",
    slug: "password-generator",
    description: "Generate strong, randomized passwords securely.",
  },
  {
    name: "Color Picker",
    slug: "color-picker",
    description: "Pick colors and extract HEX, RGB, and HSL codes.",
  },
  {
    name: "BMI Calculator",
    slug: "bmi-calculator",
    description: "Calculate your Body Mass Index quickly and accurately.",
  },
  {
    name: "Image to PDF",
    slug: "image-to-pdf",
    description: "Convert JPG and PNG images into a single PDF document.",
  },
  {
    name: "Merge PDF",
    slug: "merge-pdf",
    description: "Combine multiple PDF files into one consolidated document.",
  },
  {
    name: "Split PDF",
    slug: "split-pdf",
    description: "Extract specific page ranges into a separate PDF file.",
  },
  {
    name: "Rotate PDF",
    slug: "rotate-pdf",
    description: "Rotate PDF pages clockwise by 90, 180, or 270 degrees.",
  },
  {
    name: "Remove PDF Pages",
    slug: "remove-pdf-pages",
    description: "Delete unwanted pages from your PDF file.",
  },
  {
    name: "Compress PDF",
    slug: "compress-pdf",
    description: "Optimize and reduce the file size of your PDF document.",
  },
  {
    name: "PDF to Word",
    slug: "pdf-to-word",
    description: "Extract text from PDF files into editable document format.",
  },
  {
    name: "PDF to Excel",
    slug: "pdf-to-excel",
    description: "Convert tabular PDF data into Excel spreadsheet format.",
  },
];