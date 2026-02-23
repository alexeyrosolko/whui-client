export class Configuration {
    constructor({ accessToken, apiKeys, basePath, credentials, encodeParam, encoder, password, username, withCredentials } = {}) {
        if (apiKeys) {
            this.apiKeys = apiKeys;
        }
        if (username !== undefined) {
            this.username = username;
        }
        if (password !== undefined) {
            this.password = password;
        }
        if (accessToken !== undefined) {
            this.accessToken = accessToken;
        }
        if (basePath !== undefined) {
            this.basePath = basePath;
        }
        if (withCredentials !== undefined) {
            this.withCredentials = withCredentials;
        }
        if (encoder) {
            this.encoder = encoder;
        }
        this.encodeParam = encodeParam !== null && encodeParam !== void 0 ? encodeParam : (param => this.defaultEncodeParam(param));
        this.credentials = credentials !== null && credentials !== void 0 ? credentials : {};
        // init default bearerAuth credential
        if (!this.credentials['bearerAuth']) {
            this.credentials['bearerAuth'] = () => {
                return typeof this.accessToken === 'function'
                    ? this.accessToken()
                    : this.accessToken;
            };
        }
    }
    /**
     * Select the correct content-type to use for a request.
     * Uses {@link Configuration#isJsonMime} to determine the correct content-type.
     * If no content type is found return the first found type if the contentTypes is not empty
     * @param contentTypes - the array of content types that are available for selection
     * @returns the selected content-type or <code>undefined</code> if no selection could be made.
     */
    selectHeaderContentType(contentTypes) {
        if (contentTypes.length === 0) {
            return undefined;
        }
        const type = contentTypes.find((x) => this.isJsonMime(x));
        if (type === undefined) {
            return contentTypes[0];
        }
        return type;
    }
    /**
     * Select the correct accept content-type to use for a request.
     * Uses {@link Configuration#isJsonMime} to determine the correct accept content-type.
     * If no content type is found return the first found type if the contentTypes is not empty
     * @param accepts - the array of content types that are available for selection.
     * @returns the selected content-type or <code>undefined</code> if no selection could be made.
     */
    selectHeaderAccept(accepts) {
        if (accepts.length === 0) {
            return undefined;
        }
        const type = accepts.find((x) => this.isJsonMime(x));
        if (type === undefined) {
            return accepts[0];
        }
        return type;
    }
    /**
     * Check if the given MIME is a JSON MIME.
     * JSON MIME examples:
     *   application/json
     *   application/json; charset=UTF8
     *   APPLICATION/JSON
     *   application/vnd.company+json
     * @param mime - MIME (Multipurpose Internet Mail Extensions)
     * @return True if the given MIME is JSON, false otherwise.
     */
    isJsonMime(mime) {
        const jsonMime = new RegExp('^(application\/json|[^;/ \t]+\/[^;/ \t]+[+]json)[ \t]*(;.*)?$', 'i');
        return mime !== null && (jsonMime.test(mime) || mime.toLowerCase() === 'application/json-patch+json');
    }
    lookupCredential(key) {
        const value = this.credentials[key];
        return typeof value === 'function'
            ? value()
            : value;
    }
    addCredentialToHeaders(credentialKey, headerName, headers, prefix) {
        const value = this.lookupCredential(credentialKey);
        return value
            ? headers.set(headerName, (prefix !== null && prefix !== void 0 ? prefix : '') + value)
            : headers;
    }
    addCredentialToQuery(credentialKey, paramName, query) {
        const value = this.lookupCredential(credentialKey);
        return value
            ? query.set(paramName, value)
            : query;
    }
    defaultEncodeParam(param) {
        // This implementation exists as fallback for missing configuration
        // and for backwards compatibility to older typescript-angular generator versions.
        // It only works for the 'simple' parameter style.
        // Date-handling only works for the 'date-time' format.
        // All other styles and Date-formats are probably handled incorrectly.
        //
        // But: if that's all you need (i.e.: the most common use-case): no need for customization!
        const value = param.dataFormat === 'date-time' && param.value instanceof Date
            ? param.value.toISOString()
            : param.value;
        return encodeURIComponent(String(value));
    }
}
//# sourceMappingURL=configuration.js.map