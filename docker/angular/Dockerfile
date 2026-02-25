FROM --platform=$BUILDPLATFORM node:20-alpine AS frontend-build

RUN apk add --no-cache git openjdk21

# проверить версию (опционально)
RUN java -version

WORKDIR /app

# 👇 Install git (required for git-based npm deps)
RUN apk add --no-cache git

COPY whui-client/ ./
COPY api-docs.yaml ./

RUN npm install
RUN npm run api:clean:gen
RUN npm run whui-client:clean:build


