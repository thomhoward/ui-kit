import {
  BaseFacetSearchRequest,
  FacetSearchType,
} from '../base/base-facet-search-request';
import {SearchAppState} from '../../../../state/search-app-state';
import {buildSearchRequest} from '../../../../features/search/search-actions';

export interface SpecificFacetSearchRequest
  extends BaseFacetSearchRequest,
    FacetSearchType<'specific'> {
  ignoreValues: string[];
}

export const buildSpecificFacetSearchRequest = (
  id: string,
  state: SearchAppState
): SpecificFacetSearchRequest => {
  const {captions, query, numberOfValues} = state.facetSearchSet[id].options;
  const {field, delimitingCharacter, currentValues} = state.facetSet[id];
  const searchContext = buildSearchRequest(state);
  const ignoreValues = currentValues
    .filter((v) => v.state !== 'idle')
    .map((facetValue) => facetValue.value);

  return {
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
