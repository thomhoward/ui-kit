import {SearchAppState} from '../../../../state/search-app-state';
import {NumericFacetResponse} from './interfaces/response';
import {genericFacetResponseSelector} from '../../facet-set/facet-set-selectors';
import {AnyFacetResponse} from '../../generic/interfaces/generic-facet-response';

function isNumericFacetResponse(
  state: SearchAppState,
  response: AnyFacetResponse | undefined
): response is NumericFacetResponse {
  return (response && response.facetId in state.numericFacetSet) || false;
}

export const numericFacetResponseSelector = (
  state: SearchAppState,
  facetId: string
) => {
  const response = genericFacetResponseSelector(state, facetId);
  if (isNumericFacetResponse(state, response)) {
    return response;
  }

  return undefined;
};

export const numericFacetSelectedValuesSelector = (
  state: SearchAppState,
  facetId: string
) => {
  const facetResponse = numericFacetResponseSelector(state, facetId);
  if (!facetResponse) {
    return [];
  }
  return facetResponse.values.filter((value) => value.state === 'selected');
};
