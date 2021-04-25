import { Component } from './component';

describe('Component', () => {
    beforeEach(() => {
        spyOn(console, 'log');
        spyOn(console, 'warn');
    });

    describe('Single container', () => {
        let $fake = null;

        beforeEach(() => {
            $fake = document.createElement('div');
        });

        it('should render in passed container', () => {
            class FakeComponent extends Component {
                get template() {
                    return `<span>fake</span>`;
                }
            }
            const c = new FakeComponent();
            c.render($fake);
            expect($fake.firstElementChild.tagName.toLowerCase()).toEqual('span');
            expect($fake.firstElementChild.textContent).toEqual('fake');
        });

        it('should compile template', () => {
            class FakeComponent extends Component {
                get template() {
                    return `<span>${this.title}</span>`;
                }
                constructor() {
                    super();
                    this.title = 'fake-title';
                }
            }
            const c = new FakeComponent();
            c.render($fake);
            expect($fake.firstElementChild.textContent).toEqual('fake-title');
        });

        it('should update UI when update a model', () => {
            class FakeComponent extends Component {
                get template() {
                    return `<span>${this.title}</span>`;
                }
                constructor() {
                    super();
                    this.title = null;
                }
            }
            const c = new FakeComponent();
            c.title = 'fake-title';
            c.render($fake);
            expect($fake.firstElementChild.textContent).toEqual('fake-title');
        });

        it('should not update UI when model is not changed', () => {
            class FakeComponent extends Component {
                get template() {
                    return `<span>${this.title}</span>`;
                }
                constructor() {
                    super();
                    this.title = null;
                }
            }
            const c = new FakeComponent();
            c.render($fake);
            spyOn(FakeComponent.prototype, 'update').and.callThrough();
            c.title = 'fake-title';
            c.title = 'fake-title';
            c.title = 'fake-title';
            expect(c.update).toHaveBeenCalledTimes(1);
        });

        it('should update UI when model changed', () => {
            class FakeComponent extends Component {
                get template() {
                    return `<span>${this.title}</span>`;
                }
                constructor() {
                    super();
                    this.title = null;
                }
            }
            const c = new FakeComponent();
            c.render($fake);
            spyOn(FakeComponent.prototype, 'update').and.callThrough();
            c.title = 1;
            c.title = 2;
            c.title = 3;
            expect($fake.firstElementChild.textContent).toEqual('3');
            expect(c.update).toHaveBeenCalledTimes(3);
        });

        it('should use relevant comparison (NaN problem)', () => {
            class FakeComponent extends Component {
                get template() {
                    return `<span>${this.title}</span>`;
                }
                constructor() {
                    super();
                    this.title = null;
                }
            }
            const c = new FakeComponent();
            c.render($fake);
            spyOn(FakeComponent.prototype, 'update').and.callThrough();
            c.title = NaN;
            c.title = NaN;
            c.title = NaN;
            expect(c.update).toHaveBeenCalledTimes(1);
        });

        it('should contains only iterable properties', () => {
            class FakeComponent extends Component {
                constructor() {
                    super();
                    this.title = 'fake-title';
                }
            }
            const c = new FakeComponent();
            expect(Object.keys(c)).toEqual(['title']);
            expect(Object.values(c)).toEqual(['fake-title']);
        });
    });

    describe('Inside a few containers', () => {
        let $fake = null;

        beforeEach(() => {
            const $parent = document.createElement('parent');
            const $child1 = document.createElement('child-1');
            $fake = document.createElement('child-2');
            const $child3 = document.createElement('child-3');
            $parent.append($child1);
            $parent.append($fake);
            $parent.append($child3);
        });

        it('should render component in the same order as is', () => {
            // Given
            class FakeComponent extends Component {
                constructor() {
                    super();
                    this.title = 'fake-title';
                }
            }
            const c = new FakeComponent();
            c.render($fake);

            // When
            c.title = 'example-title';

            // Then
            const index = Array.from($fake.parentNode.children).indexOf($fake);
            expect(index).toEqual(1);
        });
    });
});
