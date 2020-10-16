import {createReducer} from '@reduxjs/toolkit';
import {
  registerConstantQuery,
  updateConstantQuery,
} from './constant-query-actions';
import {change} from '../history/history-actions';

export interface ConstantQueryState {
  /**
   * The cq filter (e.g., `((q AND aq) OR dq) AND cq).
   */
  cq: string;
  /**
   * Represents whether the query has been updated once yet.
   */
  isInitialized: boolean;
}

export const getInitialConstantQueryState: () => ConstantQueryState = () => ({
  cq: '',
  isInitialized: false,
});

export const constantQueryReducer = createReducer(
  getInitialConstantQueryState(),
  (builder) => {
    builder
      .addCase(registerConstantQuery, (state, action) => {
        const cq = action.payload;
        if (!state.isInitialized) {
          state.cq = cq;
          state.isInitialized = true;
        }
      })
      .addCase(updateConstantQuery, (state, action) => {
        state.cq = action.payload;
      })
      .addCase(change.fulfilled, (_, action) => action.payload.constantQuery);
  }
);
