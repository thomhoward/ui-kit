import {
  getAdvancedSearchParametersInitialState,
  advancedSearchParametersReducer,
} from './advanced-search-parameters-slice';
import {AdvancedSearchParametersState} from '../../state';
import {
  updateConstantQuery,
  updateAdvancedQuery,
} from './advanced-search-parameters-actions';
import {getHistoryEmptyState} from '../history/history-slice';
import {change} from '../history/history-actions';

describe('advanced search parameters', () => {
  const cq = 'mock-cq';
  const aq = 'mock-aq';
  let state: AdvancedSearchParametersState;

  beforeEach(() => {
    state = getAdvancedSearchParametersInitialState();
  });

  it('#updateConstantQuery sets cq to the correct value', () => {
    const action = updateConstantQuery(cq);
    state = advancedSearchParametersReducer(state, action);

    expect(state.cq).toEqual(cq);
  });

  it('#updateAdvancedQuery sets aq to the correct value', () => {
    const action = updateAdvancedQuery(aq);
    state = advancedSearchParametersReducer(state, action);

    expect(state.aq).toEqual(aq);
  });

  it('allows a restore query on history change', () => {
    const expectedQuery: AdvancedSearchParametersState = {
      cq: 'hello',
      aq: 'hola',
    };
    const historyChange = {
      ...getHistoryEmptyState(),
      advancedSearchParameters: expectedQuery,
    };

    const nextState = advancedSearchParametersReducer(
      state,
      change.fulfilled(historyChange, '')
    );
    expect(nextState).toEqual(expectedQuery);
  });
});
