import {RangeFacetSortCriterion} from './interfaces/request';
import {createAction, createAsyncThunk} from '@reduxjs/toolkit';
import {RangeFacetValue} from './interfaces/range-facet';
import {AsyncThunkSearchOptions} from '../../../../api/search/search-api-client';
import {ConfigurationSection} from '../../../../state/state-sections';
import {updateFacetOptions} from '../../../facet-options/facet-options-actions';
import {executeSearch} from '../../../search/search-actions';
import {getAnalyticsActionForToggleRangeFacetSelect} from './range-facet-utils';

/**
 * Updates the sort criterion of a range facet.
 * @param facetId (string) The unique identifier of the facet (e.g., `"1"`).
 * @param criterion (RangeFacetSortCriterion) The target criterion.
 */
export const updateRangeFacetSortCriterion = createAction<{
  facetId: string;
  criterion: RangeFacetSortCriterion;
}>('rangeFacet/updateSortCriterion');

/**
 * Executes a search with the appropriate analytics for a toggle range facet value
 * @param facetId (string) The unique identifier of the facet (e.g., `"1"`).
 * @param selection (RangeFacetValue) The target range facet value.
 */
export const executeToggleRangeFacetSelect = createAsyncThunk<
  void,
  {
    facetId: string;
    selection: RangeFacetValue;
  },
  AsyncThunkSearchOptions<ConfigurationSection>
  >('rangeFacet/executeToggleSelect', ({facetId, selection}, {dispatch}) => {
  const analyticsAction = getAnalyticsActionForToggleRangeFacetSelect(
    facetId,
    selection
  );

  dispatch(updateFacetOptions({freezeFacetOrder: true}));
  dispatch(executeSearch(analyticsAction));
});
