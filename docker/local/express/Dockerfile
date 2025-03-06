ARG NODE_VERSION=22-alpine3.20

FROM node:${NODE_VERSION}

LABEL name="invoice-generator"
LABEL licence="MIT"
LABEL description="invoice generator image"

ENV NODE_ENV=development

ARG APP_HOME=/app

WORKDIR ${APP_HOME}

RUN addgroup --system invoice && adduser --system --ingroup invoice invoice

COPY package*.json ./

RUN npm install

COPY --chown=invoice:invoice . ${APP_HOME}

RUN chown invoice:invoice ${APP_HOME}

USER invoice

CMD ["npm", "run", "dev"]