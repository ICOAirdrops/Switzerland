import { h, patch } from 'superfine';
import * as u from './utils';

export { h };

/**
 * @function html ∷ Tree t, Props p ⇒ (void → t) → (p → p)
 * ---
 * Takes a virtual DOM representation that will render to the node's shadow boundary. For size reasons, Switzerland
 * uses Picodom over VirtualDOM, and as such you can use the Picodom documentation for reference.
 */
export default function html(getView, options = {}) {
    return async props => {
        const boundary = u.createShadowRoot(props, options);

        if (props.node.isConnected) {
            const view = await getView(props);
            const tree = patch(u.takeTree(props.node), view, boundary);
            u.putTree(props.node, tree);
        }

        return { ...props, boundary };
    };
}

// Convenience export to prevent an explicit import of `h` as well as the default import.
html.h = h;
