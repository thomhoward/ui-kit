import {createReducer} from '@reduxjs/toolkit';
import {change} from '../history/history-actions';
import {
  updateAdvancedQuery,
  updateConstantQuery,
} from './advanced-search-parameters-actions';

export interface AdvancedSearchParametersState {
  /**
   * The cq filter (e.g., `((q AND aq) OR dq) AND cq).
   */
  cq: string;

  /**
   * The aq filter (e.g., `((q AND aq) OR dq) AND cq).
   */
  aq: string;
}

export const getAdvancedSearchParametersInitialState: () => AdvancedSearchParametersState = () => ({
  cq: '',
  aq: '',
});

export const advancedSearchParametersReducer = createReducer(
  getAdvancedSearchParametersInitialState(),
  (builder) => {
    builder
      .addCase(updateAdvancedQuery, (state, action) => {
        state.aq = action.payload;
      })
      .addCase(updateConstantQuery, (state, action) => {
        state.cq = action.payload;
      })
      .addCase(
        change.fulfilled,
        (_, action) => action.payload.advancedSearchParameters
      );
  }
);
