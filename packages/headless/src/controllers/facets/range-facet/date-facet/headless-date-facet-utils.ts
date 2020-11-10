import {DateFacetRegistrationOptions} from '../../../../features/facets/range-facets/date-facet-set/interfaces/options';
import {DateRangeRequest} from '../../../../features/facets/range-facets/date-facet-set/interfaces/request';
import {
  AutomaticDateFacetOptions,
  DateFacetOptions,
} from './headless-date-facet';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

function isAutomaticFacet(
  facetOptions: DateFacetOptions
): facetOptions is AutomaticDateFacetOptions {
  return facetOptions.generateAutomaticRanges;
}

export function formatDateFacetOptions(
  facetId: string,
  facetOptions: DateFacetOptions
): DateFacetRegistrationOptions {
  const DATE_FORMAT = 'YYYY/MM/DD@HH:mm:ss';
  dayjs.extend(utc);
  if (isAutomaticFacet(facetOptions)) {
    return {facetId, ...facetOptions};
  }
  const currentValues: DateRangeRequest[] = [];
  for (const currentValue of facetOptions.currentValues) {
    const start = dayjs(currentValue.start);
    const end = dayjs(currentValue.end);
    currentValues.push({
      ...currentValue,
      start: start.utc().format(DATE_FORMAT),
      end: end.utc().format(DATE_FORMAT),
    });
  }

  return {facetId, ...facetOptions, currentValues};
}
