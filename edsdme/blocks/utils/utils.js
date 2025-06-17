import { getLocale, setLibs } from '../../scripts/utils.js';
import { RT_SEARCH_ACTION_PATH } from './dmeConstants.js';

const miloLibs = setLibs('/libs');

const { createTag, localizeLink, getConfig } = await import(`${miloLibs}/utils/utils.js`);

export { createTag, localizeLink, getConfig };
const { replaceText } = await import(`${miloLibs}/features/placeholders.js`);
export { replaceText };

const previewURL = 'https://admin.hlx.page/preview/adobecom/dme-partners/main/*';
const publishURL = 'https://admin.hlx.page/live/adobecom/dme-partners/main/*';

export function populateLocalizedTextFromListItems(el, localizedText) {
  const liList = Array.from(el.querySelectorAll('li'));
  liList.forEach((liEl) => {
    const liInnerText = liEl.innerText;
    if (!liInnerText) return;
    let liContent = liInnerText.trim().toLowerCase().replace(/ /g, '-');
    if (liContent.endsWith('_default')) liContent = liContent.slice(0, -8);
    localizedText[`{{${liContent}}}`] = liContent;
  });
}
export async function localizationPromises(localizedText, config) {
  return Promise.all(Object.keys(localizedText).map(async (key) => {
    const value = await replaceText(key, config);
    if (value.length) {
      localizedText[key] = value;
    }
  }));
}

export function getRuntimeActionUrl(action, type = 'dx') {
  const { env } = getConfig();
  const isProd = env.name === 'prod';

  const domains = {
    dx: {
      stage: 'https://io-partners-dx.stage.adobe.com',
      prod: 'https://io-partners-dx.adobe.com',
    },
    tooling: {
      stage: 'https://io-partners-tooling.stage.adobe.com',
      prod: 'https://io-partners-tooling.adobe.com',
    },
  };

  const domain = isProd ? domains[type].prod : domains[type].stage;
  return new URL(`${domain}${action}`);
}

export function generateRequestForSearchAPI(pageOptions, body) {
  const { locales } = getConfig();
  const url = getRuntimeActionUrl(RT_SEARCH_ACTION_PATH);
  const localesData = getLocale(locales);
  const queryParams = new URLSearchParams(url.search);
  queryParams.append('geo', localesData.prefix && localesData.region);
  queryParams.append('language', localesData.ietf);

  // eslint-disable-next-line array-callback-return
  Object.keys(pageOptions).map((option) => {
    queryParams.append(option, pageOptions[option]);
  });

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');

  return fetch(url + queryParams, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
    credentials: 'include',
  });
}

// eslint-disable-next-line class-methods-use-this
export function setDownloadParam(url) {
  try {
    if (!url) return '';
    const urlWithParam = new URL(url);
    urlWithParam.search = 'download';
    // eslint-disable-next-line consistent-return
    return urlWithParam;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Invalid URL provided:', url, error.message);
    return '';
  }
}

// eslint-disable-next-line class-methods-use-this
export function transformCardUrl(url) {
  if (!url) {
    // eslint-disable-next-line no-console
    console.error('URL is null or undefined');
    return '';
  }
  const newUrl = new URL(url);
  newUrl.protocol = window.location.protocol;
  newUrl.host = window.location.host;
  return newUrl;
}

