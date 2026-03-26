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

export async function parseMarkdown(markdown) {
  if (!markdown) return '';
  const markdownParser = await initMarkdownIt();
  const cleanedMarkdown = markdown.replace(/\[\^([^\]]+)\]/g, '[$1]');
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
