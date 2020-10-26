import {
  buildMockRecommendationAppEngine,
  MockEngine,
} from '../../test/mock-engine';
import {RecommendationAppState} from '../../state/recommendation-app-state';
import {buildRecommendation, Recommendation} from './headless-recommendation';
import {createMockRecommendationState} from '../../test/mock-recommendation-state';
import {Action} from 'redux';
import {
  getRecommendations,
  setRecommendation,
} from '../../features/recommendation/recommendation-actions';

describe('headless recommendation', () => {
  let state: RecommendationAppState;
  let recommendation: Recommendation;
  let engine: MockEngine<RecommendationAppState>;

  beforeEach(() => {
    state = createMockRecommendationState();
    engine = buildMockRecommendationAppEngine({state});
    recommendation = buildRecommendation(engine);
  });

  const expectContainAction = (action: Action) => {
    const found = engine.actions.find((a) => a.type === action.type);
    expect(engine.actions).toContainEqual(found);
  };

  it('setRecommendationId dispatches #setRecommendationId', () => {
    recommendation.setRecommendationId('bar');
    expectContainAction(setRecommendation);
  });

  it('getRecommendations dispatches #getRecommendations', () => {
    recommendation.getRecommendations();
    expectContainAction(getRecommendations.pending);
  });
});
