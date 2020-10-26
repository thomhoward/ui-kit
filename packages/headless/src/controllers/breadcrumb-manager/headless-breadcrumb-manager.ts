import {Engine} from '../../app/headless-engine';
import {buildController} from '../controller/headless-controller';
import {facetResponseSelectedValuesSelector} from '../../features/facets/facet-set/facet-set-selectors';
import {categoryFacetSelectedValuesSelector} from '../../features/facets/category-facet-set/category-facet-set-selectors';
import {toggleCategoryFacetSelect} from '../facets/category-facet/headless-category-facet-utils';
import {toggleFacetSelect} from '../facets/facet/headless-facet-utils';
import {numericFacetSelectedValuesSelector} from '../../features/facets/range-facets/numeric-facet-set/numeric-facet-selectors';
import {dateFacetSelectedValuesSelector} from '../../features/facets/range-facets/date-facet-set/date-facet-selectors';
import {toggleNumericFacetSelect} from '../facets/range-facet/numeric-facet/headless-numeric-facet-utils';
import {toggleDateFacetSelect} from '../facets/range-facet/date-facet/headless-date-facet-utils';

export type BreadcrumbManager = ReturnType<typeof buildBreadcrumbManager>;
export type BreadcrumbManagerState = BreadcrumbManager['state'];

export const buildBreadcrumbManager = (engine: Engine) => {
  const controller = buildController(engine);

  function getBreadcrumbs() {
    const breadcrumbs: Breadcrumb[] = []

    Object.keys(engine.state.facetSet).forEach(facetId => {
      const selectedValues = facetResponseSelectedValuesSelector(engine.state, facetId);
      selectedValues.map(value => {
        breadcrumbs.push({
          value: value.value,
          deselect: () => toggleFacetSelect(engine, facetId, value)
        });
      });
    });

    Object.keys(engine.state.categoryFacetSet).forEach(facetId => {
      const selectedValues = categoryFacetSelectedValuesSelector(engine.state, facetId);
      selectedValues.map(value => {
        breadcrumbs.push({
          value: value.value,
          deselect: () => toggleCategoryFacetSelect(engine, facetId, value)
        });
      });
    });

    Object.keys(engine.state.numericFacetSet).forEach(facetId => {
      const selectedValues = numericFacetSelectedValuesSelector(engine.state, facetId);
      selectedValues.map(value => {
        breadcrumbs.push({
          value: `${value.start}-${value.end}`,
          deselect: () => toggleNumericFacetSelect(engine, facetId, value)
        });
      });
    });

    Object.keys(engine.state.dateFacetSet).forEach(facetId => {
      const selectedValues = dateFacetSelectedValuesSelector(engine.state, facetId);
      selectedValues.map(value => {
        breadcrumbs.push({
          value: `${value.start}-${value.end}`,
          deselect: () => toggleDateFacetSelect(engine, facetId, value)
        });
      });
    });

    return breadcrumbs;
  }

  return {
    ...controller,

    get state() {
      return {
        breadcrumbs: getBreadcrumbs()
      };
    },
  };
};

type Breadcrumb = {
  value: string;
  deselect: () => void;
};