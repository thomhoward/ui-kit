import {formatDateFacetOptions} from './headless-date-facet-utils';
import {DateFacetOptions} from './headless-date-facet';
import {DateFacetRegistrationOptions} from '../../../../features/facets/range-facets/date-facet-set/interfaces/options';

describe('headless date facet utils', () => {
  const facetId = 'test';
  const field = 'test';

  it('#formatDateFacetOptions generates the correct currentValues for a numeric input', () => {
    const facetOptions: DateFacetOptions = {
      facetId,
      field,
      generateAutomaticRanges: false,
      currentValues: [
        {
          start: 721404625000,
          end: 752940625000,
          endInclusive: true,
          state: 'idle',
          numberOfResults: 5,
        },
      ],
    };
    console.log();
    const expectedValues: DateFacetRegistrationOptions = {
      facetId,
      field,
      generateAutomaticRanges: false,
      currentValues: [
        {
          start: '1992/11/10@014:10:10',
          end: '1993/11/10@014:10:10',
          endInclusive: true,
          state: 'idle',
        },
      ],
    };
    expect(formatDateFacetOptions(facetId, facetOptions)).toEqual();
  });
});
