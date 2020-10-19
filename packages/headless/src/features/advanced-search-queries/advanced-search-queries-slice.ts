import {createReducer} from '@reduxjs/toolkit';
import {change} from '../history/history-actions';
import {updateAdvancedSearchQueries} from './advanced-search-queries-actions';
import {AdvancedSearchQueriesState} from '../../state';

export const getAdvancedSearchQueriesInitialState: () => AdvancedSearchQueriesState = () => ({
  cq: '',
  aq: '',
});

export const advancedSearchQueriesReducer = createReducer(
  getAdvancedSearchQueriesInitialState(),
  (builder) => {
    builder
      .addCase(updateAdvancedSearchQueries, (state, action) => {
        if (action.payload.aq) {
          state.aq = action.payload.aq;
        }
        if (action.payload.cq) {
          state.cq = action.payload.cq;
        }
      })
      .addCase(
        change.fulfilled,
        (_, action) => action.payload.advancedSearchQueries
      );
  }
);
