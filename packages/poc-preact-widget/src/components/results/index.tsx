import {h, Component} from 'preact';
import {Provider} from 'react-redux';
import {coveoHeadlessEngine} from '../..';
import {CoveoHeadlessState, SearchStatus} from 'coveo-headless-engine';
import {connect} from 'react-redux';
import './style.scss';

const Results = (state: CoveoHeadlessState) => {
  return (
    <div>
      <span>Results for "{state.query.expression}"</span>
      <ul>
        {!state.results.list.length && <li>No results</li>}
        {resultList(state)}
      </ul>
    </div>
  );
};

const resultList = (state: CoveoHeadlessState) =>
  state.results.list.map(result => (
    <li key={result.uniqueId}>
      <a href={result.uri} target="blank">
        {result.title}
      </a>
      <p>{result.excerpt}</p>
    </li>
  ));

const ConnectedResults = connect((state: CoveoHeadlessState) => state)(Results);

export default class App extends Component {
  componentWillMount() {
    coveoHeadlessEngine.performSearch();
  }

  render() {
    return (
      <Provider store={coveoHeadlessEngine.reduxStore}>
        <ConnectedResults />
      </Provider>
    );
  }
}
