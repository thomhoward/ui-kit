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
        state.cq = action.payload.cq;
        state.aq = action.payload.aq;
      })
      .addCase(
        change.fulfilled,
        (_, action) => action.payload.advancedSearchQueries
      );
  }
);
