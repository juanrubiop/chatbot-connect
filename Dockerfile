FROM             node:18.14.2-alpine3.17 as build-stage
WORKDIR          /app
COPY             . .
RUN              npm install
EXPOSE           80
CMD              ["node", "app/server.js"]
