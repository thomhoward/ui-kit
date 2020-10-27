import {CategoryFacetValue} from '../../../features/facets/category-facet-set/interfaces/response';
import {toggleSelectCategoryFacetValue} from '../../../features/facets/category-facet-set/category-facet-set-actions';
import {updateFacetOptions} from '../../../features/facet-options/facet-options-actions';
import {executeSearch} from '../../../features/search/search-actions';
import {
  FacetSelectionChangeMetadata,
  logFacetDeselect,
  logFacetSelect,
} from '../../../features/facets/facet-set/facet-set-analytics-actions';
import {
  CategoryFacetSection,
  ConfigurationSection,
} from '../../../state/state-sections';
import {createAsyncThunk} from '@reduxjs/toolkit';
import {AsyncThunkSearchOptions} from '../../../api/search/search-api-client';

const getAnalyticsActionForCategoryFacetToggleSelect = (
  facetId: string,
  selection: CategoryFacetValue
) => {
  const payload: FacetSelectionChangeMetadata = {
    facetId,
    facetValue: selection.value,
  };

  const isSelected = selection.state === 'selected';
  return isSelected ? logFacetDeselect(payload) : logFacetSelect(payload);
};

type ToggleCategoryFacetSelectArguments = {
  facetId: string;
  selection: CategoryFacetValue;
};

export const toggleCategoryFacetSelect = createAsyncThunk<
  void,
  ToggleCategoryFacetSelectArguments,
  AsyncThunkSearchOptions<CategoryFacetSection & ConfigurationSection>
>('headless/categoryFacet/toggleSelect', ({facetId, selection}, {dispatch}) => {
  const analyticsAction = getAnalyticsActionForCategoryFacetToggleSelect(
    facetId,
    selection
  );

  dispatch(toggleSelectCategoryFacetValue({facetId, selection}));
  dispatch(updateFacetOptions({freezeFacetOrder: true}));
  dispatch(executeSearch(analyticsAction));
});
