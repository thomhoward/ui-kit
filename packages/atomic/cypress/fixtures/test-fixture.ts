import {i18n} from 'i18next';
import {SearchResponseSuccess} from '../../../headless/dist/definitions/api/search/search/search-response';
import {buildTestUrl} from '../utils/setupComponent';

export type SearchResponseModifierPredicate = (
  response: SearchResponseSuccess
) => SearchResponseSuccess | void;

export type SearchInterface = HTMLElement & {
  initialize: (opts: {
    accessToken: string;
    organizationId: string;
  }) => Promise<void>;
  executeFirstSearch: () => void;
  i18n: i18n;
};

export type TestFeature = (e: TestFixture) => void | Promise<void>;

export type TagProps = Record<string, string | number>;

export class TestFixture {
  private aliases: TestFeature[] = [];
  private execFirstSearch = true;
  private searchInterface = document.createElement(
    'atomic-search-interface'
  ) as SearchInterface;
  private hash = '';
  private style = document.createElement('style');
  private language?: string;
  private disabledAnalytics = false;
  private fieldCaptions: {field: string; captions: Record<string, string>}[] =
    [];
  private translations: Record<string, string> = {};
  private responseModifiers: SearchResponseModifierPredicate[] = [];

  public with(feat: TestFeature) {
    feat(this);
    return this;
  }

  public withoutFirstAutomaticSearch() {
    this.execFirstSearch = false;
    return this;
  }

  public withHash(hash: string) {
    this.hash = hash;
    return this;
  }

  public withElement(e: HTMLElement) {
    this.searchInterface.append(e);
    return this;
  }

  public withAlias(aliasFn: TestFeature) {
    this.aliases.push(aliasFn);
    return this;
  }

  public withStyle(e: string) {
    this.style.append(e);
    return this;
  }

  public withLanguage(lang: string) {
    this.language = lang;
    return this;
  }

  public withoutAnalytics() {
    this.disabledAnalytics = true;
    return this;
  }

  public withFieldCaptions(field: string, captions: Record<string, string>) {
    this.fieldCaptions.push({field, captions});
    return this;
  }

  public withTranslation(translations: Record<string, string>) {
    this.translations = {
      ...this.translations,
      ...translations,
    };
    return this;
  }

  public withCustomResponse(predicate: SearchResponseModifierPredicate) {
    this.responseModifiers.push(predicate);
    return this;
  }

  public init() {
    cy.visit(buildTestUrl(this.hash)).injectAxe();
    this.intercept();
    this.stubConsole();

    cy.document().then((doc) => {
      doc.head.appendChild(this.style);
      doc.body.appendChild(this.searchInterface);
      cy.get('atomic-search-interface').as(this.elementAliases.SearchInterface);
    });

    cy.get(`@${this.elementAliases.SearchInterface}`).then(($si) => {
      const searchInterfaceComponent = $si.get()[0] as SearchInterface;

      if (this.language) {
        searchInterfaceComponent.setAttribute('language', this.language);
      }

      if (this.disabledAnalytics) {
        searchInterfaceComponent.setAttribute('analytics', 'false');
      }

      if (this.responseModifiers.length) {
        cy.intercept(
          {
            method: 'POST',
            url: '**/rest/search/v2?*',
          },
          (request) => {
            request.reply((response) => {
              let newResponse = response.body;
              this.responseModifiers.forEach((modifier) => {
                const returnedResponse = modifier(newResponse);
                if (returnedResponse) {
                  newResponse = returnedResponse;
                }
              });
              response.send(200, newResponse);
            });
          }
        ).as(TestFixture.interceptAliases.Search.substring(1));
      }

      searchInterfaceComponent
        .initialize({
          accessToken: 'xx564559b1-0045-48e1-953c-3addd1ee4457',
          organizationId: 'searchuisamples',
        })
        .then(() => {
          this.fieldCaptions.forEach(({field, captions}) =>
            searchInterfaceComponent.i18n.addResourceBundle(
              'en',
              `caption-${field}`,
              captions
            )
          );
          searchInterfaceComponent.i18n.addResourceBundle(
            'en',
            'translation',
            this.translations
          );
          if (this.execFirstSearch) {
            searchInterfaceComponent.executeFirstSearch();
          }
        });
    });

    if (this.execFirstSearch) {
      cy.wait(TestFixture.interceptAliases.Search);
      if (!this.disabledAnalytics) {
        cy.wait(TestFixture.interceptAliases.UA);
      }
    }

    this.aliases.forEach((alias) => alias(this));

    return this;
  }

  public static get interceptAliases() {
    return {
      UA: '@coveoAnalytics',
      QuerySuggestions: '@coveoQuerySuggest',
      Search: '@coveoSearch',
      FacetSearch: '@coveoFacetSearch',
    };
  }

  public static get urlParts() {
    return {
      UA: 'https://analytics.cloud.coveo.com/rest/ua/v15/analytics',
      Search: 'https://cloud.coveo.com/rest/search/v2',
      UAClick: 'https://analytics.cloud.coveo.com/rest/ua/v15/analytics/click',
      UASearch:
        'https://analytics.cloud.coveo.com/rest/ua/v15/analytics/search',
    };
  }

  public get elementAliases() {
    return {
      SearchInterface: 'searchInterface',
    };
  }

  public static get consoleAliases() {
    return {
      error: '@consoleError',
      warn: '@consoleWarn',
      log: '@consoleLog',
    };
  }

  private intercept() {
    cy.intercept({
      method: 'POST',
      path: '**/rest/ua/v15/analytics/*',
    }).as(TestFixture.interceptAliases.UA.substring(1));

    cy.intercept({
      method: 'POST',
      path: '**/rest/search/v2/querySuggest?*',
    }).as(TestFixture.interceptAliases.QuerySuggestions.substring(1));

    cy.intercept({
      method: 'POST',
      url: '**/rest/search/v2?*',
    }).as(TestFixture.interceptAliases.Search.substring(1));

    cy.intercept({
      method: 'POST',
      path: '**/rest/search/v2/facet?*',
    }).as(TestFixture.interceptAliases.FacetSearch.substring(1));
  }

  private stubConsole() {
    cy.window().then((win) => {
      cy.stub(win.console, 'error').as(
        TestFixture.consoleAliases.error.substring(1)
      );
      cy.stub(win.console, 'warn').as(
        TestFixture.consoleAliases.warn.substring(1)
      );
      cy.stub(win.console, 'log').as(
        TestFixture.consoleAliases.log.substring(1)
      );
    });
  }
}

export const addTag = (env: TestFixture, tag: string, props: TagProps) => {
  const e = generateComponentHTML(tag, props);
  env.withElement(e);
};

export const generateComponentHTML = (tag: string, props: TagProps = {}) => {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    e.setAttribute(k, v.toString());
  }
  return e;
};
