FROM node:23.6.0-alpine3.21 AS build

WORKDIR /app

COPY package.json ./

RUN yarn install

ENV PATH /app/node_modules/.bin:$PATH

COPY . .

RUN yarn run build

FROM nginx:1.27.5-alpine3.21

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /var/www/html/

EXPOSE 5173

ENTRYPOINT ["nginx","-g","daemon off;"]