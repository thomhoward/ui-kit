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
          start: 721386625000,
          end: 752922625000,
          endInclusive: true,
          state: 'idle',
        },
      ],
    };
    const expectedValues: DateFacetRegistrationOptions = {
      facetId,
      field,
      generateAutomaticRanges: false,
      currentValues: [
        {
          start: '1992/11/10@09:10:25',
          end: '1993/11/10@09:10:25',
          endInclusive: true,
          state: 'idle',
        },
      ],
    };
    expect(formatDateFacetOptions(facetId, facetOptions)).toMatchObject(
      expectedValues
    );
  });

  it('#formatDateFacetOptions generates the correct currentValues for a js date input', () => {
    const facetOptions: DateFacetOptions = {
      facetId,
      field,
      generateAutomaticRanges: false,
      currentValues: [
        {
          start: new Date(721386625000),
          end: new Date(752922625000),
          endInclusive: true,
          state: 'idle',
        },
      ],
    };
    const expectedValues: DateFacetRegistrationOptions = {
      facetId,
      field,
      generateAutomaticRanges: false,
      currentValues: [
        {
          start: '1992/11/10@09:10:25',
          end: '1993/11/10@09:10:25',
          endInclusive: true,
          state: 'idle',
        },
      ],
    };
    expect(formatDateFacetOptions(facetId, facetOptions)).toMatchObject(
      expectedValues
    );
  });

  it('#formatDateFacetOptions generates the correct currentValues for an iso 8601 string input', () => {
    const facetOptions: DateFacetOptions = {
      facetId,
      field,
      generateAutomaticRanges: false,
      currentValues: [
        {
          start: new Date(721386625000).toISOString(),
          end: new Date(752922625000).toISOString(),
          endInclusive: true,
          state: 'idle',
        },
      ],
    };
    const expectedValues: DateFacetRegistrationOptions = {
      facetId,
      field,
      generateAutomaticRanges: false,
      currentValues: [
        {
          start: '1992/11/10@09:10:25',
          end: '1993/11/10@09:10:25',
          endInclusive: true,
          state: 'idle',
        },
      ],
    };
    expect(formatDateFacetOptions(facetId, facetOptions)).toMatchObject(
      expectedValues
    );
  });
});
