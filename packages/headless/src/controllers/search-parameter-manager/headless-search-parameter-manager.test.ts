import {restoreSearchParameters} from '../../features/search-parameters/search-parameter-actions';
import {initialSearchParameterSelector} from '../../features/search-parameters/search-parameter-selectors';
import {executeSearch} from '../../features/search/search-actions';
import {buildMockSearchAppEngine, MockSearchEngine} from '../../test';
import {buildMockCategoryFacetRequest} from '../../test/mock-category-facet-request';
import {buildMockCategoryFacetSlice} from '../../test/mock-category-facet-slice';
import {buildMockCategoryFacetValueRequest} from '../../test/mock-category-facet-value-request';
import {buildMockDateFacetRequest} from '../../test/mock-date-facet-request';
import {buildMockDateFacetValue} from '../../test/mock-date-facet-value';
import {buildMockFacetRequest} from '../../test/mock-facet-request';
import {buildMockFacetValueRequest} from '../../test/mock-facet-value-request';
import {buildMockNumericFacetRequest} from '../../test/mock-numeric-facet-request';
import {buildMockNumericFacetValue} from '../../test/mock-numeric-facet-value';
import {buildMockSearchParameters} from '../../test/mock-search-parameters';
import {buildMockStaticFilterSlice} from '../../test/mock-static-filter-slice';
import {buildMockStaticFilterValue} from '../../test/mock-static-filter-value';
import {buildMockTabSlice} from '../../test/mock-tab-state';
import {
  buildSearchParameterManager,
  SearchParameterManager,
  SearchParameterManagerProps,
} from './headless-search-parameter-manager';

