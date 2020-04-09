import {h, render} from 'preact';
// @ts-ignore
import {Provider, connect} from 'react-redux';
import {coveoHeadlessEngine} from '../app';
import { CoveoHeadlessState } from 'coveo-headless-engine';


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
    render(
      <Provider store={coveoHeadlessEngine.reduxStore}>
        <ConnectedResultsList />
      </Provider>,
      this.root
    );
  }
}
