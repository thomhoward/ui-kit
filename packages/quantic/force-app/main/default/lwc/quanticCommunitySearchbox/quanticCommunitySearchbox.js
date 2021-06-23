import {
  LightningElement,
  track,
  api
} from 'lwc';
import {
  NavigationMixin
} from 'lightning/navigation';
import {
  registerComponentForInit,
  initializeWithHeadless
} from 'c/quanticHeadlessLoader';

const ENTER = 'Enter';
const ARROWUP = 'ArrowUp';
const ARROWDOWN = 'ArrowDown';

export default class QuanticCommunitySearchBox extends NavigationMixin(LightningElement) {

  /** @type {import("coveo").SearchBoxState} */
  @track state = {
    // @ts-ignore
    redirectTo: '',
    suggestions: [],
    value: '',
  };

  /** @type {any} */
  get suggestions() {
    return this.state.suggestions.map((s, index) => ({
      key: index,
      value: s.rawValue
    }));
  }

  /** @type {string} */
  @api engineId;
  /** @type {string} */
  @api placeholder = 'Search';
  /** @type {string} */
  @api redirectTo = 'global-search';
  /** @type {string} */
  @api searchHub;

  /** @type {import("coveo").SearchBox} */
  searchBox;
  /** @type {import("coveo").StandaloneSearchBox} */
  standaloneSearchBox;
  /** @type {import("coveo").Unsubscribe} */
  unsubscribeStandalone;
  /** @type {import("coveo").Unsubscribe} */
  unsubscribe;
  /** @type {number} */
  selectionIndex = -1;
  /** @type {HTMLInputElement} */
  input;
  /** @type {import("lwc").HTMLElementTheGoodPart} */
  combobox;

  /** @type {() => void} */
  resetSelectionIndex = () => {
    this.selectionIndex = -1
  };
  /** @type {() => boolean} */
  // @ts-ignore
  areSuggestionsShown = () => (this.template.querySelector('.slds-combobox').classList.contains('slds-is-open'));
  /** @type {() => HTMLElement[]} */
  // @ts-ignore
  getSuggestionElements = () => this.template.querySelectorAll('.slds-listbox__option');

  /**
   * @param {import("coveo").Engine} engine
   */
  @api
  initialize(engine) {
    this.searchBox = CoveoHeadless.buildSearchBox(engine);
    this.standaloneSearchBox = CoveoHeadless.buildStandaloneSearchBox(engine, {
      options: {
        redirectionUrl: `${window.location.origin}`
      }
    });
    this.unsubscribeStandalone = this.standaloneSearchBox.subscribe(() => {});
    this.unsubscribe = this.searchBox.subscribe(() => this.updateState());
  }

  connectedCallback() {
    registerComponentForInit(this, this.engineId);
  }

  renderedCallback() {
    initializeWithHeadless(this, this.engineId, this.initialize.bind(this));
    if (!this.input) {
      // @ts-ignore
      this.input = this.template.querySelector('input');
    }
    if (!this.combobox) {
      // @ts-ignore
      this.combobox = this.template.querySelector('.slds-combobox');
    }
  }

  disconnectedCallback() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  updateState() {
    if (this.state.value !== this.searchBox.state.value && this.input.value !== this.searchBox.state.value) {
      console.log('changing the input value from ' + this.input.value + ' to ' + this.searchBox.state.value);
      this.input.value = this.searchBox.state.value;
    }
    this.state = this.searchBox.state;
  }

  showSuggestions() {
    this.combobox.classList.add('slds-is-open');
    this.combobox.setAttribute("aria-expanded", true);
  }

  hideSuggestions() {
    this.combobox.classList.remove('slds-is-open');
    this.combobox.setAttribute('aria-expanded', false);
    this.resetHighlighted();
    this.resetSelectionIndex();
  }

  setHighlighted() {
    const options = this.getSuggestionElements();
    const option = options[this.selectionIndex];

    this.resetHighlighted();
    option.setAttribute('aria-selected', 'true');
    option.classList.add('slds-has-focus');
    this.input.value = option.textContent;
  }

  resetHighlighted() {
    const options = this.getSuggestionElements();

    options.forEach((element) => {
      element.setAttribute('aria-selected', 'false');
      element.classList.remove('slds-has-focus');
    });
  }

  /**
   * @param {string} textValue
   */
  updateSearchboxText(textValue) {
    this.input.value = textValue;
    this.searchBox.updateText(textValue);
  }

  handleEnter() {
    if (this.selectionIndex >= 0) {
      this.searchBox.updateText(this.input.value);
    }
    this.input.blur();
    this.handleSearchboxSubmit();
  }

  handleArrowUp() {
    this.selectionIndex--;
    if (this.selectionIndex < 0) {
      this.selectionIndex = this.suggestions.length - 1;
    }
    this.setHighlighted();
  }

  handleArrowDown() {
    this.selectionIndex++;
    if (this.selectionIndex > this.suggestions.length - 1) {
      this.selectionIndex = 0;
    }
    this.setHighlighted();
  }

  /**
   * @param {KeyboardEvent & {target: {value : string}}} event
   */
  onKeyup(event) {
    if (event.key === ENTER) {
      this.handleEnter();
    } else if (this.areSuggestionsShown() && event.key === ARROWUP) {
      this.handleArrowUp();
    } else if (this.areSuggestionsShown() && event.key === ARROWDOWN) {
      this.handleArrowDown();
    } else {
      this.resetSelectionIndex();
      this.resetHighlighted();
      this.searchBox.updateText(event.target.value);
    }
  }

  onFocus() {
    this.searchBox.showSuggestions();
    this.showSuggestions();
  }

  onBlur() {
    this.hideSuggestions();
  }

  preventDefault(event) {
    event.preventDefault();
  }

  /**
   * @param {KeyboardEvent & {target: {textContent : string}}} event
   */
  handleSuggestionSelection(event) {
    const textValue = event.target.textContent;
    this.updateSearchboxText(textValue);
    this.input.blur();
    if (this.shouldRedirect) {
      this.standaloneSearchBox.selectSuggestion(textValue);
      this.navigateToSearchPage();
    } else {
      this.searchBox.selectSuggestion(textValue);
    }
  }

  handleSearchboxSubmit() {
    if (this.shouldRedirect) {
      this.standaloneSearchBox.updateText(this.state.value);
      this.standaloneSearchBox.submit();
      this.navigateToSearchPage();
    } else {
      this.searchBox.submit();
    }
  }

  navigateToSearchPage() {
    // Navigate to the search page
    this[NavigationMixin.Navigate]({
      type: 'standard__webPage',
      attributes: {
        url: `/${this.redirectTo}/%40#q=${this.state.value}`
      }
    }, false);
  }

  get shouldRedirect() {
    return !window.location.pathname.includes(this.redirectTo);
  }
}