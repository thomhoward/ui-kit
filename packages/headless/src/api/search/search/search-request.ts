import {
  AdvancedQueryRequest,
  BaseRequest,
  ConstantQueryRequest,
  ContextRequest,
  EnableDidYouMeanRequest,
  FacetsRequest,
  FieldsToIncludeRequest,
  FirstResultRequest,
  NumberOfResultsRequest,
  PipelineRequest,
  QueryRequest,
  SearchHubRequest,
  SortCriteriaRequest,
  VisitorIDRequest,
} from '../search-api-request';

export type SearchRequest = BaseRequest &
  QueryRequest &
  AdvancedQueryRequest &
  ConstantQueryRequest &
  NumberOfResultsRequest &
  FirstResultRequest &
  SortCriteriaRequest &
  FacetsRequest &
  ContextRequest &
  EnableDidYouMeanRequest &
  FieldsToIncludeRequest &
  PipelineRequest &
  SearchHubRequest &
  VisitorIDRequest;
