import {
  buildController,
  Controller,
} from '../../../controller/headless-controller';
import {
  registerFacet,
  deselectAllFacetValues,
  updateFacetSortCriterion,
  updateFacetNumberOfValues,
  updateFacetIsFieldExpanded,
} from '../../../../features/facets/facet-set/facet-set-actions';
import {
  facetRequestSelector,
  facetResponseSelector,
  isFacetLoadingResponseSelector,
} from '../../../../features/facets/facet-set/facet-set-selectors';
import {FacetSortCriterion} from '../../../../features/facets/facet-set/interfaces/request';
import {updateFacetOptions} from '../../../../features/facet-options/facet-options-actions';
import {
  ConfigurationSection,
  FacetSearchSection,
  FacetSection,
  ProductListingSection,
  SearchSection,
} from '../../../../state/state-sections';
import {isFacetValueSelected} from '../../../../features/facets/facet-set/facet-set-utils';
import {executeToggleFacetSelect} from '../../../../features/facets/facet-set/facet-set-controller-actions';
import {validateOptions} from '../../../../utils/validate-payload';
import {defaultFacetOptions} from '../../../../features/facets/facet-set/facet-set-slice';
import {defaultFacetSearchOptions} from '../../../../features/facets/facet-search-set/facet-search-reducer-helpers';
import {
  FacetOptions,
  facetOptionsSchema,
  FacetSearchOptions,
} from './headless-core-facet-options';
import {determineFacetId} from '../_common/facet-id-determinor';
import {FacetValueState} from '../../../../features/facets/facet-api/value';
import {
  configuration,
  facetSearchSet,
  facetSet,
} from '../../../../app/reducers';
import {loadReducerError} from '../../../../utils/errors';
import {CoreEngine} from '../../../../app/engine';
import {SearchThunkExtraArguments} from '../../../../app/search-thunk-extra-arguments';

export {FacetOptions, FacetSearchOptions, FacetValueState};

export interface FacetProps {
  /**
   * The options for the `Facet` controller.
   * */
  options: FacetOptions;
}

export interface Facet extends CoreFacet {
  /**
   * Provides methods to search the facet's values.
   */
  facetSearch: FacetSearch;

  /**
   * The state of the `Facet` controller.
   */
  state: FacetState;
}

/**
 * The `Facet` headless controller offers a high-level interface for designing a common facet UI controller.
 */
export interface CoreFacet extends Controller {
  /**
   * Toggles the specified facet value.
   *
   * @param selection - The facet value to toggle.
   */
  toggleSelect(selection: FacetValue): void;

  /**
   * Toggles the specified facet value, deselecting others.
   *
   * @param selection - The facet value to toggle.
   */
  toggleSingleSelect(selection: FacetValue): void;

  /**
   * Checks whether the specified facet value is selected.
   *
   * @param value - The facet value to check.
   * @returns Whether the specified facet value is selected.
   */
  isValueSelected(value: FacetValue): boolean;

  /**
   * Deselects all facet values.
   * */
  deselectAll(): void;

  /**
   * Sorts the facet values according to the specified criterion.
   *
   * @param criterion - The criterion to use for sorting values.
   */
  sortBy(criterion: FacetSortCriterion): void;

  /**
   * Checks whether the facet values are sorted according to the specified criterion.
   *
   * @param criterion - The criterion to compare.
   * @returns Whether the facet values are sorted according to the specified criterion.
   */
  isSortedBy(criterion: FacetSortCriterion): boolean;

  /**
   * Increases the number of values displayed in the facet to the next multiple of the originally configured value.
   */
  showMoreValues(): void;

  /**
   * Sets the number of values displayed in the facet to the originally configured value.
   * */
  showLessValues(): void;

  /**
   * The state of the `Facet` controller.
   * */
  state: CoreFacetState;
}

export interface FacetState extends CoreFacetState {
  /** The state of the facet's searchbox. */
  facetSearch: FacetSearchState;
}

/**
 * A scoped and simplified part of the headless state that is relevant to the `Facet` controller.
 */
export interface CoreFacetState {
  /** The facet ID. */
  facetId: string;

  /** The values of the facet. */
  values: FacetValue[];

  /** The active sortCriterion of the facet. */
  sortCriterion: FacetSortCriterion;

  /** `true` if a search is in progress and `false` otherwise. */
  isLoading: boolean;

  /** `true` if there is at least one non-idle value and `false` otherwise. */
  hasActiveValues: boolean;

  /** `true` if there are more values to display and `false` otherwise. */
  canShowMoreValues: boolean;

  /** `true` if fewer values can be displayed and `false` otherwise. */
  canShowLessValues: boolean;
}

export interface FacetSearch {
  /**
   * Updates the facet search query.
   *
   * @param text - The query to search.
   * */
  updateText(text: string): void;

  /**
   * Shows more facet search results.
   * */
  showMoreResults(): void;

  /**
   * Performs a facet search.
   * */
  search(): void;

  /**
   * Selects a facet search result.
   *
   * @param value - The search result to select.
   * */
  select(value: SpecificFacetSearchResult): void;

  /**
   * Selects a search result while deselecting facet values.
   *
   * @param value - The search result to select.
   * */
  singleSelect(value: SpecificFacetSearchResult): void;

  /**
   * Resets the query and empties the values.
   * */
  clear(): void;

  /**
   * Updates the facet value captions.
   * @param captions - A dictionary that maps index field values to facet value display names.
   */
  updateCaptions(captions: Record<string, string>): void;
}

