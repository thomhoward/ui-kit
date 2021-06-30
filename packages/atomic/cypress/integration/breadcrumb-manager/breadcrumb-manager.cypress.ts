import {setupBreadcrumbManager} from './breadcrumb-manager-actions';

describe('Breadcrumb manager Test Suites', () => {
  describe('Breadcrumb manager with default setting', () => {
    function setupWithDefaultSettings() {
      setupFacet();
      cy.wait(RouteAlias.search);
    }

    describe('When user selects 1 facet checkbox', () => {
      function setupFacetWithCheckboxSelected() {
        setupWithDefaultSettings();
        cy.wait(RouteAlias.analytics);
        selectFacetValueAt(0);
      }
      describe('verify rendering', () => {
        before(setupFacetWithCheckboxSelected);
        FacetAssertions.assertCheckboxDisplay(0, true);
        FacetAssertions.assertNonZeroFacetCount();
        FacetAssertions.assertBreadcrumbDisplayFacetValueAtIndex();
        FacetAssertions.assertFacetValueOnUrl();
      });

      describe('verify analytics', () => {
        beforeEach(setupFacetWithCheckboxSelected);
        FacetAssertions.assertAnalyticLogFacetSelect();
      });
    });
  });
});

// describe('Default properties test', () => {
//   beforeEach(() => {
//     setupComponents('');
//     createAliasFacetUL(numericFacetProp.field, FacetSelectors.numericFacet);
//   });

//   it('should display one breadcrumb when a regular facet is selected.', () => {
//     cy.get(FacetAlias.facetFirstValue).find(FacetSelectors.label).click();
//     createBreadcrumbShadowAlias();
//     facetValueShouldDisplayInBreadcrumb(FacetAlias.facetFirstValue, 1);
//     cy.get(BreadcrumbAlias.breadcrumbs).should('have.length', 1);

//     cy.getAnalyticsAt('@coveoAnalytics', 1).then((analyticsBody) => {
//       expect(analyticsBody).to.have.property('actionCause', 'facetSelect');
//       expect(analyticsBody.facetState).to.have.lengthOf(1);
//     });
//   });
