import dom from 'jsdom';
import { cycleMiddleware } from '../core/utils.js';
import * as u from './utils.js';

/**
 * @function render ∷ ∀ a. [String, [(p → p)]]|String → Object String a → String
 */
export async function render(component, attrs = {}) {
    const { window } = new dom.JSDOM();
    const { name, middleware } = component;

    const node = window.document.createElement(name);
    node.classList.add('resolved');

    await cycleMiddleware(node, u.initialProps(node, middleware), middleware);

    return node.outerHTML;

    // if (isHeadless) {
    //     // Define the JSDOM globals if the current environment doesn't have them.
    //     global.window = dom.window;
    //     global.document = dom.window.document;
    // }

    // // Either use the passed node or create from the passed name.
    // const isComponent = Array.isArray(component);
    // const host = isComponent
    //     ? await u.parseComponent(component, node, attrs)
    //     : u.parseHtml(component);

    // // Render recursively each custom child element.
    // for (const name of elements.keys()) {
    //     const childNode = host.querySelector(name);
    //     const middleware = elements.get(name);
    //     childNode && (await render([name, middleware], {}, childNode));
    // }

    // if (isHeadless) {
    //     // Clean up the defined globals.
    //     delete global.window;
    //     delete global.document;
    // }

    // return host[isComponent ? 'outerHTML' : 'innerHTML'];
}
