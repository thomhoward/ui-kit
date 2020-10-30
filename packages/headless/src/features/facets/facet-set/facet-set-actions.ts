import {createAction} from '@reduxjs/toolkit';
import {FacetRegistrationOptions} from './interfaces/options';
import {FacetSortCriterion} from './interfaces/request';
import {
  validatePayloadValue,
  validatePayloadSchema,
} from '../../../utils/validate-payload';
import {StringValue, NumberValue, BooleanValue} from '@coveo/bueno';
import {FacetValue} from './interfaces/response';

const facetIdDefinition = new StringValue({required: true, emptyAllowed: true});

/**
 * Registers a facet in the facet set.
 * @param (FacetRegistrationOptions) The options to register the facet with.
 */
export const registerFacet = createAction<FacetRegistrationOptions>(
  'facet/register'
);

/**
 * Toggles a facet value.
 * @param facetId (string) The unique identifier of the facet (e.g., `"1"`).
 * @param selection (FacetValue) The target facet value.
 */
export const toggleSelectFacetValue = createAction<{
  facetId: string;
  selection: FacetValue;
}>('facet/toggleSelectValue');

/**
 * Deselects all values of a facet.
 * @param facetId (string) The unique identifier of the facet (e.g., `"1"`).
 */
export const deselectAllFacetValues = createAction(
  'facet/deselectAll',
  (payload: string) => validatePayloadValue(payload, facetIdDefinition)
);

/**
 * Updates the sort criterion of a facet.
 * @param facetId (string) The unique identifier of the facet (e.g., `"1"`).
 * @param criterion (FacetSortCriterion) The criterion by which to sort the facet.
 */
export const updateFacetSortCriterion = createAction<{
  facetId: string;
  criterion: FacetSortCriterion;
}>('facet/updateSortCriterion');

/**
 * Updates the number of values of a facet.
 * @param facetId (string) The unique identifier of the facet (e.g., `"1"`).
 * @param numberOfValues (number) The new number of facet values (e.g., `10`).
 */
export const updateFacetNumberOfValues = createAction(
  'facet/updateNumberOfValues',
  (payload: {facetId: string; numberOfValues: number}) =>
    validatePayloadSchema(payload, {
      facetId: facetIdDefinition,
      numberOfValues: new NumberValue({min: 0}),
    })
);

/**
 * Whether to expand (show more values than initially configured) or shrink down the facet.
 * @param facetId (string) The unique identifier of the facet (e.g., `"1"`).
 * @param isFieldExpanded (boolean) Whether to expand or shrink down the facet.
 */
export const updateFacetIsFieldExpanded = createAction(
  'facet/updateIsFieldExpanded',
  (payload: {facetId: string; isFieldExpanded: boolean}) =>
    validatePayloadSchema(payload, {
      facetId: facetIdDefinition,
      isFieldExpanded: new BooleanValue({required: true}),
    })
);
