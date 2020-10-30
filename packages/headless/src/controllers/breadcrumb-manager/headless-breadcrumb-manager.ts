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
import {AsyncThunk} from '@reduxjs/toolkit';
import {AsyncThunkSearchOptions} from '../../api/search/search-api-client';

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

  function getBreadcrumbs<T extends BaseFacetValue>(
    facetSet: Record<string, BaseFacetRequest>,
    executeToggleSelect: AsyncThunk<
      void,
      {facetId: string; selection: T},
      AsyncThunkSearchOptions<ConfigurationSection>
    >,
    facetValuesSelector:
      | ((state: SearchSection & FacetSection, facetId: string) => T[])
      | ((state: SearchSection & NumericFacetSection, facetId: string) => T[])
      | ((state: SearchSection & DateFacetSection, facetId: string) => T[])
  ) {
    const breadcrumbs: GenericBreadcrumb<T>[] = [];

    Object.keys(facetSet).forEach((facetId) => {
      const selectedValues = facetValuesSelector(engine.state, facetId);
      selectedValues.forEach((selection) => {
        breadcrumbs.push({
          value: selection,
          deselect: () => dispatch(executeToggleSelect({facetId, selection})),
        });
      });
    });

    return breadcrumbs;
  }

  function getFacetBreadcrumbs() {
    return getBreadcrumbs<FacetValue>(
      engine.state.facetSet,
      executeToggleFacetSelect,
      facetResponseSelectedValuesSelector
    );
  }

  function getNumericFacetBreadcrumbs() {
    return getBreadcrumbs<NumericFacetValue>(
      engine.state.numericFacetSet,
      executeToggleNumericFacetSelect,
      numericFacetSelectedValuesSelector
    );
  }

  function getDateFacetBreadcrumbs() {
    return getBreadcrumbs<DateFacetValue>(
      engine.state.dateFacetSet,
      executeToggleDateFacetSelect,
      dateFacetSelectedValuesSelector
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
