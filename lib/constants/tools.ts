export interface Tool {
  name: string;
  slug: string;
  description: string;
  category?: 'Developer' | 'Text' | 'Web' | 'Image' | 'Calculators' | 'PDF' | string;
  // If old tools required other properties (like icon or component), mark them optional too:
  // icon?: any;
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
{ slug: "base64", name: "Base64 Encoder or Decoder", description: "Encode text to Base64 or decode back instantly.", category: "Developer" },
  { slug: "jwt-decoder", name: "JWT Decoder", description: "Decode and inspect JSON Web Tokens safely.", category: "Developer" },
  { slug: "diff-checker", name: "Diff Checker", description: "Compare two pieces of text side-by-side.", category: "Developer" },
  { slug: "sql-formatter", name: "SQL Formatter", description: "Beautify and format messy SQL queries.", category: "Developer" },
  { slug: "regex-tester", name: "Regex Tester", description: "Test regular expressions with real-time matching.", category: "Developer" },
  { slug: "markdown-editor", name: "Markdown Editor and Previewer", description: "Write markdown and preview rendered HTML live.", category: "Developer" },
  { slug: "code-minifier", name: "Code Minifier and Unminifier", description: "Minify or unminify HTML, CSS, and JS code.", category: "Developer" },
  { slug: "curl-to-fetch", name: "cURL to Fetch Converter", description: "Convert cURL commands into JavaScript fetch code.", category: "Developer" },

  // Text & String Manipulation
  { slug: "case-converter", name: "Case Converter", description: "Switch text between uppercase, camelCase, snake_case, etc.", category: "Text" },
  { slug: "slug-generator", name: "Slug Generator", description: "Convert titles into clean URL slugs.", category: "Text" },
  { slug: "lorem-ipsum-generator", name: "Lorem Ipsum Generator", description: "Generate placeholder text paragraphs.", category: "Text" },
  { slug: "string-inspector", name: "String Inspector and Byte Counter", description: "Count characters, words, lines, and bytes.", category: "Text" },
  { slug: "duplicate-line-remover", name: "Duplicate Line Remover", description: "Clean up duplicate rows of text instantly.", category: "Text" },

  // Web & Network Utilities
  { slug: "url-encoder", name: "URL Encoder or Decoder", description: "Encode and decode special characters in URLs.", category: "Web" },
  { slug: "url-parser", name: "URL Query Parser", description: "Parse URL query parameters into structured JSON.", category: "Web" },
  { slug: "meta-tag-generator", name: "Meta Tag and OpenGraph Generator", description: "Generate SEO meta tags for your web pages.", category: "Web" },
  { slug: "user-agent", name: "User Agent Parser", description: "Parse browser and device details from user strings.", category: "Web" },
  { slug: "hash-generator", name: "Hash Generator", description: "Generate MD5 and SHA-256 hashes.", category: "Web" },

  // Image & Media Processing
  { slug: "image-compressor", name: "Image Compressor", description: "Compress PNG, JPEG, and WebP images locally.", category: "Image" },
  { slug: "image-converter", name: "Image Converter", description: "Convert image formats between PNG, JPG, and WebP.", category: "Image" },
  { slug: "image-resizer", name: "Image Resizer and Cropper", description: "Resize images to precise dimensions.", category: "Image" },
  { slug: "svg-minifier", name: "SVG Minifier", description: "Optimize and minify SVG code files.", category: "Image" },
  { slug: "favicon-generator", name: "Favicon Generator", description: "Create multi-size favicons from source images.", category: "Image" },

  // Calculators & Converters
  { slug: "aspect-ratio", name: "Aspect Ratio Calculator", description: "Calculate proportions for images and videos.", category: "Calculators" },
  { slug: "px-to-rem", name: "PX to REM or EM Converter", description: "Convert pixel values to flexible CSS units.", category: "Calculators" },
  { slug: "unix-timestamp", name: "Unix Timestamp Converter", description: "Convert timestamps to human-readable dates.", category: "Calculators" },
  { slug: "chmod-calculator", name: "Chmod Permissions Calculator", description: "Calculate Linux file permissions numeric codes.", category: "Calculators" },
  { slug: "cron-parser", name: "Cron Expression Parser", description: "Translate cron schedules into plain English.", category: "Calculators" },
// Some More
 {
    slug: "invoice-generator",
    name: "Receipt / Invoice Generator",
    description: "Generate clean custom invoices and receipts as PDFs.",
  },
  {
    slug: "sign-pdf",
    name: "Sign PDF / Draw Signature",
    description: "Draw signatures and place them onto PDF files.",
  },
  {
    slug: "pdf-watermark",
    name: "Watermark Remover / Adder",
    description: "Add text or image watermarks to PDF files.",
  },
  {
    slug: "grammar-checker",
    name: "Plagiarism & Grammar Checker",
    description: "Check text structure and readability.",
  },
  {
    slug: "gpa-calculator",
    name: "GPA & Grade Calculator",
    description: "Calculate high school and college semester GPAs.",
  },
  {
    slug: "word-to-pdf",
    name: "Word to PDF Converter",
    description: "Convert Word DOCX documents to PDF format.",
  },
  {
    slug: "excel-to-pdf",
    name: "Excel to PDF Converter",
    description: "Convert Excel spreadsheets to formatted PDFs.",
  },
  {
    slug: "emi-calculator",
    name: "EMI & Loan Calculator",
    description: "Calculate monthly loan EMIs and total interest.",
  },
  {
    slug: "fuel-calculator",
    name: "Fuel Cost Calculator",
    description: "Estimate fuel consumption and total trip cost.",
  }, 

];
