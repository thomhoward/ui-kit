import {PlatformClient, PlatformResponse} from '../platform-client';
import {UserActionsRequest} from './user-profiles/user-actions-request';
import {
  UserActions,
  UserActionsResponseSuccess,
} from './user-profiles/user-actions-response';
import {MLAPIErrorWithStatusCode} from './ml-api-client-error-response';
import {UserActionsAppState} from '../../state/user-actions-app-state';
import {BaseParam, baseMLRequest} from './ml-api-params';
import {SearchAPIClient} from '../search/search-api-client';

export type AllMLAPIResponse = UserActions;

export interface AsyncThunkMLRequestOptions<
  T extends Partial<UserActionsAppState>
> {
  state: T;
  rejectValue: MLAPIErrorWithStatusCode;
  extra: {
    mlAPIClient: MLAPIClient;
    searchAPIClient: SearchAPIClient;
  };
}

export interface MLAPIClientOptions<RequestParams> {
  accessToken: string;
  apiBaseUrl: string;
  requestParams: RequestParams;
}

export type MLAPIClientResponse<T> =
  | {success: T}
  | {error: MLAPIErrorWithStatusCode};

export class MLAPIClient {
  constructor(private renewAccessToken: () => Promise<string>) {}

  async userActions(
    req: UserActionsRequest
  ): Promise<MLAPIClientResponse<UserActionsResponseSuccess>> {
    const platformResponse = await PlatformClient.call<
      UserActionsRequest,
      UserActions
    >({
      ...baseMLRequest(req, 'POST', 'application/json', '/user/actions'),
      requestParams: pickNonBaseParams(req),
      renewAccessToken: this.renewAccessToken,
    });

    if (isSuccessUserActionsResponse(platformResponse)) {
      return {
        success: platformResponse.body,
      };
    }

    return {
      error: unwrapError(platformResponse),
    };
  }
}

const unwrapError = (res: PlatformResponse<AllMLAPIResponse>) => {
  if (isError(res)) {
    return unwrapByStatusCode(res);
  }

  return {message: 'unknown', statusCode: 0, type: 'unknown'};
};

const unwrapByStatusCode = (
  res: PlatformResponse<MLAPIErrorWithStatusCode>
) => ({
  message: res.body.message,
  statusCode: res.body.statusCode,
  type: res.body.type,
});

export const isSuccessResponse = <T>(
  r: MLAPIClientResponse<T>
): r is {success: T} => {
  return (r as {success: T}).success !== undefined;
};

function isSuccessUserActionsResponse(
  r: PlatformResponse<UserActions>
): r is PlatformResponse<UserActionsResponseSuccess> {
  return (
    (r as PlatformResponse<UserActionsResponseSuccess>).body.value !== undefined
  );
}

export const isErrorResponse = <T>(
  r: MLAPIClientResponse<T>
): r is {error: MLAPIErrorWithStatusCode} => {
  return (r as {error: MLAPIErrorWithStatusCode}).error !== undefined;
};

function isError(
  r: PlatformResponse<AllMLAPIResponse>
): r is PlatformResponse<MLAPIErrorWithStatusCode> {
  return (
    (r as PlatformResponse<MLAPIErrorWithStatusCode>).body.statusCode !==
    undefined
  );
}

function pickNonBaseParams<Params extends BaseParam>(req: Params) {
  // cheap version of _.omit
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {url, accessToken, organizationId, ...nonBase} = req;
  return nonBase;
}
