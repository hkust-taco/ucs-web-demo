FROM node:22.4-alpine AS build

WORKDIR /app

ENV USE_PUBLISHED_BUILD=true

COPY . .

RUN npm install

RUN npm run build

FROM node:22.4-alpine

COPY --from=build /app/dist /www

WORKDIR /www

RUN npm i -g serve

EXPOSE 3000

CMD [ "serve", "-s", "." ]
