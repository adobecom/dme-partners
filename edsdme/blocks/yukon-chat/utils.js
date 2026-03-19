import MarkdownIt from '../../libs/deps/markdown-it-wrapper.js';

let md = null;
async function initMarkdownIt() {
  if (!md) {
    md = new MarkdownIt({
      html: false,
      breaks: true,
      linkify: true,
    });

    // Force links to open in a new tab
    // eslint-disable-next-line func-names,max-len
    const defaultRender = md.renderer.rules.link_open || function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };

    // add target="_blank"
    // eslint-disable-next-line func-names
    md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
      const token = tokens[idx];

      const targetIndex = token.attrIndex('target');
      if (targetIndex < 0) {
        token.attrPush(['target', '_blank']);
      } else {
        token.attrs[targetIndex][1] = '_blank';
      }

      return defaultRender(tokens, idx, options, env, self);
    };
  }
  return md;
}

function removeCitations(text) {
  // Remove inline citation markers like [1], [2], [^1], [^2], (1), (2)
  let cleaned = text.replace(/\[\^?\d+\]/g, '');
  cleaned = cleaned.replace(/\(\d+\)/g, '');

  // Remove Citations/References section and everything after
  const lines = cleaned.split('\n');
  let cutoffIndex = -1;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const plainLine = line
      .replace(/\*\*/g, '')
      .replace(/__/g, '')
      .replace(/\*/g, '')
      .replace(/_/g, '')
      .trim();

    if (/^#{0,6}\s*(citations?|references?):?\s*$/i.test(plainLine)) {
      cutoffIndex = i;
      break;
    }
  }

  if (cutoffIndex !== -1) {
    return lines.slice(0, cutoffIndex).join('\n').trim();
  }

  return cleaned;
}

export async function parseMarkdown(markdown) {
  if (!markdown) return '';
  const markdownParser = await initMarkdownIt();
  const cleanedMarkdown = removeCitations(markdown);
  return markdownParser.render(cleanedMarkdown);
}

export function extractAuthoredConfigs(configs, elementChildren) {
  const rows = Array.from(elementChildren);
  rows.forEach((row) => {
    const divs = row.querySelectorAll('div');
    if (divs.length < 2) return;

    const key = divs[0].textContent.trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    const value = divs[1].textContent.trim();

    configs[key] = value;
  });
}

export function createSourcesAccordion(sourceObj, localizedText) {
  const accordionContainer = document.createElement('div');
  accordionContainer.className = 'yc-sources-accordion';

  const accordionHeader = document.createElement('button');
  accordionHeader.className = 'yc-accordion-header';
  accordionHeader.setAttribute('aria-expanded', 'false');
  accordionHeader.innerHTML = `<svg class="yc-accordion-icon" width="10" height="11" viewBox="0 0 10 11" fill="none"><path d="M5.59375 7.99866L9.2168 4.37561C9.54492 4.04749 9.54492 3.51623 9.2168 3.18811C8.88868 2.85999 8.35742 2.85999 8.0293 3.18811L5 6.21741L1.9707 3.18811C1.64258 2.85999 1.11132 2.85999 0.783201 3.18811C0.619142 3.35217 0.537111 3.56702 0.537111 3.78186C0.537111 3.9967 0.619142 4.21155 0.783201 4.37561L4.40625 7.99866C4.73437 8.32678 5.26563 8.32678 5.59375 7.99866Z" fill="currentColor"></path></svg><span>${localizedText['{{sources}}'] || 'Sources'}</span>`;

  const accordionContent = document.createElement('div');
  accordionContent.className = 'yc-accordion-content';
  accordionContent.style.display = 'none';

  accordionHeader.addEventListener('click', () => {
    const isExpanded = accordionHeader.getAttribute('aria-expanded') === 'true';
    accordionHeader.setAttribute('aria-expanded', !isExpanded);
    accordionContent.style.display = isExpanded ? 'none' : 'block';
    if (!isExpanded) accordionHeader.classList.add('expanded');
    else accordionHeader.classList.remove('expanded');
  });

  const ol = document.createElement('ol');
  ol.className = 'yc-sources-list';

  const sourceKeys = Object.keys(sourceObj).sort((a, b) => parseInt(a, 10) - parseInt(b, 10));

  sourceKeys.forEach((key) => {
    const item = sourceObj[key];
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = item.document_url;
    a.textContent = item.title || item.document_name || item.document_url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    li.appendChild(a);
    ol.appendChild(li);
  });

  accordionContent.appendChild(ol);
  accordionContainer.appendChild(accordionHeader);
  accordionContainer.appendChild(accordionContent);

  return accordionContainer;
}
