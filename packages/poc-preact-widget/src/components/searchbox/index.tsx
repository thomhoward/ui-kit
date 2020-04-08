import {h, Component} from 'preact';
import {Provider} from 'react-redux';
import {coveoHeadlessEngine} from '../..';
import {connect} from 'react-redux';
import { CoveoHeadlessState } from 'coveo-headless-engine';
import "./style.scss";

const Input = (state: CoveoHeadlessState) => <input value={state.query.expression} type="text" onChange={(e) => {
  coveoHeadlessEngine.updateQueryExpression(e.currentTarget.value);
  coveoHeadlessEngine.performSearch();
}} />;

const ConnectedInput = connect((state: CoveoHeadlessState) => state)(Input);

export interface ISearchboxProps {
  dataLabel: String;
}

export default class Searchbox extends Component<ISearchboxProps> {
  render(props: ISearchboxProps) {
    return (
      <Provider store={coveoHeadlessEngine.reduxStore}>
        <ConnectedInput />
      </Provider>
    );
  }
}
