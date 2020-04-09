import { h, render } from "preact";
import Header from "./header";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
if ((module as any).hot) {
    // tslint:disable-next-line:no-var-requires
    require("preact/debug");
}

class HeaderElement extends HTMLElement {
    private root!: ShadowRoot;

    connectedCallback() {
        this.root = this.attachShadow({ mode: "open" });
        render(<Header />, this.root);
    }
}

customElements.define("coveo-header", HeaderElement);
