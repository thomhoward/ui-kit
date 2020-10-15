import {createReducer} from '@reduxjs/toolkit';
import {change} from '../history/history-actions';
import {setRecommendation} from './recommendation-actions';

export const getRecommendationInitialState: () => string = () => '';

export const recommendationReducer = createReducer(
  getRecommendationInitialState(),
  (builder) => {
    builder
      .addCase(setRecommendation, (_, action) => action.payload)
      .addCase(change.fulfilled, (_, action) => action.payload.pipeline);
  }
);
