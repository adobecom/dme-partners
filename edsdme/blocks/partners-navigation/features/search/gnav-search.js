// MWPW-159021
/* eslint-disable */
import {
  toFragment,
  isDesktop,
  setCurtainState,
  trigger,
  closeAllDropdowns,
  logErrorFor,
} from '../../utilities/utilities.js';
import { getLibs } from '../../../../scripts/utils.js';
import { generateRequestForSearchAPI } from "../../../utils/utils.js";

const miloLibs = getLibs();
const { replaceKeyArray } = await import(`${miloLibs}/features/placeholders.js`);
const { getConfig, getFedsPlaceholderConfig } = await import(`${miloLibs}/utils/utils.js`);
const { debounce } = await import(`${miloLibs}/utils/action.js`);


const CONFIG = {
  selectors: {
    hasResults: 'has-results',
    inputIsPopulated: 'feds-search-input--isPopulated',
  },
};
const SUGGESTIONS_SIZE = 10;

const { locale } = getConfig();

class Search {
  constructor(config) {
    this.icon = config.icon;
    this.trigger = config.trigger;
    this.parent = this.trigger.closest('.feds-nav-wrapper');
    const observer = new MutationObserver(() => {
      this.clearSearchForm();
    });
    observer.observe(this.trigger, { attributeFilter: ['aria-expanded'] });
    logErrorFor(this.init.bind(this), 'Search init has failed', 'errorType=error,module=gnav-search');
  }

  async init() {
    await this.getLabels();
    this.decorate();
    this.addEventListeners();
    this.toggleDropdown();
  }

  async getLabels() {
    this.labels = {};
    [this.labels.clearResults] = await replaceKeyArray(['clear-results'], getFedsPlaceholderConfig());
    [this.labels.search, this.labels.viewAllResults] = await replaceKeyArray(['search-topics-resources-files', 'view-all-results'], getConfig());
  }

  decorate() {
    this.input = toFragment`<input placeholder="${this.labels.search}" aria-label="${this.labels.search}" class="feds-search-input" autocomplete="off" aria-autocomplete="list" aria-controls="feds-search-results" daa-ll="search-results:standard search" />`;
    this.resultsList = toFragment`<ul class="feds-search-results" id="feds-search-results" role="region" daa-ll="search-results:suggested-search:click"></ul>`;
    this.clearButton = toFragment`<button tabindex="0" class="feds-search-clear" aria-label="${this.labels.clearResults}"></button>`;
    this.searchBar = toFragment`
      <aside class="feds-search-dropdown">
        <div class="feds-search-bar">
          <div class="feds-search-field">
            ${this.input}
            <div class="feds-search-icons">
              ${this.icon}
              ${this.clearButton}
            </div>
          </div>
          ${this.resultsList}
        </div>
      </aside>`;

    this.trigger.after(this.searchBar);
  }

  clearSearchForm() {
    this.input.value = '';
    this.onSearchInput();
  }

  addEventListeners() {
    // Toggle the dropdown when the trigger is clicked
    this.trigger.addEventListener('click', () => {
      this.toggleDropdown();
    });

    this.input.addEventListener('input', () => {
      this.onSearchInput();
    });

    this.input.addEventListener('keydown', (e) => {
      if (e.code === 'Escape') {
        // Pressing ESC when input has value resets the results
        if (this.input.value.length) {
          this.clearSearchForm();
        } else if (isDesktop.matches) {
          closeAllDropdowns();
          this.trigger.focus();
        }
      }

      if (e.code === 'Enter') {
        if (!this.input) return;
        window.location.href = Search.getSearchLink(this.input.value?.trim());
      }
    });

    // If a search result is focused, return focus to input when ESC is pressed
    this.resultsList.addEventListener('keydown', (e) => {
      if (e.code === 'Escape') {
        this.input.focus();
      }
    });

    // Clicking the clear button resets the results
    this.clearButton.addEventListener('click', () => {
      this.clearSearchForm();
      this.input.focus();
    });

    // Switching between a mobile and a desktop view
    // should close the search dropdown
    isDesktop.addEventListener('change', () => {
      closeAllDropdowns();
    });
  }

  getSuggestions(query = this.query) {
    return generateRequestForSearchAPI(
      {
        size: SUGGESTIONS_SIZE,
        term: query,
        suggestions: true,
      }
    ).then((data) => data.json())
      .catch(() => {
        // do nothing
      });
  }

