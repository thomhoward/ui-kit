import {DateFacetRequest, DateRangeRequest} from './interfaces/request';
import {createReducer} from '@reduxjs/toolkit';
import {
  registerDateFacet,
  toggleSelectDateFacetValue,
  deselectAllDateFacetValues,
  updateDateFacetSortCriterion,
  RegisterDateFacetActionCreatorPayload,
  updateDateFacetValues,
} from './date-facet-actions';
import {change} from '../../../history/history-actions';
import {executeSearch} from '../../../search/search-actions';
import {DateFacetResponse, DateFacetValue} from './interfaces/response';
import {
  registerRangeFacet,
  toggleSelectRangeValue,
  onRangeFacetRequestFulfilled,
  handleRangeFacetDeselectAll,
  defaultRangeFacetOptions,
  handleRangeFacetSearchParameterRestoration,
  updateRangeValues,
} from '../generic/range-facet-reducers';
import {handleFacetSortCriterionUpdate} from '../../generic/facet-reducer-helpers';
import {getDateFacetSetInitialState} from './date-facet-set-state';
import {deselectAllFacets} from '../../generic/facet-actions';
import {restoreSearchParameters} from '../../../search-parameters/search-parameter-actions';
import {deselectAllBreadcrumbs} from '../../../breadcrumb/breadcrumb-actions';

export const dateFacetSetReducer = createReducer(
  getDateFacetSetInitialState(),
  (builder) => {
    builder
      .addCase(registerDateFacet, (state, action) => {
        const {payload} = action;
        const request = buildDateFacetRequest(payload);
        registerRangeFacet<DateFacetRequest>(state, request);
      })
      .addCase(
        change.fulfilled,
        (state, action) => action.payload?.dateFacetSet ?? state
      )
      .addCase(restoreSearchParameters, (state, action) => {
        const df = action.payload.df || {};
        handleRangeFacetSearchParameterRestoration(state, df);
      })
      .addCase(toggleSelectDateFacetValue, (state, action) => {
        const {facetId, selection} = action.payload;
        toggleSelectRangeValue<DateFacetRequest, DateFacetValue>(
          state,
          facetId,
          selection
        );
      })
      .addCase(updateDateFacetValues, (state, action) => {
        const {facetId, values} = action.payload;
        updateRangeValues<DateFacetRequest>(state, facetId, values);
      })
      .addCase(deselectAllDateFacetValues, (state, action) => {
        handleRangeFacetDeselectAll<DateFacetRequest>(state, action.payload);
      })
      .addCase(deselectAllFacets, (state) => {
        Object.keys(state).forEach((facetId) => {
          handleRangeFacetDeselectAll<DateFacetRequest>(state, facetId);
        });
      })
      .addCase(deselectAllBreadcrumbs, (state) => {
        Object.keys(state).forEach((facetId) => {
          handleRangeFacetDeselectAll<DateFacetRequest>(state, facetId);
        });
      })
      .addCase(updateDateFacetSortCriterion, (state, action) => {
        handleFacetSortCriterionUpdate<DateFacetRequest>(state, action.payload);
      })
      .addCase(executeSearch.fulfilled, (state, action) => {
        const facets = action.payload.response.facets as DateFacetResponse[];
        onRangeFacetRequestFulfilled<DateFacetRequest, DateFacetResponse>(
          state,
          facets,
          convertToRangeRequests
        );
      });
  }
);

function buildDateFacetRequest(
  config: RegisterDateFacetActionCreatorPayload
): DateFacetRequest {
  return {
    ...defaultRangeFacetOptions,
    currentValues: [],
    preventAutoSelect: false,
    type: 'dateRange',
    ...config,
  };
}

function convertToRangeRequests(values: DateFacetValue[]): DateRangeRequest[] {
  return values.map((value) => {
    const {numberOfResults, ...rest} = value;
    return rest;
  });
}
