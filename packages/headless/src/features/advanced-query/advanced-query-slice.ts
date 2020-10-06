import {AdvancedQueryState} from '../../state';
import {createReducer} from '@reduxjs/toolkit';
import {updateAdvancedQuery} from './advanced-query-actions';

export const getInitialAdvancedQueryState: () => AdvancedQueryState = () => ({
  aq: '',
});

export const advancedQueryReducer = createReducer(
  getInitialAdvancedQueryState(),
  (builder) => {
    builder.addCase(updateAdvancedQuery, (state, action) => {
      state.aq = action.payload;
    });
  }
);
