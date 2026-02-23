import { HttpParams } from '@angular/common/http';
import { CustomHttpParameterCodec, IdentityHttpParameterCodec } from './encoder';
export var QueryParamStyle;
(function (QueryParamStyle) {
    QueryParamStyle[QueryParamStyle["Json"] = 0] = "Json";
    QueryParamStyle[QueryParamStyle["Form"] = 1] = "Form";
    QueryParamStyle[QueryParamStyle["DeepObject"] = 2] = "DeepObject";
    QueryParamStyle[QueryParamStyle["SpaceDelimited"] = 3] = "SpaceDelimited";
    QueryParamStyle[QueryParamStyle["PipeDelimited"] = 4] = "PipeDelimited";
})(QueryParamStyle || (QueryParamStyle = {}));
export class OpenApiHttpParams {
    /**
     * @param encoder  Parameter serializer
     * @param defaults Global defaults used when a specific parameter has no explicit options.
     *                 By OpenAPI default, explode is true for query params with style=form.
     */
    constructor(encoder, defaults) {
        var _a, _b;
        this.params = new Map();
        this.encoder = encoder || new CustomHttpParameterCodec();
        this.defaults = {
            explode: (_a = defaults === null || defaults === void 0 ? void 0 : defaults.explode) !== null && _a !== void 0 ? _a : true,
            delimiter: (_b = defaults === null || defaults === void 0 ? void 0 : defaults.delimiter) !== null && _b !== void 0 ? _b : ",",
        };
    }
    resolveOptions(local) {
        var _a, _b;
        return {
            explode: (_a = local === null || local === void 0 ? void 0 : local.explode) !== null && _a !== void 0 ? _a : this.defaults.explode,
            delimiter: (_b = local === null || local === void 0 ? void 0 : local.delimiter) !== null && _b !== void 0 ? _b : this.defaults.delimiter,
        };
    }
    /**
     * Replace the parameter's values and (optionally) its options.
     * Options are stored per-parameter (not global).
     */
    set(key, values, options) {
        const arr = Array.isArray(values) ? values.slice() : [values];
        const opts = this.resolveOptions(options);
        this.params.set(key, { values: arr, options: opts });
        return this;
    }
    /**
     * Append a single value to the parameter. If the parameter didn't exist it will be created
     * and use resolved options (global defaults merged with any provided options).
     */
    append(key, value, options) {
        const entry = this.params.get(key);
        if (entry) {
            // If new options provided, override the stored options for subsequent serialization
            if (options) {
                entry.options = this.resolveOptions({ ...entry.options, ...options });
            }
            entry.values.push(value);
        }
        else {
            this.set(key, [value], options);
        }
        return this;
    }
    /**
     * Serialize to a query string according to per-parameter OpenAPI options.
     * - If explode=true for that parameter → repeated key=value pairs (each value encoded).
     * - If explode=false for that parameter → single key=value where values are individually encoded
     *   and joined using the configured delimiter. The delimiter character is inserted AS-IS
     *   (not percent-encoded).
     */
    toString() {
        const records = this.toRecord();
        const parts = [];
        for (const key in records) {
            parts.push(`${key}=${records[key]}`);
        }
        return parts.join("&");
    }
    /**
     * Return parameters as a plain record.
     * - If a parameter has exactly one value, returns that value directly.
     * - If a parameter has multiple values, returns a readonly array of values.
     */
    toRecord() {
        const parts = {};
        for (const [key, entry] of this.params.entries()) {
            const encodedKey = this.encoder.encodeKey(key);
            if (entry.options.explode) {
                parts[encodedKey] = entry.values.map((v) => this.encoder.encodeValue(v));
            }
            else {
                const encodedValues = entry.values.map((v) => this.encoder.encodeValue(v));
                // join with the delimiter *unencoded*
                parts[encodedKey] = encodedValues.join(entry.options.delimiter);
            }
        }
        return parts;
    }
    /**
     * Return an Angular's HttpParams with an identity parameter codec as the parameters are already encoded.
     */
    toHttpParams() {
        const records = this.toRecord();
        let httpParams = new HttpParams({ encoder: new IdentityHttpParameterCodec() });
        return httpParams.appendAll(records);
    }
}
export function concatHttpParamsObject(httpParams, key, item, delimiter) {
    let keyAndValues = [];
    for (const k in item) {
        keyAndValues.push(k);
        const value = item[k];
        if (Array.isArray(value)) {
            keyAndValues.push(...value.map(convertToString));
        }
        else {
            keyAndValues.push(convertToString(value));
        }
    }
    return httpParams.set(key, keyAndValues, { explode: false, delimiter: delimiter });
}
function convertToString(value) {
    if (value instanceof Date) {
        return value.toISOString();
    }
    else {
        return value.toString();
    }
}
//# sourceMappingURL=query.params.js.map