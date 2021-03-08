import {Component} from 'react';
import {
  buildCategoryFacet,
  CategoryFacet as HeadlessCategoryFacet,
  CategoryFacetState,
  CategoryFacetValue,
  Unsubscribe,
} from '@coveo/headless';
import {engine} from '../../engine';
import {CategoryFacetSearch} from './category-facet-search';

interface CategoryFacetProps {
  field: string;
  facetId: string;
}

export class CategoryFacet extends Component<CategoryFacetProps> {
  private controller: HeadlessCategoryFacet;
  public state: CategoryFacetState;
  private unsubscribe: Unsubscribe = () => {};

  constructor(props: CategoryFacetProps) {
    super(props);

    this.controller = buildCategoryFacet(engine, {
      options: {field: props.field, facetId: props.facetId},
    });
    this.state = this.controller.state;
  }

  componentDidMount() {
    this.unsubscribe = this.controller.subscribe(() => this.updateState());
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  private updateState() {
    this.setState(this.controller.state);
  }

  private getUniqueKeyForValue(value: CategoryFacetValue) {
    return value.path.join('>');
  }

  private renderSearch() {
    return (
      <CategoryFacetSearch
        controller={this.controller.facetSearch}
        searchState={this.state.facetSearch}
      />
    );
  }

  private renderClearButton() {
    return (
      <button onClick={() => this.controller.deselectAll()}>
        All categories
      </button>
    );
  }

  private renderParents() {
    return (
      this.state.hasActiveValues && (
        <div>
          Filtering by: {this.renderClearButton()}
          {this.state.parents.map((parentValue, i) => {
            const isSelectedValue = i === this.state.parents.length - 1;

            return (
              <span key={this.getUniqueKeyForValue(parentValue)}>
                &rarr;
                {!isSelectedValue ? (
                  <button
                    onClick={() => this.controller.toggleSelect(parentValue)}
                  >
                    {parentValue.value}
                  </button>
                ) : (
                  <span>{parentValue.value}</span>
                )}
              </span>
            );
          })}
        </div>
      )
    );
  }

  private renderActiveValues() {
    return (
      <ul>
        {this.state.values.map((value) => (
          <li key={this.getUniqueKeyForValue(value)}>
            <button onClick={() => this.controller.toggleSelect(value)}>
              {value.value} ({value.numberOfResults}{' '}
              {value.numberOfResults === 1 ? 'result' : 'results'})
            </button>
          </li>
        ))}
      </ul>
    );
  }

  private renderCanShowMoreLess() {
    return (
      <div>
        {this.state.canShowLessValues && (
          <button onClick={() => this.controller.showLessValues()}>
            Show less
          </button>
        )}
        {this.state.canShowMoreValues && (
          <button onClick={() => this.controller.showMoreValues()}>
            Show more
          </button>
        )}
      </div>
    );
  }

  render() {
    if (!this.state.hasActiveValues && this.state.values.length === 0) {
      return <div>No facet values</div>;
    }

    return (
      <ul>
        <li>{this.renderSearch()}</li>
        <li>
          {this.renderParents()}
          {this.renderActiveValues()}
          {this.renderCanShowMoreLess()}
        </li>
      </ul>
    );
  }
}