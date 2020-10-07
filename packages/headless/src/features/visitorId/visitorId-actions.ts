import {createAction} from '@reduxjs/toolkit';

/**
 * Sets the visitorId value.
 * @param visitorId (string) The new visitor id value (e.g., `@source=="Products"`).
 */
export const updateVisitorId = createAction<string>('visitor/updateVisitorId');
