import {createMockState} from '../../test/mock-state';
import {buildMockFacetRequest} from '../../test/mock-facet-request';
import {buildMockNumericFacetRequest} from '../../test/mock-numeric-facet-request';
import {buildMockDateFacetRequest} from '../../test/mock-date-facet-request';
import {buildMockCategoryFacetRequest} from '../../test/mock-category-facet-request';
import {buildMockFacetOptions} from '../../test/mock-facet-options';
import {SearchAppState} from '../../state/search-app-state';
import {buildMockCategoryFacetSlice} from '../../test/mock-category-facet-slice';
import {buildMockTabSlice} from '../../test/mock-tab-state';
import {buildMockStaticFilterSlice} from '../../test/mock-static-filter-slice';
import {buildMockStaticFilterValue} from '../../test/mock-static-filter-value';
import {buildSearchRequest} from './search-request';

describe('search request', () => {
  let state: SearchAppState;

  beforeEach(() => {
    state = createMockState();
  });

  it('#searchRequest returns the state #query', () => {
    state.query.q = 'hello';
    const params = buildSearchRequest(state).request;

    expect(params.q).toBe(state.query.q);
  });

  it('#searchRequest returns the state #enableQuerySyntax', () => {
    state.query.enableQuerySyntax = true;
    const params = buildSearchRequest(state).request;

    expect(params.enableQuerySyntax).toBe(state.query.enableQuerySyntax);
  });

  it('#searchRequest returns the state #sortCriteria', () => {
    state.sortCriteria = 'qre';
    const params = buildSearchRequest(state).request;

    expect(params.sortCriteria).toBe(state.sortCriteria);
  });

  it('#searchRequest returns the state #numberOfResults', () => {
    state.pagination.numberOfResults = 10;
    const params = buildSearchRequest(state).request;

    expect(params.numberOfResults).toBe(state.pagination.numberOfResults);
  });

  it('#searchRequest returns the state #firstResult', () => {
    state.pagination.firstResult = 10;
    const params = buildSearchRequest(state).request;

    expect(params.firstResult).toBe(state.pagination.firstResult);
  });

  it('#searchRequest returns the state #dictionaryFieldContext.contextValues', () => {
    const contextValues = {price: 'cad'};
    state.dictionaryFieldContext.contextValues = contextValues;
    const params = buildSearchRequest(state).request;

    expect(params.dictionaryFieldContext).toBe(contextValues);
  });

  it('#searchRequest returns the facets in the state #facetSet', () => {
    const request = buildMockFacetRequest({field: 'objecttype'});
    state.facetSet[1] = request;

    const {facets} = buildSearchRequest(state).request;
    expect(facets).toContainEqual(request);
  });

  it('#searchRequest returns the facets in the state #numericFacetSet', () => {
    const request = buildMockNumericFacetRequest({field: 'objecttype'});
    state.numericFacetSet[1] = request;

    const {facets} = buildSearchRequest(state).request;
    expect(facets).toContainEqual(request);
  });

  it('#searchRequest returns the facets in the state #dateFacetSet', () => {
    const request = buildMockDateFacetRequest({field: 'objecttype'});
    state.dateFacetSet[1] = request;

    const {facets} = buildSearchRequest(state).request;
    expect(facets).toContainEqual(request);
  });

  it('#searchRequestParams returns the facets in the #categoryFacetSet', () => {
    const request = buildMockCategoryFacetRequest({field: 'objecttype'});
    state.categoryFacetSet[1] = buildMockCategoryFacetSlice({request});

    const {facets} = buildSearchRequest(state).request;
    expect(facets).toContainEqual(request);
  });

  it('when no facets are configured, the #searchRequestParams does not contain a #facets key', () => {
    const request = buildSearchRequest(state).request;
    expect(request.facets).toBe(undefined);
  });

  it(`when there are facets ids in the same order as the facetOrder array,
  #searchRequestParams orders the facets in the same order as the response`, () => {
    const facetId1 = '1';
    const facetId2 = '2';

    state.facetOrder = [facetId2, facetId1];

    state.facetSet[facetId1] = buildMockFacetRequest({facetId: facetId1});
    state.facetSet[facetId2] = buildMockFacetRequest({facetId: facetId2});

    const {facets} = buildSearchRequest(state).request;
    expect(facets).toEqual([
      state.facetSet[facetId2],
      state.facetSet[facetId1],
    ]);
  });

  it(`when there is a facet id that is not in the facetOrder array,
  #searchRequestParams includes it at the end of the facets array`, () => {
    const facetId1 = '1';
    const facetId2 = '2';

    state.facetOrder = [facetId2];

    state.facetSet[facetId1] = buildMockFacetRequest({facetId: facetId1});
    state.facetSet[facetId2] = buildMockFacetRequest({facetId: facetId2});

    const {facets} = buildSearchRequest(state).request;
    expect(facets).toEqual([
      state.facetSet[facetId2],
      state.facetSet[facetId1],
    ]);
  });

  it('#searchRequestParams returns the facetOptions in state', () => {
    state.facetOptions = buildMockFacetOptions({freezeFacetOrder: true});

    const params = buildSearchRequest(state).request;
    expect(params.facetOptions).toEqual(state.facetOptions);
  });

  it('should send visitorId if analytics is enable', () => {
    state.configuration.analytics.enabled = true;
    expect(buildSearchRequest(state).request.visitorId).toBeDefined();
  });

  it('should not send visitorId if analytics is disabled', () => {
    state.configuration.analytics.enabled = false;
    expect(buildSearchRequest(state).request.visitorId).not.toBeDefined();
  });

  it('#searchRequest.tab holds the #originLevel2', () => {
    const originLevel2 = 'youtube';
    state.configuration.analytics.originLevel2 = originLevel2;
    expect(buildSearchRequest(state).request.tab).toBe(originLevel2);
  });

  it('#searchRequest.referrer holds the #originLevel3', () => {
    const originLevel3 = 'www.coveo.com';
    state.configuration.analytics.originLevel3 = originLevel3;
    expect(buildSearchRequest(state).request.referrer).toBe(originLevel3);
  });

  it('#searchRequest.fieldsToInclude holds the #fieldsToInclude', () => {
    state.fields.fieldsToInclude = ['foo', 'bar'];
    expect(buildSearchRequest(state).request.fieldsToInclude).toEqual(
      expect.arrayContaining(['foo', 'bar'])
    );
  });

  it('#searchRequest.fieldsToInclude does not holds #fieldsToInclude if #fetchAllFields is active', () => {
    state.fields.fieldsToInclude = ['foo', 'bar'];
    state.fields.fetchAllFields = true;
    expect(buildSearchRequest(state).request.fieldsToInclude).not.toBeDefined();
  });

  it('when there are no cq expressions in state, cq is undefined', () => {
    expect(buildSearchRequest(state).request.cq).toBe(undefined);
  });

  it('when there is a cq expression, it sets the cq to the expression', () => {
    state.advancedSearchQueries.cq = 'a';
    expect(buildSearchRequest(state).request.cq).toBe('a');
  });

  it('when there is an active tab, it sets cq to the active tab expression', () => {
    state.tabSet.a = buildMockTabSlice({expression: 'a', isActive: true});
    expect(buildSearchRequest(state).request.cq).toBe('a');
  });

  it(`when there is cq and an active tab,
  it sets the cq to a concatenated expression`, () => {
    state.advancedSearchQueries.cq = 'a';
    state.tabSet.b = buildMockTabSlice({expression: 'b', isActive: true});

    expect(buildSearchRequest(state).request.cq).toBe('a AND b');
  });

  it(`when the cq and active tab expressions are surrounded by spaces,
  it trims them before concatenating`, () => {
    state.advancedSearchQueries.cq = ' a ';
    state.tabSet.b = buildMockTabSlice({expression: ' b ', isActive: true});

    expect(buildSearchRequest(state).request.cq).toBe('a AND b');
  });

  it('static filter with an active value, it sets cq to the active filter value expression', () => {
    const value = buildMockStaticFilterValue({
      expression: 'a',
      state: 'selected',
    });
    state.staticFilterSet.a = buildMockStaticFilterSlice({values: [value]});
    expect(buildSearchRequest(state).request.cq).toBe('a');
  });

  it(`static filter with two active values,
  it concatenates the expressions with OR and wraps them with parentheses`, () => {
    const valueA = buildMockStaticFilterValue({
      expression: 'a',
      state: 'selected',
    });
    const valueB = buildMockStaticFilterValue({
      expression: 'b',
      state: 'selected',
    });

    state.staticFilterSet.a = buildMockStaticFilterSlice({
      values: [valueA, valueB],
    });
    expect(buildSearchRequest(state).request.cq).toBe('(a OR b)');
  });

  it(`static filter with two active values, one value has an empty space as an expression,
  it filters off the empty expression`, () => {
    const valueA = buildMockStaticFilterValue({
      expression: 'a',
      state: 'selected',
    });
    const valueB = buildMockStaticFilterValue({
      expression: ' ',
      state: 'selected',
    });

    state.staticFilterSet.a = buildMockStaticFilterSlice({
      values: [valueA, valueB],
    });
    expect(buildSearchRequest(state).request.cq).toBe('a');
  });
});
