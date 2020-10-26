import {Engine} from '../../../../app/headless-engine';
import {NumericFacetValue} from '../../../../features/facets/range-facets/numeric-facet-set/interfaces/response';
import {toggleSelectNumericFacetValue} from '../../../../features/facets/range-facets/numeric-facet-set/numeric-facet-actions';
import {toggleRangeFacetSelect} from '../headless-range-facet-utils';

export const toggleNumericFacetSelect = (engine: Engine, facetId: string, selection: NumericFacetValue) => {
  const {dispatch} = engine;
  dispatch(toggleSelectNumericFacetValue({facetId, selection}));
  toggleRangeFacetSelect(engine, facetId, selection);
};