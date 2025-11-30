// src/services/downloadService.js
import { marked } from 'marked';

/**
 * Check if content is already HTML
 * Looks for DOCTYPE, html tag, or multiple HTML tags
 */
const isHTML = (str) => {
  const trimmed = str.trim();
  
  // Check for DOCTYPE declaration
  if (trimmed.toLowerCase().startsWith('<!doctype html')) {
    return true;
  }
  
  // Check for opening HTML tag
  if (trimmed.toLowerCase().startsWith('<html')) {
    return true;
  }
  
  // Check if content has HTML structure using DOMParser
  try {
    const doc = new DOMParser().parseFromString(str, "text/html");
    // Check if there are actual HTML elements (not just text nodes)
    return Array.from(doc.body.childNodes).some(node => node.nodeType === 1);
  } catch (error) {
    return false;
  }
};

/**
 * Generate HTML document with inline CSS from rendered markdown
 */
const generateHTMLDocument = (content, title = 'Output') => {
  // Configure marked options for proper markdown parsing
  marked.setOptions({
    breaks: true,
    gfm: true,
    pedantic: false,
  });
  
  // Convert markdown to HTML
  let htmlContent;
  try {
    htmlContent = marked.parse(content);
  } catch (error) {
    console.error('Error parsing markdown:', error);
    // Fallback: escape HTML and wrap in pre tag if marked fails
    const escaped = content
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
    htmlContent = `<pre>${escaped}</pre>`;
  }
  
  // Escape title for HTML
  const escapedTitle = title
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapedTitle}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    html, body {
      height: 100%;
      width: 100%;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.7;
      color: #2c3e50;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      padding: 40px 20px;
    }
    
    .container {
      max-width: 900px;
      margin: 0 auto;
      background: white;
      padding: 48px;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      animation: fadeIn 0.3s ease-in;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    h1, h2, h3, h4, h5, h6 {
      font-weight: 700;
      line-height: 1.3;
      margin-top: 24px;
      margin-bottom: 16px;
      color: #1a202c;
    }
    
    h1 {
      font-size: 2.25rem;
      border-bottom: 3px solid #3b82f6;
      padding-bottom: 12px;
      margin-top: 0;
      margin-bottom: 24px;
    }
    
    h2 {
      font-size: 1.875rem;
      border-bottom: 2px solid #94a3b8;
      padding-bottom: 10px;
      margin-top: 32px;
    }
    
    h3 {
      font-size: 1.5rem;
      color: #334155;
      margin-top: 24px;
    }
    
    h4 {
      font-size: 1.25rem;
      color: #475569;
      margin-top: 20px;
    }
    
    p {
      margin-bottom: 16px;
      line-height: 1.8;
      color: #374151;
    }
    
    strong {
      font-weight: 700;
      color: #1e293b;
    }
    
    em {
      font-style: italic;
      color: #475569;
    }
    
    a {
      color: #3b82f6;
      text-decoration: none;
      border-bottom: 1px solid #3b82f6;
      transition: all 0.2s;
    }
    
    a:hover {
      color: #1e40af;
      border-bottom-color: #1e40af;
    }
    
    ul, ol {
      margin: 16px 0;
      padding-left: 32px;
    }
    
    li {
      margin: 10px 0;
      line-height: 1.7;
      color: #374151;
    }
    
    ul li {
      list-style-type: disc;
    }
    
    ol li {
      list-style-type: decimal;
    }
    
    code {
      font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
      font-size: 0.9em;
      background: #f1f5f9;
      padding: 3px 8px;
      border-radius: 4px;
      color: #e11d48;
      border: 1px solid #e2e8f0;
    }
    
    pre {
      background: #1e293b;
      color: #f8f8f2;
      padding: 20px;
      border-radius: 8px;
      overflow-x: auto;
      margin: 20px 0;
      border: 1px solid #334155;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
      font-size: 0.95em;
      line-height: 1.6;
    }
    
    pre code {
      background: transparent;
      padding: 0;
      color: #f8f8f2;
      border: none;
      font-size: inherit;
    }
    
    blockquote {
      border-left: 4px solid #3b82f6;
      padding: 12px 0 12px 20px;
      margin: 20px 0;
      background: #f8fafc;
      color: #475569;
      font-style: italic;
      border-radius: 0 4px 4px 0;
    }
    
    blockquote p {
      margin: 0;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 24px 0;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    
    thead {
      background: #f1f5f9;
    }
    
    th {
      padding: 14px 16px;
      text-align: left;
      font-weight: 700;
      color: #1e293b;
      border-bottom: 2px solid #cbd5e1;
      font-size: 0.95em;
    }
    
    td {
      padding: 12px 16px;
      border-bottom: 1px solid #e2e8f0;
      color: #374151;
    }
    
    tbody tr:last-child td {
      border-bottom: none;
    }
    
    tbody tr:hover {
      background: #f8fafc;
    }
    
    hr {
      border: none;
      border-top: 2px solid #e2e8f0;
      margin: 32px 0;
    }
    
    img {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      margin: 16px 0;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    /* Print styles */
    @media print {
      body {
        background: white;
        padding: 0;
      }
      
      .container {
        box-shadow: none;
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    ${htmlContent}
  </div>
</body>
</html>`;
};

/**
 * Download content as file
 */
export const downloadFile = (content, filename, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Download output in specified format
 */
export const downloadOutput = (content, format, baseName = 'output') => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  
  switch (format) {
    case 'markdown':
      downloadFile(
        content,
        `${baseName}_${timestamp}.md`,
        'text/markdown'
      );
      break;
      
    case 'html':
      // Check if content is already complete HTML
      if (isHTML(content)) {
        // Save raw HTML as-is without any modification
        downloadFile(
          content,
          `${baseName}_${timestamp}.html`,
          'text/html'
        );
      } else {
        // Convert markdown to styled HTML document
        const htmlDoc = generateHTMLDocument(content, baseName);
        downloadFile(
          htmlDoc,
          `${baseName}_${timestamp}.html`,
          'text/html'
        );
      }
      break;
      
    case 'pdf':
      // For PDF, always convert from markdown to HTML (default format is markdown)
      // Always use generateHTMLDocument to ensure consistent markdown parsing
      const printableHTML = generateHTMLDocument(content, baseName);
      
      const printWindow = window.open('', '_blank');
      printWindow.document.open();
      printWindow.document.write(printableHTML);
      printWindow.document.close();
      
      // Wait a bit for content to load, then trigger print dialog
      setTimeout(() => {
        printWindow.print();
      }, 250);
      break;
      
    default:
      console.error('Unsupported format:', format);
  }
};
