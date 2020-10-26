import {Engine} from '../../../app/headless-engine';
import {FacetValue} from '../../../features/facets/facet-set/interfaces/response';
import {
  FacetSelectionChangeMetadata,
  logFacetDeselect, logFacetSelect,
} from '../../../features/facets/facet-set/facet-set-analytics-actions';
import {toggleSelectFacetValue} from '../../../features/facets/facet-set/facet-set-actions';
import {updateFacetOptions} from '../../../features/facet-options/facet-options-actions';
import {executeSearch} from '../../../features/search/search-actions';

export const isFacetValueSelected = (value: FacetValue) => value.state === 'selected';

const getAnalyticsActionForToggleFacetSelect = (facetId: string, selection: FacetValue) => {
  const payload: FacetSelectionChangeMetadata = {
    facetId: facetId,
    facetValue: selection.value,
  };

  return isFacetValueSelected(selection)
    ? logFacetDeselect(payload)
    : logFacetSelect(payload);
};

export function toggleFacetSelect(engine: Engine, facetId: string, selection: FacetValue) {
  const {dispatch} = engine;
  const analyticsAction = getAnalyticsActionForToggleFacetSelect(facetId, selection);

  dispatch(toggleSelectFacetValue({facetId, selection}));
  dispatch(updateFacetOptions({freezeFacetOrder: true}));
  dispatch(executeSearch(analyticsAction));
}