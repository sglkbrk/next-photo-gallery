# 1) Builder Stage
FROM node:18-alpine AS builder
WORKDIR /app

RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma/
RUN npm install --production=false

COPY . .
RUN npx prisma generate
RUN npm run build

# 2) Runner Stage
FROM node:18-alpine AS runner
WORKDIR /app

RUN apk add --no-cache openssl

ENV NODE_ENV=production
ENV PORT=3001
ENV HOST=127.0.0.1
ENV UPLOADS_DIR=/app/uploads

COPY --from=builder /app ./

RUN mkdir -p /app/uploads

EXPOSE 3001

CMD ["npm", "run", "start"]
