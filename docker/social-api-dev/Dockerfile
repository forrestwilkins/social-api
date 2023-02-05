FROM node:16.13-alpine AS build_stage

RUN apk add --update python3 build-base

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app
COPY yarn.lock /usr/src/app

RUN npm install -D

COPY . .

RUN npm run build

FROM node:16.13-alpine AS runtime_stage

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY package.json /usr/src/app
COPY yarn.lock /usr/src/app

RUN npm install --only=production

COPY . .
COPY --from=build_stage /usr/src/app/dist ./dist

CMD ["node", "dist/main"]
