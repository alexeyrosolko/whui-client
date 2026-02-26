FROM --platform=$BUILDPLATFORM node:20-alpine AS openapi-build

# system deps
RUN apk add --no-cache git openjdk21

WORKDIR /app

# ---- cache layer ----
COPY package*.json ./

RUN npm ci

# ---- source code ----
COPY . .

# optional debug
RUN pwd && ls -la

# build steps
RUN npm run api:clean:gen && npm run whui-client:clean:build

FROM scratch AS export
COPY --from=openapi-build /app/dist /dist
