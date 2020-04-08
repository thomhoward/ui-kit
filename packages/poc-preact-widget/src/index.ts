import habitat from "preact-habitat";
import Searchbox from "./components/searchbox";
import Results from "./components/results";
import {CoveoHeadlessEngine} from 'coveo-headless-engine';

export const coveoHeadlessEngine = new CoveoHeadlessEngine();

habitat(Searchbox).render({
  selector: '.CoveoSearchbox',
  clean: true
});

habitat(Results).render({
  selector: '.CoveoResults',
  clean: true
});
