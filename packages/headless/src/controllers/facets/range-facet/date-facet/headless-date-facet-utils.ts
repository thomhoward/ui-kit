import {DateFacetRegistrationOptions} from '../../../../features/facets/range-facets/date-facet-set/interfaces/options';
import {DateRangeRequest} from '../../../../features/facets/range-facets/date-facet-set/interfaces/request';
import {
  AutomaticDateFacetOptions,
  DateFacetOptions,
} from './headless-date-facet';

function isAutomaticFacet(
  facetOptions: DateFacetOptions
): facetOptions is AutomaticDateFacetOptions {
  return facetOptions.generateAutomaticRanges;
}

function dateToTimestamp(date: Date): string {
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getMinutes().toString().padStart(2, '0');

  return `${year}/${month}/${day}@${hours}:${minutes}:${seconds}`;
}

export function formatDateFacetOptions(
  facetId: string,
  facetOptions: DateFacetOptions
): DateFacetRegistrationOptions {
  if (isAutomaticFacet(facetOptions)) {
    return {facetId, ...facetOptions};
  }
  const currentValues: DateRangeRequest[] = [];
  for (const currentValue of facetOptions.currentValues) {
    const start = new Date(currentValue.start);
    const end = new Date(currentValue.end);
    currentValues.push({
      ...currentValue,
      start: dateToTimestamp(start),
      end: dateToTimestamp(end),
    });
  }

  return {facetId, ...facetOptions, currentValues};
}
