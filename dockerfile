FROM node:8.12.0

# Create app directory
WORKDIR /usr/src/app

ARG PORT
ARG ENVIRONMENT

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .

EXPOSE ${PORT}
ENV PORT ${PORT}
ENV ENVIRONMENT ${ENVIRONMENT}
CMD PORT=${PORT} ENVIRONMENT=${ENVIRONMENT} node gateway.js