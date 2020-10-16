import {
  ConfigurationSection,
  AdvancedSearchParameterSection,
  ContextSection,
  FieldsSection,
  PipelineSection,
  SearchHubSection,
  SearchSection,
} from './state-sections';

export type RecommendationAppState = AdvancedSearchParameterSection &
  ContextSection &
  PipelineSection &
  SearchHubSection &
  ConfigurationSection &
  SearchSection &
  FieldsSection;
