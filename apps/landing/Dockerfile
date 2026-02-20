FROM node:20-alpine AS build
WORKDIR /app
COPY apps/landing/package.json .
RUN npm install
COPY apps/landing .
RUN npm run build

FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
