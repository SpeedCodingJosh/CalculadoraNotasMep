
# Base image
FROM node:14.16.0-alpine

# Set working directory
WORKDIR /calculator/

COPY package-lock.json /calculator/package-lock.json
COPY package.json /calculator/package.json

RUN npm install

COPY public /calculator/public
# COPY scripts /calculator/scripts
COPY routes /calculator/routes
COPY views /calculator/views
# COPY .env /calculator/.env
COPY app.js /calculator/app.js
RUN npm audit fix

# Start app
CMD ["npm", "start"]
