FROM nginx:1.21-alpine

COPY ./build /usr/share/nginx/html

HEALTHCHECK CMD wget -q -O /dev/null http://localhost || exit 1
