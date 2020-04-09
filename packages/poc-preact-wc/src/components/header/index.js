import { h } from "preact";
import * as style from "./style.css";
var Header = function () {
    return (h("header", { class: style.header },
        h("h1", null, "Header")));
};
export default Header;
