import {h, render} from 'preact';
// @ts-ignore
import {Provider, connect} from 'react-redux';
import {coveoHeadlessEngine} from '../app';
import { CoveoHeadlessState } from 'coveo-headless-engine';

const ConnectedInput = connect((state: CoveoHeadlessState) => state)((state: CoveoHeadlessState) => (
  <input
    value={state.query.expression}
    type="text"
    onChange={e => {
      coveoHeadlessEngine.updateQueryExpression(e.currentTarget.value);
      coveoHeadlessEngine.performSearch();
    }}
  />
));

export default class Searchbox extends HTMLElement {
  private root!: ShadowRoot;

  connectedCallback() {
    this.root = this.attachShadow({mode: 'open'});
    render(
      <Provider store={coveoHeadlessEngine.reduxStore}>
        <ConnectedInput />
      </Provider>,
      this.root
    );
  }
}
