import {StateWithHistory} from '../app/undoable';
import {
  CategoryFacetSearchSection,
  CategoryFacetSection,
  ConfigurationSection,
  AdvancedSearchParameterSection,
  ContextSection,
  DateFacetSection,
  DidYouMeanSection,
  FacetSearchSection,
  FacetSection,
  FieldsSection,
  NumericFacetSection,
  PaginationSection,
  PipelineSection,
  QuerySetSection,
  QuerySuggestionSection,
  RedirectionSection,
  SearchHubSection,
  SearchSection,
  SortSection,
  QuerySection,
} from './state-sections';

export type SearchParametersState = FacetSection &
  DateFacetSection &
  NumericFacetSection &
  CategoryFacetSection &
  QuerySection &
  AdvancedSearchParameterSection &
  PaginationSection &
  SortSection &
  ContextSection &
  QuerySetSection &
  PipelineSection &
  SearchHubSection;

export type SearchAppState = SearchParametersState &
  ConfigurationSection &
  FacetSearchSection &
  CategoryFacetSearchSection &
  RedirectionSection &
  QuerySuggestionSection &
  SearchSection &
  DidYouMeanSection &
  FieldsSection & {history: StateWithHistory<SearchParametersState>};
