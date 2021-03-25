FROM node:latest as build
WORKDIR /app
COPY . . 
RUN npm install
RUN npm run build --prod

FROM nginx 
EXPOSE 4200
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html