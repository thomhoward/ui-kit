import SearchIcon from 'coveo-styleguide/resources/icons/svg/search.svg';
import ClearIcon from 'coveo-styleguide/resources/icons/svg/clear.svg';
import {Component, h, State, Prop, Listen} from '@stencil/core';
import {
  SearchBox,
  SearchBoxState,
  buildSearchBox,
  loadQuerySetActions,
  QuerySetActionCreators,
} from '@coveo/headless';
import {
  Bindings,
  BindStateToController,
  InitializeBindings,
} from '../../utils/initialization-utils';
import {Button} from '../common/button';
import {randomID} from '../../utils/utils';
import {isNullOrUndefined} from '@coveo/bueno';
import {
  SearchBoxSuggestionElement,
  SearchBoxSuggestions,
  SearchBoxSuggestionsBindings,
  SearchBoxSuggestionsEvent,
} from '../search-box-suggestions/suggestions-common';

/**
 * The `atomic-search-box` component creates a search box with built-in support for suggestions.
 *
 * @part wrapper - The search box wrapper.
 * @part input - The search box input.
 * @part loading - The search box loading animation.
 * @part clear-button - The button to clear the search box of input.
 * @part submit-button - The search box submit button.
 * @part suggestions - A list of suggested query corrections.
 * @part suggestion - A suggested query correction.
 * @part active-suggestion - The currently active suggestion.
 */
@Component({
  tag: 'atomic-search-box',
  styleUrl: 'atomic-search-box.pcss',
  shadow: true,
})
export class AtomicSearchBox {
  @InitializeBindings() public bindings!: Bindings;
  private searchBox!: SearchBox;
  private id!: string;
  private inputRef!: HTMLInputElement;
  private listRef!: HTMLElement;
  private querySetActions!: QuerySetActionCreators;
  private pendingSuggestionEvents: SearchBoxSuggestionsEvent[] = [];
  private suggestions: SearchBoxSuggestions[] = [];

  @BindStateToController('searchBox')
  @State()
  private searchBoxState!: SearchBoxState;
  @State() public error!: Error;
  @State() private isExpanded = false;
  @State() private activeDescendant = '';
  @State() private suggestionElements: SearchBoxSuggestionElement[] = [];

  /**
   * The amount of queries displayed when the user interacts with the search box.
   * By default, a mix of query suggestions and recent queries will be shown.
   * You can configure those settings using the following components as children:
   *  - atomic-search-box-query-suggestions
   *  - atomic-search-box-recent-queries
   */
  @Prop() public numberOfQueries = 8;

  public initialize() {
    this.id = randomID('atomic-search-box-');
    this.querySetActions = loadQuerySetActions(this.bindings.engine);
    this.searchBox = buildSearchBox(this.bindings.engine, {
      options: {
        id: this.id,
        numberOfSuggestions: 0,
        highlightOptions: {
          notMatchDelimiters: {
            open: '<span class="font-bold">',
            close: '</span>',
          },
          correctionDelimiters: {
            open: '<span class="font-normal">',
            close: '</span>',
          },
        },
      },
    });

    this.suggestions.push(
      ...this.pendingSuggestionEvents.map((event) =>
        event(this.suggestionBindings)
      )
    );
    this.pendingSuggestionEvents = [];
  }

  @Listen('atomic/searchBoxSuggestion/register')
  public registerSuggestions(event: CustomEvent<SearchBoxSuggestionsEvent>) {
    event.preventDefault();
    event.stopPropagation();
    if (this.searchBox) {
      this.suggestions.push(event.detail(this.suggestionBindings));
      return;
    }
    this.pendingSuggestionEvents.push(event.detail);
  }

  private get suggestionBindings(): SearchBoxSuggestionsBindings {
    return {
      ...this.bindings,
      id: this.id,
      searchBoxController: this.searchBox,
      numberOfQueries: this.numberOfQueries,
      inputRef: this.inputRef,
      triggerSuggestions: () => this.triggerSuggestions(),
      getSuggestions: () => this.suggestions,
    };
  }

  private get popupId() {
    return `${this.id}-popup`;
  }

