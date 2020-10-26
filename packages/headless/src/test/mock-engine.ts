import {Engine} from '../app/headless-engine';
import {createMockState} from './mock-state';
import configureStore, {MockStoreEnhanced} from 'redux-mock-store';
import {AnyAction, ThunkDispatch, getDefaultMiddleware} from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import {analyticsMiddleware} from '../app/analytics-middleware';
import {SearchAPIClient} from '../api/search/search-api-client';
import {SearchAppState} from '../state/search-app-state';
import {RecommendationAppState} from '../state/recommendation-app-state';
import {createMockRecommendationState} from './mock-recommendation-state';

export type AllStateShape = SearchAppState | RecommendationAppState;

export interface MockEngine<T extends AllStateShape> extends Engine<T> {
  store: MockStore;
  actions: AnyAction[];
}

type MockStore = MockStoreEnhanced<AllStateShape, DispatchExts>;
type DispatchExts = ThunkDispatch<AllStateShape, void, AnyAction>;

const mockRenewAccessToken = async () => '';

export function buildMockSearchAppEngine(
  config: Partial<Engine<SearchAppState>> = {}
): MockEngine<SearchAppState> {
  return buildMockEngine(config, createMockState);
}

export function buildMockRecommendationAppEngine(
  config: Partial<Engine<RecommendationAppState>> = {}
): MockEngine<RecommendationAppState> {
  return buildMockEngine(config, createMockRecommendationState);
}

function buildMockEngine<T extends AllStateShape>(
  config: Partial<Engine<T>> = {},
  mockState: () => T
): MockEngine<T> {
  const storeConfiguration = configureMockStore();
  const store = storeConfiguration(config.state || mockState());
  const unsubscribe = () => {};

  return {
    store: store,
    state: mockState(),
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

const configureMockStore = () => {
  return configureStore<AllStateShape, DispatchExts>([
    analyticsMiddleware,
    thunk.withExtraArgument({
      searchAPIClient: new SearchAPIClient(mockRenewAccessToken),
    }),
    ...getDefaultMiddleware(),
  ]);
};
