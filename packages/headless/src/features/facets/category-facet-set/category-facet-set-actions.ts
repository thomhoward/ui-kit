import {createAction} from '@reduxjs/toolkit';
import {CategoryFacetRegistrationOptions} from './interfaces/options';
import {CategoryFacetValue} from './interfaces/response';
import {
  deselectAllFacetValues,
  updateFacetNumberOfValues,
} from '../facet-set/facet-set-actions';
import {CategoryFacetSortCriterion} from './interfaces/request';
import {validatePayloadSchema} from '../../../utils/validate-payload';
import {
  facetIdDefinition,
  requiredNonEmptyString,
} from '../generic/facet-actions-validation';
import {
  Value,
  BooleanValue,
  ArrayValue,
  StringValue,
  NumberValue,
  RecordValue,
} from '@coveo/bueno';

const categoryFacetValueDefinition = {
  value: requiredNonEmptyString,
  path: new ArrayValue({required: true, each: requiredNonEmptyString}),
  children: new Value<CategoryFacetValue[]>({required: true}),
  moreValuesAvailable: new BooleanValue({required: false}),
};

const categoryFacetRegistrationOptionsDefinition = {
  facetId: facetIdDefinition,
  field: requiredNonEmptyString,
  delimitingCharacter: new StringValue({required: false, emptyAllowed: true}),
  filterFacetCount: new BooleanValue({required: false}),
  injectionDepth: new NumberValue({required: false, min: 0}),
  numberOfValues: new NumberValue({required: false, min: 1}),
  sortCriteria: new Value<CategoryFacetSortCriterion>({required: false}),
  basePath: new ArrayValue({required: false, each: requiredNonEmptyString}),
  filterByBasePath: new BooleanValue({required: false}),
};

/**
 * Registers a category facet in the category facet set.
 * @param (CategoryFacetRegistrationOptions) The options to register the category facet with.
 */
export const registerCategoryFacet = createAction(
  'categoryFacet/register',
  (payload: CategoryFacetRegistrationOptions) =>
    validatePayloadSchema(payload, categoryFacetRegistrationOptionsDefinition)
);

/**
 * Toggles a category facet value.
 * @param facetId (string) The unique identifier of the facet (e.g., `"1"`).
 * @param selection (CategoryFacetValue) The target category facet value.
 */
export const toggleSelectCategoryFacetValue = createAction(
  'categoryFacet/toggleSelectValue',
  (payload: {facetId: string; selection: CategoryFacetValue}) =>
    validatePayloadSchema(payload, {
      facetId: facetIdDefinition,
      selection: new RecordValue(categoryFacetValueDefinition),
    })
);

/** Deselects all values of a category facet.
 * @param facetId (string) The unique identifier of the facet (e.g., `"1"`).
 */
export const deselectAllCategoryFacetValues = deselectAllFacetValues;

/** Updates the number of values of a category facet.
 * @param facetId (string) The unique identifier of the facet (e.g., `"1"`).
 * @param numberOfValues (number) The new number of facet values (e.g., `10`).
 */
export const updateCategoryFacetNumberOfValues = updateFacetNumberOfValues;

/**
 * Updates the the sort criterion for the category facet
 * @param facetId (string) The unique identifier of the facet (e.g., `"1"`).
 * @param criterion (FacetSortCriterion) The criterion by which to sort the facet.
 */
export const updateCategoryFacetSortCriterion = createAction(
  'categoryFacet/updateSortCriterion',
  (payload: {facetId: string; criterion: CategoryFacetSortCriterion}) =>
    validatePayloadSchema(payload, {
      facetId: facetIdDefinition,
      criterion: new Value<CategoryFacetSortCriterion>(),
    })
);
