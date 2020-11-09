import {
  DateRangeRequest,
  DateFacetRequest,
} from '../../../../features/facets/range-facets/date-facet-set/interfaces/request';
import {
  AutomaticRangeFacetOptions,
  ManualRangeFacetOptions,
} from '../../../../features/facets/range-facets/generic/interfaces/options';
import {Engine} from '../../../../app/headless-engine';
import {randomID} from '../../../../utils/utils';
import {DateFacetRegistrationOptions} from '../../../../features/facets/range-facets/date-facet-set/interfaces/options';
import {
  DateFacetResponse,
  DateFacetValue,
} from '../../../../features/facets/range-facets/date-facet-set/interfaces/response';
import {registerDateFacet} from '../../../../features/facets/range-facets/date-facet-set/date-facet-actions';
import {buildRangeFacet} from '../headless-range-facet';
import {
  ConfigurationSection,
  DateFacetSection,
  SearchSection,
} from '../../../../state/state-sections';
import {executeToggleDateFacetSelect} from '../../../../features/facets/range-facets/date-facet-set/date-facet-controller-actions';
import {BaseFacetValue} from '../../../../features/facets/facet-api/response';

type DateRangeOptions = Pick<DateRangeRequest, 'start' | 'end'> &
  Partial<DateRangeRequest>;

export function buildDateRange(config: DateRangeOptions): DateRangeRequest {
  return {
    endInclusive: false,
    state: 'idle',
    ...config,
  };
}

export type DateFacetProps = {
  options: DateFacetOptions;
};

interface RangeValueInput<T extends string | number | Date>
  extends BaseFacetValue {
  start: T;
  end: T;
  endInclusive: boolean;
}

type CurrentValueInputType =
  | RangeValueInput<string>[]
  | RangeValueInput<Date>[]
  | RangeValueInput<number>[];

interface ManualDateFacetOptions
  extends Omit<
    ManualRangeFacetOptions<DateFacetRequest>,
    'facetId' | 'currentValues'
  > {
  facetId?: string;
  currentValues: CurrentValueInputType;
}

interface AutomaticDateFacetOptions
  extends Omit<AutomaticRangeFacetOptions<DateFacetRequest>, 'facetId'> {
  facetId?: string;
}

export type DateFacetOptions =
  | AutomaticDateFacetOptions
  | ManualDateFacetOptions;

function isAutomaticFacet(
  facetOptions: DateFacetOptions
): facetOptions is AutomaticDateFacetOptions {
  return facetOptions.currentValues !== undefined;
}

function isStringCurrentValues(
  currentValues: CurrentValueInputType
): currentValues is RangeValueInput<string>[] {
  return typeof currentValues[0]?.start === 'string';
}

function isNumericCurrentValues(
  currentValues: CurrentValueInputType
): currentValues is RangeValueInput<number>[] {
  return typeof currentValues[0]?.start === 'number';
}

function getFacetOptions(
  facetId: string,
  facetOptions: DateFacetOptions
): DateFacetRegistrationOptions {
  if (isAutomaticFacet(facetOptions)) {
    return {facetId, ...facetOptions};
  }
  let currentValues: DateRangeRequest[];
  if (isStringCurrentValues(facetOptions.currentValues)) {
    currentValues = facetOptions.currentValues;
  } else if (isNumericCurrentValues(facetOptions.currentValues)) {
    currentValues = facetOptions.currentValues.map((currentValue) => {
      const start = new Date(currentValue.start);
      const end = new Date(currentValue.end);
      return {
        ...currentValue,
        start: start.toISOString(),
        end: end.toISOString(),
      };
    });
  } else {
    currentValues = facetOptions.currentValues.map((currentValue) => {
      const start = new Date(currentValue.start);
      const end = new Date(currentValue.end);
      return {
        ...currentValue,
        start: start.toISOString(),
        end: end.toISOString(),
      };
    });
  }

  return {facetId, ...facetOptions, currentValues};
}

/** The `DateFacet` controller makes it possible to create a facet with date ranges.*/
export type DateFacet = ReturnType<typeof buildDateFacet>;
export type DateFacetState = DateFacet['state'];

export function buildDateFacet(
  engine: Engine<ConfigurationSection & SearchSection & DateFacetSection>,
  props: DateFacetProps
) {
  const dispatch = engine.dispatch;

  const facetId = props.options.facetId || randomID('dateFacet');
  const options: DateFacetRegistrationOptions = getFacetOptions(
    facetId,
    props.options
  );

  dispatch(registerDateFacet(options));

  const rangeFacet = buildRangeFacet<DateFacetRequest, DateFacetResponse>(
    engine,
    {
      facetId,
      getRequest: () => engine.state.dateFacetSet[facetId],
    }
  );

  return {
    ...rangeFacet,
    /**
     * Selects (deselects) the passed value if unselected (selected).
     * @param selection The facet value to select or deselect.
     */
    toggleSelect: (selection: DateFacetValue) =>
      dispatch(executeToggleDateFacetSelect({facetId, selection})),

    /** @returns The state of the `DateFacet` controller.*/
    get state() {
      return {...rangeFacet.state, isLoading: engine.state.search.isLoading};
    },
  };
}
