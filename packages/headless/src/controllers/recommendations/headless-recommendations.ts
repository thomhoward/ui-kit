import {Engine} from '../../app/headless-engine';
import {buildController} from '../controller/headless-controller';
import {Schema, SchemaValues, StringValue} from '@coveo/bueno';
import {setRecommendation} from '../../features/recommendation/recommendation-actions';

export interface RecommendationProps {
  options: RecommendationOptions;
}

const optionsSchema = new Schema({
  /**
   * Specifies the ID of the recommendation controller.
   * This identifier can be used by query pipelines in order to route and associate with a specific recommendation model.
   *
   * Default value is `Recommendation`
   */
  id: new StringValue({
    default: () => 'Recommendation',
    emptyAllowed: false,
  }),
});

export type RecommendationOptions = SchemaValues<typeof optionsSchema>;

/**
 * The Recommendation controler is allows to retrieves recommendations typically based on user history.
 *
 * To get history-based recommendations, you will likely need to include the `pageview` script in your application (see [coveo.analytics.js](https://github.com/coveo/coveo.analytics.js))
 */
export type Recommendation = ReturnType<typeof buildRecommendation>;
/**
 * A scoped and simplified part of the headless state that is relevant to the `Recommendation` controller.
 */
export type Recommendationtate = Recommendation['state'];

export const buildRecommendation = (
  engine: Engine,
  props: Partial<RecommendationProps> = {}
) => {
  const controller = buildController(engine);
  const {dispatch} = engine;
  const options = optionsSchema.validate(props.options) as Required<
    RecommendationOptions
  >;
  dispatch(setRecommendation(options.id));
  return {
    ...controller,

    /**
     * @returns The state of the `Recommendation` controller.
     */
    get state() {
      const state = engine.state;
      return {recommendations: state.search.response.results};
    },
  };
};
