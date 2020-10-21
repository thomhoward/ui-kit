import {
  BaseRequest,
  ContextRequest,
  PipelineRequest,
  QueryRequest,
  SearchHubRequest,
} from '../search-api-request';

export type QuerySuggestRequest = BaseRequest &
  QueryRequest &
  ContextRequest &
  PipelineRequest &
  SearchHubRequest & {
    count: number;
  };
