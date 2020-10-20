import {AnyFacetRequest} from '../../features/facets/generic/interfaces/generic-facet-request';

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
