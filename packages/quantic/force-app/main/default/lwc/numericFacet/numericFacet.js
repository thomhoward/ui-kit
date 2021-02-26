import {LightningElement, track, api} from 'lwc';
import {getHeadlessEngine, registerComponentForInit, setComponentInitialized} from 'c/headlessLoader';

export default class NumericFacet extends LightningElement {
  /** @type {import("coveo").NumericFacetState} */
  // @ts-ignore TODO: Check CategoryFacetState typing and integration with LWC/Quantic
  @track state = {
    values: [],
  };
  /** @type {string} */
  @api field;
  /** @type {string} */
  @api label;

  /** @type {import("coveo").NumericFacet} */
  facet;
  /** @type {import("coveo").Unsubscribe} */
  unsubscribe;

  constructor() {
    super();
    registerComponentForInit(this);
    console.log('registered numericFacet');
  }

  connectedCallback() {
    try {
      getHeadlessEngine(this).then((engine) => {
        this.initialize(engine);
        setComponentInitialized(this);
        console.log('initialized numericFacet');
      })
    } catch (error) {
      console.error('Fatal error: unable to initialize component', error);
    }
  }

  /**
   * @param {import("coveo").Engine} engine
   */
  @api
  initialize(engine) {
    this.facet = CoveoHeadless.buildNumericFacet(engine, {
      options: {
        field: this.field,
        generateAutomaticRanges: true,
      },
    });
    this.unsubscribe = this.facet.subscribe(() => this.updateState());
  }

  disconnectedCallback() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  updateState() {
    this.state = this.facet.state;
  }

  get values() {
    return this.state.values || [];
  }

  get hasValues() {
    return this.values.length !== 0;
  }

  /**
   * @param {CustomEvent<import("coveo").NumericFacetValue>} evt
   */
  onSelect(evt) {
    this.facet.toggleSelect(evt.detail);
  }
}
