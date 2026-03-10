FROM node:24-alpine3.22 as builder

WORKDIR /app

COPY package.json /app/
COPY package-lock.json /app/

RUN npm ci && npm cache clean --force

COPY . /app

RUN npm run build

FROM node:24-alpine3.22

WORKDIR /app


COPY --from=builder /app/.output  /app/.output
COPY --from=builder /app/.nuxt  /app/.nuxt

ENV HOST 0.0.0.0 
ENV AUTH_ORIGIN http://localhost:3000/
ENV auth_secret __SET_SECRET__
EXPOSE 3000

ENTRYPOINT ["node", ".output/server/index.mjs"]
