import {createAction} from '@reduxjs/toolkit';
import {DateFacetRegistrationOptions} from './interfaces/options';
import {DateFacetValue} from './interfaces/response';
import {updateRangeFacetSortCriterion} from '../generic/range-facet-actions';
import {deselectAllFacetValues} from '../../facet-set/facet-set-actions';
import {validatePayloadSchema} from '../../../../utils/validate-payload';
import {NumberValue, BooleanValue, RecordValue, Value} from '@coveo/bueno';
import {
  facetIdDefinition,
  requiredNonEmptyString,
} from '../../generic/facet-actions-validation';
import {RangeFacetSortCriterion} from '../generic/interfaces/request';
import {DateRangeRequest} from './interfaces/request';
// import { FacetValueState } from '../../facet-api/value';

const dateFacetValueDefinition = {
  state: requiredNonEmptyString,
  numberOfResults: new NumberValue({required: true, min: 0}),
  start: requiredNonEmptyString,
  end: requiredNonEmptyString,
  endInclusive: new BooleanValue({required: true}),
};

// const dateRangeRequestDefinition = {
//   start: requiredNonEmptyString,
//   end: requiredNonEmptyString,
//   endInclusive: new BooleanValue({required:true}),
//   state: new Value<FacetValueState>({required:true}),
// }

const dateFacetRegistrationOptionsDefinition = {
  facetId: facetIdDefinition,
  field: requiredNonEmptyString,
  //currentValues:new ArrayValue({required:true, each:dateRangeRequestDefinition}),
  currentValues: new Value<DateRangeRequest[]>({required: true}),
  generateAutomaticRanges: new BooleanValue<true>({
    required: true,
    default: true,
  }),
  filterFacetCount: new BooleanValue({required: false}),
  injectionDepth: new NumberValue({required: false, min: 0}),
  numberOfValues: new NumberValue({required: false, min: 1}),
  sortCriteria: new Value<RangeFacetSortCriterion>({required: false}),
};

/**
 * Registers a date facet.
 * @param (DateFacetRegistrationOptions) The options to register the facet with.
 */
export const registerDateFacet = createAction(
  'dateFacet/register',
  (payload: DateFacetRegistrationOptions) =>
    validatePayloadSchema(payload, dateFacetRegistrationOptionsDefinition)
);

/**
 * Toggles a date facet value.
 * @param facetId (string) The unique identifier of the facet (e.g., `"1"`).
 * @param selection (DateFacetValue) The target date facet value.
 */
export const toggleSelectDateFacetValue = createAction(
  'dateFacet/toggleSelectValue',
  (payload: {facetId: string; selection: DateFacetValue}) =>
    validatePayloadSchema(payload, {
      facetId: facetIdDefinition,
      selection: new RecordValue(dateFacetValueDefinition),
    })
);

/** Updates the sort criterion of a date facet.
 * @param facetId (string) The unique identifier of the facet (e.g., `"1"`).
 * @param criterion (RangeFacetSortCriterion) The target criterion.
 */
export const updateDateFacetSortCriterion = updateRangeFacetSortCriterion;

/** Deselects all values of a date facet.
 * @param facetId (string) The unique identifier of the facet (e.g., `"1"`).
 */
export const deselectAllDateFacetValues = deselectAllFacetValues;
