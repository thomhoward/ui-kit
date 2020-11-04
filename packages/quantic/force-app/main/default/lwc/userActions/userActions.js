import { LightningElement, api, track } from 'lwc';
import HeadlessPath from '@salesforce/resourceUrl/coveoheadless';
import AtomicPath from '@salesforce/resourceUrl/atomicutils';
import { loadScript } from 'lightning/platformResourceLoader';
import { initializeComponent } from 'c/initialization';

export default class UserActions extends LightningElement {

  /** @type {boolean} */
  @api sample = false;

  @api userId = 'nlafrance@coveo.com';

  /** @type {import("coveo").UserActionsState} */
  state = {
    userActions: [],
    duration: 0,
    error: null,
    isLoading: true
  };

  /** @type {import("coveo").HeadlessEngine<any>} */
  engine;

  /** @type {boolean} */
  dependenciesLoaded = false;

  /** @type {import("coveo").HeadlessConfigurationOptions} */
  config;

  /** @type {import("coveo").UserActions} */
  userActionsController;

  /** @type {import("coveo").Unsubscribe} */
  unsubscribe;

  startDate;
  duration;

  async connectedCallback() {
    this.sample = true;
    if (this.dependenciesLoaded) {
      return;
    }

    try {
      await Promise.all([
        loadScript(this, HeadlessPath + '/browser/headless.js'),
        loadScript(this, AtomicPath + '/atomic-utils.js'),
      ]);

      this.loadDependencies();
      if (this.dependenciesLoaded) {
        this.initEngine();
        this.userActionsController = new CoveoHeadless.buildUserActions(this.engine, { options: { userId: this.userId } });
        this.unsubscribe = this.userActionsController.subscribe(() => this.updateState());
        this.userActionsController.update();
      }
    } catch (error) {
      console.error('Fatal error: unable to initialize user actions', error);
    }
  }

  loadDependencies() {
    this.dependenciesLoaded = true;
    if (this.sample) {
      this.config = CoveoHeadless.HeadlessEngine.getSampleConfiguration();
      this.config.organizationId = 'qaregression2'
      this.config.accessToken = 'xxc6ead3c6-f5ea-44ff-ab2c-4fe11b5676b3'
      this.config.platformUrl = 'https://platformqa.cloud.coveo.com'
      delete this.config.search;
    }
  }

  initEngine() {
    this.engine = new CoveoHeadless.HeadlessEngine({
      configuration: this.config,
      reducers: CoveoHeadless.userActionsAppReducers,
    });
    return this.engine;
  }

  disconnectedCallback() {
    this.unsubscribe && this.unsubscribe();
  }

  updateState() {
    this.state = this.userActionsController.state;
    if (this.state.userActions.length > 0) {
      this.setActivityTime();
    }
  }

  getActionName(action) {
    if (action.type === 'CLICK' && action.document) {
      return 'Clicked Document';
    }
    if (action.type === 'SEARCH') {
      return action.query ? 'User Query' : 'Query';
    }
    if (action.type === 'CUSTOM') {
      return 'Custom';
    }
  }

  setActivityTime() {
    const endDate = this.userActions[0].timestamp;
    this.startDate = this.userActions[this.userActions.length - 1].timestamp;
    this.duration = this.formatTimeInterval(endDate.getTime() - this.startDate.getTime());
  }

  getIcon(action) {
    if (action.name === 'Clicked Document'){ 
      return 'standard:document';
    }
    if (action.type === 'SEARCH') {
      return 'standard:search';
    }
    return 'standard:today';
  }

  get isLoading() {
    return this.state.isLoading;
  }

  get startDate() {
    return this.startDate;
  }

  get duration() {
    return this.duration;
  }

  get userActions() {
    const userActionsWithKey = this.state.userActions ? this.state.userActions.slice(0, 1000).map((action, index) => {
      action.key = index;
      action.type = String(action.type);
      action.name = this.getActionName(action);
      action.icon = this.getIcon(action);
      return action;
    }) : [];
    return userActionsWithKey;
  }

  /* Documents */
  get documents() {
    return this.userActions.length ? this.userActions.filter(action => Boolean(action.document)).map((action, index) => {
      return {
        key: index,
        value: action.document
      }
    }) : [];
  }

  get someDocuments() {
    return this.documents.slice(0, 4);
  }

  get moreDocuments() {
    return this.documents.slice(4);
  }


  /* Queries */
  get queries() {
    return this.userActions.length ? this.userActions.filter(action => Boolean(action.query)).map((action, index) => {
      return {
        key: index,
        value: action.query
      }
    }) : [];
  }

  get someQueries() {
    return this.queries.slice(0, 4);
  }

  get moreQueries() {
    return this.queries.slice(4);
  }

  formatTimeInterval(interval) {
    const SECOND = 1000;
    const MINUTE = 60 * SECOND;
    const HOUR = 60 * MINUTE;
    const DAY = 24 * HOUR;
    const WEEK = 7 * DAY;
    const string_index = 1;
    const nb_seconds = Math.floor(Math.round((interval % MINUTE) / SECOND));
    const nb_minutes = Math.floor((interval % HOUR) / MINUTE);
    const nb_hour = Math.floor((interval % DAY) / HOUR);
    const nb_day = Math.floor((interval % WEEK) / DAY);
    const nb_week = Math.floor(interval / WEEK);

    const formater = (nb, unit) => `${nb} ${unit}${nb === 1 ? '' : 's'}`;

    const seconds_str = formater(nb_seconds, 'second');
    const minutes_str = formater(nb_minutes, 'minute');
    const hour_str = formater(nb_hour, 'hour');
    const day_str = formater(nb_day, 'day');
    const week_str = formater(nb_week, 'week');

    const time_per_unit = [
        [nb_week, `${week_str}${nb_day > 0 ? ` ${day_str}` : ''}`],
        [nb_day, `${day_str}${nb_hour > 0 ? ` ${hour_str}` : ''}`],
        [nb_hour, `${hour_str}${nb_minutes > 0 ? ` ${minutes_str}` : ''}`],
        [nb_minutes, `${minutes_str}${nb_seconds > 0 ? ` ${seconds_str}` : ''}`],
        [nb_seconds, seconds_str],
    ];

    const first_meaningful_tuple = (time_per_unit.find(([amount, _]) => amount > 0)) || [0, '0 seconds'];

    return first_meaningful_tuple[string_index];
  }
}