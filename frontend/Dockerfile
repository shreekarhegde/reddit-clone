# Stage 0: compile angular frontend
FROM node:latest as build
WORKDIR /app
COPY . . 
RUN npm install
RUN npm run build --prod

FROM nginx 
EXPOSE 4200
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html