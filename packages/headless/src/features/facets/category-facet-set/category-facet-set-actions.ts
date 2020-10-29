import {createAction, createAsyncThunk} from '@reduxjs/toolkit';
import {CategoryFacetRegistrationOptions} from './interfaces/options';
import {CategoryFacetValue} from './interfaces/response';
import {
  deselectAllFacetValues,
  updateFacetNumberOfValues,
} from '../facet-set/facet-set-actions';
import {CategoryFacetSortCriterion} from './interfaces/request';
import {AsyncThunkSearchOptions} from '../../../api/search/search-api-client';
import {
  CategoryFacetSection,
  ConfigurationSection,
} from '../../../state/state-sections';
import {updateFacetOptions} from '../../facet-options/facet-options-actions';
import {executeSearch} from '../../search/search-actions';
import {getAnalyticsActionForCategoryFacetToggleSelect} from './category-facet-utils';
import {logFacetClearAll} from '../facet-set/facet-set-analytics-actions';

/**
 * Registers a category facet in the category facet set.
 * @param (CategoryFacetRegistrationOptions) The options to register the category facet with.
 */
export const registerCategoryFacet = createAction<
  CategoryFacetRegistrationOptions
>('categoryFacet/register');

/**
 * Toggles a category facet value.
 * @param facetId (string) The unique identifier of the facet (e.g., `"1"`).
 * @param selection (CategoryFacetValue) The target category facet value.
 */
export const toggleSelectCategoryFacetValue = createAction<{
  facetId: string;
  selection: CategoryFacetValue;
}>('categoryFacet/toggleSelectValue');

/** Deselects all values of a category facet.
 * @param facetId (string) The unique identifier of the facet (e.g., `"1"`).
 */
export const deselectAllCategoryFacetValues = deselectAllFacetValues;

/** Updates the number of values of a category facet.
 * @param facetId (string) The unique identifier of the facet (e.g., `"1"`).
 * @param numberOfValues (number) The new number of facet values (e.g., `10`).
 */
export const updateCategoryFacetNumberOfValues = updateFacetNumberOfValues;

/**
 * Updates the the sort criterion for the category facet
 * @param facetId (string) The unique identifier of the facet (e.g., `"1"`).
 * @param criterion (FacetSortCriterion) The criterion by which to sort the facet.
 */
export const updateCategoryFacetSortCriterion = createAction<{
  facetId: string;
  criterion: CategoryFacetSortCriterion;
}>('categoryFacet/updateSortCriterion');

export const executeToggleCategoryFacetSelect = createAsyncThunk<
  void,
  {
    facetId: string;
    selection: CategoryFacetValue;
  },
  AsyncThunkSearchOptions<CategoryFacetSection & ConfigurationSection>
>('categoryFacet/executeToggleSelect', ({facetId, selection}, {dispatch}) => {
  const analyticsAction = getAnalyticsActionForCategoryFacetToggleSelect(
    facetId,
    selection
  );

  dispatch(toggleSelectCategoryFacetValue({facetId, selection}));
  dispatch(updateFacetOptions({freezeFacetOrder: true}));
  dispatch(executeSearch(analyticsAction));
});

export const executeDeselectAllCategoryFacetValues = createAsyncThunk<
  void,
  {facetId: string; numberOfValues: number},
  AsyncThunkSearchOptions<CategoryFacetSection & ConfigurationSection>
>(
  'categoryFacet/executeDeselectAll',
  ({facetId, numberOfValues}, {dispatch}) => {
    dispatch(deselectAllCategoryFacetValues(facetId));
    dispatch(updateCategoryFacetNumberOfValues({facetId, numberOfValues}));
    dispatch(updateFacetOptions({freezeFacetOrder: true}));
    dispatch(executeSearch(logFacetClearAll(facetId)));
  }
);
