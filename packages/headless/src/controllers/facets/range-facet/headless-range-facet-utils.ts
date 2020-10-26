import {Engine} from '../../../app/headless-engine';
import {updateFacetOptions} from '../../../features/facet-options/facet-options-actions';
import {executeSearch} from '../../../features/search/search-actions';
import {RangeFacetValue} from '../../../features/facets/range-facets/generic/interfaces/range-facet';
import {
  FacetSelectionChangeMetadata,
  logFacetDeselect, logFacetSelect,
} from '../../../features/facets/facet-set/facet-set-analytics-actions';

export const isRangeFacetValueSelected = (selection: RangeFacetValue) => {
  return selection.state === 'selected';
};

const getAnalyticsActionForToggleRageFacetSelect = (facetId: string, selection: RangeFacetValue) => {
  const {start, end} = selection;
  const facetValue = `${start}..${end}`;
  const payload: FacetSelectionChangeMetadata = {facetId, facetValue};

  return isRangeFacetValueSelected(selection)
    ? logFacetDeselect(payload)
    : logFacetSelect(payload);
};

export const toggleRangeFacetSelect = (engine: Engine, facetId: string, selection: RangeFacetValue) => {
  const {dispatch} = engine;
  const analyticsAction = getAnalyticsActionForToggleRageFacetSelect(facetId, selection);

  dispatch(updateFacetOptions({freezeFacetOrder: true}));
  dispatch(executeSearch(analyticsAction));
}