import { api } from 'lwc';
import BaseFacetSearch from 'c/baseFacetSearch';

export default class CategoryFacetSearch extends BaseFacetSearch {
  /** @type {import("coveo").CategoryFacetSearch} */
  @api facet;

  /** @type {import("coveo").Unsubscribe} */
  unsubscribe;


  /**
   * @param {import("coveo").Engine} engine
   */
  @api
  initialize(engine) {
    this.unsubscribe = this.facet.subscribe(() => this.updateState());
  }

  updateState() {
    if (!this.tributeLoaded) return ;

    const values = this.facet.facetSearch.state.values;

    this.tribute.append()
  }

  onTributeReplaced(e) {
    console.log("replaced");
    if (!this.facet) return;
    this.facet.facetSearch.updateText(e.detail.item.string());
    this.facet.facetSearch.search();
  }

  /**
   * @param {InputEvent & {target: {value : string}}} event
   */
  onChange(event) {
    this.facet.facetSearch.updateText(event.target.value);
    this.facet.facetSearch.search();
  }

  /**
   * @param {KeyboardEvent & {target: {value : string}}} event
   */
  onKeyup(event) {
    this.facet.facetSearch.updateText(event.target.value);
    this.facet.facetSearch.search();
  }

}
