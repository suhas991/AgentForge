// src/services/fileParser.js
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import { convert as htmlToText } from 'html-to-text';

// Configure PDF.js worker to use local worker from node_modules
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).href;

/**
 * Parse PDF file to text
 */
export const parsePDF = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map(item => item.str).join(' ');
      text += pageText + '\n\n';
    }

    return text;
  } catch (error) {
    throw new Error(`Failed to parse PDF: ${error.message}`);
  }
};

/**
 * Parse DOCX file to text
 */
export const parseDOCX = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } catch (error) {
    throw new Error(`Failed to parse DOCX: ${error.message}`);
  }
};

/**
 * Parse Excel/CSV to text
 */
export const parseExcel = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    let text = '';

    workbook.SheetNames.forEach((sheetName, index) => {
      const worksheet = workbook.Sheets[sheetName];
      const sheetData = XLSX.utils.sheet_to_csv(worksheet);
      text += `\n\n=== Sheet: ${sheetName} ===\n\n${sheetData}`;
    });

    return text;
  } catch (error) {
    throw new Error(`Failed to parse Excel: ${error.message}`);
  }
};

/**
 * Parse HTML to text
 */
export const parseHTML = async (file) => {
  try {
    const htmlContent = await file.text();
    const text = htmlToText(htmlContent, {
      wordwrap: false,
      selectors: [
        { selector: 'a', options: { ignoreHref: true } },
        { selector: 'img', format: 'skip' }
      ]
    });
    return text;
  } catch (error) {
    throw new Error(`Failed to parse HTML: ${error.message}`);
  }
};

/**
 * Parse RTF to text (simple regex-based extraction)
 */
export const parseRTF = async (file) => {
  try {
    const rtfContent = await file.text();
    
    // Remove RTF header
    let text = rtfContent;
    
    // Remove font table
    text = text.replace(/\{\\fonttbl[^}]*\}/gi, '');
    
    // Remove color table
    text = text.replace(/\{\\colortbl[^}]*\}/gi, '');
    
    // Remove stylesheet
    text = text.replace(/\{\\stylesheet[^}]*\}/gi, '');
    
    // Remove info block
    text = text.replace(/\{\\info[^}]*\}/gi, '');
    
    // Remove header/footer
    text = text.replace(/\{\\header[^}]*\}/gi, '');
    text = text.replace(/\{\\footer[^}]*\}/gi, '');
    
    // Handle special characters
    text = text.replace(/\\par\s?/g, '\n');
    text = text.replace(/\\tab\s?/g, '\t');
    text = text.replace(/\\line\s?/g, '\n');
    text = text.replace(/\\\n/g, '\n');
    text = text.replace(/\\'/g, "'");
    
    // Remove RTF control words (e.g., \b, \i, \f0, \fs24, etc.)
    text = text.replace(/\\[a-z]+\d*\s?/gi, '');
    
    // Remove remaining backslashes
    text = text.replace(/\\/g, '');
    
    // Remove curly braces
    text = text.replace(/[{}]/g, '');
    
    // Clean up whitespace
    text = text.replace(/\n\s*\n/g, '\n\n');
    text = text.trim();
    
    return text;
  } catch (error) {
    throw new Error(`Failed to parse RTF: ${error.message}`);
  }
};

/**
 * Parse plain text file
 */
export const parseText = async (file) => {
  return await file.text();
};

/**
 * Main file parser - detects type and parses accordingly
 */
export const parseFile = async (file) => {
  const extension = file.name.split('.').pop().toLowerCase();
  const mimeType = file.type.toLowerCase();

  try {
    // PDF files
    if (extension === 'pdf' || mimeType === 'application/pdf') {
      return await parsePDF(file);
    }

    // Word documents
    if (extension === 'docx' || mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return await parseDOCX(file);
    }

    // Excel files
    if (extension === 'xlsx' || extension === 'xls' || 
        mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        mimeType === 'application/vnd.ms-excel') {
      return await parseExcel(file);
    }

    // CSV files
    if (extension === 'csv' || mimeType === 'text/csv') {
      return await parseExcel(file);
    }

    // HTML files
    if (extension === 'html' || extension === 'htm' || mimeType === 'text/html') {
      return await parseHTML(file);
    }

    // RTF files
    if (extension === 'rtf' || mimeType === 'application/rtf' || mimeType === 'text/rtf') {
      return await parseRTF(file);
    }

    // Plain text files (txt, md, json, xml, code files, etc.)
    if (mimeType.startsWith('text/') || 
        ['txt', 'md', 'json', 'xml', 'js', 'py', 'java', 'cpp', 'c', 'h', 'css', 'html'].includes(extension)) {
      return await parseText(file);
    }

    throw new Error(`Unsupported file type: .${extension}`);
  } catch (error) {
    console.error('File parsing error:', error);
    throw error;
  }
};

/**
 * Get supported file extensions
 */
export const getSupportedExtensions = () => {
  return [
    '.pdf',
    '.docx',
    '.xlsx', '.xls', '.csv',
    '.html', '.htm',
    '.rtf',
    '.txt', '.md',
    '.json', '.xml',
    '.js', '.jsx', '.ts', '.tsx',
    '.py', '.java', '.cpp', '.c', '.h',
    '.css', '.scss', '.sass'
  ];
};

/**
 * Check if file is supported
 */
export const isFileSupported = (file) => {
  const extension = '.' + file.name.split('.').pop().toLowerCase();
  return getSupportedExtensions().includes(extension);
};
