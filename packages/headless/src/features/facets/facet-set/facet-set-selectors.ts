import {SearchPageState} from '../../../state';
import {BaseFacetResponse, BaseFacetValue} from '../facet-api/response';

export const facetSelector = (state: SearchPageState, id: string) => {
  return state.search.response.facets.find(
    (response) => response.facetId === id
  );
};

export const facetRequestSelector = (state: SearchPageState, id: string) => {
  return state.facetSet[id];
};

export const facetSelectedValuesSelector = (
  state: SearchPageState,
  facetId: string
) => {
  const facetResponse = facetSelector(state, facetId);
  if (!facetResponse) return [];
  const result = facetResponse as BaseFacetResponse<BaseFacetValue>;
  return result.values.filter((value) => value.state === 'selected');
};
