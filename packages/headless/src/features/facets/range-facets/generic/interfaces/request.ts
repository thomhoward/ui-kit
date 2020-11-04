import {
  BaseFacetRequest,
  SortCriteria,
  BaseFacetValueRequest,
} from '../../../facet-api/request';

export type RangeFacetSortCriterion = 'ascending' | 'descending';

export interface AutomaticRanges {
  generateAutomaticRanges: boolean;
}

export interface RangeRequest<T extends string | number>
  extends BaseFacetValueRequest {
  start: T;
  end: T;
  endInclusive: boolean;
}

export interface BaseRangeFacetRequest
  extends BaseFacetRequest,
    AutomaticRanges,
    SortCriteria<RangeFacetSortCriterion> {}