  private get hasInputValue() {
    return this.searchBoxState.value !== '';
  }

  private get hasSuggestions() {
    return !!this.suggestionElements.length;
  }

  private get hasActiveDescendant() {
    return this.activeDescendant !== '';
  }

  private updateActiveDescendant(activeDescendant = '') {
    this.activeDescendant = activeDescendant;
  }

  private get activeDescendantElement(): HTMLLIElement | null {
    if (!this.hasActiveDescendant) {
      return null;
    }

    return this.listRef.querySelector(`#${this.activeDescendant}`);
  }

  private get firstValue() {
    return this.listRef.firstElementChild!;
  }

  private get lastValue() {
    return this.listRef.lastElementChild!;
  }

  private get nextOrFirstValue() {
    if (!this.hasActiveDescendant) {
      return this.firstValue;
    }

    return this.activeDescendantElement?.nextElementSibling || this.firstValue;
  }

  private get previousOrLastValue() {
    if (!this.hasActiveDescendant) {
      return this.lastValue;
    }

    return (
      this.activeDescendantElement?.previousElementSibling || this.lastValue
    );
  }

  private scrollActiveDescendantIntoView() {
    this.activeDescendantElement?.scrollIntoView({
      block: 'nearest',
    });
  }

  private focusNextValue() {
    if (!this.hasSuggestions) {
      return;
    }

    const query = this.nextOrFirstValue.getAttribute('data-query');
    !isNullOrUndefined(query) && this.updateQuery(query);
    this.updateActiveDescendant(this.nextOrFirstValue.id);
    this.scrollActiveDescendantIntoView();
  }

  private focusPreviousValue() {
    if (!this.hasSuggestions) {
      return;
    }

    const query = this.previousOrLastValue.getAttribute('data-query');
    !isNullOrUndefined(query) && this.updateQuery(query);
    this.updateActiveDescendant(this.previousOrLastValue.id);
    this.scrollActiveDescendantIntoView();
  }

  private async triggerSuggestions() {
    await Promise.all(
      this.suggestions.map((suggestion) => suggestion.onInput())
    );
    const suggestionElements = this.suggestions
      .sort((a, b) => a.position - b.position)
      .map((suggestion) => suggestion.renderItems())
      .flat();

    const max =
      this.numberOfQueries +
      suggestionElements.filter((sug) => sug.query === undefined).length;
    this.suggestionElements = suggestionElements.slice(0, max);
  }

  private onInput(value: string) {
    this.searchBox.updateText(value);
    this.updateActiveDescendant();
    this.triggerSuggestions();
  }

  private onFocus() {
    this.isExpanded = true;
    this.triggerSuggestions();
  }

  private onBlur() {
    this.isExpanded = false;
    this.updateActiveDescendant();
    this.clearSuggestionElements();
  }

  private onSubmit() {
    if (this.activeDescendantElement) {
      this.activeDescendantElement.click();
      this.updateActiveDescendant();
      return;
    }

    this.searchBox.submit();
    this.updateActiveDescendant();
    this.inputRef.blur();
  }

  private updateQuery(query: string) {
    this.bindings.engine.dispatch(
      this.querySetActions.updateQuerySetQuery({
        id: this.id,
        query,
      })
    );
  }

  private onKeyDown(e: KeyboardEvent) {
    switch (e.key) {
      case 'Enter':
        this.onSubmit();
        break;
      case 'Escape':
        this.onBlur();
        break;
      case 'ArrowDown':
        e.preventDefault();
        this.focusNextValue();
        break;
      case 'ArrowUp':
        e.preventDefault();
        this.focusPreviousValue();
        break;
    }
  }

