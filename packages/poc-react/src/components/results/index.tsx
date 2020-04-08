import React from 'react';
import ReactDOM from 'react-dom';
import retargetEvents from 'react-shadow-dom-retarget-events';
import {Provider, connect} from 'react-redux';
import {CoveoHeadlessState} from 'coveo-headless-engine';
import {coveoHeadlessEngine} from '../..';

const list = (state: CoveoHeadlessState) =>
  state.results.list.map(result => (
    <li key={result.uniqueId}>
      <a href={result.uri} target="blank">
        {result.title}
      </a>
      <p>{result.excerpt}</p>
    </li>
  ));

const ResultsList = (state: CoveoHeadlessState) => {
  return (
    <div>
      <span>Results for "{state.query.expression}"</span>
      <ul>
        {!state.results.list.length && <li>No results</li>}
        {list(state)}
      </ul>
    </div>
  );
};

const ConnectedResultsList = connect((state: CoveoHeadlessState) => state)(
  ResultsList
);

export default class Results extends HTMLElement {
  private root!: ShadowRoot;

  connectedCallback() {
    this.root = this.attachShadow({mode: 'open'});
    retargetEvents(this.root);
    ReactDOM.render(
      <Provider store={coveoHeadlessEngine.reduxStore}>
        <ConnectedResultsList />
      </Provider>,
      this.root
    );
  }

  disconnectedCallback() {
    ReactDOM.unmountComponentAtNode(this.root);
  }
}
