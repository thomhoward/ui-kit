import { initializeComponent } from 'c/initialization';
import { LightningElement, api, track} from 'lwc';

export default class CaseClassification extends LightningElement {

    @track classifications = {};
    unsubscribe;
    caseAssist;

    connectedCallback() {
        initializeComponent(this);
    }

    disconnectedCallback() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }

    @api
    initialize(engine) {
        this.caseAssist = CoveoHeadless.buildCaseAssist(engine);
        this.unsubscribe = this.caseAssist.subscribe(() => this.updateState());
    }

    updateState() {
        this.classifications = this.caseAssist.state.classifications;
    }

    get classificationsJson() {
        return JSON.stringify(this.classifications);
    }
}