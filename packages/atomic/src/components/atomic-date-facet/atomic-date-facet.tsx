import {Component, Prop, State, h} from '@stencil/core';
import {
  DateFacet,
  buildDateFacet,
  DateFacetState,
  DateFacetOptions,
  DateFacetValue,
  RangeFacetSortCriterion,
  Unsubscribe,
} from '@coveo/headless';
import {headlessEngine} from '../../engine';

@Component({
  tag: 'atomic-date-facet',
  styleUrl: 'atomic-date-facet.css',
  shadow: true,
})
export class AtomicDateFacet {
  @Prop() field = '';
  @Prop() label = 'No label';
  @State() state!: DateFacetState;

  private facet: DateFacet;
  private unsubscribe: Unsubscribe;

  constructor() {
    const options: DateFacetOptions = {
      field: this.field,
      generateAutomaticRanges: true,
    };

    this.facet = buildDateFacet(headlessEngine, {options});
    this.unsubscribe = this.facet.subscribe(() => this.updateState());
  }

  public disconnectedCallback() {
    this.unsubscribe();
  }

  private updateState() {
    this.state = this.facet.state;
  }

  private get values() {
    return this.state.values.map((listItem) => this.buildListItem(listItem));
  }

  private buildListItem(item: DateFacetValue) {
    const isSelected = this.facet.isValueSelected(item);

    return (
      <div onClick={() => this.facet.toggleSelect(item)}>
        <input type="checkbox" checked={isSelected}></input>
        <span>
          {item.start}-{item.end} {item.numberOfResults}
        </span>
      </div>
    );
  }

  private get resetButton() {
    return this.state.hasActiveValues ? (
      <button onClick={() => this.facet.deselectAll()}>X</button>
    ) : null;
  }

  private get sortSelector() {
    return (
      <select name="facetSort" onChange={(val) => this.onFacetSortChange(val)}>
        {this.sortOptions}
      </select>
    );
  }

  private get sortOptions() {
    const criteria: RangeFacetSortCriterion[] = ['ascending', 'descending'];

    return criteria.map((criterion) => (
      <option value={criterion} selected={this.facet.isSortedBy(criterion)}>
        {criterion}
      </option>
    ));
  }

  private onFacetSortChange(e: Event) {
    const select = e.composedPath()[0] as HTMLSelectElement;
    const criterion = select.value as RangeFacetSortCriterion;

    this.facet.sortBy(criterion);
  }

  render() {
    return (
      <div>
        <div>
          <span>{this.label}</span>
          {this.sortSelector}
          {this.resetButton}
        </div>
        <div>{this.values}</div>
      </div>
    );
  }
}
