FROM nginx:1.13.1
COPY default.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html
