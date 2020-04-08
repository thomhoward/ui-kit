import React, {ChangeEvent} from 'react';
import ReactDOM from 'react-dom';
import retargetEvents from 'react-shadow-dom-retarget-events';
import {Provider, connect} from 'react-redux';
import {CoveoHeadlessState} from 'coveo-headless-engine';
import {coveoHeadlessEngine} from '../..';

const ConnectedInput = connect((state: CoveoHeadlessState) => state)((state: CoveoHeadlessState) => (
  <input
    value={state.query.expression}
    type="text"
    onChange={e => {
      coveoHeadlessEngine.updateQueryExpression(e.target.value);
      coveoHeadlessEngine.performSearch();
    }}
  />
));

export default class Searchbox extends HTMLElement {
  private root!: ShadowRoot;

  connectedCallback() {
    this.root = this.attachShadow({mode: 'open'});
    retargetEvents(this.root);
    ReactDOM.render(
      <Provider store={coveoHeadlessEngine.reduxStore}>
        <ConnectedInput />
      </Provider>,
      this.root
    );
  }

  disconnectedCallback() {
    ReactDOM.unmountComponentAtNode(this.root);
  }
}
