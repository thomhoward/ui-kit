import { LightningElement, track } from 'lwc';
import { initializeComponent } from 'c/initialization';
import {loadScript} from 'lightning/platformResourceLoader';
import TributePath from "@salesforce/resourceUrl/tributejs";

export default class BaseFacetSearch extends LightningElement {
  @track state = {
    value: ''
  }
  tributeLoaded = false;
  /** @type {any} */
  tribute;

  connectedCallback() {
    initializeComponent(this);

    if (this.tributeLoaded) {
      return;
    }

    loadScript(this, TributePath + '/tribute.js').then(
      () => (this.tributeLoaded = true)
    );
  }

  renderedCallback() {
    // @ts-ignore
    const input = this.template.querySelector('input');
    // @ts-ignore
    const wrapper = this.template.querySelector('.slds-dropdown');
    // @ts-ignore
    const combobox = this.template.querySelector('.slds-combobox');

    if (!input || !wrapper || !this.tributeLoaded || this.tribute) {
      return;
    }

    this.configureTributeJS(input, wrapper, combobox);
  }

  /**
   * @param {import("lwc").HTMLElementTheGoodPart} input
   * @param {import("lwc").HTMLElementTheGoodPart} wrapper
   * @param {import("lwc").HTMLElementTheGoodPart} combobox
   */
  configureTributeJS(input, wrapper, combobox) {
    const tributeOptions = {
      values: [],
      searchOpts: {
        skip: true,
      },
      selectTemplate: (item) => item.string,
      menuContainer: wrapper,
      positionMenu: false,
      autocompleteMode: true,
      replaceTextSuffix: '',
      containerClass: 'slds-listbox slds-listbox_vertical',
      itemClass:
        'slds-listbox__item slds-media slds-listbox__option slds-listbox__option_plain slds-media_small',
      noMatchTemplate: '',
    };
    // @ts-ignore
    this.tribute = new Tribute(tributeOptions);
    this.tribute.attach(input);

    input.addEventListener('tribute-replaced', this.onTributeReplaced);

    input.addEventListener('tribute-active-true', () => {
      combobox.classList.add('slds-is-open');
    });

    input.addEventListener('tribute-active-false', () => {
      combobox.classList.remove('slds-is-open');
    });
  }

  onTributeReplaced(e) {}

}
