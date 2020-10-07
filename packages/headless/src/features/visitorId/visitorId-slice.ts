import {createReducer} from '@reduxjs/toolkit';
import {updateVisitorId} from './visitorId-actions';

export type VisitorId = string;

export const getInitialVisitorIdState: () => VisitorId = () => '';

export const visitorIdReducer = createReducer(
  getInitialVisitorIdState(),
  (builder) => {
    builder.addCase(updateVisitorId, (_, action) => action.payload);
  }
);
