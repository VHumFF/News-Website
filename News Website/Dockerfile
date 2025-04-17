FROM node:20 AS build

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy all source files
COPY . .

# Ensure Vite has execute permission
RUN chmod +x node_modules/.bin/vite

# Run build
RUN npm run build

FROM nginx:alpine

# Copy build result to nginx's public directory
COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf


EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
