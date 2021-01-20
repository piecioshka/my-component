import { Component } from '../future-packages/component.js';
import { Editor } from './editor.js';
import { Timeline } from './timeline.js';

export class App extends Component {
    get template() {
        return `
            <section>
                <h1>video-editor</h1>
            </section>
        `
    }

    render($target) {
        super.render($target);

        const e = new Editor();
        e.render(this.$el);

        const t = new Timeline();
        t.render(this.$el);
    }
}