  onSearchInput = debounce(() => {
    const query = this.getQuery();

    if (!query.length) {
      this.resultsList.replaceChildren();
      delete this.query;
      return;
    }

    // Avoid successive calls for the same input value
    if (query === this.query) {
      return;
    }

    this.query = query;

    this.getSuggestions()
      .then((data) => {
        data = {
          "suggested_completions": [
            {
              "name": "Region-nav",
              "type": "page"
            },
            {
              "name": "Regoion selector page",
              "type": "page"
            },
            {
              "name": "Nested fragment ignored in search",
              "type": "page"
            },
            {
              "name": "Ignored page with fragments",
              "type": "page"
            },
            {
              "name": "Fragment (not ignored) with nested fragments (1 is ignored the other not)",
              "type": "page"
            },
            {
              "name": "Nested (not ignored) fragment",
              "type": "page"
            },
            {
              "name": "Page with fragments",
              "type": "page"
            },
            {
              "name": "Ignored in search fragment",
              "type": "page"
            },
            {
              "name": "Sales Resources",
              "type": "page"
            },
            {
              "name": "MAPC public stage (no partner level, no program type, no region, no specializations)",
              "type": "asset"
            },
            {
              "name": "MAPC stage worldwide (no partner level, no specializations)",
              "type": "asset"
            },
            {
              "name": "MAPC stage education (level: distributor, gold) (region: Asia Pacific, Japan, Latin America, North America",
              "type": "asset"
            },
            {
              "name": "MAPC stage combined (all levels, regions (except worldwide), no specializations)",
              "type": "asset"
            },
            {
              "name": "General Error",
              "type": "page"
            },
          ]
        };
        const suggestions = data?.suggested_completions;
        this.resultsList.replaceChildren(this.getResultsTemplate(suggestions));
        this.resultsList.appendChild(this.getViewAllResultsTemplate());
        if (this.parent instanceof HTMLElement) {
          this.parent.classList.add(CONFIG.selectors.hasResults);
        }
      })
      .catch(() => {
        this.resultsList.replaceChildren(this.getViewAllResultsTemplate());
        if (this.parent instanceof HTMLElement) {
          this.parent.classList.remove(CONFIG.selectors.hasResults);
        }
      });
  }, 150);

  getQuery() {
    const query = this.input.value.trim();

    if (!query.length) {
      this.input.classList.remove(CONFIG.selectors.inputIsPopulated);
      this.resultsList.replaceChildren();
      if (this.parent instanceof HTMLElement) {
        this.parent.classList.remove(CONFIG.selectors.hasResults);
      }
      return '';
    }

    this.input.classList.add(CONFIG.selectors.inputIsPopulated);

    return query;
  }

  getResultsTemplate(results) {
    const resultsTemplate = document.createDocumentFragment();

    // eslint-disable-next-line array-callback-return
    results.map((result) => {
      const resultLabel = result.name;

      if (!resultLabel.length) {
        return;
      }

      // A longest common substring match between the original prefix and suggestion must be made
      // for cases when special characters are used. Say the user searches for 'pho-',
      // then the prefix will be 'pho-', while the suggestion will be 'photoshop'.
      // The generated suggestion markup should look like `<b>pho</b>toshop`,
      // so we need to extract the part of the prefix that matches the current suggestion
      const matchPrefixToSuggestion = () => {
        let i = 0;
        const prefixLength = this.query.length;

        while (i < prefixLength && this.query[i].toLowerCase() === resultLabel[i].toLowerCase()) {
          i += 1;
        }

        return this.query.substring(0, i).trim();
      };

      // The matched prefix can't be cached to be used for all of the suggestions in the set
      // because there are edge cases when there are significant differences between suggestions.
      // For example, the query 'max 20' will yield the suggestions 'max 2016' and 'maximize',
      // thus the common part between the query and the suggestion differs:
      // * 'max 20' for the first suggestion
      // * 'max' for the second suggestion
      const matchedPrefix = matchPrefixToSuggestion();

      // Say the user searched for 'PhOtOsHoP' and the suggested result is 'Photoshop Trial';
      // We don't want the suggestion to be rendered as '<b>PhOtOsHoP</b> Trial',
      // rather '<b>Photoshop</b> Trial', like the original suggestion formatting.
      // First, define a capturing group Regexp;
      // in the example above this will be '/(PhOtOsHoP)/i'
      const prefixPattern = new RegExp(`(${matchedPrefix})`, 'i');
      let suggestionPrefix;
      // Remove the query from the suggestion and
      // save the matched prefix in its original formatting from the API
      const suggestionWithoutPrefix = resultLabel.replace(prefixPattern, (match) => {
        // Save the matched string (with the formatting suggested by the API) into a variable
        suggestionPrefix = match;
        // Remove the matched string
        return '';
      });

      /* MWPW-162729 */
      const icon = result.type === 'asset' ? `<span class="feds-search-result-icon" style="background-image: url('/edsdme/img/icons/default.svg')"></span>` : '';

      const resultTemplate = toFragment`<li>
          <a href="${Search.getSearchLink(resultLabel)}" class="feds-search-result" aria-label="${resultLabel}">
            ${icon}
            <span>${suggestionPrefix}</span>${suggestionWithoutPrefix}
          </a>
        </li>`;

      resultsTemplate.appendChild(resultTemplate);
    });

    return resultsTemplate;
  }

  getViewAllResultsTemplate(query = this.query) {
    return toFragment`<li>
      <a href="${Search.getSearchLink(query)}" class="feds-search-view-all-results"><span>${this.labels.viewAllResults}</span></a>
    </li>`;
  }

  focusInput() {
    if (isDesktop.matches) {
      this.input.focus();
    }
  }

  toggleDropdown() {
    if (!isDesktop.matches) return;

    const hasBeenOpened = trigger({ element: this.trigger });
    if (hasBeenOpened) {
      setCurtainState(true);
      this.focusInput();
    } else {
      this.clearSearchForm();
    }
  }

  static getSearchLink(query) {
    const queryString = query ? `?term=${encodeURIComponent((query || '').trim())}` : '';
    return `${locale?.prefix}/channelpartners/home/search/${queryString}`;
  }
}

export default Search;