export interface FacetSearchState {
  /**
   * The facet search results.
   * */
  values: SpecificFacetSearchResult[];

  /**
   * `true` if the facet search is in progress and `false` otherwise.
   * */
  isLoading: boolean;

  /**
   * Whether more values are available.
   * */
  moreValuesAvailable: boolean;

  /** The current query in the facet search box. */
  query: string;
}

export interface SpecificFacetSearchResult {
  /**
   * The custom facet value display name, as specified in the `captions` argument of the facet request.
   */
  displayValue: string;

  /**
   * The original facet value, as retrieved from the field in the index.
   */
  rawValue: string;

  /**
   * An estimate of the number of result items matching both the current query and
   * the filter expression that would get generated if the facet value were selected.
   */
  count: number;
}

export interface FacetValue {
  /**
   * Whether a facet value is filtering results (`selected`) or not (`idle`).
   * */
  state: FacetValueState;

  /**
   * The number of results that have the facet value.
   * */
  numberOfResults: number;

  /**
   * The facet value.
   * */
  value: string;
}

/**
 * Creates a `Facet` controller instance.
 *
 * @param engine - The headless engine.
 * @param props - The configurable `Facet` properties.
 * @returns A `Facet` controller instance.
 * */
export function buildCoreFacet(
  engine: CoreEngine,
  props: FacetProps
): CoreFacet {
  if (!loadFacetReducers(engine)) {
    throw loadReducerError;
  }

  const {dispatch} = engine;
  const controller = buildController(engine);

  const facetId = determineFacetId(engine, props.options);
  const options: Required<FacetOptions> = {
    facetSearch: {...defaultFacetSearchOptions},
    ...defaultFacetOptions,
    ...props.options,
    facetId,
  };

  validateOptions(engine, facetOptionsSchema, options, 'buildFacet');

  const getRequest = () => facetRequestSelector(engine.state, facetId);
  const getResponse = () => facetResponseSelector(engine.state, facetId);
  const getIsLoading = () => isFacetLoadingResponseSelector(engine.state);

  const getNumberOfActiveValues = () => {
    const {currentValues} = getRequest();
    return currentValues.filter((v) => v.state !== 'idle').length;
  };

  const computeCanShowLessValues = () => {
    const {currentValues} = getRequest();
    const initialNumberOfValues = options.numberOfValues;
    const hasIdleValues = !!currentValues.find((v) => v.state === 'idle');

    return initialNumberOfValues < currentValues.length && hasIdleValues;
  };

  dispatch(registerFacet(options));

  return {
    ...controller,

    toggleSelect: (selection: FacetValue) =>
      dispatch(executeToggleFacetSelect({facetId: options.facetId, selection})),

    // Must use a function here to properly support inheritance with `this`.
    toggleSingleSelect: function (selection: FacetValue) {
      if (selection.state === 'idle') {
        dispatch(deselectAllFacetValues(facetId));
      }

      this.toggleSelect(selection);
    },

    isValueSelected: isFacetValueSelected,

    deselectAll() {
      dispatch(deselectAllFacetValues(facetId));
      dispatch(updateFacetOptions({freezeFacetOrder: true}));
    },

    sortBy(criterion: FacetSortCriterion) {
      dispatch(updateFacetSortCriterion({facetId, criterion}));
      dispatch(updateFacetOptions({freezeFacetOrder: true}));
    },

    isSortedBy(criterion: FacetSortCriterion) {
      return this.state.sortCriterion === criterion;
    },

    showMoreValues() {
      const numberInState = getRequest().numberOfValues;
      const initialNumberOfValues = options.numberOfValues;
      const numberToNextMultipleOfConfigured =
        initialNumberOfValues - (numberInState % initialNumberOfValues);
      const numberOfValues = numberInState + numberToNextMultipleOfConfigured;

      dispatch(updateFacetNumberOfValues({facetId, numberOfValues}));
      dispatch(updateFacetIsFieldExpanded({facetId, isFieldExpanded: true}));
      dispatch(updateFacetOptions({freezeFacetOrder: true}));
    },

    showLessValues() {
      const initialNumberOfValues = options.numberOfValues;
      const newNumberOfValues = Math.max(
        initialNumberOfValues,
        getNumberOfActiveValues()
      );

      dispatch(
        updateFacetNumberOfValues({facetId, numberOfValues: newNumberOfValues})
      );
      dispatch(updateFacetIsFieldExpanded({facetId, isFieldExpanded: false}));
      dispatch(updateFacetOptions({freezeFacetOrder: true}));
    },

    get state() {
      const request = getRequest();
      const response = getResponse();
      const isLoading = getIsLoading();

      const sortCriterion = request.sortCriteria;
      const values = response ? response.values : [];
      const hasActiveValues = values.some(
        (facetValue) => facetValue.state !== 'idle'
      );
      const canShowMoreValues = response ? response.moreValuesAvailable : false;

      return {
        facetId,
        values,
        sortCriterion,
        isLoading,
        hasActiveValues,
        canShowMoreValues,
        canShowLessValues: computeCanShowLessValues(),
      };
    },
  };
}

function loadFacetReducers(
  engine: CoreEngine
): engine is CoreEngine<
  FacetSection &
    ConfigurationSection &
    FacetSearchSection &
    (SearchSection | ProductListingSection),
  SearchThunkExtraArguments
> {
  engine.addReducers({facetSet, configuration, facetSearchSet});
  return true;
}