describe('search parameter manager', () => {
  let engine: MockSearchEngine;
  let props: SearchParameterManagerProps;
  let manager: SearchParameterManager;

  function initSearchParameterManager() {
    manager = buildSearchParameterManager(engine, props);
  }

  beforeEach(() => {
    engine = buildMockSearchAppEngine();
    props = {
      initialState: {
        parameters: {},
      },
    };

    initSearchParameterManager();
  });

  it('exposes a #subscribe method', () => {
    expect(manager.subscribe).toBeTruthy();
  });

  it('exposes a #parameters property under state', () => {
    expect(manager.state.parameters).toBeTruthy();
  });

  it('dispatches #restoreSearchParameters on registration', () => {
    const action = restoreSearchParameters(props.initialState.parameters);
    expect(engine.actions).toContainEqual(action);
  });

  it('when #parameters is not an object, it throws an error', () => {
    props.initialState.parameters = true as never;
    expect(() => initSearchParameterManager()).toThrow(
      'Check the initialState of buildSearchParameterManager'
    );
  });

  describe('#state.parameters.q', () => {
    it('when the parameter does not equal the default value, it is included', () => {
      engine.state.query.q = 'a';
      expect(manager.state.parameters.q).toBe('a');
    });

    it('when the parameter is equal to the default value, it is not included', () => {
      expect('q' in manager.state.parameters).toBe(false);
    });
  });

  describe('#state.parameters.enableQuerySyntax', () => {
    it('when the parameter does not equal the default value, it is included', () => {
      engine.state.query.enableQuerySyntax = true;
      expect(manager.state.parameters.enableQuerySyntax).toBe(true);
    });

    it('when the parameter is equal to the default value, it is not included', () => {
      expect('enableQuerySyntax' in manager.state.parameters).toBe(false);
    });
  });

  describe('#state.parameters.aq', () => {
    it('when the parameter is not the default, it is included', () => {
      engine.state.advancedSearchQueries.aq = 'abc';
      engine.state.advancedSearchQueries.defaultFilters.aq = 'def';
      expect(manager.state.parameters.aq).toBe('abc');
    });

    it('when the parameter is the default, it is not included', () => {
      engine.state.advancedSearchQueries.aq = 'abc';
      engine.state.advancedSearchQueries.defaultFilters.aq = 'abc';
      expect('aq' in manager.state.parameters).toBe(false);
    });
  });

  describe('#state.parameters.cq', () => {
    it('when the parameter is not the default, it is included', () => {
      engine.state.advancedSearchQueries.cq = 'abc';
      engine.state.advancedSearchQueries.defaultFilters.cq = 'def';
      expect(manager.state.parameters.cq).toBe('abc');
    });

    it('when the parameter is the default, it is not included', () => {
      engine.state.advancedSearchQueries.cq = 'abc';
      engine.state.advancedSearchQueries.defaultFilters.cq = 'abc';
      expect('cq' in manager.state.parameters).toBe(false);
    });
  });

  describe('#state.parameters.tab', () => {
    it('when there is an active tab, it is included', () => {
      const id = 'a';
      const tab = buildMockTabSlice({id, isActive: true});
      engine.state.tabSet = {[id]: tab};
      expect(manager.state.parameters.tab).toBe(id);
    });

    it('when there is no active tab, it is not included', () => {
      const id = 'a';
      const tab = buildMockTabSlice({id, isActive: false});
      engine.state.tabSet = {[id]: tab};
      expect(manager.state.parameters.tab).toBe(undefined);
    });
  });

  describe('#state.parameters.lq', () => {
    it('when the parameter is not the default, it is not included', () => {
      engine.state.advancedSearchQueries.lq = 'abc';
      engine.state.advancedSearchQueries.defaultFilters.lq = 'def';
      expect('lq' in manager.state.parameters).toBe(false);
    });

    it('when the parameter is the default, it is not included', () => {
      engine.state.advancedSearchQueries.lq = 'abc';
      engine.state.advancedSearchQueries.defaultFilters.lq = 'abc';
      expect('lq' in manager.state.parameters).toBe(false);
    });
  });

  describe('#state.parameters.firstResult', () => {
    it('when the parameter does not equal the default value, it is included', () => {
      engine.state.pagination.firstResult = 1;
      expect(manager.state.parameters.firstResult).toBe(1);
    });

    it('when the parameter is equal to the default value, it is not included', () => {
      expect('firstResult' in manager.state.parameters).toBe(false);
    });
  });

  describe('#state.parameters.numberOfResults', () => {
    it('when the parameter does not equal the default value, it is included', () => {
      engine.state.pagination.numberOfResults = 1;
      expect(manager.state.parameters.numberOfResults).toBe(1);
    });

    it('when the parameter is equal to the default value, it is not included', () => {
      expect('numberOfResults' in manager.state.parameters).toBe(false);
    });
  });

  describe('#state.parameters.sf', () => {
    it('when a static filter has a selected value, only selected values are included', () => {
      const id = 'a';
      const selected = buildMockStaticFilterValue({
        caption: 'a',
        state: 'selected',
      });
      const idle = buildMockStaticFilterValue({caption: 'b', state: 'idle'});
      const filter = buildMockStaticFilterSlice({id, values: [selected, idle]});

      engine.state.staticFilterSet = {[id]: filter};
      expect(manager.state.parameters.sf).toEqual({[id]: [selected.caption]});
    });

    it('when no static filters have selected values, the #sf parameter is not included', () => {
      const filter = buildMockStaticFilterSlice();

      engine.state.staticFilterSet = {a: filter};
      expect('sf' in manager.state.parameters).toBe(false);
    });
  });

  describe('#state.parameters.f', () => {
    it('when a facet has selected values, only selected values are included', () => {
      const selected = buildMockFacetValueRequest({
        value: 'a',
        state: 'selected',
      });
      const idle = buildMockFacetValueRequest({value: 'b', state: 'idle'});

      const currentValues = [selected, idle];
      engine.state.facetSet = {author: buildMockFacetRequest({currentValues})};

      expect(manager.state.parameters.f).toEqual({author: ['a']});
    });

    it('when there are no facets with selected values, the #f parameter is not included', () => {
      engine.state.facetSet = {author: buildMockFacetRequest()};
      expect('f' in manager.state.parameters).toBe(false);
    });
  });

  describe('#state.parameters.cf', () => {
    it('when a category facet has selected values, only selected values are included', () => {
      const selected = buildMockCategoryFacetValueRequest({
        value: 'a',
        state: 'selected',
      });

      const idle = buildMockCategoryFacetValueRequest({
        value: 'b',
        state: 'idle',
      });

      const request = buildMockCategoryFacetRequest({
        currentValues: [selected, idle],
      });

      engine.state.categoryFacetSet = {
        author: buildMockCategoryFacetSlice({request}),
      };

      expect(manager.state.parameters.cf).toEqual({author: ['a']});
    });

    it('when a category facet has a nested selection, the full path is included', () => {
      const child = buildMockCategoryFacetValueRequest({
        value: 'b',
        state: 'selected',
      });

      const parent = buildMockCategoryFacetValueRequest({
        value: 'a',
        children: [child],
      });

      const request = buildMockCategoryFacetRequest({currentValues: [parent]});
      engine.state.categoryFacetSet = {
        author: buildMockCategoryFacetSlice({request}),
      };

      expect(manager.state.parameters.cf).toEqual({author: ['a', 'b']});
    });

    it('when there are no category facets with selected values, the #cf parameter is not included', () => {
      engine.state.categoryFacetSet = {author: buildMockCategoryFacetSlice()};
      expect('cf' in manager.state.parameters).toBe(false);
    });
  });

  describe('#state.parameters.nf', () => {
    it('when a numeric facet has selected values, only selected values are included', () => {
      const selected = buildMockNumericFacetValue({
        start: 0,
        end: 10,
        state: 'selected',
      });
      const idle = buildMockNumericFacetValue({
        start: 10,
        end: 20,
        state: 'idle',
      });

      const currentValues = [selected, idle];
      engine.state.numericFacetSet = {
        size: buildMockNumericFacetRequest({currentValues}),
      };

      expect(manager.state.parameters.nf).toEqual({size: [selected]});
    });

    it('when there are no numeric facets with selected values, the #nf parameter is not included', () => {
      engine.state.numericFacetSet = {author: buildMockNumericFacetRequest()};
      expect('nf' in manager.state.parameters).toBe(false);
    });
  });

  describe('#state.parameters.df', () => {
    it('when a date facet has selected values, only selected values are included', () => {
      const selected = buildMockDateFacetValue({
        start: '2020/10/01',
        end: '2020/11/01',
        state: 'selected',
      });
      const idle = buildMockDateFacetValue({
        start: '2020/11/01',
        end: '2020/12/01',
        state: 'idle',
      });

      const currentValues = [selected, idle];
      engine.state.dateFacetSet = {
        created: buildMockDateFacetRequest({currentValues}),
      };

      expect(manager.state.parameters.df).toEqual({created: [selected]});
    });

    it('when there are no date facets with selected values, the #df parameter is not included', () => {
      engine.state.dateFacetSet = {created: buildMockDateFacetRequest()};
      expect('df' in manager.state.parameters).toBe(false);
    });
  });

  describe('#state.parameters.sortCriteria', () => {
    it('when the parameter does not equal the default value, it is included', () => {
      engine.state.sortCriteria = 'qre';
      expect(manager.state.parameters.sortCriteria).toBe('qre');
    });

    it('when the parameter is equal to the default value, it is not included', () => {
      expect('sortCriteria' in manager.state.parameters).toBe(false);
    });

    it('when the parameter is undefined, it is not included', () => {
      engine.state.sortCriteria = undefined as never;
      expect('sortCriteria' in manager.state.parameters).toBe(false);
    });
  });

  describe('#state.parameters.debug', () => {
    it('when the parameter does not equal the default value, it is included', () => {
      engine.state.debug = true;
      expect(manager.state.parameters.debug).toBe(true);
    });

    it('when the parameter is equal to the default value, it is not included', () => {
      expect('debug' in manager.state.parameters).toBe(false);
    });

    it('when the parameter is undefined, it is not included', () => {
      engine.state.debug = undefined as never;
      expect('debug' in manager.state.parameters).toBe(false);
    });
  });

  it(`given a certain initial state,
  it is possible to access every relevant search parameter using #state.parameters`, () => {
    const facetValues = [buildMockFacetValueRequest({state: 'selected'})];
    engine.state.facetSet = {
      author: buildMockFacetRequest({currentValues: facetValues}),
    };

    const request = buildMockCategoryFacetRequest({
      currentValues: [buildMockCategoryFacetValueRequest({state: 'selected'})],
    });
    engine.state.categoryFacetSet = {
      author: buildMockCategoryFacetSlice({request}),
    };

    const numericRanges = [buildMockNumericFacetValue({state: 'selected'})];
    engine.state.numericFacetSet = {
      size: buildMockNumericFacetRequest({currentValues: numericRanges}),
    };

    const dateRanges = [buildMockDateFacetValue({state: 'selected'})];
    engine.state.dateFacetSet = {
      created: buildMockDateFacetRequest({currentValues: dateRanges}),
    };

    const staticFilterValues = [
      buildMockStaticFilterValue({state: 'selected'}),
    ];
    engine.state.staticFilterSet = {
      a: buildMockStaticFilterSlice({id: 'a', values: staticFilterValues}),
    };

    const tab = buildMockTabSlice({id: 'a', isActive: true});
    engine.state.tabSet = {a: tab};

    engine.state.query.q = 'a';
    engine.state.query.enableQuerySyntax = true;
    engine.state.advancedSearchQueries.aq = 'someAq';
    engine.state.advancedSearchQueries.defaultFilters.aq = 'anotherAq';
    engine.state.advancedSearchQueries.cq = 'someCq';
    engine.state.advancedSearchQueries.defaultFilters.cq = 'anotherCq';
    engine.state.advancedSearchQueries.lq = 'someLq';
    engine.state.advancedSearchQueries.defaultFilters.lq = 'anotherLq';
    engine.state.pagination.firstResult = 1;
    engine.state.pagination.numberOfResults = 1;
    engine.state.sortCriteria = 'qre';
    engine.state.debug = true;

    const stateParams = manager.state.parameters;
    const allKeys = Object.keys(buildMockSearchParameters());
    const unavailableKeys = allKeys.filter((key) => !(key in stateParams));

    expect(unavailableKeys).toEqual([]);
  });

  describe('#synchronize', () => {
    it('given partial search parameters, it dispatches #restoreSearchParameters with non-specified parameters set to their initial values', () => {
      const params = {q: 'a'};
      manager.synchronize(params);

      const initialParameters = initialSearchParameterSelector(engine.state);
      const action = restoreSearchParameters({
        ...initialParameters,
        ...params,
      });

      expect(engine.actions).toContainEqual(action);
    });

    it('executes a search', () => {
      manager.synchronize({q: 'a'});
      expect(engine.findAsyncAction(executeSearch.pending)).toBeTruthy();
    });

    it(`when only the order of facet values changes,
    calling #synchronize does not execute a search`, () => {
      const value1 = 'Kafka';
      const value2 = 'Cervantes';

      const facetValue1 = buildMockFacetValueRequest({
        value: value1,
        state: 'selected',
      });
      const facetValue2 = buildMockFacetValueRequest({
        value: value2,
        state: 'selected',
      });

      engine.state.facetSet = {
        author: buildMockFacetRequest({
          currentValues: [facetValue1, facetValue2],
        }),
      };

      manager.synchronize({f: {author: [value2, value1]}});

      expect(engine.findAsyncAction(executeSearch.pending)).toBeFalsy();
    });
  });
});
