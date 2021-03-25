# Stage 0: compile angular frontend
FROM node:latest as build
WORKDIR /app
COPY . . 
RUN npm install
RUN npm run build --prod

FROM nginx 
EXPOSE 4200
#copy dist content to html nginx folder, config nginx to point in index.html
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

COPY ./default.conf /etc/nginx/conf.d/default.conf