import {createReducer} from '@reduxjs/toolkit';
import {updateVisitorId} from './visitorId-actions';
import {change} from '../history/history-actions';

export type VisitorId = string;

export const getInitialVisitorIdState: () => VisitorId = () => '';

export const visitorIdReducer = createReducer(
  getInitialVisitorIdState(),
  (builder) => {
    builder
      .addCase(updateVisitorId, (_, action) => action.payload)
      .addCase(change.fulfilled, (_, action) => action.payload.visitorId);
  }
);
