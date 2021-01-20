function setter(target, property, value) {
    console.log(`[setter] ${property} = `, value);
    if (Object.is(target[property], value)) {
        console.warn(`[set: ${property}] cannot override to the same value`);
        return true;
    }
    if (property === '$el' && this.$el !== null) {
        return true;
    }
    target[property] = value;
    if (!this.$el) {
        console.warn(`[set: ${property}] this.$el is not defined, cannot update UI`);
        return true;
    }
    const $parent = this.$el.parentElement;
    if (!$parent) {
        console.warn(`[set: ${property}] $parent is not defined, cannot update UI`);
        return true;
    }
    $parent.removeChild(this.$el);
    this.render($parent);
    return true;
}

export class Component {
    constructor() {
        const self = this;
        Object.defineProperty(this, "$el", {
            value: null,
            writable: true,
        });
        return new Proxy(this, { set: setter.bind(self) });
    }

    get template() {
        return '';
    }

    compile() {
        const t = this.template;
        const $el = new DOMParser()
            .parseFromString(t, 'text/html')
            .body.firstElementChild;
        return $el;
    }

    render($target) {
        console.log('render', this);
        this.$el = this.compile();
        $target.append(this.$el);
    }
}
