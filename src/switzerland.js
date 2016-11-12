import { diff, patch, create as createElement } from 'virtual-dom';
import { h as vdomH } from 'virtual-dom';
import OrderlyQueue from 'orderly-queue';
import implementation from './helpers/implementation';
import { htmlFor } from './middleware/html';
import { invokeFor, purgeFor } from './middleware/refs';
import { treeResolved, awaitEventName } from './middleware/await';
import { error } from './helpers/messages';

/**
 * @constant queueKey
 * @type {Symbol}
 */
const queueKey = Symbol('switzerland/queue');

/**
 * @constant lastPropsKey
 * @type {Symbol}
 */
export const lastPropsKey = Symbol('switzerland/last-props');

/**
 * @method clearHTMLFor
 * @param {HTMLElement} node
 * @return {void}
 */
const clearHTMLFor = node => {
    node.shadowRoot.innerHTML = '';
};

/**
 * @method create
 * @param {String} name
 * @param {Function} component
 * @return {void}
 */
export function create(name, component) {

    /**
     * @constant component
     * @type {Object}
     */
    implementation.customElement(name, class extends window.HTMLElement {

        /**
         * @method connectedCallback
         * @return {void}
         */
        [implementation.hooks[0]]() {

            const queue = this[queueKey] = new OrderlyQueue({ value: '' });

            queue.process(async () => {

                // Setup the shadow boundary for the current node.
                const node = this;
                node.shadowRoot && clearHTMLFor(node);
                const boundary = node.shadowRoot || implementation.shadowBoundary(node);

                try {

                    // Apply the middleware and wait for the props to be returned.
                    const props = await component({ node, render: node.render.bind(node) });

                    // Memorise the last props as it's useful in the methods middleware.
                    this[lastPropsKey] = props;

                    // Setup the Virtual DOM instance, and then append the component to the DOM.
                    const tree = htmlFor(props);
                    const root = createElement(tree);
                    boundary.insertBefore(root, boundary.firstChild);

                    // Invoke any ref callbacks defined in the component's `render` method.
                    'ref' in props && invokeFor(node);

                    /**
                     * @constant resolved
                     * @type {Promise}
                     */
                    node.resolved = (async () => {

                        // Setup listener for children being resolved.
                        await treeResolved(props);

                        // Emit the event that the node has been resolved.
                        node.dispatchEvent(new window.CustomEvent(awaitEventName, {
                            detail: node,
                            bubbles: true,
                            composed: true
                        }));

                    })();

                    return { tree, root, node };

                } catch (err) {

                    // Capture any errors that were thrown in processing the component.
                    error(err);

                }

            });

        }

        /**
         * @method disconnectedCallback
         * @return {void}
         */
        [implementation.hooks[1]]() {

            clearHTMLFor(this);

            // Once the node has been removed then we perform one last pass, however the render function
            // ensures the node is in the DOM before any reconciliation takes place, thus saving resources.
            this.render();

        }

        /**
         * @method render
         * @param {Object} [additionalProps = {}]
         * @return {void}
         */
        render(additionalProps = {}) {

            this[queueKey].process(async instance => {

                // Gather the props from the previous rendering of the component.
                const { tree: currentTree, root: currentRoot, node } = instance;

                try {

                    // Apply the middleware and wait for the props to be returned.
                    const props = await component({ ...additionalProps, node, render: node.render.bind(node) });

                    // Memorise the last props as it's useful in the methods middleware.
                    this[lastPropsKey] = props;

                    // Create the Virtual DOM tree based on the current props.
                    const tree = htmlFor(props);

                    // Clear any previously defined refs for the current component.
                    'ref' in props && purgeFor(node);

                    if (node.isConnected) {

                        // Diff and patch the current DOM state with the new one.
                        const patches = diff(currentTree, tree);
                        const root = patch(currentRoot, patches);

                        // Invoke any ref callbacks defined in the component's `render` method.
                        'ref' in props && invokeFor(node);

                        return { node, tree, root };

                    }

                } catch (err) {

                    // Capture any errors that were thrown in processing the component.
                    error(err);

                }

            });

        }

    });

}

export { default as path } from './helpers/path';
export { pipe, compose } from './helpers/composition';

/**
 * @method element
 * @param {HTMLElement} el
 * @param {Object} props
 * @param {Array} children
 * @return {Object}
 */
export const element = (el, props, ...children) => {
    return vdomH(el, props, children);
};

/**
 * @method h
 * @alias element
 * @return {Object}
 */
export const h = element;
