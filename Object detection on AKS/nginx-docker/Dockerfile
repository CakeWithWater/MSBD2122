FROM nginx:1.21
MAINTAINER "ZHU"
LABEL description="frontend"
COPY dist/ /usr/share/nginx/html/
COPY default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
