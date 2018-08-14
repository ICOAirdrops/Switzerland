/**
 * @function dispatchEvent ∷ ∀ a. HTMLElement e ⇒ e → String → Object String a → void
 * ---
 * Dispatches an event, merging in the current package's version for handling legacy events
 * if/when the payloads differ from version-to-version.
 */
export const dispatchEvent = node => (name, payload) => {
    node.dispatchEvent(
        new CustomEvent(name, {
            detail: { ...payload, version: '3.0.0' },
            bubbles: true,
            composed: true
        })
    );
};

/**
 * @function getEventName ∷ String → String
 * ---
 * Prepends all event names with the '@switzerland' scope.
 */
export const getEventName = label => {
    return `@switzerland/${label}`;
};

/**
 * @function getPrototype ∷ HTMLElement e ⇒ String → e
 * ---
 * Determines which constructor to extend from for the defining of the custom element. In most cases it
 * will be `HTMLElement` unless the user is extending an existing element.
 */
export const getPrototype = extendTag => {
    return extendTag
        ? document.createElement(extendTag).constructor
        : HTMLElement;
};

/**
 * @function getNamespace ∷ String|void
 * ---
 * Attempts to locate whether the JS file was included using a namespace, denoted by the "data-ns"
 * attribute on the <script /> tag.
 */
export const getNamespace = () => {
    try {
        return document.currentScript.dataset.ns || '';
    } catch (err) {
        return '';
    }
};

/**
 * @function consoleMessage ∷ String → String → void
 * ---
 * Takes a message and an optional console type for output. During minification this function will be removed
 * from the generated output if 'NODE_ENV' is defined as 'production', as it will be unused due to 'process.env'
 * checks later on in the code.
 */
export const consoleMessage = (text, type = 'error') => {
    console[type](`\uD83C\uDDE8\uD83C\uDDED Switzerland: ${text}.`);
};

export const parseStylesheetPaths = data => {
    const embeddedRegexp = /^data:(.*?),(.*?)/;
    const commentRegexp = /\/\*([\s\S]*?)\*\//g;
    const urlsRegexp = /(?:@import\s+)?url\s*\(\s*(("(.*?)")|('(.*?)')|(.*?))\s*\)|(?:@import\s+)(("(.*?)")|('(.*?)')|(.*?))[\s;]/gi;

    const isEmbedded = src => embeddedRegexp.test(src.trim());

    const getUrls = text => {
        let url;
        let urlMatch;
        const urls = [];

        text = text.replace(commentRegexp, '');

        while ((urlMatch = urlsRegexp.exec(text))) {
            url =
                urlMatch[3] ||
                urlMatch[5] ||
                urlMatch[6] ||
                urlMatch[9] ||
                urlMatch[11] ||
                urlMatch[12];

            if (url && !isEmbedded(url) && urls.indexOf(url) === -1) {
                urls.push(url);
            }
        }

        return urls;
    };

    return getUrls(data);
};

/**
 * @function escapeRegExp ∷ String → String
 */
export const escapeRegExp = value => {
    return value.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');
};
