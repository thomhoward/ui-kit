import {SearchAppState} from '../../../state/search-app-state';
import {genericFacetResponseSelector} from '../facet-set/facet-set-selectors';
import {partitionIntoParentsAndValues} from './category-facet-utilities';
import {CategoryFacetResponse} from './interfaces/response';
import {AnyFacetResponse} from '../generic/interfaces/generic-facet-response';

function isCategoryFacetResponse(
  state: SearchAppState,
  response: AnyFacetResponse | undefined
): response is CategoryFacetResponse {
  return (response && response.facetId in state.categoryFacetSet) || false;
}

export const categoryFacetResponseSelector = (
  state: SearchAppState,
  facetId: string
) => {
  const response = genericFacetResponseSelector(state, facetId);
  if (isCategoryFacetResponse(state, response)) {
    return response;
  }

  return undefined;
};

export const categoryFacetRequestSelector = (
  state: SearchAppState,
  id: string
) => {
  return state.categoryFacetSet[id];
};

export const categoryFacetSelectedValuesSelector = (
  state: SearchAppState,
  facetId: string
) => {
  const facetResponse = categoryFacetResponseSelector(state, facetId);
  if (!facetResponse) {
    return [];
  }
  const parentsAndValues = partitionIntoParentsAndValues(facetResponse);
  return parentsAndValues.parents;
};
