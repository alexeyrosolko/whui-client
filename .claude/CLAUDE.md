# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

run to update library:
wh-client:start-pipeline

## What This Project Is

`whui-client` is an Angular workspace that auto-generates and publishes a strongly-typed TypeScript/Angular API client library (`wh-open-client` on npm). The library source is entirely generated from an OpenAPI spec (`api-docs.yaml`) — do not hand-edit files under `projects/whui-client/src/lib/api-client/`.

## Commands

```bash
# Install dependencies
npm install

# API client: clean generated files and regenerate from api-docs.yaml
npm run api:clean:gen

# Build the library
npm run whui-client:build

# Clean dist and rebuild
npm run whui-client:clean:build

# Run tests (Karma)
ng test

# Dev server (app shell, not the library)
npm start
```

## Architecture

### Code Flow

1. **API spec lives in `api-docs.yaml`** — 100+ KB OpenAPI YAML describing the backend REST API.
2. **`npm run api:gen`** uses OpenAPI Generator CLI (`openapitools.json`) to produce Angular service classes and model interfaces into `projects/whui-client/src/lib/api-client/`.
3. **`projects/whui-client/src/public-api.ts`** re-exports everything from `./lib/api-client` — this is the sole public surface of the library.
4. **`npm run whui-client:build`** uses `ng-packagr` to compile and bundle the library into `dist/whui-client/` (ESM2022 + FESM2022).

### Key Directories

| Path | Purpose |
|------|---------|
| `projects/whui-client/src/lib/api-client/` | Generated API client (do not edit) |
| `projects/whui-client/src/public-api.ts` | Library entry point |
| `api-docs.yaml` | OpenAPI specification (source of truth for the client) |
| `docker/java/` | Docker build that runs the Java backend to export `api-docs.yaml` |
| `docker/angular/` | Docker build that compiles and packages the Angular library |
| `.github/workflows/build.yml` | CI: auto-bumps patch version, regenerates client, builds & publishes |

### CI/CD Pipeline

Each push to `main`:
1. Starts the Java backend in Docker → waits for it on `localhost:8080` → downloads `/v3/api-docs.yaml`
2. Runs `api:clean:gen` to regenerate the Angular client
3. Builds the library via Docker
4. Auto-increments the patch version and commits (`Auto update from CI: vX.Y.Z`)
5. Publishes the built package to the `wh-open-client` repository

### TypeScript Config

Strict mode is fully enabled (`strict`, `noImplicitOverride`, `noPropertyAccessFromIndexSignature`). The path alias `whui-client` resolves to `./dist/whui-client` so the workspace app imports the library as it would in production.

## Triggering a Library Build

To trigger the CI pipeline to build and publish the library, append the current date to `README.md`, commit, and push:

```bash
echo "\n$(date)" >> README.md
git add README.md
git commit -m "start pipeline"
git push
```

CI will then auto-bump the patch version, regenerate the client, build, and publish.

## Updating the API Client

To update the client after the OpenAPI spec changes:

```bash
# Option A: have a running backend on :8080 then pull the spec manually, then:
npm run api:clean:gen

# Option B: edit api-docs.yaml directly, then:
npm run api:clean:gen
```

The generator config is in `openapitools.json` (generator version 7.20.0, output target: `typescript-angular`).

```NEVER RUN
NEVER RUN
npm install
on this project