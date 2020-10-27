import {Engine} from '../../app/headless-engine';
import {buildController} from '../controller/headless-controller';
import {BaseFacetValue} from '../../features/facets/facet-api/response';
import {FacetValue} from '../../features/facets/facet-set/interfaces/response';
import {CategoryFacetValue} from '../../features/facets/category-facet-set/interfaces/response';
import {NumericFacetValue} from '../../features/facets/range-facets/numeric-facet-set/interfaces/response';
import {DateFacetValue} from '../../features/facets/range-facets/date-facet-set/interfaces/response';
import {facetResponseSelectedValuesSelector} from '../../features/facets/facet-set/facet-set-selectors';
import {categoryFacetSelectedValuesSelector} from '../../features/facets/category-facet-set/category-facet-set-selectors';
import {numericFacetSelectedValuesSelector} from '../../features/facets/range-facets/numeric-facet-set/numeric-facet-selectors';
import {dateFacetSelectedValuesSelector} from '../../features/facets/range-facets/date-facet-set/date-facet-selectors';
import {toggleFacetSelect} from '../facets/facet/headless-facet-actions';
import {toggleNumericFacetSelect} from '../facets/range-facet/numeric-facet/headless-numeric-facet-actions';
import {toggleDateFacetSelect} from '../facets/range-facet/date-facet/headless-date-facet-actions';
import {
  CategoryFacetSection,
  ConfigurationSection,
  DateFacetSection,
  FacetSection,
  NumericFacetSection,
  SearchSection,
} from '../../state/state-sections';

export type BreadcrumbManager = ReturnType<typeof buildBreadcrumbManager>;
export type BreadcrumbManagerState = BreadcrumbManager['state'];

export const buildBreadcrumbManager = (
  engine: Engine<
    ConfigurationSection &
      SearchSection &
      FacetSection &
      NumericFacetSection &
      DateFacetSection &
      CategoryFacetSection
  >
) => {
  const controller = buildController(engine);
  const {dispatch} = engine;

  function getFacetBreadcrumbs() {
    const breadcrumbs: GenericBreadcrumb<FacetValue>[] = [];

    Object.keys(engine.state.facetSet).forEach((facetId) => {
      const selectedValues = facetResponseSelectedValuesSelector(
        engine.state,
        facetId
      );
      selectedValues.forEach((selection) => {
        breadcrumbs.push({
          value: selection,
          deselect: () => dispatch(toggleFacetSelect({facetId, selection})),
        });
      });
    });

    return breadcrumbs;
  }

  function getCategoryFacetBreadcrumbs() {
    const breadcrumbs: CategoryFacetBreadcrumb[] = [];

    Object.keys(engine.state.categoryFacetSet).forEach((facetId) => {
      const selectedValues = categoryFacetSelectedValuesSelector(
        engine.state,
        facetId
      );
      breadcrumbs.push({
        value: selectedValues[selectedValues.length - 1],
        path: selectedValues,
        deselect: () => {},
      });
    });
    return breadcrumbs;
  }

  function getNumericFacetBreadcrumbs() {
    const breadcrumbs: GenericBreadcrumb<NumericFacetValue>[] = [];

    Object.keys(engine.state.numericFacetSet).forEach((facetId) => {
      const selectedValues = numericFacetSelectedValuesSelector(
        engine.state,
        facetId
      );
      selectedValues.forEach((selection) => {
        breadcrumbs.push({
          value: selection,
          deselect: () =>
            dispatch(toggleNumericFacetSelect({facetId, selection})),
        });
      });
    });

    return breadcrumbs;
  }

  function getDateFacetBreadcrumbs() {
    const breadcrumbs: GenericBreadcrumb<DateFacetValue>[] = [];

    Object.keys(engine.state.dateFacetSet).forEach((facetId) => {
      const selectedValues = dateFacetSelectedValuesSelector(
        engine.state,
        facetId
      );
      selectedValues.forEach((selection) => {
        breadcrumbs.push({
          value: selection,
          deselect: () => dispatch(toggleDateFacetSelect({facetId, selection})),
        });
      });
    });

    return breadcrumbs;
  }

  return {
    ...controller,

    get state() {
      return {
        facetBreadcrumbs: getFacetBreadcrumbs(),
        categoryFacetBreadcrumbs: getCategoryFacetBreadcrumbs(),
        numericFacetBreadcrumbs: getNumericFacetBreadcrumbs(),
        dateFacetBreadcrumbs: getDateFacetBreadcrumbs(),
      };
    },
  };
};

export type GenericBreadcrumb<T extends BaseFacetValue> = {
  value: T;
  deselect: () => void;
};

export interface CategoryFacetBreadcrumb
  extends GenericBreadcrumb<CategoryFacetValue> {
  path: CategoryFacetValue[];
}
