import {SpecificFacetSearchRequest} from './specific-facet-search/specific-facet-search-request';
import {CategoryFacetSearchRequest} from './category-facet-search/category-facet-search-request';
import {BaseRequest} from '../search-api-request';

export type FacetSearchRequest = BaseRequest &
  (SpecificFacetSearchRequest | CategoryFacetSearchRequest);
