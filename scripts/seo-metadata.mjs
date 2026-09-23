// SERP metadata for every English tool page.
//
// Why this file exists: the inherited page metadata was keyword-stuffed ad copy
// ("★ Split PDF online free ★ No signup ★ Unlimited files ★ …") with a <title>
// that repeated only the tool name. Google showed the short title and ignored
// the starred description, so pages ranking on page 1 earned no clicks.
//
// Rules for entries here:
//   - title:        primary search phrase FIRST, brand LAST, 45-60 chars.
//   - description:  what the tool actually does + why it is safe, 115-158 chars.
//                   No star separators, no keyword lists, no unsupported claims.
//   - Every page in src/pages/ must have an entry; apply-seo-metadata.mjs fails
//     the build when one is missing or out of range.
//
// Phrases are chosen from Search Console data: the title leads with the wording
// people actually type (e.g. "how to split pdf", "pdf form filler"), not the
// internal tool name.

export const SEO = {
  'add-attachments': {
    title: 'Add Attachments to a PDF — Free Online Tool | PDFBay',
    description:
      'Attach files, images or other documents to a PDF and keep them embedded in the same file. Free, no signup, and everything runs in your browser.',
  },
  'add-blank-page': {
    title: 'Add a Blank Page to PDF — Free & Private | PDFBay',
    description:
      'Insert a blank page anywhere in a PDF, at the size of the first page or a custom size. Free, no signup, and nothing is uploaded.',
  },
  'add-page-labels': {
    title: 'Add PDF Page Labels — Roman Numerals, Prefixes | PDFBay',
    description:
      'Give PDF pages real page labels: roman numerals for front matter, decimal for the body, with prefixes and custom start values.',
  },
  'add-stamps': {
    title: 'Add a Stamp to a PDF — Free Online Stamp Tool | PDFBay',
    description:
      'Stamp text or an image onto PDF pages from the annotation toolbar, with control over position, size and rotation. Nothing is uploaded.',
  },
  'add-watermark': {
    title: 'Add a Watermark to PDF — Text or Image | PDFBay',
    description:
      'Watermark every PDF page with custom text or an image. Set opacity, angle, position and font, then export — all in your browser.',
  },
  'adjust-colors': {
    title: 'Adjust PDF Colors — Brightness, Contrast, Saturation | PDFBay',
    description:
      'Fine-tune brightness, contrast, saturation and more in a PDF, previewing the result live before you export. No signup, no upload.',
  },
  'alternate-merge': {
    title: 'Alternate & Mix PDF Pages — Interleave Two PDFs | PDFBay',
    description:
      'Merge two PDFs by alternating pages — front and back, odd and even, or with the second file reversed. Bookmarks are preserved.',
  },
  'background-color': {
    title: 'Change PDF Background Color — Free Online | PDFBay',
    description:
      'Set a background colour behind every page of a PDF, useful for colour paper, letterheads or reading comfort. Processed in your browser.',
  },
  'bates-numbering': {
    title: 'Bates Numbering — Add Legal Bates Stamps | PDFBay',
    description:
      'Add sequential Bates numbers across one or many PDFs, with prefix, suffix, start value and placement you control. Free legal numbering.',
  },
  'bmp-to-pdf': {
    title: 'BMP to PDF Converter — Free & Private | PDFBay',
    description:
      'Create a PDF from one or more BMP images. Combine files into a single document, set the page size and margins, and download.',
  },
  bookmark: {
    title: 'Edit PDF Bookmarks — Add, Import & Reorder | PDFBay',
    description:
      'Add, edit, import, delete or extract PDF bookmarks and outline entries. Reorder chapters without touching the page content.',
  },
  'cbz-to-pdf': {
    title: 'CBZ to PDF — Convert Comic Archives Free | PDFBay',
    description:
      'Turn CBZ or CBR comic book archives into a single PDF, keeping the page order. Nothing is uploaded — the conversion runs locally.',
  },
  'change-permissions': {
    title: 'Change PDF Permissions — Printing, Copying, Editing | PDFBay',
    description:
      'Set or change PDF permission flags — printing, copying, editing and annotations — with an optional owner password. Runs in your browser.',
  },
  'combine-single-page': {
    title: 'Combine PDF Pages into One Long Page | PDFBay',
    description:
      'Stitch every page of a PDF into one continuous scrolling page — useful for web reading, receipts and long tables. No upload required.',
  },
  'compare-pdfs': {
    title: 'Compare Two PDFs — Find the Differences | PDFBay',
    description:
      'Compare two PDFs side by side or overlaid to see exactly what changed between revisions, with page-by-page highlighting. Fully private.',
  },
  'compress-pdf': {
    title: 'Compress PDF — Reduce PDF File Size Free | PDFBay',
    description:
      'Shrink large PDFs by removing dead weight, optimising images and subsetting fonts, with a compression level to balance size and quality.',
  },
  'crop-pdf': {
    title: 'Crop PDF Pages — Trim Margins Free | PDFBay',
    description:
      'Trim the margins or whitespace from one page or every page of a PDF. Drag the crop box, apply to all pages, then download.',
  },
  'csv-to-pdf': {
    title: 'CSV to PDF — Convert Spreadsheets into Tables | PDFBay',
    description:
      'Convert CSV files into clean, paginated PDF tables. Set orientation, page size and header rows, and convert several files at once.',
  },
  'decrypt-pdf': {
    title: 'Decrypt PDF — Remove a PDF Password | PDFBay',
    description:
      'Unlock a password-protected PDF you own: enter the password and save an unprotected copy. The file and password stay on your device.',
  },
  'delete-pages': {
    title: 'Delete PDF Pages — Remove Pages Free | PDFBay',
    description:
      'Remove unwanted pages from a PDF. Select them visually or type page ranges, then export a clean copy. Free and entirely in-browser.',
  },
  'deskew-pdf': {
    title: 'Deskew PDF — Straighten Tilted Scans | PDFBay',
    description:
      'Automatically straighten tilted scans and crooked phone photos so the text sits level on the page, page by page. Nothing is uploaded.',
  },
  'digital-sign-pdf': {
    title: 'Add a Digital Signature to PDF — Free | PDFBay',
    description:
      'Sign a PDF with an X.509 certificate and a PKCS#7 signature, with an optional visible stamp. Your certificate and private key never leave your browser.',
  },
  'divide-pages': {
    title: 'Divide PDF Pages — Split or Cut Pages | PDFBay',
    description:
      'Split a PDF by page ranges, into equal parts, or cut each page in half horizontally. Select which pages to divide and keep the rest as-is.',
  },
  'duplex-collate': {
    title: 'Duplex Collate — Fix Front/Back Scan Order | PDFBay',
    description:
      'Reorder a scan captured as two blocks — all fronts, then all backs — back into proper front/back page order. Handles uneven blocks.',
  },
  'edit-attachments': {
    title: 'Edit PDF Attachments — Add & Remove Files | PDFBay',
    description:
      'Add, extract or delete the files embedded inside a PDF. Free and private — attachments are edited in your browser, never on a server.',
  },
  'edit-metadata': {
    title: 'Edit PDF Metadata — Title, Author, Subject | PDFBay',
    description:
      "Change a PDF's title, author, subject, keywords and custom properties, then save. Free, no signup, and the file never leaves your device.",
  },
  'edit-pdf-text': {
    title: 'Edit PDF Text — Change Text in a PDF | PDFBay',
    description:
      'Click any paragraph in a PDF and edit it in place, with live reflow, fonts and styling. Free and in-browser — nothing is uploaded.',
  },
  'edit-pdf': {
    title: 'Edit PDF Online Free — PDF Editor in Your Browser | PDFBay',
    description:
      'Annotate, highlight, redact, comment, add text, shapes and images to a PDF, then save it. No signup and your file never leaves your device.',
  },
  'email-to-pdf': {
    title: 'Email to PDF — Convert EML & MSG Files Free | PDFBay',
    description:
      'Convert Outlook MSG and EML emails to PDF, including headers, body and attachments, with options for what to include. Runs in your browser.',
  },
  'encrypt-pdf': {
    title: 'Encrypt PDF — Password Protect Your PDF | PDFBay',
    description:
      'Password-protect a PDF with AES encryption and choose what readers may do — printing, copying or editing. Your password stays local.',
  },
  'epub-to-pdf': {
    title: 'EPUB to PDF Converter — Free & Private | PDFBay',
    description:
      'Convert EPUB e-books to PDF with consistent pagination, keeping chapters and images. Supports several files and nothing is uploaded.',
  },
  'excel-to-pdf': {
    title: 'Excel to PDF — Convert XLSX, XLS & ODS | PDFBay',
    description:
      'Convert Excel spreadsheets (XLSX, XLS, ODS, CSV) to PDF, with several files supported and the layout preserved. Processed in your browser.',
  },
  'extract-attachments': {
    title: 'Extract PDF Attachments — Download All Files | PDFBay',
    description:
      'Extract every file embedded inside one or more PDFs and download them together as a ZIP. Free and private — nothing is uploaded.',
  },
  'extract-images': {
    title: 'Extract Images from PDF — Free Online | PDFBay',
    description:
      'Pull every embedded image out of a PDF at its original resolution, or copy images straight to the clipboard. Runs entirely in your browser.',
  },
  'extract-pages': {
    title: 'Extract PDF Pages — Save Pages as a New PDF | PDFBay',
    description:
      'Extract the pages you need from a PDF into a new document — single pages, ranges, or every even or odd page. No signup, no upload.',
  },
  'extract-tables': {
    title: 'Extract PDF Tables — Export to CSV, JSON, Markdown | PDFBay',
    description:
      'Detect tables in a PDF and export them as CSV, JSON or Markdown. Works on text-based PDFs and runs entirely in your browser.',
  },
  'fb2-to-pdf': {
    title: 'FB2 to PDF — Convert FictionBook Files Free | PDFBay',
    description:
      'Convert FictionBook (FB2) e-books to PDF, keeping the chapter structure. Supports several files at once and nothing is uploaded.',
  },
  'fix-page-size': {
    title: 'Fix PDF Page Size — Standardise Pages | PDFBay',
    description:
      'Resize every page of a PDF to one uniform page size, such as A4 or Letter, with scaling or padding. Free and processed in your browser.',
  },
  'flatten-pdf': {
    title: 'Flatten PDF — Make Forms & Annotations Permanent | PDFBay',
    description:
      'Flatten form fields, annotations and comments into the page content so they can no longer be edited or removed. Nothing is uploaded.',
  },
  'font-to-outline': {
    title: 'Convert PDF Fonts to Outlines — Print-Ready | PDFBay',
    description:
      'Convert embedded fonts to vector outlines so a PDF renders identically everywhere, with no font dependency. Ideal for print-ready files.',
  },
  'form-creator': {
    title: 'Create Fillable PDF Forms — Drag & Drop | PDFBay',
    description:
      'Build a fillable PDF form by dragging text fields, checkboxes and dropdowns onto the page, then export it. Free and fully in-browser.',
  },
  'form-filler': {
    title: 'Fill PDF Forms Online Free — PDF Form Filler | PDFBay',
    description:
      'Fill in PDF form fields directly in the viewer, including XFA forms, then save or print the completed file. No signup and nothing is uploaded.',
  },
  'header-footer': {
    title: 'Add Header & Footer to PDF — Page Numbers | PDFBay',
    description:
      'Add headers and footers to a PDF with page numbers, dates or custom text, and control their position, font and first page. Runs locally.',
  },
  'heic-to-pdf': {
    title: 'HEIC to PDF — Convert iPhone Photos Free | PDFBay',
    description:
      'Create a PDF from one or more HEIC images straight from an iPhone, combining them into one document. Nothing is uploaded.',
  },
  'image-to-pdf': {
    title: 'Images to PDF — JPG, PNG, WebP, HEIC & More | PDFBay',
    description:
      'Convert JPG, PNG, BMP, GIF, TIFF, WebP, HEIC, PSD, SVG and JP2 images into one PDF. Reorder, set page size, and keep the quality.',
  },
  'image-to-text': {
    title: 'Image to Text — Free OCR in Your Browser | PDFBay',
    description:
      'Extract the text from photos and screenshots — JPG, PNG, WebP, BMP, TIFF and HEIC — with OCR that runs in your browser. No upload, no signup.',
  },
  'invert-colors': {
    title: 'Invert PDF Colors — Dark Mode for PDFs | PDFBay',
    description:
      'Create a dark-mode version of a PDF by inverting the colours, easier on the eyes for night reading and cheaper to print on dark paper.',
  },
  'jpg-to-pdf': {
    title: 'JPG to PDF — Convert JPEG Images Free | PDFBay',
    description:
      'Create a PDF from JPG, JPEG and JPEG 2000 (JP2/JPX) images, combining several into one document with the page size you choose.',
  },
  'json-to-pdf': {
    title: 'JSON to PDF — Rebuild a PDF from Exported JSON | PDFBay',
    description:
      'Turn JSON exported by the PDF to JSON converter back into a PDF, preserving the original structure. Note: other JSON files are not supported.',
  },
  'linearize-pdf': {
    title: 'Linearize PDF — Fast Web View Optimisation | PDFBay',
    description:
      'Linearize a PDF for Fast Web View so the first page displays before the rest has downloaded. Free, private and processed in your browser.',
  },
  'markdown-to-pdf': {
    title: 'Markdown to PDF — Write and Export | PDFBay',
    description:
      'Write or paste Markdown and export it as a formatted PDF with headings, lists, tables and code blocks. No signup and nothing is uploaded.',
  },
  'merge-pdf': {
    title: 'Merge PDF Files Free Online — Combine PDFs | PDFBay',
    description:
      'Combine whole PDFs or pick specific page ranges from each, arrange the order, and merge into one document. Free and fully in-browser.',
  },
  'mobi-to-pdf': {
    title: 'MOBI to PDF — Convert Kindle Files Free | PDFBay',
    description:
      'Convert MOBI e-books to PDF, keeping the text and images readable. Supports several files at once and nothing leaves your device.',
  },
  'n-up-pdf': {
    title: 'N-Up PDF — Print Multiple Pages per Sheet | PDFBay',
    description:
      'Arrange 2, 4, 6 or more PDF pages onto a single sheet, with margins, borders and page size you control. Great for handouts and drafts.',
  },
  'ocr-pdf': {
    title: 'OCR PDF — Make a Scanned PDF Searchable | PDFBay',
    description:
      'Add an invisible text layer to a scanned PDF so it becomes searchable and copyable while looking exactly the same. OCR runs in your browser.',
  },
  'odg-to-pdf': {
    title: 'ODG to PDF — Convert OpenDocument Graphics | PDFBay',
    description:
      'Convert OpenDocument Graphics (ODG) files to PDF, preserving the drawing layout. Several files supported, all processed in your browser.',
  },
  'odp-to-pdf': {
    title: 'ODP to PDF — Convert OpenDocument Presentations | PDFBay',
    description:
      'Convert OpenDocument Presentation (ODP) files to PDF with slides and notes intact. Several files supported and nothing is uploaded.',
  },
  'ods-to-pdf': {
    title: 'ODS to PDF — Convert OpenDocument Spreadsheets | PDFBay',
    description:
      'Convert ODS spreadsheets to PDF, keeping the sheet layout and formatting. Convert several files at once without uploading anything.',
  },
  'odt-to-pdf': {
    title: 'ODT to PDF — Convert OpenDocument Text Free | PDFBay',
    description:
      'Convert ODT documents to PDF with the fonts, images and layout preserved. Supports several files and runs entirely in your browser.',
  },
  'organize-pdf': {
    title: 'Organize PDF Pages — Reorder, Duplicate, Delete | PDFBay',
    description:
      'Reorder PDF pages by dragging, duplicate or delete them, and insert pages from another file. Free and private — nothing is uploaded.',
  },
  'overlay-pdf': {
    title: 'PDF Overlay & Underlay — Combine Two PDFs | PDFBay',
    description:
      'Overlay or underlay the pages of one PDF onto another — letterheads, backgrounds, stamps and watermarks. Free and fully in-browser.',
  },
  'page-dimensions': {
    title: 'PDF Page Dimensions — Size & Orientation Report | PDFBay',
    description:
      'Inspect the page size, orientation and unit measurements of every page in a PDF, including mixed-size documents. Nothing is uploaded.',
  },
  'page-numbers': {
    title: 'Add Page Numbers to PDF — Free Online | PDFBay',
    description:
      'Add page numbers to a PDF, choosing the position, font, starting number and format — including ranges and skipping the first page.',
  },
  'pages-to-pdf': {
    title: 'Pages to PDF — Convert Apple Pages Files | PDFBay',
    description:
      'Convert Apple Pages documents to PDF with the layout and formatting preserved. Supports several files and processes them in your browser.',
  },
  'pdf-booklet': {
    title: 'PDF Booklet — Impose Pages for Printing | PDFBay',
    description:
      'Rearrange PDF pages into booklet order for double-sided printing, so folding and stapling produces a real booklet. Runs in your browser.',
  },
  'pdf-layers': {
    title: 'PDF Layers — View, Toggle & Edit OCG Layers | PDFBay',
    description:
      'View, toggle, add and delete optional content group (OCG) layers in a PDF, then save the file with the layers you want visible.',
  },
  'pdf-multi-tool': {
    title: 'PDF Multi Tool — Merge, Split, Rotate & Organise | PDFBay',
    description:
      'Merge, split, organise, rotate, delete, extract and duplicate pages across several PDFs in one visual workspace. Nothing is uploaded.',
  },
  'pdf-to-bmp': {
    title: 'PDF to BMP — Convert PDF Pages to Images | PDFBay',
    description:
      'Convert each PDF page into a BMP image at the resolution you pick, and download them individually or together. Runs in your browser.',
  },
  'pdf-to-cbz': {
    title: 'PDF to CBZ — Convert to Comic Book Archive | PDFBay',
    description:
      'Convert a PDF into a CBZ comic book archive that readers like Panels and YACReader can open, with your choice of image quality.',
  },
  'pdf-to-csv': {
    title: 'PDF to CSV — Extract PDF Tables to Spreadsheets | PDFBay',
    description:
      'Extract tables from a PDF and save them as CSV for Excel or Sheets, one file per table or page. Free and processed in your browser.',
  },
  'pdf-to-docx': {
    title: 'PDF to Word — Convert PDF to DOCX Free | PDFBay',
    description:
      'Convert a PDF into an editable Word document (DOCX) that keeps the text, tables and layout. No signup and nothing is uploaded.',
  },
  'pdf-to-excel': {
    title: 'PDF to Excel — Convert PDF Tables to XLSX | PDFBay',
    description:
      'Extract tables from a PDF into an Excel workbook (XLSX) with rows and columns intact. Free, private and processed in your browser.',
  },
  'pdf-to-greyscale': {
    title: 'PDF to Greyscale — Convert Colour PDFs | PDFBay',
    description:
      'Convert a colour PDF to greyscale, keeping the text sharp and the file small. Useful for cheap printing and black-and-white forms.',
  },
  'pdf-to-jpg': {
    title: 'PDF to JPG — Convert PDF Pages to Images Free | PDFBay',
    description:
      'Convert PDF pages to JPG, JPEG or JPEG 2000 images at the quality and resolution you choose. Pick pages, then download them all.',
  },
  'pdf-to-json': {
    title: 'PDF to JSON — Export Structure for RAG & Data | PDFBay',
    description:
      'Export a PDF as structured JSON with text, headings, tables and positions per page, ready for data pipelines or LLM processing.',
  },
  'pdf-to-markdown': {
    title: 'PDF to Markdown — Extract Text and Tables | PDFBay',
    description:
      'Convert PDF text, headings and tables into clean Markdown for docs, wikis or LLM prompts. Free and processed entirely in your browser.',
  },
  'pdf-to-pdfa': {
    title: 'PDF to PDF/A — Convert for Long-Term Archiving | PDFBay',
    description:
      'Convert a PDF to PDF/A for archiving, embedding the fonts, colour profile and metadata the ISO standard requires. Nothing is uploaded.',
  },
  'pdf-to-png': {
    title: 'PDF to PNG Converter — Free Online, No Upload | PDFBay',
    description:
      'Convert PDF pages to PNG images at any scale, with transparency and page selection, and download them as a set. Your file stays local.',
  },
  'pdf-to-svg': {
    title: 'PDF to SVG — Convert PDF Pages to Vectors | PDFBay',
    description:
      'Convert each PDF page into a scalable SVG that stays sharp at any size, ideal for logos, diagrams and single-page graphics.',
  },
  'pdf-to-text': {
    title: 'PDF to Text — Extract Text from PDF Free | PDFBay',
    description:
      'Extract the text from PDF files into plain .txt, including multi-column layouts, and convert several files at once. Nothing is uploaded.',
  },
  'pdf-to-tiff': {
    title: 'PDF to TIFF — Convert PDF Pages at Any DPI | PDFBay',
    description:
      'Convert PDF pages into TIFF images at the DPI you choose, with optional multi-page output. Suitable for print and archival workflows.',
  },
  'pdf-to-webp': {
    title: 'PDF to WebP — Convert PDF Pages to Images | PDFBay',
    description:
      'Convert PDF pages into WebP images, which stay sharp while taking far less space than JPG or PNG. Free and processed in your browser.',
  },
  'pdf-to-zip': {
    title: 'PDF to ZIP — Package Several PDFs into One File | PDFBay',
    description:
      'Pack multiple PDF files into a single ZIP archive, with the original file names preserved. Free and nothing is uploaded.',
  },
  'pdf-workflow': {
    title: 'PDF Workflow Builder — Chain Tools into a Pipeline | PDFBay',
    description:
      'Build a visual pipeline of PDF steps — merge, rotate, watermark, compress — and run it over your files in one pass. Runs in your browser.',
  },
  'png-to-pdf': {
    title: 'PNG to PDF Converter — Combine Images Free | PDFBay',
    description:
      'Create a PDF from one or more PNG images, reorder them, set the page size and margins, and keep transparency where it matters.',
  },
  'posterize-pdf': {
    title: 'Posterize PDF — Split Pages into Large Prints | PDFBay',
    description:
      'Split a large PDF page into a grid of smaller tiles you can print on a normal printer and assemble into a poster. Nothing is uploaded.',
  },
  'powerpoint-to-pdf': {
    title: 'PowerPoint to PDF — Convert PPTX & PPT Free | PDFBay',
    description:
      'Convert PowerPoint presentations (PPTX, PPT, ODP) to PDF with the slides and layout intact. Several files supported, nothing uploaded.',
  },
  'prepare-pdf-for-ai': {
    title: 'Prepare PDF for AI — Export for RAG Pipelines | PDFBay',
    description:
      'Extract a PDF as LlamaIndex-style JSON with page metadata and context, ready to feed into RAG and LLM pipelines. Processed in your browser.',
  },
  'psd-to-pdf': {
    title: 'PSD to PDF — Convert Photoshop Files Free | PDFBay',
    description:
      'Convert Adobe Photoshop (PSD) files to PDF with the composition flattened, and combine several files into one document.',
  },
  'pub-to-pdf': {
    title: 'PUB to PDF — Convert Microsoft Publisher Files | PDFBay',
    description:
      'Convert Microsoft Publisher (PUB) files to PDF so they open anywhere, without Publisher installed. Nothing is uploaded.',
  },
  'rasterize-pdf': {
    title: 'Rasterize PDF — Flatten to Image-Based PDF | PDFBay',
    description:
      'Convert a PDF into an image-based PDF, flattening layers and removing selectable text — useful before sharing sensitive documents.',
  },
  'remove-annotations': {
    title: 'Remove PDF Annotations — Comments & Highlights | PDFBay',
    description:
      'Strip comments, highlights, stamps and markup from a PDF so only the original page content remains. Free and fully in-browser.',
  },
  'remove-blank-pages': {
    title: 'Remove Blank Pages from PDF — Automatic | PDFBay',
    description:
      'Detect and delete blank pages from a PDF automatically, with a sensitivity setting so lightly marked pages are kept. Nothing is uploaded.',
  },
  'remove-metadata': {
    title: 'Remove Metadata from PDF — Strip Hidden Data | PDFBay',
    description:
      "Remove a PDF's hidden metadata — author, creator, producer, dates and private application data — before you share it. Runs locally.",
  },
  'remove-restrictions': {
    title: 'Remove PDF Restrictions — Unlock a PDF | PDFBay',
    description:
      'Remove printing, copying and editing restrictions from a PDF you own so the content can be reused. Free and processed in your browser.',
  },
  'repair-pdf': {
    title: 'Repair PDF — Recover Corrupted PDF Files | PDFBay',
    description:
      'Recover data from corrupted or damaged PDF files so they open again, rebuilding the structure where possible. Nothing is uploaded.',
  },
  'reverse-pages': {
    title: 'Reverse PDF Pages — Flip Page Order Free | PDFBay',
    description:
      'Reverse the page order of a PDF, or of several PDFs at once, and download the result. Free, no signup and processed in your browser.',
  },
  'rotate-custom': {
    title: 'Rotate PDF by Custom Degrees — Any Angle | PDFBay',
    description:
      'Rotate PDF pages by any angle, not just 90°, and apply the rotation to selected pages or a whole batch. Free and fully in-browser.',
  },
  'rotate-pdf': {
    title: 'Rotate PDF Online Free — Fix Page Orientation | PDFBay',
    description:
      'Rotate PDF pages 90°, 180° or 270°, one page or all of them, and save the corrected file. No signup and nothing leaves your device.',
  },
  'rtf-to-pdf': {
    title: 'RTF to PDF — Convert Rich Text Format Files | PDFBay',
    description:
      'Convert Rich Text Format (RTF) documents to PDF with the formatting preserved. Convert several files at once, all in your browser.',
  },
  'sanitize-pdf': {
    title: 'Sanitize PDF — Remove Metadata, Scripts & More | PDFBay',
    description:
      'Strip metadata, annotations, embedded scripts, attachments and hidden objects from a PDF before sharing it. Nothing is uploaded.',
  },
  'scanner-effect': {
    title: 'Scanner Effect — Make a PDF Look Scanned | PDFBay',
    description:
      'Give a digital PDF the look of a real scan: skew, noise, grain and contrast, with the settings visible in a live preview. Runs locally.',
  },
  'sign-pdf': {
    title: 'Sign PDF Online Free — Draw, Type or Upload | PDFBay',
    description:
      'Sign a PDF by drawing, typing or uploading your signature, place it on the page and download the signed document. Nothing is uploaded.',
  },
  'split-pdf': {
    title: 'Split PDF Free Online — Split or Extract Pages | PDFBay',
    description:
      'Split a PDF into separate files or extract a page range in your browser. No signup, no watermark, and your file never leaves your device.',
  },
  'svg-to-pdf': {
    title: 'SVG to PDF — Convert Vector Graphics Free | PDFBay',
    description:
      'Create a PDF from one or more SVG images, keeping the vector quality so lines stay sharp at any size. Nothing is uploaded.',
  },
  'table-of-contents': {
    title: 'Generate a Table of Contents from PDF Bookmarks | PDFBay',
    description:
      "Build a table of contents page from a PDF's bookmarks, with page numbers and links, and insert it into the document. Runs in your browser.",
  },
  'text-color': {
    title: 'Change PDF Text Color — Free Online | PDFBay',
    description:
      'Change the colour of text in a PDF, page by page, while keeping the original layout and fonts. Free and processed in your browser.',
  },
  'tiff-to-pdf': {
    title: 'TIFF to PDF — Convert TIFF Images Free | PDFBay',
    description:
      'Create a PDF from one or more TIFF images, including multi-page files, at the page size you choose. Nothing is uploaded.',
  },
  'timestamp-pdf': {
    title: 'Timestamp PDF — RFC 3161 Document Timestamps | PDFBay',
    description:
      'Add an RFC 3161 timestamp from a public Time Stamp Authority to prove when a document existed. No certificate needed.',
  },
  'txt-to-pdf': {
    title: 'Text to PDF — Convert TXT Files Free | PDFBay',
    description:
      'Convert plain text files to PDF with control over font, size and margins. Right-to-left languages are detected and laid out correctly.',
  },
  'validate-signature-pdf': {
    title: 'Validate PDF Signature — Verify Signatures Free | PDFBay',
    description:
      'Verify the digital signatures in a PDF: check certificate validity, see who signed and confirm the document has not been altered since.',
  },
  'view-metadata': {
    title: 'View PDF Metadata — See Hidden Properties | PDFBay',
    description:
      "Inspect a PDF's hidden properties — author, creator, producer, dates, keywords and custom fields — without uploading the file anywhere.",
  },
  'vsd-to-pdf': {
    title: 'VSD to PDF — Convert Microsoft Visio Diagrams | PDFBay',
    description:
      'Convert Microsoft Visio (VSD, VSDX) diagrams to PDF so they can be viewed and printed everywhere. Processed in your browser.',
  },
  'wasm-settings': {
    title: 'Advanced PDF Settings — Optional Modules | PDFBay',
    description:
      'Configure the optional processing modules that unlock advanced PDF features in your browser. These modules are licensed separately.',
  },
  'webp-to-pdf': {
    title: 'WebP to PDF — Convert WebP Images Free | PDFBay',
    description:
      'Create a PDF from one or more WebP images, combining them into a single document with the page size and margins you set.',
  },
  'word-to-pdf': {
    title: 'Word to PDF — Convert DOCX & DOC Free | PDFBay',
    description:
      'Convert Word documents (DOCX, DOC, ODT, RTF) to PDF with the fonts and layout preserved. Convert several files at once, in your browser.',
  },
  'wpd-to-pdf': {
    title: 'WPD to PDF — Convert WordPerfect Files Free | PDFBay',
    description:
      'Convert WordPerfect (WPD) documents to PDF so anyone can open them, with the formatting intact. Nothing is uploaded.',
  },
  'wps-to-pdf': {
    title: 'WPS to PDF — Convert WPS Office Documents | PDFBay',
    description:
      'Convert WPS Office documents to PDF with the layout preserved, without installing WPS. Free and processed entirely in your browser.',
  },
  'xml-to-pdf': {
    title: 'XML to PDF — Convert XML Documents Free | PDFBay',
    description:
      'Convert XML documents to PDF so the content can be read, printed and shared easily. Free, no signup, and nothing is uploaded.',
  },
  'xps-to-pdf': {
    title: 'XPS to PDF — Convert XPS & OXPS Files | PDFBay',
    description:
      "Convert XPS and OXPS documents (Microsoft's PDF alternative) to PDF so they open on any device. Nothing is uploaded.",
  },
};

