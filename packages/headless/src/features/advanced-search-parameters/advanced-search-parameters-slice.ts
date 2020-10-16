import {createReducer} from '@reduxjs/toolkit';
import {change} from '../history/history-actions';
import {
  updateAdvancedQuery,
  updateConstantQuery,
} from './advanced-search-parameters-actions';
import {AdvancedSearchParametersState} from '../../state';

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
