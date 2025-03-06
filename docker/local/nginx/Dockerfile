ARG NGINX_VERSION=1.27.4-alpine

FROM nginx:${NGINX_VERSION}

#Remove existing default configuration from nginx
RUN rm /etc/nginx/conf.d/default.conf

#Add our config file to nginx
COPY ./default.conf /etc/nginx/conf.d/default.conf