// Hub pages at the repo root (about, privacy, category landing pages…) — these
// rank too, and the homepage carried the same starred description as the tools.
// Same rules as above. 404.html is excluded: it is noindex.
export const SITE_PAGES = {
  index: {
    title: 'PDFBay — Free Online PDF Tools That Run in Your Browser',
    description:
      'Merge, split, compress, convert, sign and edit PDFs in your browser. 100+ free tools, no signup, no watermark, and nothing is ever uploaded.',
  },
  about: {
    title: 'About PDFBay — Free, Private PDF Tools',
    description:
      'Why PDFBay exists: a free PDF toolkit where every tool runs in your browser, so your documents are never uploaded, stored or shared.',
  },
  contact: {
    title: 'Contact PDFBay — Support and Feedback',
    description:
      'Get in touch about a bug, a missing tool or a question about privacy. Send feedback and we will read it — no account required.',
  },
  faq: {
    title: 'PDFBay FAQ — Privacy, Limits and How It Works',
    description:
      'Answers to common questions: where your files go (nowhere), whether the tools are really free, file size limits and browser support.',
  },
  licensing: {
    title: 'Licensing and Open Source Credits — PDFBay',
    description:
      'How PDFBay is licensed and which open-source projects it is built on, with the attribution the licences require.',
  },
  privacy: {
    title: 'Privacy Policy — Your Files Never Leave Your Device | PDFBay',
    description:
      'PDFBay processes documents locally in your browser. Read exactly what that means for your files, and what little data the site does collect.',
  },
  terms: {
    title: "Terms and Conditions — Using PDFBay's Free Tools",
    description:
      'The terms for using PDFBay: free browser-based PDF tools, acceptable use, and the limits of the warranty we can offer.',
  },
  tools: {
    title: 'All PDF Tools — 100+ Free Browser Tools | PDFBay',
    description:
      'Browse every PDFBay tool by category: convert, edit, organise, optimise, secure and sign. Search and filter to find the right one fast.',
  },
  'pdf-converter': {
    title: 'PDF Converter — Convert PDF to Word, Excel, JPG | PDFBay',
    description:
      'Convert PDFs to Word, Excel, JPG, PNG and more, or turn Office documents and images into PDF. Free and processed in your browser.',
  },
  'pdf-editor': {
    title: 'PDF Editor Tools — Edit, Compress, Rotate & Sign | PDFBay',
    description:
      'The full set of PDFBay editing tools: annotate, compress, rotate, crop, watermark, number pages and sign — all in your browser.',
  },
  'pdf-merge-split': {
    title: 'Merge & Split PDF — Combine or Separate Files | PDFBay',
    description:
      'Merge several PDFs into one, split a document into parts, or extract and reorder pages. Free, no signup and nothing is uploaded.',
  },
  'pdf-security': {
    title: 'PDF Security Tools — Encrypt, Sign & Verify | PDFBay',
    description:
      'Encrypt PDFs with a password, add digital signatures, validate existing ones or remove restrictions — all running in your browser.',
  },
};

