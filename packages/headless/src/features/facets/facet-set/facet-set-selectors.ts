import {SearchAppState} from '../../../state/search-app-state';
import {FacetSection} from '../../../state/state-sections';
import {BaseFacetValue} from '../facet-api/response';

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
  if (!facetResponse) {
    return [];
  }
  const filteredResponses: BaseFacetValue[] = [];

  for (const value of facetResponse.values) {
    if (value.state === 'selected') {
      filteredResponses.push(value);
    }
  }
  return filteredResponses;
};
