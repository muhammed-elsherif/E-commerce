FROM node:18.16.0 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

FROM node:18.16.0-alpine

RUN addgroup -g 1001 appuser && adduser -D -u 1001 -G appuser appuser

WORKDIR /app

COPY --from=builder --chown=appuser:appuser /app .

EXPOSE 4000

USER appuser

CMD ["npm", "start"]
