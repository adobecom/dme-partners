import { getCaasUrl } from '../../scripts/utils.js';
import { getConfig } from '../utils/utils.js';

export default async function init(el) {
  const config = getConfig();
  const newestCards = [];

  const block = {
    el,
    collectionTag: '"caas:adobe-partners/collections/announcements"',
    ietf: config.locale.ietf,
  };

  const blockData = {
    caasUrl: getCaasUrl(block),
    ietf: config.locale.ietf,
    title: '',
    buttonText: '',
    link: '',
    empty: 'Currently, there a no partner announcements',
  };

  const app = document.createElement('announcements-preview');

  Array.from(el.children).forEach((row) => {
    const cols = Array.from(row.children);
    const rowTitle = cols[0].innerText.trim().toLowerCase().replace(/ /g, '-');

    if (rowTitle && rowTitle === 'title') {
      blockData.title = cols[1].innerText;
    }
    if (rowTitle && rowTitle === 'page-url') {
      blockData.link = cols[1].innerText;
    }
    if (rowTitle && rowTitle === 'button-text') {
      blockData.buttonText = cols[1].innerText;
    }
  });

  function addAnnouncement(cardData) {
    const announcementItem = document.createElement('div');
    announcementItem.className = 'announcement-item';

    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'card-content';
    const titleElement = document.createElement('h3');
    titleElement.className = 'card-title';
    titleElement.textContent = cardData.contentArea.title;

    const descriptionElement = document.createElement('p');
    descriptionElement.className = 'card-description';
    descriptionElement.textContent = cardData.contentArea.description;

    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'card-image';

    const picture = document.createElement('picture');

    const source = document.createElement('source');
    source.srcset = `${new URL(cardData.styles?.backgroundImage).pathname}?width=240&format=webp&optimize=small`;
    source.type = 'image/webp';

    const img = document.createElement('img');
    img.src = `${new URL(cardData.styles?.backgroundImage).pathname}??width=240&format=webp&optimize=small`;
    img.alt = 'Image description';
    img.loading = 'lazy';

    picture.appendChild(source);
    picture.appendChild(img);

    imageWrapper.appendChild(picture);
    announcementItem.appendChild(imageWrapper);
    contentWrapper.appendChild(titleElement);
    contentWrapper.appendChild(descriptionElement);
    announcementItem.appendChild(contentWrapper);
    app.appendChild(announcementItem);
  }

  async function fetchData() {
    try {
      let apiData = [];

      const response = await fetch(blockData.caasUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      apiData = await response.json();

      if (apiData?.cards) {
        apiData.cards.forEach((card) => {
          const cardDate = new Date(card.cardDate);
          if (newestCards.length < 3) {
            newestCards.push(card);
            newestCards.sort((a, b) => new Date(b.cardDate) - new Date(a.cardDate));
          } else if (cardDate > new Date(newestCards[2].cardDate)) {
            newestCards[2] = card;
            newestCards.sort((a, b) => new Date(b.cardDate) - new Date(a.cardDate));
          }
        });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching data:', error);
    }
  }

  await fetchData();

  if (blockData.title !== '') {
    const componentTitle = document.createElement('div');
    componentTitle.className = 'text announcement-preview-title';
    const titleText = document.createElement('h3');
    titleText.textContent = blockData.title;
    componentTitle.appendChild(titleText);
    app.appendChild(componentTitle);
  }

  if (newestCards.length !== 0) {
    newestCards.forEach((card) => {
      addAnnouncement(card);
    });

    if (blockData.link !== '' && blockData.buttonText !== '') {
      const announcementButton = document.createElement('a');
      announcementButton.className = 'con-button blue';
      announcementButton.setAttribute('href', blockData.link);
      announcementButton.innerText = blockData.buttonText;
      app.appendChild(announcementButton);
    }
  } else {
    const emptyAnnouncements = document.createElement('p');
    emptyAnnouncements.className = 'empty-massage';
    emptyAnnouncements.textContent = blockData.empty;
    app.appendChild(emptyAnnouncements);
  }

  el.replaceWith(app);
}
