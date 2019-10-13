#!/bin/bash

set -x

sed -i "s#&&port&&#$PORT#g" /etc/nginx/conf.d/default.conf

sed -i "s#&&apiUrl&&#$API_URL#g" /var/www/static/js/main.*.js

exec nginx -g 'daemon off;'
