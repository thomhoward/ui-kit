import {ResultListSelectors} from '../../result-list/result-list-selectors';

export const resultBadgeComponent = 'atomic-result-badge';
export const ResultBadgeSelectors = {
  shadow: () => cy.get(resultBadgeComponent).shadow(),
  firstInResult: () =>
    ResultListSelectors.firstResult().find(resultBadgeComponent),
  text: () =>
    ResultBadgeSelectors.firstInResult()
      .find('atomic-text', {includeShadowDom: true})
      .shadow(),
  resultText: () =>
    ResultBadgeSelectors.firstInResult().find('atomic-result-text', {
      includeShadowDom: true,
    }),
};
