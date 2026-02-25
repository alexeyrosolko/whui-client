FROM --platform=$BUILDPLATFORM node:20-alpine AS frontend-build

RUN apk add --no-cache git openjdk21

# проверить версию (опционально)
RUN java -version

WORKDIR /app

# 👇 Install git (required for git-based npm deps)
RUN apk add --no-cache git

COPY ./ ./

RUN npm install
RUN npm run api:clean:gen
RUN npm run whui-client:clean:build
#          cp -r $(pwd)/dist/esm2022 .
#          cp -r $(pwd)/dist/fesm2022 .
#          cp -r $(pwd)/dist/lib .
#          cp $(pwd)/dist/.npmignore .
#          cp $(pwd)/dist/package.json .
#          cp $(pwd)/dist/public-api.d.ts .
#          cp $(pwd)/dist/README.md .


