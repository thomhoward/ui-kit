import {ReducersMapObject} from 'redux';
import {advancedSearchParametersReducer} from '../features/advanced-search-parameters/advanced-search-parameters-slice';
import {configurationReducer} from '../features/configuration/configuration-slice';
import {contextReducer} from '../features/context/context-slice';
import {fieldsReducer} from '../features/fields/fields-slice';
import {pipelineReducer} from '../features/pipeline/pipeline-slice';
import {searchHubReducer} from '../features/search-hub/search-hub-slice';
import {searchReducer} from '../features/search/search-slice';
import {RecommendationAppState} from '../state/recommendation-app-state';

/**
 * Map of reducers that make up the RecommendationAppState.
 */
export const recommendationReducers: ReducersMapObject<RecommendationAppState> = {
  configuration: configurationReducer,
  advancedSearchParameters: advancedSearchParametersReducer,
  context: contextReducer,
  fields: fieldsReducer,
  pipeline: pipelineReducer,
  search: searchReducer,
  searchHub: searchHubReducer,
};
