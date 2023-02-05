FROM node:16.13-alpine AS build_stage

RUN apk add --update python3 build-base

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app
COPY yarn.lock /usr/src/app

RUN yarn install --development

COPY . .

RUN yarn build

FROM node:16.13-alpine AS runtime_stage

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app
COPY yarn.lock /usr/src/app

RUN yarn install --production

COPY . .
COPY --from=build_stage /usr/src/app/dist ./dist

CMD ["node", "dist/main"]
