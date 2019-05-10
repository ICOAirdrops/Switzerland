import * as u from './utils.js';
import * as impl from './impl/index.js';

export { meta, Cancel } from './utils.js';

/**
 * @constant elements ∷ Map
 */
export const elements = new Map();

/**
 * @function init ∷ String → String → Boolean → (String → String)
 * @deprecated
 * ---
 * Utility function for referencing paths inside of your custom components. Allows you to encapsulate
 * the components by using the `import.meta.url` (or `document.currentScript` for non-module includes).
 * Detects when the component is being used on a different host where absolute paths will be used instead
 * of relative ones to allow components to be rendered cross-domain.
 */
export const init = (
    url,
    host = window.location.host,
    isHeadless = typeof require !== 'undefined'
) => path => {
    if (isHeadless) {
        return new URL(path, host);
    }
    const key = new URL(url).host === host ? 'pathname' : 'href';
    return new URL(path, url)[key];
};

/**
 * @function create ∷ Props p ⇒ String → [(p → Promise p)] → String
 * ---
 * Takes the name of the web component and an array of functions that represent the middleware. Each
 * middleware item takes in the accumulated props, and yields props to pass to the next item in the list.
 */
export const create = (name, ...middleware) => {
    try {
        const [tag, extension, tagExtend] = u.parseTagName(name);
        window.customElements.define(
            tag,
            impl.base(extension, middleware),
            tagExtend && { extends: tagExtend }
        );
        return tag;
    } catch {
        const type = [name, middleware];
        elements.set(name, middleware);
        type.toString = () => name;
        return type;
    }
};

/**
 * @function alias ∷ String → String → String
 * ---
 * Takes the name of an existing custom element, and creates a clone of it under a different name. No attempt
 * to find a unique name takes place in this function, and so if the new custom component name already exists, a
 * native ungraceful `customElements` exception will be thrown.
 */
export const alias = (name, alias) => {
    const CustomElement = window.customElements.get(name);
    const instance = new CustomElement();
    const [, extension] = u.parseTagName(alias);
    window.customElements.define(alias, impl.alias(extension, instance));
    return alias;
};
