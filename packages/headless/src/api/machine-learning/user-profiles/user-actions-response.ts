/* eslint-disable @typescript-eslint/no-explicit-any */
import {MLAPIErrorWithStatusCode} from '../ml-api-client-error-response';

export interface UserActionsResponseSuccess {
  value: {
    name: string;
    time: string;
    value: string;
  }[];
  debug: any;
  internalExecutionLog: any;
  executionTime: number;
}

export type UserActions = UserActionsResponseSuccess | MLAPIErrorWithStatusCode;
