import {
  Component,
  h,
  State,
  Prop,
  VNode,
  Element,
  Listen,
  Host,
} from '@stencil/core';
import {
  NumericFacet,
  buildNumericFacet,
  NumericFacetState,
  NumericFacetOptions,
  RangeFacetSortCriterion,
  SearchStatus,
  SearchStatusState,
  buildSearchStatus,
  RangeFacetRangeAlgorithm,
  NumericFacetValue,
  buildNumericRange,
  NumericRangeRequest,
} from '@coveo/headless';
import {
  Bindings,
  BindStateToController,
  InitializableComponent,
  InitializeBindings,
} from '../../../utils/initialization-utils';
import {FacetPlaceholder} from '../../facets/atomic-facet-placeholder/atomic-facet-placeholder';
import {FacetContainer} from '../facet-container/facet-container';
import {FacetHeader} from '../facet-header/facet-header';
import {FacetValueCheckbox} from '../facet-value-checkbox/facet-value-checkbox';
import {FacetValueLink} from '../facet-value-link/facet-value-link';
import {BaseFacet} from '../facet-common';
import {
  defaultNumberFormatter,
  NumberFormatter,
} from '../../formats/format-common';

interface NumericRangeWithLabel extends NumericRangeRequest {
  label?: string;
}

/**
 * A facet is a list of values for a certain field occurring in the results, ordered using a configurable criteria (e.g., number of occurrences).
 * An `atomic-numeric-facet` displays a facet of the results for the current query as numeric ranges.
 *
 * @part facet - The wrapper for the entire facet.
 * @part placeholder - The placeholder shown before the first search is executed.
 *
 * @part label-button - The button that displays the label and allows to expand/collapse the facet.
 * @part label-button-icon - The label button icon.
 * @part clear-button - The button that resets the actively selected facet values.
 * @part clear-button-icon - The clear button icon.
 *
 * @part values - The facet values container.
 * @part value-label - The facet value label, common for all displays.
 * @part value-count - The facet value count, common for all displays.
 *
 * @part value-checkbox - The facet value checkbox, available when display is 'checkbox'.
 * @part value-checkbox-label - The facet value checkbox clickable label, available when display is 'checkbox'.
 * @part value-link - The facet value when display is 'link'.
 */
