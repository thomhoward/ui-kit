import {Component, h, Element, State, Prop, Listen, Host} from '@stencil/core';
import {
  ResultList,
  ResultListState,
  ResultTemplatesManager,
  buildResultList,
  buildResultTemplatesManager,
  Result,
  buildResultsPerPage,
  ResultsPerPageState,
  ResultsPerPage,
  buildInteractiveResult,
} from '@coveo/headless';
import {
  Bindings,
  BindStateToController,
  InitializableComponent,
  InitializeBindings,
} from '../../utils/initialization-utils';
import {
  ResultDisplayLayout,
  ResultDisplayDensity,
  ResultDisplayImageSize,
  getResultDisplayClasses,
} from '../atomic-result/atomic-result-display-options';
import {TemplateContent} from '../atomic-result-template/atomic-result-template';
import {LinkWithResultAnalytics} from '../result-link/result-link';

/**
 * The `atomic-result-list` component is responsible for displaying query results by applying one or more result templates.
 *
 * @part result-list-grid-clickable - The clickable element on a result when displayed as a grid
 */
@Component({
  tag: 'atomic-result-list',
  styleUrl: 'atomic-result-list.pcss',
  shadow: true,
})
export class AtomicResultList implements InitializableComponent {
  @InitializeBindings() public bindings!: Bindings;
  private resultList!: ResultList;
  public resultsPerPage!: ResultsPerPage;
  private resultTemplatesManager!: ResultTemplatesManager<TemplateContent>;

  @Element() private host!: HTMLDivElement;

  @BindStateToController('resultList')
  @State()
  private resultListState!: ResultListState;

  @BindStateToController('resultsPerPage')
  @State()
  private resultsPerPageState!: ResultsPerPageState;

  @State() public error!: Error;
  @State() private templateHasError = false;

  /**
   * TODO: KIT-452 Infinite scroll feature
   * Whether to automatically retrieve an additional page of results and append it to the
   * current results when the user scrolls down to the bottom of element
   */
  private enableInfiniteScroll = false;
  /**
   * A list of fields to include in the query results, separated by commas.
   */
  @Prop() public fieldsToInclude = '';

  /**
   * How results should be displayed.
   */
  @Prop() display: ResultDisplayLayout = 'list';

  /**
   * How large or small results should be.
   */
  @Prop() density: ResultDisplayDensity = 'normal';

  /**
   * How large or small the visual section of results should be.
   */
  @Prop() imageSize?: ResultDisplayImageSize;

  /**
   * @deprecated use `imageSize` instead.
   */
  @Prop() image: ResultDisplayImageSize = 'icon';

  private listWrapperRef?: HTMLDivElement;

  private get fields() {
    if (this.fieldsToInclude.trim() === '') return [];
    return this.fieldsToInclude.split(',').map((field) => field.trim());
  }

  private get defaultFieldsToInclude() {
    return [
      'date',
      'author',
      'source',
      'language',
      'filetype',
      'parents',
      'ec_price',
      'ec_name',
      'ec_description',
      'ec_brand',
      'ec_category',
      'ec_item_group_id',
      'ec_shortdesc',
      'ec_thumbnails',
      'ec_images',
      'ec_promo_price',
      'ec_in_stock',
      'ec_cogs',
      'ec_rating',
    ];
  }

  public initialize() {
    this.resultTemplatesManager = buildResultTemplatesManager(
      this.bindings.engine
    );
    this.resultList = buildResultList(this.bindings.engine, {
      options: {
        fieldsToInclude: [...this.defaultFieldsToInclude, ...this.fields],
      },
    });
    this.resultsPerPage = buildResultsPerPage(this.bindings.engine);
    this.registerDefaultResultTemplates();
    this.registerChildrenResultTemplates();
  }

  private registerDefaultResultTemplates() {
    const content = document.createDocumentFragment();
    const linkEl = document.createElement('atomic-result-link');
    content.appendChild(linkEl);
    this.resultTemplatesManager.registerTemplates({
      content,
      conditions: [],
    });
  }

  private registerChildrenResultTemplates() {
    this.host
      .querySelectorAll('atomic-result-template')
      .forEach(async (resultTemplateElement) => {
        const template = await resultTemplateElement.getTemplate();
        if (!template) {
          this.templateHasError = true;
          return;
        }
        this.resultTemplatesManager.registerTemplates(template);
      });
  }

