import { getLibs } from '../../../../scripts/utils.js';

import { getConfig } from '../../../utils/utils.js';

const miloLibs = getLibs();

const { toFragment, getFedsPlaceholderConfig, trigger, closeAllDropdowns, logErrorFor } = await import(`${miloLibs}/blocks/global-navigation/utilities/utilities.js`);

const { replaceKeyArray } = await import(`${miloLibs}/features/placeholders.js`);

const decorateProfileLink = (service, path = '') => {
  const defaultServiceUrls = {
    adminconsole: 'https://adminconsole.adobe.com',
    account: 'https://account.adobe.com',
  };

  if (!service.length || !defaultServiceUrls[service]) return '';

  let serviceUrl;
  const { env } = getConfig();

  if (!env?.[service]) {
    serviceUrl = defaultServiceUrls[service];
  } else {
    serviceUrl = new URL(defaultServiceUrls[service]);
    serviceUrl.hostname = env[service];
  }

  return `${serviceUrl}${path}`;
};

const decorateEditProfileLink = () => {
  const { env } = getConfig();
  if (env.name === 'prod') {
    return 'https://channelpartners.adobe.com/s/manageprofile/?appid=mp';
  }
  return 'https://channelpartners.stage2.adobe.com/s/manageprofile/?appid=mp';
};

const decorateAction = (label, path) => toFragment`<li><a class="feds-profile-action" href="${decorateProfileLink('adminconsole', path)}">${label}</a></li>`;

class ProfileDropdown {
  constructor({
    rawElem,
    decoratedElem,
    avatar,
    sections,
    buttonElem,
    openOnInit,
  } = {}) {
    this.placeholders = {};
    this.profileData = {};
    this.avatar = avatar;
    this.buttonElem = buttonElem;
    this.decoratedElem = decoratedElem;
    this.sections = sections;
    this.openOnInit = openOnInit;
    this.localMenu = rawElem.querySelector('h5')?.parentElement;
    logErrorFor(this.init.bind(this), 'ProfileDropdown.init()', 'errorType=error,module=gnav-profile');
  }

  async init() {
    await this.getData();
    this.setButtonLabel();
    this.dropdown = this.decorateDropdown();
    this.addEventListeners();

    if (this.openOnInit) trigger({ element: this.buttonElem });

    this.decoratedElem.append(this.dropdown);
  }

  async getData() {
    [
      [
        this.placeholders.profileButton,
        this.placeholders.signOut,
        this.placeholders.viewAccount,
        this.placeholders.manageTeams,
        this.placeholders.manageEnterprise,
        this.placeholders.profileAvatar,
      ],
      [
        this.placeholders.editProfile,
      ],
      { displayName: this.profileData.displayName, email: this.profileData.email },
    ] = await Promise.all([
      replaceKeyArray(
        ['profile-button', 'sign-out', 'view-account', 'manage-teams', 'manage-enterprise', 'profile-avatar'],
        getFedsPlaceholderConfig(),
      ),
      replaceKeyArray(
        ['edit-profile'],
        getConfig(),
      ),
      window.adobeIMS.getProfile(),
    ]);
  }

  setButtonLabel() {
    if (this.buttonElem) this.buttonElem.setAttribute('aria-label', this.profileData.displayName);
  }

  decorateDropdown() {
    // TODO: the account name and email might need a bit of adaptive behavior;
    // historically we shrunk the font size and displayed the account name on two lines;
    // the email had some special logic as well;
    // for MVP, we took a simpler approach ("Some very long name, very l...")
    this.avatarElem = toFragment`<img
      class="feds-profile-img"
      src="${this.avatar}"
      tabindex="0"
      alt="${this.placeholders.profileAvatar}"
      data-url="${decorateEditProfileLink()}"></img>`;
    return toFragment`
      <div id="feds-profile-menu" class="feds-profile-menu">
        <a
          href="${decorateEditProfileLink()}"
          target="_blank"
          class="feds-profile-header"
          daa-ll="${this.placeholders.editProfile}"
          aria-label="${this.placeholders.editProfile}"
        >
          ${this.avatarElem}
          <div class="feds-profile-details">
            <p class="feds-profile-name">${this.profileData.displayName}</p>
            <p class="feds-profile-email">${this.decorateEmail(this.profileData.email)}</p>
            <p class="feds-profile-account">${this.placeholders.editProfile}</p>
          </div>
        </a>
        ${this.localMenu ? this.decorateLocalMenu() : ''}
        <ul class="feds-profile-actions">
          ${this.sections?.manage?.items?.team?.id ? decorateAction(this.placeholders.manageTeams, '/team') : ''}
          ${this.sections?.manage?.items?.enterprise?.id ? decorateAction(this.placeholders.manageEnterprise) : ''}
          ${this.decorateSignOut()}
        </ul>
      </div>
    `;
  }

  decorateEmail() {
    const maxCharacters = 12;
    const emailParts = this.profileData.email.split('@');
    const username = emailParts[0].length <= maxCharacters
      ? emailParts[0]
      : `${emailParts[0].slice(0, maxCharacters)}…`;
    const domainArr = emailParts[1].split('.');
    const tld = domainArr.pop();
    let domain = domainArr.join('.');
    domain = domain.length <= maxCharacters
      ? domain
      : `${domain.slice(0, maxCharacters)}…`;

    return `${username}@${domain}.${tld}`;
  }

  decorateLocalMenu() {
    if (this.localMenu) this.localMenu.classList.add('feds-local-menu');

    return this.localMenu;
  }

  decorateSignOut() {
    const signOutLink = toFragment`
      <li>
        <a href="#" class="feds-profile-action" daa-ll="${this.placeholders.signOut}">${this.placeholders.signOut}</a>
      </li>
    `;

    signOutLink.addEventListener('click', (e) => {
      e.preventDefault();
      window.dispatchEvent(new Event('feds:signOut'));
      window.adobeIMS.signOut();
    });

    return signOutLink;
  }

  addEventListeners() {
    this.buttonElem.addEventListener('click', (e) => trigger({ element: this.buttonElem, event: e }));
    this.buttonElem.addEventListener('keydown', (e) => e.code === 'Escape' && closeAllDropdowns());
    this.dropdown.addEventListener('keydown', (e) => e.code === 'Escape' && closeAllDropdowns());
    this.avatarElem.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.assign(this.avatarElem.dataset?.url);
    });
  }
}

export default ProfileDropdown;
