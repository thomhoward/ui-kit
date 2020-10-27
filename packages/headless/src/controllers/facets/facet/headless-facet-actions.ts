import {createAsyncThunk} from '@reduxjs/toolkit';
import {AsyncThunkSearchOptions} from '../../../api/search/search-api-client';
import {FacetValue} from '../../../features/facets/facet-set/interfaces/response';
import {
  FacetSelectionChangeMetadata,
  logFacetDeselect,
  logFacetSelect,
} from '../../../features/facets/facet-set/facet-set-analytics-actions';
import {toggleSelectFacetValue} from '../../../features/facets/facet-set/facet-set-actions';
import {updateFacetOptions} from '../../../features/facet-options/facet-options-actions';
import {executeSearch} from '../../../features/search/search-actions';
import {
  ConfigurationSection,
  FacetSection,
} from '../../../state/state-sections';

export const isFacetValueSelected = (value: FacetValue) =>
  value.state === 'selected';

const getAnalyticsActionForToggleFacetSelect = (
  facetId: string,
  selection: FacetValue
) => {
  const payload: FacetSelectionChangeMetadata = {
    facetId: facetId,
    facetValue: selection.value,
  };

  return isFacetValueSelected(selection)
    ? logFacetDeselect(payload)
    : logFacetSelect(payload);
};

type ToggleFacetSelectOptions = {
  facetId: string;
  selection: FacetValue;
};

export const toggleFacetSelect = createAsyncThunk<
  void,
  ToggleFacetSelectOptions,
  AsyncThunkSearchOptions<FacetSection & ConfigurationSection>
>('facetController/toggleSelect', ({facetId, selection}, {dispatch}) => {
  const analyticsAction = getAnalyticsActionForToggleFacetSelect(
    facetId,
    selection
  );

  dispatch(toggleSelectFacetValue({facetId, selection}));
  dispatch(updateFacetOptions({freezeFacetOrder: true}));
  dispatch(executeSearch(analyticsAction));
});
