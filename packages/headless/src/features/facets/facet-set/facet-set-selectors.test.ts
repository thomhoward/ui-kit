import {createMockState} from '../../../test/mock-state';
import {buildMockFacetResponse} from '../../../test/mock-facet-response';
import {
  facetSelector,
  facetRequestSelector,
  facetSelectedValuesSelector,
} from './facet-set-selectors';
import {SearchPageState} from '../../../state';
import {buildMockFacetRequest} from '../../../test/mock-facet-request';
import {buildMockDateFacetValue} from '../../../test/mock-date-facet-value';
import {buildMockDateFacetResponse} from '../../../test/mock-date-facet-response';
import {buildMockNumericFacetValue} from '../../../test/mock-numeric-facet-value';
import {buildMockNumericFacetResponse} from '../../../test/mock-numeric-facet-response';
import {buildMockFacetValue} from '../../../test/mock-facet-value';

describe('facet-set selectors', () => {
  it('#facetSelector gets the facet response by id', () => {
    const facetId = '1';
    const state = createMockState();
    const facetResponse = buildMockFacetResponse({facetId});
    state.search.response.facets = [facetResponse];

    expect(facetSelector(state, facetId)).toBe(facetResponse);
  });

  it('when the id is not found, #facetSelector returns undefined', () => {
    const state = createMockState();
    expect(facetSelector(state, '1')).toBe(undefined);
  });

  it('#facetRequestSelector gets the facet request by id', () => {
    const facetId = '1';
    const state = createMockState();
    const facetRequest = buildMockFacetRequest({facetId});
    state.facetSet[facetId] = facetRequest;

    expect(facetRequestSelector(state, facetId)).toBe(facetRequest);
  });

  describe('#facetSelectedValuesSelector', () => {
    const facetId = 'abc123';
    let state: SearchPageState;

    beforeEach(() => {
      state = createMockState();
    });

    it('#facetSelectedValuesSelector returns an empty array if the facet does not exist', () => {
      const selectedValues = facetSelectedValuesSelector(state, facetId);
      expect(selectedValues).toEqual([]);
    });

    it('#facetSelectedValuesSelector gets the selected selected value for a date facet', () => {
      const mockValue = buildMockDateFacetValue({
        state: 'selected',
      });
      state.search.response.facets = [
        buildMockDateFacetResponse({
          facetId,
          values: [mockValue],
        }),
      ];
      const selectedValues = facetSelectedValuesSelector(state, facetId);
      expect(selectedValues).toEqual([mockValue]);
    });

    it('#facetSelectedValuesSelector gets the selected selected value for a numeric facet', () => {
      const mockValue = buildMockNumericFacetValue({
        state: 'selected',
      });
      state.search.response.facets = [
        buildMockNumericFacetResponse({
          facetId,
          values: [mockValue],
        }),
      ];
      const selectedValues = facetSelectedValuesSelector(state, facetId);
      expect(selectedValues).toEqual([mockValue]);
    });

    it('#facetSelectedValuesSelector gets the selected selected value for a generic facet', () => {
      const mockValue = buildMockFacetValue({
        state: 'selected',
      });
      state.search.response.facets = [
        buildMockFacetResponse({
          facetId,
          values: [mockValue],
        }),
      ];
      const selectedValues = facetSelectedValuesSelector(state, facetId);
      expect(selectedValues).toEqual([mockValue]);
    });

    it('#facetSelectedValuesSelector gets all the selected values if more than one exists', () => {
      const mockValue = buildMockFacetValue({
        value: 'test1',
        state: 'selected',
      });
      const mockValue2 = buildMockFacetValue({
        value: 'test2',
        state: 'selected',
      });
      state.search.response.facets = [
        buildMockFacetResponse({
          facetId,
          values: [mockValue, mockValue2],
        }),
      ];
      const selectedValues = facetSelectedValuesSelector(state, facetId);
      expect(selectedValues).toContain(mockValue);
      expect(selectedValues).toContain(mockValue2);
    });

    it('#facetSelectedValuesSelector only gets the selected values', () => {
      const mockValue = buildMockFacetValue({
        value: 'test1',
        state: 'selected',
      });
      const mockValue2 = buildMockFacetValue({
        value: 'test2',
        state: 'idle',
      });
      state.search.response.facets = [
        buildMockFacetResponse({
          facetId,
          values: [mockValue, mockValue2],
        }),
      ];
      const selectedValues = facetSelectedValuesSelector(state, facetId);
      expect(selectedValues).toContain(mockValue);
      expect(selectedValues).not.toContain(mockValue2);
    });
  });
});