export async function sidekickListener(locales) {
  const deps = await Promise.all([
    import(`${miloLibs}/features/spectrum-web-components/dist/toast.js`),
    import(`${miloLibs}/features/spectrum-web-components/dist/theme.js`),
  ]);
  await deps;

  const initSidekickListener = () => {
    const sidekick = document.querySelector('aem-sidekick, helix-sidekick');
    if (sidekick) {
      // eslint-disable-next-line no-use-before-define
      sidekick.addEventListener('custom:publishtoallsites', publishToAllSites, { once: true });
    }
  };

  // eslint-disable-next-line arrow-body-style
  const showToast = async (messages, variant = 'info') => {
    return new Promise((resolve) => {
      const header = document.querySelector('header');
      const theme = document.createElement('sp-theme');
      theme.setAttribute('theme', 'spectrum');
      theme.setAttribute('color', 'light');
      theme.setAttribute('scale', 'medium');

      const toast = document.createElement('sp-toast');
      toast.variant = variant;
      toast.open = true;
      toast.dismissible = true;
      toast.setAttribute('style', 'min-width: 90%');
      messages.forEach((msg) => {
        const divElem = document.createElement('div');
        divElem.textContent = msg;
        toast.append(divElem);
      });

      theme.appendChild(toast);
      header.appendChild(theme);

      customElements.whenDefined('sp-toast').then(() => {
        requestAnimationFrame(() => {
          const shadow = toast.shadowRoot;
          if (shadow) {
            const contentEl = shadow.querySelector('.content');
            if (contentEl) {
              contentEl.style.setProperty('word-break', 'break-word');
              contentEl.style.setProperty('overflow-x', 'hidden');
              contentEl.style.setProperty('max-height', '500px');
            }
          }
        });
      });

      const cleanup = () => {
        initSidekickListener();
        toast.removeEventListener('close', cleanup);
        theme.remove();
        resolve();
      };

      toast.addEventListener('close', cleanup);
    });
  };
  const runtimeSendToCaasUrl = getRuntimeActionUrl('/api/v1/web/dx-partners-runtime-tooling/publish-announcement-to-caas', 'tooling');

  const publishToAllSites = async ({ detail: payload }) => {
    try {
      if (!window.adobeIMS.isSignedInUser()) {
        await showToast(
          ['You are not logged in with an Adobe ID. Redirecting to login...'],
          'info',
        );
        window.adobeIMS.adobeIdData.redirect_uri = window.location.href;
        window.adobeIMS.signIn();
        return;
      }
      showToast(['Starting the publishing process'], 'info');
      const headers = new Headers();
      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'application/json');

      // eslint-disable-next-line no-confusing-arrow
      const paths = Object.keys(locales).map((locale) => locale ? `/${locale}${payload.location.pathname}` : payload.location.pathname);

      const requestOptions = {
        method: 'POST',
        headers,
        body: JSON.stringify({ paths }),
      };

      const previewRes = await fetch(previewURL, requestOptions);
      if (!previewRes.ok) {
        const errorText = previewRes.headers.get('X-Error') || await previewRes.text();
        // eslint-disable-next-line no-console
        console.error('Preview with Sidekick Failed:', previewRes.status, errorText);
        await showToast([`Preview failed: ${errorText}`], 'negative');
        return;
      }
      showToast(['Preview Successful'], 'info');

      const publishRes = await fetch(publishURL, requestOptions);
      if (!publishRes.ok) {
        const errorText = publishRes.headers.get('X-Error') || await publishRes.text();
        // eslint-disable-next-line no-console
        console.error('Publish with Sidekick Failed:', publishRes.status, errorText);
        await showToast([`Publish failed: ${errorText}`], 'negative');
        return;
      }
      showToast(['Publishing Successful'], 'info');

      headers.append('Authorization', window.adobeIMS.getAccessToken().token);

      const caasRes = await fetch(runtimeSendToCaasUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({ cardPath: window.location.pathname }),
      });

      if (!caasRes.ok) {
        const errorText = await caasRes.text();
        // eslint-disable-next-line no-console
        console.error('CaaS Publish Failed:', caasRes.status, errorText);
        await showToast([`CaaS publishing failed: ${errorText}`], 'negative');
        return;
      }

      const caasData = await caasRes.json();
      const contentItems = ['Publish to CaaS:', 'The following announcements were successfully published:'];
      contentItems.push(...caasData.successfulIds);
      if (caasData.errors) {
        contentItems.push('The following errors occured:');
        contentItems.push(...caasData.errors);
      }
      const variantWhenErrors = caasData.successfulIds ? 'info' : 'negative';
      const variant = caasData.errors ? variantWhenErrors : 'positive';

      await showToast(
        contentItems,
        variant,
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Unexpected Error:', error);
      await showToast([`Unexpected error: ${error.message || error}`], 'negative');
    }
  };

  initSidekickListener();
}
