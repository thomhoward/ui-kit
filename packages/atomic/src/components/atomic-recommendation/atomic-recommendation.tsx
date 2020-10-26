import {Component, State, h} from '@stencil/core';
import {
  RecommendationState,
  recommendationAppReducer,
  RecommendationAppState,
  HeadlessEngine,
  Engine,
  buildRecommendation,
  Recommendation,
  Unsubscribe,
} from '@coveo/headless';

@Component({
  tag: 'atomic-recommendation',
  styleUrl: 'atomic-recommendation.css',
  shadow: true,
})
export class AtomicRecommendation {
  @State() state!: RecommendationState;

  private engine!: Engine<RecommendationAppState>;
  private recommendation!: Recommendation;
  private unsubscribe: Unsubscribe = () => {};

  componentWillLoad() {
    this.engine = new HeadlessEngine({
      configuration: HeadlessEngine.getSampleConfiguration(),
      reducers: recommendationAppReducer,
    });
    this.recommendation = buildRecommendation(this.engine);
    this.unsubscribe = this.recommendation.subscribe(() => this.updateState());
    this.recommendation.getRecommendations();
  }

  private updateState() {
    this.state = this.recommendation.state;
  }

  public disconnectedCallback() {
    this.unsubscribe();
  }

  public render() {
    return (
      <div>
        RECOMMENDED:
        <ul>
          {this.state.recommendations.map((r) => (
            <li>{r.title}</li>
          ))}
        </ul>
      </div>
    );
  }
}
