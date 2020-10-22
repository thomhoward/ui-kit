import {buildController, Engine} from '../..';
import {facetResponseSelectedValuesSelector} from '../../features/facets/facet-set/facet-set-selectors';
import {categoryFacetSelectedValuesSelector} from '../../features/facets/category-facet-set/category-facet-set-selectors';


export type BreadCrumbManager = ReturnType<typeof buildBreadcrumbManager>;
export const buildBreadcrumbManager = (engine: Engine) => {
  const controller = buildController(engine);

  function getBreadcrumbs() {
    const breadcrumbs: Breadcrumb[] = []

    Object.keys(engine.state.facetSet).forEach(facetId => {
      const selectedValues = facetResponseSelectedValuesSelector(engine.state, facetId);
      breadcrumbs.push({
        facetId,
        values: selectedValues.map(value => ({
          value: value.value,
          deselect: () => {}
        }))
      });
    });

    Object.keys(engine.state.facetSet).forEach(facetId => {
      const selectedValues = categoryFacetSelectedValuesSelector(engine.state, facetId);
      breadcrumbs.push({
        facetId,
        values: selectedValues.map(value => ({
          value: value.value,
          deselect: () => {}
        }))
      });
    });


    return breadcrumbs;
  }

  return {
    ...controller,

    get state() {
      return getBreadcrumbs();
    },
  };
};

type Breadcrumb = {
  facetId: string;
  values: BreadcrumbValue[];
};

type BreadcrumbValue = {
  value: string;
  deselect: () => void;
}
