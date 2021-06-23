// @ts-nocheck
import {
  LightningElement,
  api,
  wire
} from 'lwc';
// @ts-ignore
import {
  setEngineConfiguration,
  initializeWithHeadless,
  registerComponentForInit
} from 'c/quanticHeadlessLoader';
// @ts-ignore
import getHeadlessConfiguration from '@salesforce/apex/HeadlessController.getHeadlessConfiguration';

export default class QuanticSearchInterface extends LightningElement {
  /** @type {any} */
  @api flexipageRegionWidth;

  /** @type {string} */
  @api searchHub = 'default';

  /** @type {string} */
  @api pipeline = 'default';

  /** @type {string} */
  @api engineId;

  /** @type {import("coveo").HeadlessConfigurationOptions} */
  fullConfig;

  @wire(getHeadlessConfiguration)
  wiredConfig({
    error,
    data
  }) {
    if (data) {
      this.fullConfig = {
        ...JSON.parse(data),
        search: {
          searchHub: this.searchHub,
          pipeline: this.pipeline
        }
      };
      setEngineConfiguration(this.fullConfig, this.engineId, this);
    } else if (error) {
      console.error(error.message);
    }
  }

  connectedCallback() {
    registerComponentForInit(this, this.engineId);
  }

  renderedCallback() {
    initializeWithHeadless(this, this.engineId, this.initialize.bind(this));
  }

  initialize(engine) {
    this.urlManager = CoveoHeadless.buildUrlManager(engine, {
      initialState: {
        fragment: this.fragment
      },
    });
    this.unsubscribeUrlManager = this.urlManager.subscribe(() =>
      this.updateHash()
    );
    window.addEventListener('hashchange', this.onHashChange);
  }

  updateHash() {
    window.history.pushState(
      null,
      document.title,
      `#${this.urlManager.state.fragment}`
    );
  }

  onHashChange = () => {
    this.urlManager.synchronize(this.fragment);
  };

  get fragment() {
    return window.location.hash.slice(1);
  }
}