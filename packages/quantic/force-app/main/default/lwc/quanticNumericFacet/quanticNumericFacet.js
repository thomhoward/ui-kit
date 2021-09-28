import {LightningElement, track, api} from 'lwc';
import {
  registerComponentForInit,
  initializeWithHeadless,
  getHeadlessBindings
} from 'c/quanticHeadlessLoader';
import {I18nUtils} from 'c/quanticUtils';
import LOCALE from '@salesforce/i18n/locale';

import clear from '@salesforce/label/c.quantic_Clear';
import collapseFacet from '@salesforce/label/c.quantic_CollapseFacet';
import expandFacet from '@salesforce/label/c.quantic_ExpandFacet';

export default class QuanticNumericFacet extends LightningElement {
  /** @type {import("coveo").NumericFacetState} */
  // @ts-ignore TODO: Check CategoryFacetState typing and integration with LWC/Quantic
  @track state = {
    values: [],
  };

  /** @type {string} */
  @api facetId;
  /** @type {string} */
  @api field;
  /** @type {string} */
  @api label;
  /** @type {string} */
  @api engineId;
  /** @type {number} */
  @api numberOfValues = 8;
  /** @type {import("coveo").RangeFacetSortCriterion} */
  @api sortCriteria = 'ascending';
  /** @type {import("coveo").RangeFacetRangeAlgorithm} */
  @api rangeAlgorithm = 'equiprobable';
  /** @type {(any) => string} */
  @api formattingFunction = (item) => `${new Intl.NumberFormat(LOCALE).format(
    item.start
  )} - ${new Intl.NumberFormat(LOCALE).format(
    item.end
  )}`;
  /** @type {boolean} */
  @api noInput;
  /** @type {import("coveo").NumericFacet} */
  facet;
  /**  @type {import("coveo").NumericFilter} */
  numericFilter;
  /**  @type {import("coveo").SearchStatus} */
  searchStatus;
  /** @type {import("coveo").Unsubscribe} */
  unsubscribe;
  /** @type {import("coveo").Unsubscribe} */
  unsubscribeFilter;
  /** @type {import("coveo").Unsubscribe} */
  unsubscribeSearchStatus;
  /** @type {boolean} */
  isExpanded = true;


  labels = {
    clear,
    collapseFacet,
    expandFacet,
  };

  connectedCallback() {
    registerComponentForInit(this, this.engineId);
  }

  renderedCallback() {
    initializeWithHeadless(this, this.engineId, this.initialize);
  }

  /**
   * @param {import("coveo").SearchEngine} engine
   */
  initialize = (engine) => {
    this.facet = CoveoHeadless.buildNumericFacet(engine, {
      options: {
        field: this.field,
        generateAutomaticRanges: true,
        sortCriteria: this.sortCriteria,
        rangeAlgorithm: this.rangeAlgorithm,
        numberOfValues: Number(this.numberOfValues),
        facetId: this.facetId ?? this.field,
      }
    });
    if(!this.noInput) {
      this.initializeFilter(engine);
    }
    this.searchStatus = CoveoHeadless.buildSearchStatus(engine);
    this.unsubscribe = this.facet.subscribe(() => this.updateState());
    this.unsubscribeSearchStatus = this.searchStatus.subscribe(() => this.updateState());
  }

  initializeFilter(engine) {
     this.numericFilter = CoveoHeadless.buildNumericFilter(engine, {
      options: {
        field: this.field,
        facetId: this.facetId ?? this.field
      }
    });
    this.unsubscribeFilter = this.numericFilter.subscribe(() => this.updateState());
  }

  disconnectedCallback() {
    this.unsubscribe?.();
    this.unsubscribeFilter?.();
    this.unsubscribeSearchStatus?.();
  }

  updateState() {
    this.state = this.facet.state;
  }

  get values() {
    return (
      this.state.values
        .filter((value) => value.numberOfResults || value.state !== 'idle')
        .map((value) => {
          return {
            ...value,
            checked: value.state === 'selected',
          };
        }) || []
    );
  }

  get hasValues() {
    return this.values.length !== 0;
  }

  get hasActiveValues() {
    return this.state.hasActiveValues;
  }

  get actionButtonIcon() {
    return this.isExpanded ? 'utility:dash' : 'utility:add';
  }
  
  get actionButtonLabel() {
    const label = this.isExpanded ? this.labels.collapseFacet : this.labels.expandFacet;
    return I18nUtils.format(label, this.label);
  }

  get start() {
    return this.numericFilter.state.range?.start;
  }

  get end() {
    return this.numericFilter.state.range?.end;
  }

  get showValues() {
    return !this.searchStatus?.state?.hasError && !this.numericFilter?.state?.range && this.values.length > 0;
  }
  
  /**
   * @param {CustomEvent<import("coveo").NumericFacetValue>} evt
   */
  onSelect(evt) {
    this.facet.toggleSelect(evt.detail);
  }

  clearSelections() {
    if(this.numericFilter?.state?.range) {
      this.numericFilter.clear();
    }
    this.facet?.deselectAll();
  }

  toggleFacetVisibility() {
    this.isExpanded = !this.isExpanded;
  }

  preventDefault(evt) {
    evt.preventDefault();
  }

  onApply(evt) {
    const engine = getHeadlessBindings(this.engineId).engine;
    engine.dispatch(CoveoHeadless.loadNumericFacetSetActions(engine).deselectAllNumericFacetValues(this.facetId));
    this.numericFilter.setRange({
      start: evt.detail.min,
      end: evt.detail.max
    });
  }
}
