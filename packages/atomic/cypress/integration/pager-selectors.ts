export const PagerSelectors = {
  pager: 'atomic-pager',
  buttonNext: '[part="next-button"]',
  buttonPrevious: '[part="previous-button"]',
};

export function createAliasLi() {
  cy.get(PagerSelectors.pager).shadow().find('li').as('pagerLi');
}

export function createAliasNavigation() {
  createAliasLi();
  cy.get('@pagerLi').find(PagerSelectors.buttonPrevious).as('previousButton');
  cy.get('@pagerLi').find(PagerSelectors.buttonNext).as('nextButton');
}
