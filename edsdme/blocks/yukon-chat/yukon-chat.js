import { getCurrentProgramType, getPartnerDataCookieObject, partnerIsSignedIn, aemPublish, getLibs } from '../../scripts/utils.js';

/**
 * Process inline markdown (bold, italic, links, code)
 * @param {string} text - Text to process
 * @returns {string} - Processed HTML
 */
function processInlineMarkdown(text) {
  let processed = text;

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

  // Remove reference markers like [1], [2], [^1], [^2], etc.
  processed = processed.replace(/\[\^?\d+\]/g, '');

  return processed;
}

/**
 * Convert markdown text to HTML
 * @param {string} markdown - The markdown text to convert
 * @returns {string} - HTML string
 */
function parseMarkdown(markdown) {
  if (!markdown) return '';

  let html = markdown;

  // Remove Citations section and everything after it
  // Match "Citations" or "### Citations" or "## Citations" etc., case-insensitive
  html = html.replace(/^#+?\s*Citations\s*$/mi, '<!-- CITATIONS_MARKER -->');
  const citationsIndex = html.indexOf('<!-- CITATIONS_MARKER -->');
  if (citationsIndex !== -1) {
    html = html.substring(0, citationsIndex);
  }

  // Process line by line to handle block elements
  const lines = html.split('\n');
  const processedLines = [];
  let inList = false;
  let lastWasBreak = false;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

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

  return processedLines.join('');
}

export default async function init(el) {
  const miloLibs = getLibs();
  const { getModal } = await import(`${miloLibs}/blocks/modal/modal.js`);
  const aiChatIconString = '<svg title="Ask" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.25 18.998C6.15039 18.998 6.05078 18.9785 5.95605 18.9385C5.67968 18.8203 5.5 18.5488 5.5 18.248V14.998H4.75C2.68262 14.998 1 13.3154 1 11.248V5.74805C1 3.68067 2.68262 1.99805 4.75 1.99805H8.70312C9.11718 1.99805 9.45312 2.33399 9.45312 2.74805C9.45312 3.16211 9.11718 3.49805 8.70312 3.49805H4.75C3.50977 3.49805 2.5 4.50782 2.5 5.74805V11.248C2.5 12.4883 3.50977 13.498 4.75 13.498H6.25C6.66406 13.498 7 13.834 7 14.248V16.4844L9.88379 13.708C10.0234 13.5732 10.21 13.498 10.4043 13.498H15.25C16.4902 13.498 17.5 12.4883 17.5 11.248V9.97657C17.5 9.56251 17.8359 9.22657 18.25 9.22657C18.6641 9.22657 19 9.56251 19 9.97657V11.248C19 13.3154 17.3174 14.998 15.25 14.998H10.707L6.77051 18.7881C6.62793 18.9258 6.44043 18.998 6.25 18.998Z" fill="currentColor"/><path d="M13.2774 9.08292C13.0889 9.08292 12.8995 9.03409 12.7286 8.93546C12.3126 8.6962 12.1016 8.22062 12.2022 7.75187L12.6622 5.62687L11.2022 4.01652C10.8799 3.66105 10.8243 3.14445 11.0635 2.72941C11.3038 2.31437 11.7842 2.10343 12.2471 2.20304L14.3721 2.663L15.9825 1.20304C16.338 0.881747 16.8575 0.827057 17.2696 1.06437C17.6856 1.30363 17.8965 1.77921 17.796 2.24796L17.336 4.37296L18.796 5.98331C19.1182 6.33878 19.1739 6.85538 18.9346 7.27042C18.6944 7.68644 18.2178 7.89933 17.751 7.79679L15.626 7.33683L14.0157 8.79679C13.8077 8.98527 13.544 9.08292 13.2774 9.08292ZM13.1514 3.9335L13.9112 4.77139C14.1475 5.0292 14.2462 5.39248 14.1719 5.74014L13.9327 6.84757L14.7706 6.0878C15.0294 5.85147 15.3966 5.75382 15.7393 5.82706L16.8467 6.06632L16.087 5.22843C15.8506 4.97062 15.752 4.60734 15.8262 4.25968L16.0655 3.15226L15.2276 3.91203C14.9698 4.14933 14.6046 4.24894 14.2589 4.17277L13.1514 3.9335Z" fill="currentColor"/><path d="M7.93261 11.5039C7.8037 11.5039 7.6748 11.4707 7.55761 11.4033C7.27538 11.2402 7.13085 10.9141 7.19921 10.5957L7.37694 9.77538L6.81346 9.15429C6.59471 8.91308 6.55662 8.55761 6.71971 8.27538C6.8828 7.99315 7.21092 7.85448 7.52733 7.91698L8.34764 8.09471L8.96873 7.53123C9.21092 7.31248 9.56443 7.27439 9.84764 7.43748C10.1299 7.60057 10.2744 7.92674 10.206 8.2451L10.0283 9.06541L10.5918 9.6865C10.8105 9.92771 10.8486 10.2832 10.6855 10.5654C10.5225 10.8476 10.1933 10.9892 9.87792 10.9238L9.05761 10.7461L8.43652 11.3096C8.29492 11.4375 8.11425 11.5039 7.93261 11.5039Z" fill="currentColor"/></svg>';
  const submitIconString = '<svg xmlns="http://www.w3.org/2000/svg" class="send-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M18.6485 9.9735C18.6482 9.67899 18.4769 9.41106 18.2059 9.29056L4.05752 2.93282C3.80133 2.8175 3.50129 2.85583 3.28171 3.03122C3.06178 3.20765 2.95889 3.49146 3.01516 3.76733L4.28678 10.008L3.06488 16.2384C3.0162 16.4852 3.09492 16.738 3.27031 16.9134C3.29068 16.9337 3.31278 16.9531 3.33522 16.9714C3.55619 17.1454 3.85519 17.182 4.11069 17.066L18.2086 10.6578C18.4773 10.5356 18.6489 10.268 18.6485 9.9735ZM14.406 9.22716L5.66439 9.25379L4.77705 4.90084L14.406 9.22716ZM4.81711 15.0973L5.6694 10.7529L14.4323 10.7264L4.81711 15.0973Z"></path></svg>';

  const createInputField = (textareaEl, buttonEl) => {
    const container = document.createElement('div');
    container.className = 'yc-input-field-container';

    const label = document.createElement('label');
    label.className = 'yc-input-field-label';

    const icon = new DOMParser()
      .parseFromString(aiChatIconString, 'image/svg+xml')
      .documentElement;
    label.append(icon);

    const tooltip = document.createElement('div');
    tooltip.className = 'yc-label-tooltip';
    tooltip.innerText = 'Ask';
    tooltip.setAttribute('role', 'tooltip');

    const textareaWrap = document.createElement('div');
    textareaWrap.className = 'yc-textarea-grow-wrap';
    textareaWrap.appendChild(textareaEl);

    container.appendChild(label);
    container.appendChild(tooltip);
    container.appendChild(textareaWrap);
    container.appendChild(buttonEl);

    return container;
  };

  const chatBlock = document.createElement('div');
  chatBlock.className = 'yukon-chat-block';
  const chatBlockHeader = document.createElement('div');
  chatBlockHeader.className = 'yc-block-header';
  chatBlockHeader.textContent = 'Explore'; // todo: read from block - to be authorable
  const pillContainer = document.createElement('div');
  pillContainer.className = 'yukon-chat-pill';
  const inputField = document.createElement('section');
  inputField.className = 'yc-input-field';

  const textArea = document.createElement('textarea');
  textArea.id = 'yc-input-field';
  textArea.rows = 1;
  textArea.setAttribute('placeholder', 'Ask anything about Adobe Partner Connection Portal?'); // todo: from block or placeholder

  const inputFieldButton = document.createElement('button');
  inputFieldButton.className = 'yc-input-field-button';
  inputFieldButton.disabled = true;

  const submitIcon = new DOMParser()
    .parseFromString(submitIconString, 'image/svg+xml')
    .documentElement;
  inputFieldButton.append(submitIcon);

  const sharedInputField = createInputField(textArea, inputFieldButton);
  inputField.appendChild(sharedInputField);
  pillContainer.appendChild(inputField);

  let chatHistory;
  let modalInputWrapper;
  let modalInstance = null; // Store modal
  let chatHistoryCreated = false; // Track if chat history was already created
  const requestId = crypto.randomUUID();

  const appendUserMessage = (messageText) => {
    if (!chatHistory) return null;
    const userMessage = document.createElement('div');
    userMessage.className = 'chat-message user-message';

    const content = document.createElement('div');
    content.className = 'message-content';
    content.textContent = messageText;

    userMessage.appendChild(content);

    // Find last chat-message
    const messages = chatHistory.querySelectorAll('.chat-message');
    const lastMessage = messages[messages.length - 1];

    if (lastMessage && lastMessage.nextSibling) {
      lastMessage.parentNode.insertBefore(
        userMessage,
        lastMessage.nextSibling,
      );
    } else if (lastMessage) {
      chatHistory.appendChild(userMessage);
    } else {
      chatHistory.prepend(userMessage);
    }

    chatHistory.scrollTop = chatHistory.scrollHeight;
    return userMessage;
  };

  function scrollChatToBottom() {
    const messages = document.querySelectorAll('.user-message');
    const chat = messages[messages.length - 1];
    // Skip scroll for first message
    if (!chat || messages.length <= 1) return;
    // eslint-disable-next-line no-shadow
    const chatHistory = document.querySelector('.chat-history');
    chatHistory.classList.add('is-scrolling');
    chat.scrollIntoView({
      block: 'nearest',
      behavior: 'smooth',
    });
  }

  function showLoadingMessage(container) {
    const loading = document.createElement('div');
    loading.className = 'chat-loader';
    loading.innerHTML = `
      <div class="message-content loading-message">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
    `;
    container.appendChild(loading);
    scrollChatToBottom();
    return loading;
  }

  function removeLoadingMessage(loadingEl) {
    if (loadingEl) {
      loadingEl.remove();
    }
  }

  const sendMessage = async (questionText) => {
    if (!chatHistory) return;
    const question = questionText.trim();
    if (!question) return;

    // Show loading indicator first, right after user message
    const loadingElement = showLoadingMessage(chatHistory);

    let level = 'public';
    let region = 'worldwide';
    // TODO: the partner data must be sent to the servlet and parsed there
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
      url.searchParams.append('question', encodeURIComponent(question));
      url.searchParams.append('tags', JSON.stringify(tags));
      url.searchParams.append('requestId', requestId);
      url.searchParams.append('yukonProfile', 'dxpKbArticles');

      const resp = await fetch(url, {
        method: 'GET',
        credentials: 'include',
      });

      if (!resp || !resp.ok) {
        removeLoadingMessage(loadingElement);
        const chatMessage = document.createElement('div');
        chatMessage.className = 'chat-message yukon-message new-message';
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        const messageText = document.createElement('div');
        messageText.className = 'message-text';
        chatMessage.appendChild(messageContent);
        messageContent.appendChild(messageText);
        chatHistory.appendChild(chatMessage);
        const errorText = await resp.text();
        messageText.textContent = `Error ${resp.status}: ${errorText || 'Failed to get response from Yukon AI. Please try again.'}`;
        return;
      }

      // Create the yukon message container
      const chatMessage = document.createElement('div');
      chatMessage.className = 'chat-message yukon-message new-message';
      const messageContent = document.createElement('div');
      messageContent.className = 'message-content';
      const messageText = document.createElement('div');
      messageText.className = 'message-text';
      chatMessage.appendChild(messageContent);
      messageContent.appendChild(messageText);

      const reader = resp.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';
      let sourcesProcessed = false;
      let accumulatedMarkdown = '';
      let messageAdded = false;

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
                accumulatedMarkdown += generatedText;
                if (loadingElement && !messageAdded) {
                  removeLoadingMessage(loadingElement);
                  chatHistory.appendChild(chatMessage);
                  messageAdded = true;
                }
                messageText.innerHTML = parseMarkdown(accumulatedMarkdown);
              }
              if (source && Object.keys(source).length > 0) {
                if (!sourcesProcessed) {
                  sourcesProcessed = true;
                }
              }
            }
          } catch (parseError) {
            // eslint-disable-next-line no-console
            console.debug('Skipping non-JSON line:', line);
          }
        }
      }
      if (chatHistory) {
        chatHistory.classList.remove('is-scrolling');
      }
    } catch (error) {
      if (loadingElement) {
        removeLoadingMessage(loadingElement);
      }
      if (chatHistory) {
        const chatMessage = document.createElement('div');
        chatMessage.className = 'chat-message yukon-message new-message';
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        const messageText = document.createElement('div');
        messageText.className = 'message-text';
        chatMessage.appendChild(messageContent);
        messageContent.appendChild(messageText);
        chatHistory.appendChild(chatMessage);
        messageText.textContent = `Error: ${error.message}`;
      }
      // eslint-disable-next-line no-console
      console.error('Yukon API error:', error);
      // eslint-disable-next-line no-console
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
    }
  };
  chatBlock.appendChild(chatBlockHeader);
  chatBlock.appendChild(pillContainer);
  el.replaceWith(chatBlock);
  // Enable/disable button based on textarea content
  const updateButtonState = () => {
    const hasContent = textArea.value.trim().length > 0;
    if (hasContent) {
      inputFieldButton.removeAttribute('disabled');
    } else {
      inputFieldButton.setAttribute('disabled', '');
    }
  };
  // Function to create modal content
  const createModalContent = () => {
    const fragment = new DocumentFragment();
    // Modal header
    const modalHeader = document.createElement('div');
    modalHeader.className = 'yc-modal-header';
    const headerTitle = document.createElement('h1');
    headerTitle.className = 'yc-modal-title';
    headerTitle.textContent = 'Ask'; // todo: read from block or placeholder
    modalHeader.appendChild(headerTitle);
    // Chat dialog body
    const dialogBody = document.createElement('div');
    dialogBody.className = 'yukon-chat-dialog-body';
    const bodyContainer = document.createElement('div');
    bodyContainer.className = 'yukon-chat-container';
    const chatInterface = document.createElement('div');
    chatInterface.className = 'chat-interface';
    // Reuse existing chat history or create new one
    if (!chatHistoryCreated) {
      chatHistory = document.createElement('div');
      chatHistory.className = 'chat-history chat-direction-top-down chat-history-left';
      const privacyNoticeMessage = document.createElement('div');
      privacyNoticeMessage.className = 'chat-message privacy-notice-message';
      const privacyNoticeContent = document.createElement('div');
      privacyNoticeContent.className = 'message-content privacy-notice-content';
      const privacyNoticeTitle = document.createElement('div');
      privacyNoticeTitle.className = 'privacy-notice-title';
      const privacyNoticeText = document.createElement('div');
      privacyNoticeText.className = 'privacy-notice-text';
      privacyNoticeText.textContent = 'Welcome! Thank you for trying out this initial release. The experience is still evolving and will continue to improve over time.';
      privacyNoticeContent.appendChild(privacyNoticeTitle);
      privacyNoticeContent.appendChild(privacyNoticeText);
      privacyNoticeMessage.appendChild(privacyNoticeContent);
      chatHistory.appendChild(privacyNoticeMessage);
      chatHistoryCreated = true;
    }
    // Modal input wrapper
    modalInputWrapper = document.createElement('div');
    modalInputWrapper.className = 'modal-input-wrapper';
    chatInterface.appendChild(chatHistory);
    chatInterface.appendChild(modalInputWrapper);
    bodyContainer.appendChild(chatInterface);
    dialogBody.appendChild(bodyContainer);
    fragment.appendChild(modalHeader);
    fragment.appendChild(dialogBody);
    return fragment;
  };
  // Function to show modal using getModal
  const showModal = async () => {
    // Check if modal already exists in DOM
    if (modalInstance && document.body.contains(modalInstance)) {
      if (modalInputWrapper && !modalInputWrapper.contains(sharedInputField)) {
        modalInputWrapper.appendChild(sharedInputField);
      }
      setTimeout(() => {
        textArea.focus();
      }, 100);
      return modalInstance;
    }
    const modalContent = createModalContent();
    const modal = await getModal(null, {
      id: 'yukon-chat-modal',
      content: modalContent,
      closeEvent: 'yukon:modal:closed',
      class: 'yukon-chat-modal-wrapper',
      closeCallback: () => {
        // Move input field back to pill when modal closes
        if (inputField && sharedInputField) {
          inputField.appendChild(sharedInputField);
        }
        textArea.value = '';
        updateButtonState();
      },
    });
    if (!modal) {
      return null;
    }
    modalInstance = modal;
    modal.classList.add('yukon-chat-modal');
    if (modalInputWrapper) {
      modalInputWrapper.appendChild(sharedInputField);
    }
    setTimeout(() => {
      textArea.focus();
    }, 100);
    return modal;
  };
  // Listen for input changes
  textArea.addEventListener('input', updateButtonState);
  // Handle Enter key press
  textArea.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!inputFieldButton.hasAttribute('disabled')) {
        // Show modal
        await showModal();
        // Copy question to dialog textarea
        appendUserMessage(textArea.value);
        await sendMessage(textArea.value);
        // Clear the input field after sending
        textArea.value = '';
        updateButtonState();
      }
    }
  });

  // Wire up inputFieldButton
  inputFieldButton.addEventListener('click', async () => {
    await showModal();
    appendUserMessage(textArea.value);
    await sendMessage(textArea.value);
    textArea.value = '';
    updateButtonState();
  });
}
