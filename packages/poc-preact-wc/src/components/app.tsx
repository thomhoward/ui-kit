import Searchbox from './searchbox';
import Results from './results';
import { CoveoHeadlessEngine } from 'coveo-headless-engine';

export const coveoHeadlessEngine = new CoveoHeadlessEngine();
coveoHeadlessEngine.performSearch();

customElements.define('coveo-searchbox', Searchbox);
customElements.define('coveo-results', Results);