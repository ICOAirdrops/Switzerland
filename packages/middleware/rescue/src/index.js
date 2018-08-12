export const handler = Symbol('@switzerland/error-handler');

/**
 * @function rescue ∷ Tree t, Props p ⇒ t → (p → p)
 * ---
 * Takes a list of middleware which includes one or more 'html' middleware items, and renders into the component
 * whenever an exception is raised in the processing of the middleware. If the 'rescue' middleware has not been
 * defined on the component, then a console error will be rendered instead, but only in development mode.
 */
export default function rescue(getView) {
    return props => {
        return { ...props, [handler]: getView };
    };
}
