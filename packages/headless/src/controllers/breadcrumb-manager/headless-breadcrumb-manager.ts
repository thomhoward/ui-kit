import {Engine} from '../../app/headless-engine';
import {buildController} from '../controller/headless-controller';
import {facetResponseSelectedValuesSelector} from '../../features/facets/facet-set/facet-set-selectors';
import {categoryFacetSelectedValuesSelector} from '../../features/facets/category-facet-set/category-facet-set-selectors';
import {toggleFacetSelect} from '../facets/facet/headless-facet-actions';
import {numericFacetSelectedValuesSelector} from '../../features/facets/range-facets/numeric-facet-set/numeric-facet-selectors';
import {dateFacetSelectedValuesSelector} from '../../features/facets/range-facets/date-facet-set/date-facet-selectors';
import {toggleNumericFacetSelect} from '../facets/range-facet/numeric-facet/headless-numeric-facet-actions';
import {toggleDateFacetSelect} from '../facets/range-facet/date-facet/headless-date-facet-actions';
import {toggleCategoryFacetSelect} from '../facets/category-facet/headless-category-facet-actions';
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

  function getBreadcrumbs() {
    const breadcrumbs: Breadcrumb[] = [];

    Object.keys(engine.state.facetSet).forEach((facetId) => {
      const selectedValues = facetResponseSelectedValuesSelector(
        engine.state,
        facetId
      );
      selectedValues.map((selection) => {
        breadcrumbs.push({
          value: selection.value,
          deselect: () => dispatch(toggleFacetSelect({facetId, selection})),
        });
      });
    });

    Object.keys(engine.state.categoryFacetSet).forEach((facetId) => {
      const selectedValues = categoryFacetSelectedValuesSelector(
        engine.state,
        facetId
      );
      selectedValues.map((selection) => {
        breadcrumbs.push({
          value: selection.value,
          deselect: () =>
            dispatch(toggleCategoryFacetSelect({facetId, selection})),
        });
      });
    });

    Object.keys(engine.state.numericFacetSet).forEach((facetId) => {
      const selectedValues = numericFacetSelectedValuesSelector(
        engine.state,
        facetId
      );
      selectedValues.map((selection) => {
        breadcrumbs.push({
          value: `${selection.start}-${selection.end}`,
          deselect: () =>
            dispatch(toggleNumericFacetSelect({facetId, selection})),
        });
      });
    });

    Object.keys(engine.state.dateFacetSet).forEach((facetId) => {
      const selectedValues = dateFacetSelectedValuesSelector(
        engine.state,
        facetId
      );
      selectedValues.map((selection) => {
        breadcrumbs.push({
          value: `${selection.start}-${selection.end}`,
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
        breadcrumbs: getBreadcrumbs(),
      };
    },
  };
};

type Breadcrumb = {
  value: string;
  deselect: () => void;
};