@Component({
  tag: 'atomic-numeric-facet-v1', // TODO: remove v1 when old facets are removed
  styleUrl: 'atomic-numeric-facet.pcss',
  shadow: true,
})
export class AtomicNumericFacet
  implements
    InitializableComponent,
    BaseFacet<NumericFacet, NumericFacetState> {
  @InitializeBindings() public bindings!: Bindings;
  public facet!: NumericFacet;
  public searchStatus!: SearchStatus;
  @Element() private host!: HTMLElement;
  private manualRanges: NumericRangeWithLabel[] = [];
  private formatter: NumberFormatter = defaultNumberFormatter;

  @BindStateToController('facet')
  @State()
  public facetState!: NumericFacetState;
  @BindStateToController('searchStatus')
  @State()
  public searchStatusState!: SearchStatusState;
  @State() public error!: Error;
  @State() public isCollapsed = false;

  /**
   * Specifies a unique identifier for the facet.
   */
  @Prop({mutable: true, reflect: true}) public facetId?: string;
  /**
   * The non-localized label for the facet.
   */
  @Prop() public label = 'noLabel';
  /**
   * The field whose values you want to display in the facet.
   */
  @Prop() public field!: string;
  /**
   * The number of values to request for this facet, when there are no manual ranges.
   */
  @Prop() public numberOfValues = 8;
  /**
   * Whether this facet should contain an input allowing users to set custom ranges.
   */
  @Prop() public withInput = false;
  /**
   * The sort criterion to apply to the returned facet values.
   * Possible values are 'ascending' and 'descending'.
   */
  @Prop() public sortCriteria: RangeFacetSortCriterion = 'ascending';
  /**
   * The algorithm that's used for generating the ranges of this facet when they aren't manually defined. The default value of `"equiprobable"` generates facet ranges which vary in size but have a more balanced number of results within each range. The value of `"even"` generates equally sized facet ranges across all of the results.
   */
  @Prop() public rangeAlgorithm: RangeFacetRangeAlgorithm = 'equiprobable';
  /**
   * Whether to display the facet values as checkboxes (multiple selection) or links (single selection).
   * Possible values are 'checkbox' and 'link'.
   */
  @Prop() public displayValuesAs: 'checkbox' | 'link' = 'checkbox';

  public initialize() {
    this.searchStatus = buildSearchStatus(this.bindings.engine);
    this.manualRanges = this.buildManualRanges();

    const options: NumericFacetOptions = {
      facetId: this.facetId,
      field: this.field,
      numberOfValues: this.numberOfValues,
      sortCriteria: this.sortCriteria,
      rangeAlgorithm: this.rangeAlgorithm,
      currentValues: this.manualRanges,
      generateAutomaticRanges: !this.manualRanges.length,
    };
    this.facet = buildNumericFacet(this.bindings.engine, {options});
    this.facetId = this.facet.state.facetId;
    this.bindings.store.state.facets[this.facetId] = {
      label: this.label,
    };
  }

  @Listen('atomic/numberFormat')
  public setFormat(event: CustomEvent<NumberFormatter>) {
    event.preventDefault();
    event.stopPropagation();
    this.formatter = event.detail;
  }

  private format(value: number) {
    try {
      return this.formatter(value, this.bindings.i18n.languages);
    } catch (error) {
      this.bindings.engine.logger.error(
        `atomic-numeric-facet facet value "${value}" could not be formatted correctly.`,
        error
      );
      return value;
    }
  }

  private buildManualRanges(): NumericRangeWithLabel[] {
    return Array.from(this.host.querySelectorAll('atomic-numeric-range')).map(
      ({start, end, endInclusive, label}) => ({
        ...buildNumericRange({start, end, endInclusive}),
        label,
      })
    );
  }

  private get numberOfSelectedValues() {
    return this.facetState.values.filter(({state}) => state === 'selected')
      .length;
  }

  private renderHeader() {
    return (
      <FacetHeader
        i18n={this.bindings.i18n}
        label={this.label}
        onClearFilters={() => this.facet.deselectAll()}
        numberOfSelectedValues={this.numberOfSelectedValues}
        isCollapsed={this.isCollapsed}
        onToggleCollapse={() => (this.isCollapsed = !this.isCollapsed)}
      ></FacetHeader>
    );
  }

  private areRangesEqual(
    firstRange: NumericRangeRequest,
    secondRange: NumericRangeRequest
  ) {
    return (
      firstRange.start === secondRange.start &&
      firstRange.end === secondRange.end &&
      firstRange.endInclusive === secondRange.endInclusive
    );
  }

  private renderValue(facetValue: NumericFacetValue, onClick: () => void) {
    const manualRangeLabel = this.manualRanges.find((range) =>
      this.areRangesEqual(range, facetValue)
    )?.label;
    const displayValue = manualRangeLabel
      ? this.bindings.i18n.t(manualRangeLabel)
      : this.bindings.i18n.t('to', {
          start: this.format(facetValue.start),
          end: this.format(facetValue.end),
        });
    const isSelected = facetValue.state === 'selected';
    switch (this.displayValuesAs) {
      case 'checkbox':
        return (
          <FacetValueCheckbox
            displayValue={displayValue}
            numberOfResults={facetValue.numberOfResults}
            isSelected={isSelected}
            i18n={this.bindings.i18n}
            onClick={onClick}
          ></FacetValueCheckbox>
        );
      case 'link':
        return (
          <FacetValueLink
            displayValue={displayValue}
            numberOfResults={facetValue.numberOfResults}
            isSelected={isSelected}
            i18n={this.bindings.i18n}
            onClick={onClick}
          ></FacetValueLink>
        );
    }
  }

  private renderValuesContainer(children: VNode[]) {
    return (
      <ul part="values" class="mt-3">
        {children}
      </ul>
    );
  }

  private renderValues() {
    return this.renderValuesContainer(
      this.valuesToRender.map((value) =>
        this.renderValue(value, () =>
          this.displayValuesAs === 'link'
            ? this.facet.toggleSingleSelect(value)
            : this.facet.toggleSelect(value)
        )
      )
    );
  }

  private get valuesToRender() {
    return this.facetState.values.filter(
      (value) => value.numberOfResults || value.state !== 'idle'
    );
  }

  public render() {
    if (this.searchStatusState.hasError) {
      return;
    }

    if (!this.searchStatusState.firstSearchExecuted) {
      return (
        <FacetPlaceholder
          numberOfValues={this.numberOfValues}
        ></FacetPlaceholder>
      );
    }

    if (!this.valuesToRender.length) {
      return <Host class="atomic-without-values"></Host>;
    }

    return (
      <Host class="atomic-with-values">
        <FacetContainer>
          {this.renderHeader()}
          {!this.isCollapsed && this.renderValues()}
        </FacetContainer>
      </Host>
    );
  }
}