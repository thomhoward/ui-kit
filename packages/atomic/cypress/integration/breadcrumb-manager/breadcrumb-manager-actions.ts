import {setUpPage} from '../../../utils/setupComponent';

import {FacetSetupOptions} from '../../integration/facets/facet/facet-actions';

export interface NumericFacetOptions {
  field: 'size';
  label: 'File sizes';
}

export interface CategoryFacetOptions {
  field: 'geographicalhierarchy';
  label: 'Atlas';
}

export function setupBreadcrumbManager(
  options: Partial<FacetSetupOptions> = {}
) {
  const setupOptions: FacetSetupOptions = {
    attributes: '',
    executeFirstSearch: true,
    field: facetField,
    label: facetLabel,
    ...options,
  };
  setUpPage(`
  <atomic-breadcrumb-manager ${attributes}></atomic-breadcrumb-manager>
  <atomic-numeric-facet 
    field="${setupOptions.field}" 
    label="${setupOptions.label}"
  >`);
}
