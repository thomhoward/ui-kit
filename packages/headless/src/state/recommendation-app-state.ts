import {
  ConfigurationSection,
  AdvancedSearchParameterSection,
  ContextSection,
  FieldsSection,
  PipelineSection,
  BasicSearchParameterSection,
  SearchHubSection,
  SearchSection,
} from './state-sections';

export type RecommendationAppState = BasicSearchParameterSection &
  AdvancedSearchParameterSection &
  ContextSection &
  PipelineSection &
  SearchHubSection &
  ConfigurationSection &
  SearchSection &
  FieldsSection;
