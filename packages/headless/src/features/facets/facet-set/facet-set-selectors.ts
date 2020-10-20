import {SearchAppState} from '../../../state/search-app-state';
import {FacetSection} from '../../../state/state-sections';
import {BaseFacetResponse, BaseFacetValue} from '../facet-api/response';

export const facetSelector = (state: SearchAppState, id: string) => {
  return state.search.response.facets.find(
    (response) => response.facetId === id
  );
};

export const facetRequestSelector = (state: FacetSection, id: string) => {
  return state.facetSet[id];
};

export const facetSelectedValuesSelector = (
  state: SearchAppState,
  facetId: string
) => {
  const facetResponse = facetSelector(state, facetId);
  if (!facetResponse) return [];
  const result = facetResponse as BaseFacetResponse<BaseFacetValue>;
  return result.values.filter((value) => value.state === 'selected');
};
