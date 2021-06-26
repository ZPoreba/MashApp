# The first stage
# Build React static files
FROM node:13.12.0-alpine as build

WORKDIR /mash-app/client
COPY ./client/package.json ./
COPY ./client/package-lock.json ./
RUN npm ci --silent
COPY ./client/ ./
RUN npm run build

# The second stage
# Copy React static files and start nginx
FROM nginx:stable-alpine
COPY --from=build /mash-app/client/build /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]