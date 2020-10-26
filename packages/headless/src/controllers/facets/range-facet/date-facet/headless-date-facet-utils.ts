import {Engine} from '../../../../app/headless-engine';
import {
  DateFacetValue,
} from '../../../../features/facets/range-facets/date-facet-set/interfaces/response';
import {toggleRangeFacetSelect} from '../headless-range-facet-utils';
import {toggleSelectDateFacetValue} from '../../../../features/facets/range-facets/date-facet-set/date-facet-actions';

export const toggleDateFacetSelect = (engine: Engine, facetId: string, selection: DateFacetValue) => {
  const {dispatch} = engine;
  dispatch(toggleSelectDateFacetValue({facetId, selection}));
  toggleRangeFacetSelect(engine, facetId, selection);
};