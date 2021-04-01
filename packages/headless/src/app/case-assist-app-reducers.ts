import {ReducersMapObject} from 'redux';
import {CaseAssistAppState} from '../state/case-assist-app-state';
import {caseAssistReducer} from '../features/case-assist/case-assist-slice';
import {configurationReducer} from '../features/configuration/configuration-slice';

/**
 * The reducers required by the Case Assist app.
 */
export const caseAssistAppReducers: ReducersMapObject<CaseAssistAppState> = {
  configuration: configurationReducer,
  caseAssist: caseAssistReducer,
};
