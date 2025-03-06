ARG NODE_VERSION=22-alpine3.20

FROM node:${NODE_VERSION}

LABEL name="invoicegeneratorui"
LABEL description="Frontend for invoicegenerator"
LABEL licence="MIT"

ARG APP_HOME=/app

WORKDIR ${APP_HOME}

COPY package*.json ./

RUN npm install

CMD ["npm", "run", "start"]

