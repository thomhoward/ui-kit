import {SearchPageState} from '../../../state';
import {facetSelector} from '../../..';
import {partitionIntoParentsAndValues} from './category-facet-utilities';
import {CategoryFacetResponse} from './interfaces/response';

export const categoryFacetRequestSelector = (
  state: SearchPageState,
  id: string
) => {
  return state.categoryFacetSet[id];
};

export const categoryFacetSelectedValuesSelector = (
  state: SearchPageState,
  facetId: string
) => {
  const facetResponse = facetSelector(state, facetId) as CategoryFacetResponse;
  if (!facetResponse) return [];
  const parentsAndValues = partitionIntoParentsAndValues(facetResponse);
  return parentsAndValues.parents;
};
