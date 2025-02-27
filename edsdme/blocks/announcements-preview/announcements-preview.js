import { getCaasUrl, prodHosts } from '../../scripts/utils.js';
import { getConfig, localizationPromises, transformCardUrl } from '../utils/utils.js';
import { filterRestrictedCardsByCurrentSite } from '../announcements/AnnouncementsCards.js';

function addAnnouncement(cardData) {
  const linkWrapper = document.createElement('a');
  linkWrapper.className = 'link-wrapper';
  linkWrapper.href = transformCardUrl(cardData.contentArea.url);
  linkWrapper.target = '_blank';

  linkWrapper.style.display = 'block';

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
  img.alt = cardData.styles ? cardData.styles.backgroundAltText : '';
  img.loading = 'lazy';

  picture.appendChild(source);
  picture.appendChild(img);

  imageWrapper.appendChild(picture);
  announcementItem.appendChild(imageWrapper);
  contentWrapper.appendChild(titleElement);
  contentWrapper.appendChild(descriptionElement);
  announcementItem.appendChild(contentWrapper);

  linkWrapper.appendChild(announcementItem);
  return linkWrapper;
}

async function fetchData(blockData, newestCards) {
  try {
    let apiData = [];
    const response = await fetch(blockData.caasUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    apiData = await response.json();
    const cardsEvent = new Event('partner-cards-loaded');
    document.dispatchEvent(cardsEvent);

    if (apiData?.cards) {
      if (prodHosts.includes(window.location.host)) {
        apiData.cards = apiData.cards.filter((card) => !card.contentArea.url?.includes('/drafts/'));
      }
      // Filter announcements by current site
      apiData.cards = filterRestrictedCardsByCurrentSite(apiData.cards);
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

export default async function init(el) {
  const config = getConfig();
  const newestCards = [];

  const block = {
    el,
    collectionTag: '"caas:adobe-partners/collections/announcements"',
    ietf: config.locale.ietf,
  };

  const localizedText = { '{{no-partner-announcement}}': 'Currently, there are no partner announcements' };

  const deps = await Promise.all([
    localizationPromises(localizedText, config),
  ]);

  const blockData = {
    caasUrl: getCaasUrl(block),
    ietf: config.locale.ietf,
    title: '',
    buttonText: '',
    link: '',
    localizedText,
  };

  const app = document.createElement('div');
  app.className = 'announcements-preview';
  app.classList.add('con-block');
  el.classList.forEach((elem) => {
    if (!elem.includes('heading')) {
      app.classList.add(elem);
    }
  });
  Array.from(el.children).forEach((row) => {
    const cols = Array.from(row.children);
    const rowTitle = cols[0].innerText.trim().toLowerCase().replace(/ /g, '-');

    if (rowTitle && rowTitle === 'title') {
      blockData.title = cols[1].innerText;
    }
    if (rowTitle && rowTitle === 'page-url') {
      blockData.link = cols[1].querySelector('a')?.href;
    }
    if (rowTitle && rowTitle === 'button-text') {
      blockData.buttonText = cols[1].innerText;
    }
  });

  await fetchData(blockData, newestCards);

  if (blockData.title) {
    const componentTitle = document.createElement('h3');
    componentTitle.className = 'text announcement-preview-title';
    componentTitle.classList.add('heading-l');
    el.classList.forEach((elem) => {
      if (elem.includes('heading')) {
        componentTitle.classList.remove('heading-l');
        componentTitle.classList.add('heading-'.concat(elem.split('-')[0]));
      }
    });
    const titleText = document.createElement('strong');
    titleText.textContent = blockData.title;
    componentTitle.appendChild(titleText);
    app.appendChild(componentTitle);
  }

  if (newestCards.length) {
    newestCards.forEach((card) => {
      const linkWrapper = addAnnouncement(card);
      app.appendChild(linkWrapper);
    });

    if (blockData.link && blockData.buttonText) {
      const announcementButton = document.createElement('a');
      announcementButton.className = 'con-button blue';
      announcementButton.setAttribute('href', blockData.link);
      announcementButton.innerText = blockData.buttonText;
      app.appendChild(announcementButton);
    }
  } else {
    const emptyAnnouncements = document.createElement('p');
    emptyAnnouncements.className = 'empty-massage';
    emptyAnnouncements.textContent = blockData.localizedText['{{no-partner-announcement}}'];
    app.appendChild(emptyAnnouncements);
  }

  await deps;
  el.replaceWith(app);
}
