import {
  BaseRequest,
  ContextRequest,
  PipelineRequest,
  QueryRequest,
  SearchHubRequest,
} from '../search-api-request';

export type PlanRequest = BaseRequest &
  SearchHubRequest &
  ContextRequest &
  QueryRequest &
  PipelineRequest;
