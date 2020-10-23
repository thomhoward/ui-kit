import {Engine} from '../../app/headless-engine';
import {
  getRecommendations,
  setRecommendation,
} from '../../features/recommendation/recommendation-actions';
import {
  ConfigurationSection,
  RecommendationSection,
} from '../../state/state-sections';
import {buildController} from '../controller/headless-controller';

/**
 * `Recommendation` controller allows to retrieve information about the current recommendations by the search API, if any.
 */
export type Recommendation = ReturnType<typeof buildRecommendation>;
export type RecommendationState = Recommendation['state'];

export const buildRecommendation = (
  engine: Engine<RecommendationSection & ConfigurationSection>
) => {
  const controller = buildController(engine);
  const {dispatch} = engine;
  return {
    ...controller,

    fetchRecommendations() {
      dispatch(getRecommendations());
    },

    setRecommendationId(id: string) {
      dispatch(setRecommendation({id}));
    },

    get state() {
      const state = engine.state;

      return {
        recommendations: state.recommendation.recommendations,
        error: state.recommendation.error,
        isLoading: state.recommendation.isLoading,
      };
    },
  };
};
