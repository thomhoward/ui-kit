import {
  BaseFacetSearchRequest,
  FacetSearchType,
} from '../base/base-facet-search-request';
import {CategoryFacetRequest} from '../../../../features/facets/category-facet-set/interfaces/request';
import {SearchAppState} from '../../../../state/search-app-state';
import {buildSearchRequest} from '../../../../features/search/search-actions';

export interface CategoryFacetSearchRequest
  extends BaseFacetSearchRequest,
    FacetSearchType<'hierarchical'> {
  basePath: string[];
  ignorePaths: string[][];
}

export const buildCategoryFacetSearchRequest = (
  id: string,
  state: SearchAppState
): CategoryFacetSearchRequest => {
  const options = state.categoryFacetSearchSet[id].options;
  const categoryFacet = state.categoryFacetSet[id];

  const {captions, query, numberOfValues} = options;
  const {field, delimitingCharacter, basePath} = categoryFacet;
  const searchContext = buildSearchRequest(state);
  const path = getPathToSelectedCategoryFacetItem(categoryFacet);
  const ignorePaths = path.length ? [path] : [];

  return {
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
