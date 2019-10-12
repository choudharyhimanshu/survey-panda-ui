
# ~~~~~~~ build ~~~~~~~~~~~~

FROM node:latest as builder

ENV NODE_ENV "production"

RUN mkdir /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/package.json

RUN npm install --silent

COPY . /usr/src/app
RUN npm run build

# ~~~~~~ serve ~~~~~~~~~~~~

FROM nginx:latest

ADD entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /usr/src/app/build /var/www

CMD /entrypoint.sh
