import {buildDateRange} from './headless-date-facet';
import {DateRangeRequest} from '../../../../features/facets/range-facets/date-facet-set/interfaces/request';

describe('headless date facet utils', () => {
  it('#buildDateRange generates the correct value for a numeric input', () => {
    const dateRange = buildDateRange({
      start: 721386625000,
      end: 752922625000,
    });

    const expectedValues: DateRangeRequest = {
      start: '1992/11/10@09:10:25',
      end: '1993/11/10@09:10:25',
      endInclusive: false,
      state: 'idle',
    };

    expect(dateRange).toMatchObject(expectedValues);
  });

  it('#buildDateRange generates the correct value for a js date input', () => {
    const dateRange = buildDateRange({
      start: new Date(721386625000),
      end: new Date(752922625000),
    });

    const expectedValues: DateRangeRequest = {
      start: '1992/11/10@09:10:25',
      end: '1993/11/10@09:10:25',
      endInclusive: false,
      state: 'idle',
    };

    expect(dateRange).toMatchObject(expectedValues);
  });

  it('#buildDateRange generates the correct value for an iso 8601 string input', () => {
    const dateRange = buildDateRange({
      start: new Date(721386625000).toISOString(),
      end: new Date(752922625000).toISOString(),
    });

    const expectedValues: DateRangeRequest = {
      start: '1992/11/10@09:10:25',
      end: '1993/11/10@09:10:25',
      endInclusive: false,
      state: 'idle',
    };

    expect(dateRange).toMatchObject(expectedValues);
  });
});
