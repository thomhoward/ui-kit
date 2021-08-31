import {LightningElement, api, track} from 'lwc';
import {registerComponentForInit, initializeWithHeadless} from 'c/quanticHeadlessLoader';
import {getItemfromLocalStorage, setIteminLocalStorage} from 'c/quanticUtils';

export default class QuanticRecentQueries extends LightningElement {
  /** @type {number} */
  @api maxLength = 10;
  /** @type {string} */
  @api engineId;
  /** @type {string} */
  @api label;

  /** @type {import("coveo").RecentQueriesList} */
  recentQueriesList;
  /** @type {()=> void} */
  unsubscribe;
  /** @type {string} */
  localStorageKey = 'quantic-recent-queries';
  /** @type {boolean} */
  isCollapsed = false;
  /** @type {string} */
  collapseIcon = 'utility:dash';

  /** @type {import("coveo").RecentQueriesState} */
  @track state = {
    queries: getItemfromLocalStorage(this.localStorageKey) ?? [],
    maxLength: this.maxLength
  };


  connectedCallback() {
    registerComponentForInit(this, this.engineId);
  }

  renderedCallback() {
    initializeWithHeadless(this, this.engineId, this.initialize.bind(this));
  }

  /**
  * @param {import("coveo").SearchEngine} engine
  */
  @api
  initialize(engine) {
    this.recentQueriesList = CoveoHeadless.buildRecentQueriesList(engine, {
      initialState: {
        queries: this.state.queries
      },
      options: {
        maxLength: 10,
      },
    });
    this.unsubscribe = this.recentQueriesList.subscribe(() => this.updateState());
  }

  disconnectedCallback() {
    this.unsubscribe?.();
  }

  updateState() {
    this.state = this.recentQueriesList.state;
    setIteminLocalStorage(this.localStorageKey, this.state.queries);
  }

  executeQuery(e) {
    this.recentQueriesList.executeRecentQuery(e.target.value);
  }

  toggleVisibility() {
    this.collapseIcon = this.isCollapsed ? 'utility:dash' : 'utility:add';
    this.isCollapsed = !this.isCollapsed;
  }

  get queries() {
    return this.state.queries || [];
  }
}