import { Component } from "../../src/component.js";
import { Picture } from "./picture.js";

export class App extends Component {
    get template() {
        return `
            <h1>demo</h1>
        `;
    }

    render($target) {
        super.render($target);

        const pic = new Picture();
        pic.render(this.$el.parentElement);
        pic.src = "https://picsum.photos/id/593/300/150";
        pic.src = "https://picsum.photos/id/533/300/150";
    }
}
