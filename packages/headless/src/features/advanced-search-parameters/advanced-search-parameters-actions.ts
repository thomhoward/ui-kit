import {createAction} from '@reduxjs/toolkit';

/**
 * Sets the aq value.
 * @param aq (string) The new advanced query value (e.g., `@year==2017`).
 */
export const updateAdvancedQuery = createAction<string>(
  'advancedSearchParameters/updatAadvancedQuery'
);

/**
 * Sets the cq value.
 * @param cq (string) The new constant query value (e.g., `@source=="Products"`).
 */
export const updateConstantQuery = createAction<string>(
  'advancedSearchParameters/updateConstantQuery'
);
