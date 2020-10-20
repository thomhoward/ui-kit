import {SearchAppState} from '../../state/search-app-state';
import {HttpMethods, HTTPContentTypes} from '../platform-client';
import {BaseRequest} from './search-api-request';

/**
 * The unique identifier of the target Coveo Cloud organization.
 */
export const getOrganizationIdQueryParam = (req: BaseRequest) =>
  `organizationId=${req.organizationId}`;

export const getQParam = (state: SearchAppState) => ({
  /**
   * The basic query expression filter applied to the state.
   */
  q: state.query.q,
});

export const baseSearchParams = (
  req: BaseRequest,
  method: HttpMethods,
  contentType: HTTPContentTypes,
  path: string
) => ({
  accessToken: req.accessToken,
  method,
  contentType,
  url: `${req.url}${path}?${getOrganizationIdQueryParam(req)}`,
});
