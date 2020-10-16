import {SearchState} from './features/search/search-slice';
import {SearchParametersState} from './search-parameters-state';
import {StateWithHistory} from './app/undoable';
import {DidYouMeanState} from './features/did-you-mean/did-you-mean-slice';
import {FieldsState} from './features/fields/fields-slice';
import {ConfigurationState} from './features/configuration/configuration-slice';
import {SpecificFacetSearchSetState} from './features/facets/facet-search-set/specific/specific-facet-search-set-slice';
import {CategoryFacetSearchSetState} from './features/facets/facet-search-set/category/category-facet-search-set-slice';
import {RedirectionState} from './features/redirection/redirection-slice';
import {QuerySuggestSet} from './features/query-suggest/query-suggest-slice';

export interface SearchPageState extends SearchParametersState {
  /**
   * The global headless engine configuration.
   */
  configuration: ConfigurationState;
  /**
   * The set of facet searches.
   */
  facetSearchSet: SpecificFacetSearchSetState;
  /**
   * The set of category facet searches.
   */
  categoryFacetSearchSet: CategoryFacetSearchSetState;
  /**
   * The URL redirection triggered by the preprocessed query.
   */
  redirection: RedirectionState;
  /**
   * The query suggestions returned by Coveo ML.
   */
  querySuggest: QuerySuggestSet;
  /**
   * The information related to the search endpoint.
   */
  search: SearchState;
  /**
   * DidYouMean allows to retrieve query corrections from the index related to end user mispelling.
   */
  didYouMean: DidYouMeanState;
  /**
   * The information related to the history navigation.
   */
  history: StateWithHistory<SearchParametersState>;
  /**
   * The information related to fields used in the engine.
   */
  fields: FieldsState;
}
