import { Component } from '../../src/component.js';

export class Picture extends Component {
    get template() {
        if (!this.src) {
            return;
        }
        return `
            <img src="${this.src}">
        `;
    }
}
