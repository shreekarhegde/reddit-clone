FROM node:15.12.0-alpine as build
WORKDIR /app
COPY . . 
RUN npm install
RUN npm run build

FROM nginx:1.18.0-alpine
COPY --from=build /app/dist/frontend  /usr/share/nginx/html
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]