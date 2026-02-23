/**
 * Custom HttpParameterCodec
 * Workaround for https://github.com/angular/angular/issues/18261
 */
export class CustomHttpParameterCodec {
    encodeKey(k) {
        return encodeURIComponent(k);
    }
    encodeValue(v) {
        return encodeURIComponent(v);
    }
    decodeKey(k) {
        return decodeURIComponent(k);
    }
    decodeValue(v) {
        return decodeURIComponent(v);
    }
}
export class IdentityHttpParameterCodec {
    encodeKey(k) {
        return k;
    }
    encodeValue(v) {
        return v;
    }
    decodeKey(k) {
        return k;
    }
    decodeValue(v) {
        return v;
    }
}
//# sourceMappingURL=encoder.js.map