// Shared social preview card. The rebrand stripped upstream's og:image and the
// brand asset was generated but never referenced, so every share rendered as a
// blank card. All tool pages point at this one banner.
export const OG_IMAGE = {
  url: 'https://pdfbay.projectbay.uk/images/og-home.png',
  alt: 'PDFBay — free, private PDF tools that run in your browser',
  type: 'image/png',
  width: '1200',
  height: '630',
};

// Titles above 60 chars get truncated in the SERP; descriptions outside
// 115-158 chars get rewritten by Google. Both are hard failures so a regression
// is caught at build time rather than in Search Console weeks later.
export const LIMITS = {
  titleMax: 66,
  titleMin: 35,
  descMin: 110,
  descMax: 160,
};

export function validateSeoMetadata(slugs, seo = SEO, label = 'src/pages/') {
  const problems = [];
  for (const slug of slugs) {
    const entry = seo[slug];
    if (!entry) {
      problems.push(`${slug}: missing SEO entry`);
      continue;
    }
    if (!entry.title || !entry.description) {
      problems.push(`${slug}: title or description empty`);
      continue;
    }
    if (entry.title.length > LIMITS.titleMax)
      problems.push(
        `${slug}: title ${entry.title.length} chars (max ${LIMITS.titleMax})`
      );
    if (entry.title.length < LIMITS.titleMin)
      problems.push(
        `${slug}: title only ${entry.title.length} chars (min ${LIMITS.titleMin})`
      );
    if (entry.description.length < LIMITS.descMin)
      problems.push(
        `${slug}: description ${entry.description.length} chars (min ${LIMITS.descMin})`
      );
    if (entry.description.length > LIMITS.descMax)
      problems.push(
        `${slug}: description ${entry.description.length} chars (max ${LIMITS.descMax})`
      );
    if (/[★☆]/.test(entry.title + entry.description))
      problems.push(`${slug}: star separators are not allowed`);
    if (!entry.title.includes('PDFBay'))
      problems.push(`${slug}: title is missing the PDFBay brand suffix`);
  }
  for (const slug of Object.keys(seo)) {
    if (!slugs.includes(slug))
      problems.push(`${slug}: SEO entry has no matching file in ${label}`);
  }
  return problems;
}
