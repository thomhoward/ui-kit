import {CategoryFacetValue, Engine} from '../../..';
import {toggleSelectCategoryFacetValue} from '../../../features/facets/category-facet-set/category-facet-set-actions';
import {updateFacetOptions} from '../../../features/facet-options/facet-options-actions';
import {executeSearch} from '../../../features/search/search-actions';
import {
  FacetSelectionChangeMetadata,
  logFacetDeselect,
  logFacetSelect,
} from '../../../features/facets/facet-set/facet-set-analytics-actions';

const getAnalyticsActionForCategoryFacetToggleSelect = (facetId: string, selection: CategoryFacetValue) => {
  const payload: FacetSelectionChangeMetadata = {
    facetId,
    facetValue: selection.value,
  };

  const isSelected = selection.state === 'selected';
  return isSelected ? logFacetDeselect(payload) : logFacetSelect(payload);
};

export function toggleCategoryFacetSelect(engine: Engine, facetId: string, selection: CategoryFacetValue) {
  const {dispatch} = engine;
  const analyticsAction = getAnalyticsActionForCategoryFacetToggleSelect(facetId, selection);

  dispatch(toggleSelectCategoryFacetValue({facetId, selection}));
  dispatch(updateFacetOptions({freezeFacetOrder: true}));
  dispatch(executeSearch(analyticsAction));
}