  private getTemplate(result: Result): TemplateContent {
    return this.resultTemplatesManager.selectTemplate(result)!;
  }

  private getId(result: Result) {
    return result.uniqueId + this.resultListState.searchResponseId;
  }

  private buildListPlaceholders() {
    return Array.from(
      {length: this.resultsPerPageState.numberOfResults},
      (_, i) => (
        <atomic-result-placeholder
          key={`placeholder-${i}`}
          display={this.display}
          density={this.density}
          imageSize={this.imageSize ?? this.image}
        ></atomic-result-placeholder>
      )
    );
  }

  private buildListResults() {
    return this.resultListState.results.map((result) => {
      const template = this.getTemplate(result);

      const atomicResult = (
        <atomic-result
          key={this.getId(result)}
          result={result}
          engine={this.bindings.engine}
          display={this.display}
          density={this.density}
          imageSize={this.imageSize ?? this.image}
          content={template}
        ></atomic-result>
      );

      return this.display === 'grid' ? (
        <LinkWithResultAnalytics
          part="result-list-grid-clickable"
          interactiveResult={buildInteractiveResult(this.bindings.engine, {
            options: {result},
          })}
          href={result.clickUri}
          target="_self"
        >
          {atomicResult}
        </LinkWithResultAnalytics>
      ) : (
        atomicResult
      );
    });
  }

  private buildTablePlaceholder() {
    return (
      <atomic-result-table-placeholder
        density={this.density}
        imageSize={this.imageSize ?? this.image}
        rows={this.resultsPerPageState.numberOfResults}
      ></atomic-result-table-placeholder>
    );
  }

  private buildTable() {
    const fieldColumns = Array.from(
      this.getTemplate(this.resultListState.results[0]).querySelectorAll(
        'atomic-table-element'
      )
    );

    if (fieldColumns.length === 0) {
      this.bindings.engine.logger.error(
        'atomic-table-element elements missing in the result template to display columns.',
        this.host
      );
    }

    return (
      <table class={`list-root ${this.getClasses().join(' ')}`}>
        <thead>
          <tr>
            {fieldColumns.map((column) => (
              <th>
                <atomic-text
                  value={column.getAttribute('label')!}
                ></atomic-text>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {this.resultListState.results.map((result) => (
            <tr key={this.getId(result)}>
              {fieldColumns.map((column) => {
                return (
                  <td key={column.getAttribute('label')! + this.getId(result)}>
                    <atomic-result
                      engine={this.bindings.engine}
                      result={result}
                      display={this.display}
                      density={this.density}
                      image-size={this.imageSize ?? this.image}
                      content={column}
                    ></atomic-result>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  private buildList() {
    return (
      <div class={`list-root ${this.getClasses().join(' ')}`}>
        {this.buildListPlaceholders()}
        {this.resultListState.results.length ? this.buildListResults() : null}
      </div>
    );
  }

  private buildResultRoot() {
    if (this.display === 'table') {
      return [
        this.buildTablePlaceholder(),
        this.resultListState.results.length ? this.buildTable() : null,
      ];
    }

    return this.buildList();
  }

  private buildResultWrapper() {
    return (
      <div
        class="list-wrapper placeholder"
        ref={(el) => (this.listWrapperRef = el as HTMLDivElement)}
      >
        {this.buildResultRoot()}
      </div>
    );
  }

  private getClasses() {
    const classes = getResultDisplayClasses(
      this.display,
      this.density,
      this.image
    );
    if (
      this.resultListState.firstSearchExecuted &&
      this.resultList.state.isLoading
    ) {
      classes.push('loading');
    }
    return classes;
  }

  @Listen('scroll', {target: 'window'})
  handleInfiniteScroll() {
    if (!this.enableInfiniteScroll) {
      return;
    }

    const hasReachedEndOfElement =
      window.innerHeight + window.scrollY >= this.host.offsetHeight;

    if (hasReachedEndOfElement) {
      this.resultList.fetchMoreResults();
    }
  }

  public componentDidRender() {
    if (this.resultListState.firstSearchExecuted) {
      this.listWrapperRef?.classList.remove('placeholder');
    }
  }

  public render() {
    if (this.resultListState.hasError) {
      return;
    }

    return (
      <Host>
        {this.templateHasError && <slot></slot>}
        {this.buildResultWrapper()}
      </Host>
    );
  }
}
