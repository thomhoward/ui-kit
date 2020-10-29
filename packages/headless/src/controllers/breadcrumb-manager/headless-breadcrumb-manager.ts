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
import {executeToggleNumericFacetSelect} from '../../features/facets/range-facets/numeric-facet-set/numeric-facet-actions';
import {executeToggleDateFacetSelect} from '../../features/facets/range-facets/date-facet-set/date-facet-actions';
import {
  CategoryFacetSection,
  ConfigurationSection,
  DateFacetSection,
  FacetSection,
  NumericFacetSection,
  SearchSection,
} from '../../state/state-sections';
import {executeToggleFacetSelect} from '../../features/facets/facet-set/facet-set-actions';
import {executeDeselectAllCategoryFacetValues} from '../../features/facets/category-facet-set/category-facet-set-actions';
import {BaseFacetRequest} from '../../features/facets/facet-api/request';

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

  function getBreadcrumbsFor<T extends BaseFacetValue>(
    facetSet: Record<string, BaseFacetRequest>,
    deselect: (facetId: string, selection: T) => void,
    selector: (facetId: string) => T[]
  ) {
    const breadcrumbs: GenericBreadcrumb<T>[] = [];

    Object.keys(facetSet).forEach((facetId) => {
      const selectedValues = selector(facetId);
      selectedValues.forEach((selection) => {
        breadcrumbs.push({
          value: selection,
          deselect: () => {
            deselect(facetId, selection);
          },
        });
      });
    });

    return breadcrumbs;
  }

  function getFacetBreadcrumbs() {
    const deselect = (facetId: string, selection: FacetValue) => {
      dispatch(executeToggleFacetSelect({facetId, selection}));
    };
    const selector = (facetId: string) =>
      facetResponseSelectedValuesSelector(engine.state, facetId);
    return getBreadcrumbsFor<FacetValue>(
      engine.state.facetSet,
      deselect,
      selector
    );
  }

  function getNumericFacetBreadcrumbs() {
    const deselect = (facetId: string, selection: NumericFacetValue) => {
      dispatch(executeToggleNumericFacetSelect({facetId, selection}));
    };
    const selector = (facetId: string) =>
      numericFacetSelectedValuesSelector(engine.state, facetId);
    return getBreadcrumbsFor<NumericFacetValue>(
      engine.state.facetSet,
      deselect,
      selector
    );
  }

  function getDateFacetBreadcrumbs() {
    const deselect = (facetId: string, selection: DateFacetValue) => {
      dispatch(executeToggleDateFacetSelect({facetId, selection}));
    };
    const selector = (facetId: string) =>
      dateFacetSelectedValuesSelector(engine.state, facetId);
    return getBreadcrumbsFor<DateFacetValue>(
      engine.state.facetSet,
      deselect,
      selector
    );
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
        deselect: () => {
          dispatch(
            executeDeselectAllCategoryFacetValues({
              facetId,
              numberOfValues: 5,
            })
          );
        },
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
