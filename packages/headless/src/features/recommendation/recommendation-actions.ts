import {createAction} from '@reduxjs/toolkit';

export const setRecommendation = createAction<string>('recommendation/set');
