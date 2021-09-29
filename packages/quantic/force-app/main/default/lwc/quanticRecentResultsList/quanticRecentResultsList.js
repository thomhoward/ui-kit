import {LightningElement, track, api} from 'lwc';
import {
  registerComponentForInit,
  initializeWithHeadless,
} from 'c/quanticHeadlessLoader';
import {I18nUtils, getItemFromLocalStorage, setItemInLocalStorage} from 'c/quanticUtils';

import emptyListLabel from '@salesforce/label/c.quantic_EmptyRecentResultListLabel';
import recentResultsLabel from '@salesforce/label/c.quantic_RecentResults';
import collapse from '@salesforce/label/c.quantic_Collapse';
import expand from '@salesforce/label/c.quantic_Expand';

/** @typedef {import("coveo").RecentResultsState} RecentResultsState */
/** @typedef {import("coveo").RecentResultsList} RecentResultsList */
/** @typedef {import("coveo").SearchEngine} SearchEngine */

/**
 * The `QuanticRecentResultsList` component displays the current user's recently clicked results.
 * @category LWC
 * @example
 * <c-quantic-recent-results-list engine-id={engineId}></c-quantic-recent-results-list>
 */
export default class QuanticRecentResultsList extends LightningElement {
  labels = {
    emptyListLabel,
    recentResultsLabel,
    collapse,
    expand,
  }

  /**
   * The ID of the engine instance with which to register.
   * @api
   * @type {string}
   */
  @api engineId;
  /**
   * The maximum number of queries to keep in the list.
   * @api
   * @type {number}
   */
  @api maxLength = 10;
  /**
   * The non-localized label for the component.
   * @api
   * @type {string}
   */
  @api label = this.labels.recentResultsLabel;
  /**
   * Whether the component should be collapsed.
   * @api
   * @type {boolean}
   * @defaultValue `false`
   */
  @api get isCollapsed() {
    return this._isCollapsed;
  }
  set isCollapsed(collapsed) {
    this._isCollapsed = collapsed;
  }  
  /** @type {boolean} */
  _isCollapsed = false;


  /** @type {RecentResultsState} */
  @track state;

  /** @type {RecentResultsList} */
  recentResultsList;
  /** @type {Function} */
  unsubscribe;

  connectedCallback() {
    registerComponentForInit(this, this.engineId);
  }

  renderedCallback() {
    initializeWithHeadless(this, this.engineId, this.initialize);
  }

  /**
   * @param {SearchEngine} engine
   */
  initialize = (engine) => {
    this.recentResultsList = CoveoHeadless.buildRecentResultsList(engine, {
      initialState: {
        results: getItemFromLocalStorage(this.localStorageKey) ?? []
      },
      options: {
        maxLength: Number(this.maxLength)
      }
    });
    this.unsubscribe = this.recentResultsList.subscribe(() => this.updateState());
  }

  disconnectedCallback() {
    this.unsubscribe?.();
  }

  updateState() {
    this.state = {...this.recentResultsList.state};
    setItemInLocalStorage(this.localStorageKey, this.state.results)
  }

  toggleVisibility() {
    this._isCollapsed = !this.isCollapsed;
  }

  get results() {
    return this.state?.results ?? [];
  }

  get hasResults() {
    return !!this.results.length;
  }

  get localStorageKey() {
    return `${this.engineId}_quantic-recent-results`;
  }

  get actionButtonIcon() {
    return this.isCollapsed ? 'utility:add' : 'utility:dash';
  }

  get actionButtonLabel() {
    const label = this.isCollapsed ? this.labels.expand : this.labels.collapse;
    return I18nUtils.format(label, this.label);
  }
}