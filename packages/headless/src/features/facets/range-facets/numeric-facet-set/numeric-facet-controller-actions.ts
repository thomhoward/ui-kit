import {createAsyncThunk} from '@reduxjs/toolkit';
import {NumericFacetValue} from './interfaces/response';
import {AsyncThunkSearchOptions} from '../../../../api/search/search-api-client';
import {
  ConfigurationSection,
  NumericFacetSection,
} from '../../../../state/state-sections';
import {executeToggleRangeFacetSelect} from '../generic/range-facet-controller-actions';
import {toggleSelectNumericFacetValue} from './numeric-facet-actions';
import {validatePayloadSchema} from '../../../../utils/validate-payload';
import {
  facetIdDefinition,
  requiredNonEmptyString,
} from '../../generic/facet-actions-validation';
import {RecordValue, NumberValue, BooleanValue} from '@coveo/bueno';

const numericFacetValueDefinition = {
  state: requiredNonEmptyString,
  start: new NumberValue({required: true}),
  end: new NumberValue({required: true}),
  endInclusive: new BooleanValue({required: true}),
  numberOfResults: new NumberValue({required: true, min: 0}),
};

/**
 * Toggles the numeric facet value and then executes a search with the appropriate analytics tag.
 * @param facetId (string) The unique identifier of the facet (e.g., `"1"`).
 * @param selection (NumericFacetValue) The target numeric facet value.
 */
export const executeToggleNumericFacetSelect = createAsyncThunk<
  void,
  {
    facetId: string;
    selection: NumericFacetValue;
  },
  AsyncThunkSearchOptions<ConfigurationSection & NumericFacetSection>
>('numericFacet/executeToggleSelect', ({facetId, selection}, {dispatch}) => {
  validatePayloadSchema(
    {facetId, selection},
    {
      facetId: facetIdDefinition,
      selection: new RecordValue({values: numericFacetValueDefinition}),
    }
  );
  dispatch(toggleSelectNumericFacetValue({facetId, selection}));
  dispatch(executeToggleRangeFacetSelect({facetId, selection}));
});
