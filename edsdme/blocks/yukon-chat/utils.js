/**
 * Process inline markdown (bold, italic, links, code)
 * @param {string} text - Text to process
 * @returns {string} - Processed HTML
 */
export function processInlineMarkdown(text) {
  let processed = text;

  // Remove reference markers like [1], [2], [^1], [^2], etc. FIRST before processing other markdown
  processed = processed.replace(/\[\^?\d+\]/g, '');
  // Remove citation references like (1), (2), etc.
  processed = processed.replace(/\(\d+\)/g, '');

  // Bold (**text** or __text__)
  processed = processed.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  processed = processed.replace(/__(.+?)__/g, '<strong>$1</strong>');

  // Italic (*text* or _text_)
  processed = processed.replace(/\*(.+?)\*/g, '<em>$1</em>');
  processed = processed.replace(/_(.+?)_/g, '<em>$1</em>');

  // Inline code (`code`)
  processed = processed.replace(/`(.+?)`/g, '<code>$1</code>');

  // Links [text](url)
  processed = processed.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

  return processed;
}

/**
 * Process markdown table into HTML table
 * @param {Array<string>} tableLines - Array of table lines
 * @returns {string} - HTML table string
 */
function processTable(tableLines) {
  if (!tableLines || tableLines.length < 2) return '';

  const rows = [];
  let headerProcessed = false;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < tableLines.length; i++) {
    const line = tableLines[i].trim();
    // Skip separator line (contains only |, -, :, and spaces)
    if (line.match(/^\|[\s\-:|]+\|$/)) {
      // eslint-disable-next-line no-continue
      continue;
    }
    // Split by | and remove empty first/last elements
    const cells = line.split('|').slice(1, -1).map((cell) => cell.trim());
    if (!headerProcessed) {
      // First row is header
      const headerCells = cells.map((cell) => `<th>${processInlineMarkdown(cell)}</th>`).join('');
      rows.push(`<thead><tr>${headerCells}</tr></thead>`);
      headerProcessed = true;
    } else {
      // Body rows
      const bodyCells = cells.map((cell) => `<td>${processInlineMarkdown(cell)}</td>`).join('');
      rows.push(`<tr>${bodyCells}</tr>`);
    }
  }
  // Wrap body rows in tbody
  if (rows.length > 1) {
    const thead = rows[0];
    const tbody = `<tbody>${rows.slice(1).join('')}</tbody>`;
    return `<table class="markdown-table">${thead}${tbody}</table>`;
  }
  return '';
}

/**
 * Convert markdown text to HTML
 * @param {string} markdown - The markdown text to convert
 * @returns {string} - HTML string
 */
export function parseMarkdown(markdown) {
  if (!markdown) return '';

  let html = markdown;

  // Remove Citations/References section and everything after it
  // Split into lines and find the Citations or References heading
  const allLines = html.split('\n');
  let cutoffLineIndex = -1;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < allLines.length; i++) {
    const line = allLines[i].trim();
    // Remove markdown formatting (bold, italic) to check the plain text
    const plainLine = line
      .replace(/\*\*/g, '')
      .replace(/__/g, '')
      .replace(/\*/g, '')
      .replace(/_/g, '')
      .trim();
    // Match any variation of Citations or References heading (with or without markdown)
    if (/^#{0,6}\s*.*\b(citations?|references?)\b:?\s*$/i.test(plainLine)) {
      cutoffLineIndex = i;
      break;
    }
  }
  // If found, remove everything from that line onwards
  if (cutoffLineIndex !== -1) {
    html = allLines.slice(0, cutoffLineIndex).join('\n').trim();
  }

  // Process line by line to handle block elements
  const lines = html.split('\n');
  const processedLines = [];
  let inList = false;
  let inTable = false;
  let lastWasBreak = false;
  let tableLines = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect table lines (contains |)
    const isTableLine = line.trim().match(/^\|.*\|$/);
    if (isTableLine) {
      if (!inTable) {
        inTable = true;
        tableLines = [];
      }
      tableLines.push(line);
      // eslint-disable-next-line no-continue
      continue;
    } else if (inTable) {
      // Process accumulated table
      const tableHtml = processTable(tableLines);
      if (tableHtml) {
        processedLines.push(tableHtml);
      }
      inTable = false;
      tableLines = [];
    }

    // Skip horizontal rules (---, ___, ***)
    // eslint-disable-next-line no-useless-escape
    if (line.match(/^(\-{3,}|_{3,}|\*{3,})$/)) {
      // eslint-disable-next-line no-continue
      continue;
    }

    // Headings (### heading)
    if (line.match(/^(#{1,6})\s+(.+)$/)) {
      const match = line.match(/^(#{1,6})\s+(.+)$/);
      const level = match[1].length;
      const content = match[2];
      // Process inline markdown in heading
      const processedContent = processInlineMarkdown(content);
      processedLines.push(`<h${level}>${processedContent}</h${level}>`);
      lastWasBreak = false;
      // eslint-disable-next-line no-continue
      continue;
    }

    // Unordered list items (- item)
    if (line.match(/^-\s+(.+)$/)) {
      const match = line.match(/^-\s+(.+)$/);
      const content = processInlineMarkdown(match[1]);
      if (!inList) {
        processedLines.push('<ul>');
        inList = true;
      }
      processedLines.push(`<li>${content}</li>`);
      lastWasBreak = false;
      // eslint-disable-next-line no-continue
      continue;
    } else if (inList && line.trim() !== '') {
      // Close list if we're in one and hit a non-list line
      processedLines.push('</ul>');
      inList = false;
    }

    // Empty lines create paragraphs, but avoid consecutive breaks
    if (line.trim() === '') {
      if (inList) {
        processedLines.push('</ul>');
        inList = false;
      }
      // Only add break if the last line wasn't also a break
      if (!lastWasBreak) {
        processedLines.push('<br>');
        lastWasBreak = true;
      }
      // eslint-disable-next-line no-continue
      continue;
    }

    // Regular text lines
    if (line.trim() !== '') {
      const processedContent = processInlineMarkdown(line);
      processedLines.push(`<p>${processedContent}</p>`);
      lastWasBreak = false;
    }
  }

  // Close any open list
  if (inList) {
    processedLines.push('</ul>');
  }
  // Process any remaining table
  if (inTable && tableLines.length > 0) {
    const tableHtml = processTable(tableLines);
    if (tableHtml) {
      processedLines.push(tableHtml);
    }
  }

  return processedLines.join('');
}

export function extractAuthoredPlaceholders(placeholders, elementChildren) {
  const rows = Array.from(elementChildren);
  rows.forEach((row) => {
    const divs = row.querySelectorAll('div');
    if (divs.length < 2) return;

    const key = divs[0].textContent.trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    const value = divs[1].textContent.trim();

    placeholders[key] = value;
  });
}
