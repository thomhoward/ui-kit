import {createAsyncThunk} from '@reduxjs/toolkit';
import {CategoryFacetSearchRequest} from '../../../../api/search/facet-search/category-facet-search/category-facet-search-request';
import {FacetSearchResponse} from '../../../../api/search/facet-search/facet-search-response';
import {SpecificFacetSearchRequest} from '../../../../api/search/facet-search/specific-facet-search/specific-facet-search-request';
import {AsyncThunkSearchOptions} from '../../../../api/search/search-api-client';
import {
  CategoryFacetSearchSection,
  CategoryFacetSection,
  ConfigurationSection,
  FacetSearchSection,
  FacetSection,
} from '../../../../state/state-sections';
import {buildSearchRequest} from '../../../search/search-actions';
import {CategoryFacetRequest} from '../../category-facet-set/interfaces/request';
import {logFacetSearch} from '../../facet-set/facet-set-analytics-actions';

type StateNeededForSpecificFacetSearch = ConfigurationSection &
  FacetSearchSection &
  FacetSection;

type StateNeededForCategoryFacetSearch = ConfigurationSection &
  CategoryFacetSearchSection &
  CategoryFacetSection;

type StateNeededForFacetSearch = ConfigurationSection &
  Partial<
    StateNeededForSpecificFacetSearch & StateNeededForCategoryFacetSearch
  >;

/**
 * Executes a facet search (i.e., a search for facet values in a facet search box).
 * @param facetId (string) The unique identifier of the facet for which to perform a facet search (e.g., `"1"`).
 */
export const executeFacetSearch = createAsyncThunk<
  {facetId: string; response: FacetSearchResponse},
  string,
  AsyncThunkSearchOptions<StateNeededForFacetSearch>
>(
  'facetSearch/executeSearch',
  async (facetId: string, {dispatch, getState, extra: {searchAPIClient}}) => {
    const state = getState();
    let req: SpecificFacetSearchRequest | CategoryFacetSearchRequest;
    if (isFacetSearchState(state)) {
      req = buildSpecificFacetSearchRequest(facetId, state);
    } else {
      req = buildCategoryFacetSearchRequest(
        facetId,
        state as StateNeededForCategoryFacetSearch
      );
    }

    const response = await searchAPIClient.facetSearch(req);
    dispatch(logFacetSearch(facetId));

    return {facetId, response};
  }
);

export const buildSpecificFacetSearchRequest = (
  id: string,
  state: StateNeededForSpecificFacetSearch
): SpecificFacetSearchRequest => {
  const {captions, query, numberOfValues} = state.facetSearchSet[id].options;
  const {field, delimitingCharacter, currentValues} = state.facetSet[id];
  const searchContext = buildSearchRequest(state);
  const ignoreValues = currentValues
    .filter((v) => v.state !== 'idle')
    .map((facetValue) => facetValue.value);

  return {
    ...buildBaseRequest(state),
    captions,
    numberOfValues,
    query,
    field,
    delimitingCharacter,
    ignoreValues,
    searchContext,
    type: 'specific',
  };
};

export const buildCategoryFacetSearchRequest = (
  id: string,
  state: StateNeededForCategoryFacetSearch
): CategoryFacetSearchRequest => {
  const options = state.categoryFacetSearchSet[id].options;
  const categoryFacet = state.categoryFacetSet[id];

  const {captions, query, numberOfValues} = options;
  const {field, delimitingCharacter, basePath} = categoryFacet;
  const searchContext = buildSearchRequest(state);
  const path = getPathToSelectedCategoryFacetItem(categoryFacet);
  const ignorePaths = path.length ? [path] : [];

  return {
    ...buildBaseRequest(state),
    basePath,
    captions,
    numberOfValues,
    query,
    field,
    delimitingCharacter,
    ignorePaths,
    searchContext,
    type: 'hierarchical',
  };
};

const buildBaseRequest = (state: StateNeededForFacetSearch) => ({
  url: state.configuration.search.apiBaseUrl,
  accessToken: state.configuration.accessToken,
  organizationId: state.configuration.organizationId,
});

const getPathToSelectedCategoryFacetItem = (
  categoryFacet: CategoryFacetRequest
): string[] => {
  const path = [];
  let selectedValue = categoryFacet.currentValues[0];
  while (selectedValue) {
    path.push(selectedValue.value);
    selectedValue = selectedValue.children[0];
  }
  return path;
};

const isFacetSearchState = (
  s: StateNeededForFacetSearch
): s is StateNeededForSpecificFacetSearch => {
  return s.facetSearchSet !== undefined && s.facetSet !== undefined;
};
