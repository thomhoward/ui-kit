import {Engine} from '../app/headless-engine';
import {createMockState, createMockUserActionsState} from './mock-state';
import configureStore, {MockStoreEnhanced} from 'redux-mock-store';
import {AnyAction, ThunkDispatch, getDefaultMiddleware} from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import {analyticsMiddleware} from '../app/analytics-middleware';
import {SearchAPIClient} from '../api/search/search-api-client';
import {SearchAppState} from '../state/search-app-state';
import {MLAPIClient} from '../api/machine-learning/ml-api-client';

export interface MockEngine extends Engine {
  store: MockStore;
  actions: AnyAction[];
}

const mockRenewAccessToken = async () => '';

export function buildMockEngine(config: Partial<Engine> = {}): MockEngine {
  const storeConfiguration = configureMockStore();
  const store = storeConfiguration(config.state || createMockState());
  const unsubscribe = () => {};

  return {
    store: store,
    state: {...createMockState(), ...createMockUserActionsState()},
    subscribe: jest.fn(() => unsubscribe),
    get dispatch() {
      return store.dispatch;
    },
    get actions() {
      return store.getActions();
    },
    ...config,
    renewAccessToken: mockRenewAccessToken,
  };
}

type DispatchExts = ThunkDispatch<SearchAppState, void, AnyAction>;
const configureMockStore = () => {
  return configureStore<SearchAppState, DispatchExts>([
    analyticsMiddleware,
    thunk.withExtraArgument({
      searchAPIClient: new SearchAPIClient(mockRenewAccessToken),
      MLAPIClient: new MLAPIClient(mockRenewAccessToken),
    }),
    ...getDefaultMiddleware(),
  ]);
};
type MockStore = MockStoreEnhanced<SearchAppState, DispatchExts>;
