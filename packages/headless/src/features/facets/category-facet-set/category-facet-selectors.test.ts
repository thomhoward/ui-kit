import {SearchPageState} from '../../../state';
import {createMockState} from '../../../test/mock-state';
import {categoryFacetSelectedValuesSelector} from './category-facet-set-selectors';
import {buildMockCategoryFacetResponse} from '../../../test/mock-category-facet-response';
import {buildMockCategoryFacetValue} from '../../../test/mock-category-facet-value';

describe('category facet selectors', () => {
  const facetId = 'abc123';
  let state: SearchPageState;

  beforeEach(() => {
    state = createMockState();
  });

  it('#categoryFacetSelectedValuesSelector returns an empty array if the facet does not exist', () => {
    const selectedResults = categoryFacetSelectedValuesSelector(state, facetId);
    expect(selectedResults).toEqual([]);
  });

  it('#categoryFacetSelectedValuesSelector gets the top level selected value', () => {
    const mockValue = buildMockCategoryFacetValue({
      value: 'test',
      state: 'selected',
    });
    state.search.response.facets = [
      buildMockCategoryFacetResponse({
        facetId,
        values: [mockValue],
      }),
    ];
    const selectedResults = categoryFacetSelectedValuesSelector(state, facetId);
    expect(selectedResults).toEqual([mockValue]);
  });

  it('#categoryFacetSelectedValuesSelector only returns the selected value', () => {
    const ignoredValue = buildMockCategoryFacetValue({
      value: 'nestedTest',
      state: 'idle',
    });
    const mockValue = buildMockCategoryFacetValue({
      value: 'test',
      state: 'selected',
    });
    state.search.response.facets = [
      buildMockCategoryFacetResponse({
        facetId,
        values: [mockValue, ignoredValue],
      }),
    ];
    const selectedResults = categoryFacetSelectedValuesSelector(state, facetId);
    expect(selectedResults).toEqual([mockValue]);
  });

  it('#categoryFacetSelectedValuesSelector gets the path to a nested value', () => {
    const nestedChild = buildMockCategoryFacetValue({
      value: 'nestedTest',
      state: 'selected',
    });
    const mockValue = buildMockCategoryFacetValue({
      value: 'test',
      state: 'idle',
      children: [nestedChild],
    });
    state.search.response.facets = [
      buildMockCategoryFacetResponse({
        facetId,
        values: [mockValue],
      }),
    ];
    const selectedResults = categoryFacetSelectedValuesSelector(state, facetId);
    expect(selectedResults).toEqual([mockValue, nestedChild]);
  });
});
