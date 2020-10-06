import {
  getInitialAdvancedQueryState,
  advancedQueryReducer,
} from './advanced-query-slice';
import {AdvancedQueryState} from '../../state';
import {updateAdvancedQuery} from './advanced-query-actions';

describe('Advanced query slice', () => {
  const aq = 'mock-aq';
  let state: AdvancedQueryState;

  beforeEach(() => {
    state = getInitialAdvancedQueryState();
  });

  it('#updateAdvancedQuery sets aq to the correct value', () => {
    const action = updateAdvancedQuery(aq);
    state = advancedQueryReducer(state, action);
    expect(state.aq).toBe(aq);
  });
});
