FROM node:alpine as builder

WORKDIR /app
COPY . .
RUN yarn install && yarn build

FROM nginx
EXPOSE 80
COPY --from=builder /app/public /usr/share/nginx/html
