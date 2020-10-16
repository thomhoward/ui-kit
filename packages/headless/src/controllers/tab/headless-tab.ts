import {Engine} from '../../app/headless-engine';
import {buildController} from '../controller/headless-controller';
import {executeSearch} from '../../features/search/search-actions';
import {logInterfaceChange} from '../../features/analytics/analytics-actions';
import {updateConstantQuery} from '../../features/advanced-search-parameters/advanced-search-parameters-actions';

type TabOptions = {
  expression: string;
};

export interface TabProps {
  options: TabOptions;
  initialState?: Partial<TabInitialState>;
}

export interface TabInitialState {
  isActive: boolean;
}

export type Tab = ReturnType<typeof buildTab>;
export type TabState = Tab['state'];

export function buildTab(engine: Engine, props: TabProps) {
  const controller = buildController(engine);
  const {dispatch} = engine;

  return {
    ...controller,
    /**
     * Makes this tab the active one
     */
    select() {
      dispatch(updateConstantQuery(props.options.expression));
      dispatch(executeSearch(logInterfaceChange()));
    },

    get state() {
      const isActive =
        engine.state.advancedSearchParameters.cq === props.options.expression;
      return {isActive};
    },
  };
}
