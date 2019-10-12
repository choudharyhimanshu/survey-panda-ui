#!/bin/bash

set -x

sed -i "s#&&port&&#$PORT#g" /etc/nginx/conf.d/default.conf

exec nginx -g 'daemon off;'
