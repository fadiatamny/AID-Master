# Stage 1
FROM node:lts-alpine as fate
WORKDIR /app/client/
COPY ./ ./
RUN npm install
RUN npm run build

# Stage 2 - the production environment

FROM nginx:1.19.6
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=fate /app/client/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]