import {createMockState} from '../../test';
import {buildMockTabSlice} from '../../test/mock-tab-state';
import {buildSearchAndFoldingLoadCollectionRequest} from './search-and-folding-request';

describe('buildSearchAndFoldingLoadCollectionRequest', () => {
  describe('#aq', () => {
    it(`when there is an aq in state,
    the expression is included in the request`, () => {
      const state = createMockState();
      state.advancedSearchQueries.aq = 'a';

      const request = buildSearchAndFoldingLoadCollectionRequest(state);
      expect(request.aq).toBe('a');
    });

    it(`when the aq is an empty string,
    the aq is not included in the request`, () => {
      const state = createMockState();
      state.advancedSearchQueries.aq = '';

      const request = buildSearchAndFoldingLoadCollectionRequest(state);
      expect(request.aq).toBe(undefined);
    });
  });

  describe('#cq', () => {
    it(`when there is a cq in state,
    the expression is included in the request`, () => {
      const state = createMockState();
      state.advancedSearchQueries.cq = 'a';

      const request = buildSearchAndFoldingLoadCollectionRequest(state);
      expect(request.cq).toBe('a');
    });

    it(`when there is an active tab,
    the tab expression is not included in the cq`, () => {
      const state = createMockState();
      state.tabSet = {a: buildMockTabSlice({expression: 'a', isActive: true})};

      const request = buildSearchAndFoldingLoadCollectionRequest(state);
      expect(request.cq).toBe(undefined);
    });
  });

  describe('#lq', () => {
    it(`when there is an lq in state,
    the expression is included in the request`, () => {
      const state = createMockState();
      state.advancedSearchQueries.lq = 'a';

      const request = buildSearchAndFoldingLoadCollectionRequest(state);
      expect(request.lq).toBe('a');
    });

    it(`when the lq is an empty string,
    the lq is not included in the request`, () => {
      const state = createMockState();
      state.advancedSearchQueries.lq = '';

      const request = buildSearchAndFoldingLoadCollectionRequest(state);
      expect(request.lq).toBe(undefined);
    });
  });
});
