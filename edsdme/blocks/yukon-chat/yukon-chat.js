import { getCurrentProgramType, getPartnerDataCookieObject, partnerIsSignedIn, aemPublish } from '../../scripts/utils.js';

export default async function init(el) {
  const app = document.createElement('div');
  app.className = 'yukon-chat';
  const chatDialog = document.createElement('div');
  chatDialog.className = 'chat-dialog';
  const dialogBody = document.createElement('div');
  dialogBody.className = 'yukon-chat-dialog-body';
  const title = document.createElement('h4');
  title.className = 'yukon-chat-title';
  title.textContent = 'Yukon AI Chat';
  const divider = document.createElement('hr');
  const description = document.createElement('span');
  description.className = 'yukon-chat-description';
  description.textContent = 'Ask your question:';
  const textarea = document.createElement('textarea');
  textarea.className = 'yukon-chat-textarea';
  textarea.placeholder = 'Type your message here...';
  textarea.rows = 3;
  const responseLabel = document.createElement('span');
  responseLabel.className = 'yukon-chat-response-label';
  responseLabel.textContent = 'Response:';
  const responseArea = document.createElement('textarea');
  responseArea.className = 'yukon-chat-response';
  responseArea.placeholder = 'Response will appear here...';
  responseArea.rows = 5;
  responseArea.readOnly = true;

  const referencesLabel = document.createElement('span');
  referencesLabel.className = 'yukon-chat-references-label';
  referencesLabel.textContent = 'References:';
  referencesLabel.style.display = 'none';

  const referencesContainer = document.createElement('div');
  referencesContainer.className = 'yukon-chat-references';
  referencesContainer.style.display = 'none';

  const sendButton = document.createElement('button');
  sendButton.className = 'yukon-chat-button cta';
  sendButton.textContent = 'Send';

  const requestId = crypto.randomUUID();
  sendButton.addEventListener('click', async () => {
    const question = textarea.value.trim();
    if (!question) return;
    responseArea.value = 'Loading...';
    referencesLabel.style.display = 'none';
    referencesContainer.style.display = 'none';
    referencesContainer.innerHTML = '';
    let level = 'public';
    let region = 'worldwide';
    if (partnerIsSignedIn()) {
      try {
        const profileData = getPartnerDataCookieObject(getCurrentProgramType());
        level = profileData.level.toLowerCase().replace(/\s+/g, '').replace(/[()]/g, '');
        region = profileData.permissionRegion.toLowerCase().replace(/\s+/g, '').replace(/[()]/g, '');
      } catch (error) {
        // eslint-disable-next-line no-console
        console.info('Failed to parse profileData from cookie:', error);
      }
    }
    try {
      const tags = [
        { key: level, value: level },
        { key: region, value: region },
      ];
      const origin = aemPublish;
      const url = new URL(`${origin}/services/gravity/yukonAIAssistant`);
      url.searchParams.append('question', question);
      url.searchParams.append('tags', JSON.stringify(tags));
      url.searchParams.append('requestId', requestId);

      const resp = await fetch(url, {
        method: 'GET',
        credentials: 'include',
      });
      if (!resp || !resp.ok) {
        const errorText = await resp.text();
        responseArea.value = `Error ${resp.status}: ${errorText || 'Failed to get response from Yukon AI. Please try again.'}`;
        return;
      }
      responseArea.value = '';
      const reader = resp.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';
      let sourcesProcessed = false;
      // eslint-disable-next-line no-constant-condition
      while (true) {
        // eslint-disable-next-line no-await-in-loop
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        // eslint-disable-next-line no-restricted-syntax
        for (const line of lines) {
          // eslint-disable-next-line no-continue
          if (!line.trim()) continue;
          try {
            if (line.startsWith('data: ')) {
              let jsonStr = line.slice(6).trim();

              if (jsonStr.startsWith('data: ')) {
                jsonStr = jsonStr.slice(6).trim();
              }
              // eslint-disable-next-line no-continue
              if (!jsonStr || !jsonStr.startsWith('[')) continue;
              const data = JSON.parse(jsonStr);

              const generatedText = data[0]?.generated_text || '';
              const source = data[0]?.source || {};

              if (generatedText) {
                responseArea.value += generatedText;
              }

              if (!sourcesProcessed && source && Object.keys(source).length > 0) {
                sourcesProcessed = true;
                referencesLabel.style.display = 'block';
                referencesContainer.style.display = 'block';

                Object.entries(source).forEach(([refNumber, sourceData]) => {
                  const refItem = document.createElement('div');
                  refItem.className = 'yukon-chat-reference-item';

                  const refNumberSpan = document.createElement('span');
                  refNumberSpan.className = 'yukon-chat-reference-number';
                  refNumberSpan.textContent = `[${refNumber}]`;

                  const refName = document.createElement('span');
                  refName.className = 'yukon-chat-reference-name';
                  refName.textContent = sourceData.document_name || 'Unknown document';

                  refItem.appendChild(refNumberSpan);
                  refItem.appendChild(refName);
                  referencesContainer.appendChild(refItem);
                });
              }
            }
          } catch (parseError) {
            // eslint-disable-next-line no-console
            console.debug('Skipping non-JSON line:', line);
          }
        }
      }
    } catch (error) {
      responseArea.value = `Error: ${error.message}`;
      // eslint-disable-next-line no-console
      console.error('Yukon API error:', error);
      // eslint-disable-next-line no-console
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
    }
  });

  dialogBody.appendChild(title);
  dialogBody.appendChild(divider);
  dialogBody.appendChild(description);
  dialogBody.appendChild(textarea);
  dialogBody.appendChild(responseLabel);
  dialogBody.appendChild(responseArea);
  dialogBody.appendChild(referencesLabel);
  dialogBody.appendChild(referencesContainer);
  dialogBody.appendChild(sendButton);
  chatDialog.appendChild(dialogBody);
  app.appendChild(chatDialog);
  el.replaceWith(app);
}
