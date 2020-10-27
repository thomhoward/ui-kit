import {createAsyncThunk} from '@reduxjs/toolkit';
import {AsyncThunkSearchOptions} from '../../../api/search/search-api-client';
import {updateFacetOptions} from '../../../features/facet-options/facet-options-actions';
import {executeSearch} from '../../../features/search/search-actions';
import {RangeFacetValue} from '../../../features/facets/range-facets/generic/interfaces/range-facet';
import {
  FacetSelectionChangeMetadata,
  logFacetDeselect,
  logFacetSelect,
} from '../../../features/facets/facet-set/facet-set-analytics-actions';
import {ConfigurationSection} from '../../../state/state-sections';

export const isRangeFacetValueSelected = (selection: RangeFacetValue) => {
  return selection.state === 'selected';
};

const getAnalyticsActionForToggleRageFacetSelect = (
  facetId: string,
  selection: RangeFacetValue
) => {
  const {start, end} = selection;
  const facetValue = `${start}..${end}`;
  const payload: FacetSelectionChangeMetadata = {facetId, facetValue};

  return isRangeFacetValueSelected(selection)
    ? logFacetDeselect(payload)
    : logFacetSelect(payload);
};

type ToggleRangeFacetSelectArguments = {
  facetId: string;
  selection: RangeFacetValue;
};

export const toggleRangeFacetSelect = createAsyncThunk<
  void,
  ToggleRangeFacetSelectArguments,
  AsyncThunkSearchOptions<ConfigurationSection>
>('rangeFacetController/toggleSelect', ({facetId, selection}, {dispatch}) => {
  const analyticsAction = getAnalyticsActionForToggleRageFacetSelect(
    facetId,
    selection
  );

  dispatch(updateFacetOptions({freezeFacetOrder: true}));
  dispatch(executeSearch(analyticsAction));
});
