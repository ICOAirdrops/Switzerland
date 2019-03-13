import hyper from 'https://cdn.jsdelivr.net/npm/hyperhtml@2.17.1/esm/index.js';
import { createBoundary } from '../../core/utils.js';

/**
 * @function template ∷ Template t, Props p ⇒ (p → t) → (p → p)
 */
export default function template(getView) {
    return async props => {
        const { node } = props;
        const boundary = createBoundary(node);
        const h = hyper(boundary);

        if (props.node.isConnected) {
            // Attach `h` to the current set of props, and all of its infinitely nested `props` where
            // the `props` haven't been shallowly copied.
            props.props.h = h;
            await getView({ ...props, h });
        }

        return { ...props, boundary };
    };
}
