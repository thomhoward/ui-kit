import {HTTPContentTypes, HttpMethods} from '../platform-client';

export interface ObjectIdParam {
  objectId?: string;
}

export interface BaseParam {
  url: string;
  accessToken: string;
  organizationId: string;
}

export const baseMLRequest = (
  req: BaseParam,
  method: HttpMethods,
  contentType: HTTPContentTypes,
  path: string
) => ({
  accessToken: req.accessToken,
  method,
  contentType,
  url: `${req.url}${path}`,
});
