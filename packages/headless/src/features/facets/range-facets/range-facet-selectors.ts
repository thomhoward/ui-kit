import {SearchPageState} from '../../../state';
import {createSelector} from '@reduxjs/toolkit';
import {NumericFacetResponse} from './numeric-facet-set/interfaces/response';
import {DateFacetResponse} from './date-facet-set/interfaces/response';

function responseFacetsSelector(state: SearchPageState) {
  return state.search.response.facets;
}

export const specificFacetResultSelector = (facetId: string) =>
  createSelector(responseFacetsSelector, (facets) => {
    return facets.find((facet) => facet.facetId === facetId);
  });

export const numericFacetResultSelector = (facetId: string) => {
  createSelector(specificFacetResultSelector(facetId), (facetResponse) => {
    const response = facetResponse as NumericFacetResponse;
    response.values.filter((value) => value.state === 'selected');
  });
};

export const dateFacetSelector = (facetId: string) => {
  createSelector(specificFacetResultSelector(facetId), (facetResponse) => {
    const response = facetResponse as DateFacetResponse;
    response.values.filter((value) => value.state === 'selected');
  });
};
