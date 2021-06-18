import { LightningElement, track, api, wire } from 'lwc';
// @ts-ignore
import { NavigationMixin, CurrentPageReference } from 'lightning/navigation';
// @ts-ignore
import { registerComponentForInit, initializeWithHeadless } from 'c/quanticHeadlessLoader';

const ENTER = 'Enter';
const ARROWUP = 'ArrowUp';
const ARROWDOWN = 'ArrowDown';

export default class QuanticStandaloneSearchBox extends NavigationMixin(LightningElement) {

  // Declare the currentPageReference variable in order to track it
  pageRef;
  // Injects the page reference that describes the current page
  @wire(CurrentPageReference)
  setCurrentPageReference(currentPageReference) {
    console.log(`setCurrentPageReference`);
    this.pageRef = currentPageReference;
    if(this.state.value && this.state.value !== this.queryFromUrl) {
      console.log(currentPageReference);
      console.log('input exists');
      this.updateSearchboxText(this.queryFromUrl);
      this.triggerSearch(true);
    }
  }

  /** @type {import("coveo").StandaloneSearchBoxState} */
  @track state = {
    // @ts-ignore
    redirectTo: '',
    suggestions: [],
    value: '',
    isLoading: false,
  };

  /** @type {any} */
  get suggestions() {
    return this.state.suggestions.map((s, index) => ({ key: index, value: s.rawValue }));
  }

  /** @type {string} */
  @api engineId = 'example-search';
  /** @type {string} */
  @api placeholder = 'Search';
  /** @type {string} */
  @api redirectionUrl = 'https://www.salesforce.com';
  /** @type {string} */
  @api searchHub = 'default';
  /** @type {string} */
  @api pageApiName = 'search__c';

  /** @type {import("coveo").StandaloneSearchBox} */
  standaloneSearchBox;
  /** @type {import("coveo").Unsubscribe} */
  unsubscribeStandalone;
  /** @type {import("coveo").Unsubscribe} */
  unsubscribeSearchbox;
  /** @type {number} */
  selectionIndex = -1;
  /** @type {HTMLInputElement} */
  input;
  /** @type {import("lwc").HTMLElementTheGoodPart} */
  combobox;

  /** @type {() => void} */
  resetSelectionIndex = () => { this.selectionIndex = -1 };
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
    this.standaloneSearchBox = CoveoHeadless.buildStandaloneSearchBox(engine, {
      options: {
        redirectionUrl: this.redirectionUrl,
      }
    });
    this.unsubscribeStandalone = this.standaloneSearchBox.subscribe(() => this.updateState());
  }

  connectedCallback() {
    console.log('connectedCallback');
    registerComponentForInit(this, this.engineId);
  }

  renderedCallback() {
    console.log('rendered callback');
    if (!this.rendered) {
      console.log('first time render');
      this.rendered = true;
      this.handleFirstTimeRender();
    }
  }

  async handleFirstTimeRender() {
    await initializeWithHeadless(this, this.engineId, this.initialize.bind(this));
    if (!this.input) {
      // @ts-ignore
      this.input = this.template.querySelector('input');
    }
    if (this.queryFromUrl !== this.input.value) {
      console.log('Changing input value from ' + this.input.value + ' to ' + this.queryFromUrl);
      this.input.value = this.queryFromUrl;
      this.standaloneSearchBox.updateText(this.queryFromUrl);
      this.triggerSearch();
    }
    if (!this.combobox) {
      // @ts-ignore
      this.combobox = this.template.querySelector('.slds-combobox');
    }
  }

  disconnectedCallback() {
    if (this.unsubscribeStandalone) {
      this.unsubscribeStandalone();
    }
    if (this.unsubscribeSearchbox) {
      this.unsubscribeSearchbox();
    }
  }

  get queryFromUrl() {
    return this.pageRef.state.q || '';
  }

  updateState() {
    this.state = this.standaloneSearchBox.state;
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
    this.standaloneSearchBox.updateText(textValue);
  }

  handleEnter() {
    if (this.selectionIndex >= 0) {
      this.standaloneSearchBox.updateText(this.input.value);
    }
    this.triggerSearch();
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
      this.standaloneSearchBox.updateText(event.target.value);
    }
  }

  onFocus() {
    this.standaloneSearchBox.showSuggestions();
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
    this.triggerSearch();
  }

  triggerSearch(ignoreHistory = false) {
    console.log(this.pageRef);
    this.input.blur();
    const currentPageName = this.pageRef.attributes.name || '';
    this.standaloneSearchBox.submit();
    if (this.pageApiName !== currentPageName) {
      this.redirectToSearchPage();
    } else {
      this[NavigationMixin.Navigate](this.generateUpdatedPageReference({
        q: this.state.value
      }), ignoreHistory);
    }
  }

  redirectToSearchPage() {
    // Navigate to the search page
    this[NavigationMixin.Navigate]({
      type: 'comm__namedPage',
      attributes: { 
        name: this.pageApiName 
      },
      state: { 
        q: this.state.value 
      }
    }, false);
  }

  generateUpdatedPageReference(stateChanges) {
    return Object.assign({}, this.pageRef, {
      state: Object.assign({}, this.pageRef.state, stateChanges)
    });
  }
}