import {AdvancedSearchParametersState} from '../state';

export function buildMockAdvancedSearchParametersState(
  config: Partial<AdvancedSearchParametersState> = {}
): AdvancedSearchParametersState {
  return {
    aq: '',
    cq: '',
    ...config,
  };
}
