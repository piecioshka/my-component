function setter(target, property, value) {
    console.log(`[setter] "${property}" = `, value);

    if (Object.is(target[property], value)) {
        console.warn(`[set: ${property}] cannot override to the same value`);
        return true;
    }
    if (property === "$el" && this.$el !== null) {
        console.warn(`[set: ${property}] recompile $el`);
        return true;
    }
    target[property] = value;
    this.update();
    return true;
}

function buildDOM(text) {
    return new DOMParser().parseFromString(text, "text/html").body
        .firstElementChild;
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
        return "";
    }

    compile() {
        const t = this.template;
        const $el = buildDOM(t);
        return $el;
    }

    render($target) {
        console.log("render", this);
        if (!$target) {
            throw new Error("$target is not defined");
        }
        this.$target = $target;
        this.$el = this.compile();
        if (this.$el) {
            $target.append(this.$el);
        }
    }

    update() {
        console.log("update", this);
        const $el = this.compile();
        if (this.$target) {
            if ($el === null) {
                if (this.$el) {
                    this.$el.remove();
                }
                this.$el = null;
            } else {
                if (this.$el && this.$el.parentNode) {
                    this.$target.replaceChild($el, this.$el);
                } else {
                    this.$target.append($el);
                }
                this.$el = $el;
            }
        }
    }
}
