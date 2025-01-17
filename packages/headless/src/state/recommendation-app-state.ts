import {
  AdvancedSearchQueriesSection,
  ConfigurationSection,
  ContextSection,
  DebugSection,
  DictionaryFieldContextSection,
  FieldsSection,
  PipelineSection,
  RecommendationSection,
  SearchHubSection,
  VersionSection,
} from './state-sections';

export type RecommendationAppState = ConfigurationSection &
  FieldsSection &
  AdvancedSearchQueriesSection &
  ContextSection &
  DictionaryFieldContextSection &
  PipelineSection &
  SearchHubSection &
  DebugSection &
  RecommendationSection &
  VersionSection;
