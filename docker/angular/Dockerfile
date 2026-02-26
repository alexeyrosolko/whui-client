FROM --platform=$BUILDPLATFORM node:20-alpine AS frontend-build

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
RUN npm run api:clean:gen
RUN npm run whui-client:clean:build
#          cp -r $(pwd)/dist/esm2022 .
#          cp -r $(pwd)/dist/fesm2022 .
#          cp -r $(pwd)/dist/lib .
#          cp $(pwd)/dist/.npmignore .
#          cp $(pwd)/dist/package.json .
#          cp $(pwd)/dist/public-api.d.ts .
#          cp $(pwd)/dist/README.md .


