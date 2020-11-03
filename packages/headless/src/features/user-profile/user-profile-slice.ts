import {createReducer} from '@reduxjs/toolkit';
import {executeGetUserActions} from './user-profile-actions';
import {getUserProfileInitialState} from './user-profile-state';

export const userProfileReducer = createReducer(
  getUserProfileInitialState(),
  (builder) => {
    builder.addCase(executeGetUserActions.rejected, (state, action) => {
      state.error = action.payload ? action.payload : null;
      state.isLoading = false;
    });
    builder.addCase(executeGetUserActions.fulfilled, (state, action) => {
      state.error = null;
      state.userActions = action.payload.userActions;
      state.duration = action.payload.duration;
      state.isLoading = false;
    });
    builder.addCase(executeGetUserActions.pending, (state) => {
      state.isLoading = true;
    });
  }
);
