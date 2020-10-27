import {createAsyncThunk} from '@reduxjs/toolkit';
import {AsyncThunkSearchOptions} from '../../../../api/search/search-api-client';
import {
  ConfigurationSection,
  DateFacetSection,
} from '../../../../state/state-sections';
import {DateFacetValue} from '../../../../features/facets/range-facets/date-facet-set/interfaces/response';
import {toggleRangeFacetSelect} from '../headless-range-facet-actions';
import {toggleSelectDateFacetValue} from '../../../../features/facets/range-facets/date-facet-set/date-facet-actions';

type ToggleDateFacetSelect = {
  facetId: string;
  selection: DateFacetValue;
};
export const toggleDateFacetSelect = createAsyncThunk<
  void,
  ToggleDateFacetSelect,
  AsyncThunkSearchOptions<ConfigurationSection & DateFacetSection>
>('headless/dateFacet/toggleSelect', ({facetId, selection}, {dispatch}) => {
  dispatch(toggleSelectDateFacetValue({facetId, selection}));
  dispatch(toggleRangeFacetSelect({facetId, selection}));
});
