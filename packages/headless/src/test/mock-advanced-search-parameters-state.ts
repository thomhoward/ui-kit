import {AdvancedSearchParametersState} from '../features/advanced-search-parameters/advanced-search-parameters-slice';

export function buildMockAdvancedSearchParametersState(
  config: Partial<AdvancedSearchParametersState> = {}
): AdvancedSearchParametersState {
  return {
    aq: '',
    cq: '',
    ...config,
  };
}
