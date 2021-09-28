import {FacetIdConfig} from '../controllers/core/facets/_common/facet-id-generator';

export function buildMockFacetIdConfig(
  config: Partial<FacetIdConfig>
): FacetIdConfig {
  return {
    field: '',
    state: {},
    ...config,
  };
}