  private renderInput() {
    return (
      <input
        part="input"
        ref={(el) => (this.inputRef = el as HTMLInputElement)}
        role="combobox"
        aria-autocomplete="both"
        aria-haspopup="true"
        aria-owns={this.popupId}
        aria-expanded={`${this.isExpanded}`}
        aria-activedescendant={this.activeDescendant}
        autocomplete="off"
        autocapitalize="off"
        autocorrect="off"
        placeholder={this.bindings.i18n.t('search')}
        aria-label={this.bindings.i18n.t('search-box')}
        type="text"
        class="h-full outline-none bg-transparent flex-grow px-4 py-3.5 text-neutral-dark placeholder-neutral-dark text-lg"
        value={this.searchBoxState.value}
        onFocus={() => this.onFocus()}
        onBlur={() => this.onBlur()}
        onInput={(e) => this.onInput((e.target as HTMLInputElement).value)}
        onKeyDown={(e) => this.onKeyDown(e)}
      />
    );
  }

  private renderClearButton() {
    return (
      <Button
        style="text-transparent"
        part="clear-button"
        class="w-8 h-8 mr-1.5 text-neutral-dark"
        onClick={() => {
          this.searchBox.clear();
          this.clearSuggestionElements();
          this.inputRef.focus();
        }}
        ariaLabel={this.bindings.i18n.t('clear')}
      >
        <atomic-icon icon={ClearIcon} class="w-3 h-3"></atomic-icon>
      </Button>
    );
  }

  private renderInputContainer() {
    const isLoading = this.searchBoxState.isLoading;
    return (
      <div class="flex-grow flex items-center">
        {this.renderInput()}
        {isLoading && (
          <span
            part="loading"
            class="loading w-5 h-5 rounded-full bg-gradient-to-r animate-spin mr-3 grid place-items-center"
          ></span>
        )}
        {!isLoading && this.hasInputValue && this.renderClearButton()}
      </div>
    );
  }

  private clearSuggestionElements() {
    this.suggestionElements = [];
  }

  private renderSuggestion(
    suggestion: SearchBoxSuggestionElement,
    index: number
  ) {
    const id = `${this.id}-suggestion-${index}`;
    const isSelected = id === this.activeDescendant;
    return (
      <li
        id={id}
        role="option"
        aria-selected={`${isSelected}`}
        key={suggestion.key}
        data-query={suggestion.query}
        part={isSelected ? 'active-suggestion suggestion' : 'suggestion'}
        class={`flex px-4 h-10 items-center text-neutral-dark hover:bg-neutral-light cursor-pointer first:rounded-t-md last:rounded-b-md ${
          isSelected ? 'bg-neutral-light' : ''
        }`}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => suggestion.onSelect()}
      >
        {suggestion.content}
      </li>
    );
  }

  private renderSuggestions() {
    const showSuggestions = this.hasSuggestions && this.isExpanded;

    return (
      <ul
        id={this.popupId}
        role="listbox"
        part="suggestions"
        aria-label={this.bindings.i18n.t('query-suggestion-list')}
        ref={(el) => (this.listRef = el!)}
        class={`w-full z-10 absolute left-0 top-full rounded-md bg-background border border-neutral ${
          showSuggestions ? '' : 'hidden'
        }`}
      >
        {this.suggestionElements.map((suggestion, index) =>
          this.renderSuggestion(suggestion, index)
        )}
      </ul>
    );
  }

  private renderSubmitButton() {
    return (
      <Button
        style="primary"
        class="w-12 h-auto rounded-r-md rounded-l-none -my-px"
        part="submit-button"
        ariaLabel={this.bindings.i18n.t('search')}
        onClick={() => {
          this.searchBox.submit();
          this.clearSuggestionElements();
        }}
      >
        <atomic-icon icon={SearchIcon} class="w-4 h-4"></atomic-icon>
      </Button>
    );
  }

  public render() {
    return [
      <div
        part="wrapper"
        class={`relative flex bg-background h-full w-full border border-neutral rounded-md ${
          this.isExpanded ? 'border-primary ring ring-ring-primary' : ''
        }`}
      >
        {this.renderInputContainer()}
        {this.renderSuggestions()}
        {this.renderSubmitButton()}
      </div>,
      !this.suggestions.length && (
        <slot>
          <atomic-search-box-recent-queries></atomic-search-box-recent-queries>
          <atomic-search-box-query-suggestions></atomic-search-box-query-suggestions>
        </slot>
      ),
    ];
  }
}
