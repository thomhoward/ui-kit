import {SearchAppState} from '../../../state/search-app-state';
import {facetSelector} from '../facet-set/facet-set-selectors';
import {partitionIntoParentsAndValues} from './category-facet-utilities';
import {CategoryFacetResponse} from './interfaces/response';

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
  const facetResponse = facetSelector(state, facetId) as CategoryFacetResponse;
  if (!facetResponse) {
    return [];
  }
  const parentsAndValues = partitionIntoParentsAndValues(facetResponse);
  return parentsAndValues.parents;
};
