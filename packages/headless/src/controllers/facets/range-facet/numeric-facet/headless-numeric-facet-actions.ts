import {createAsyncThunk} from '@reduxjs/toolkit';
import {AsyncThunkSearchOptions} from '../../../../api/search/search-api-client';
import {NumericFacetValue} from '../../../../features/facets/range-facets/numeric-facet-set/interfaces/response';
import {toggleSelectNumericFacetValue} from '../../../../features/facets/range-facets/numeric-facet-set/numeric-facet-actions';
import {toggleRangeFacetSelect} from '../headless-range-facet-actions';
import {
  ConfigurationSection,
  NumericFacetSection,
} from '../../../../state/state-sections';

type ToggleNumericFacetSelectArguments = {
  facetId: string;
  selection: NumericFacetValue;
};

export const toggleNumericFacetSelect = createAsyncThunk<
  void,
  ToggleNumericFacetSelectArguments,
  AsyncThunkSearchOptions<ConfigurationSection & NumericFacetSection>
>('numericFacetController/toggleSelect', ({facetId, selection}, {dispatch}) => {
  dispatch(toggleSelectNumericFacetValue({facetId, selection}));
  dispatch(toggleRangeFacetSelect({facetId, selection}));
});
