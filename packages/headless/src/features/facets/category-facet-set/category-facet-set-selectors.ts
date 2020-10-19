import {SearchPageState} from '../../../state/search-app-state';

export const categoryFacetRequestSelector = (
  state: SearchPageState,
  id: string
) => {
  return state.categoryFacetSet[id];
};
