import {AnyFacetRequest} from '../../features/facets/generic/interfaces/generic-facet-request';
import {HTTPContentTypes, HttpMethods} from '../platform-client';

export interface BaseRequest {
  url: string;
  accessToken: string;
  organizationId: string;
}

export interface ContextRequest {
  context?: Record<string, string | string[]>;
}

export interface QueryRequest {
  q?: string;
}

export interface PipelineRequest {
  pipeline?: string;
}

export interface SearchHubRequest {
  searchHub?: string;
}

export interface AdvancedQueryRequest {
  aq?: string;
}

export interface ConstantQueryRequest {
  cq?: string;
}

export interface NumberOfResultsRequest {
  numberOfResults?: number;
}

export interface SortCriteriaRequest {
  sortCriteria?: string;
}

export interface FirstResultRequest {
  firstResult?: number;
}

export interface FacetsRequest {
  facets?: AnyFacetRequest[];
}

export interface EnableDidYouMeanRequest {
  enableDidYouMean?: boolean;
}

export interface FieldsToIncludeRequest {
  fieldsToInclude?: string[];
}

export interface VisitorIDRequest {
  visitorId?: string;
}

export const baseSearchRequest = (
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

export const getOrganizationIdQueryParam = (req: BaseRequest) =>
  `organizationId=${req.organizationId}`;
