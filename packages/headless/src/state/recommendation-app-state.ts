import {
  AdvancedSearchQueriesSection,
  ConfigurationSection,
  ContextSection,
  FieldsSection,
  PipelineSection,
  RecommendationSection,
  SearchHubSection,
  SearchSection,
} from './state-sections';

export type RecommendationAppState = ConfigurationSection &
  SearchSection &
  FieldsSection &
  AdvancedSearchQueriesSection &
  ContextSection &
  PipelineSection &
  SearchHubSection &
  RecommendationSection;
