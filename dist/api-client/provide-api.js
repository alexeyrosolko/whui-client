import { makeEnvironmentProviders } from "@angular/core";
import { Configuration } from './configuration';
import { BASE_PATH } from './variables';
// Returns the service class providers, to be used in the [ApplicationConfig](https://angular.dev/api/core/ApplicationConfig).
export function provideApi(configOrBasePath) {
    return makeEnvironmentProviders([
        typeof configOrBasePath === "string"
            ? { provide: BASE_PATH, useValue: configOrBasePath }
            : {
                provide: Configuration,
                useValue: new Configuration({ ...configOrBasePath }),
            },
    ]);
}
//# sourceMappingURL=provide-api.js.map