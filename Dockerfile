# # 1) Builder Stage
# FROM node:18-alpine AS builder
# WORKDIR /app

# COPY package*.json ./
# RUN npm install --production=false

# COPY . .
# RUN npm run build

# # 2) Runner Stage
# FROM node:18-alpine AS runner
# WORKDIR /app

# ENV NODE_ENV=production
# ENV PORT=3001
# ENV HOST=127.0.0.1

# COPY --from=builder /app ./

# RUN npm install --production --ignore-scripts --prefer-offline

# EXPOSE 3001

# # Sadece localhost'a bind ederek çalıştır
# CMD ["sh", "-c", "HOST=127.0.0.1 PORT=3001 npm run start"]

# 1) Builder Stage
FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install --production=false

COPY . .
RUN npm run build

# 2) Runner Stage
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001
ENV HOST=127.0.0.1

# Builder’dan her şeyi getir
COPY --from=builder /app ./

# ❌ Burayı tamamen SİLDİK
# RUN npm install --production --ignore-scripts --prefer-offline

EXPOSE 3001

# Sadece normal start → ENV’den HOST & PORT alır
CMD ["npm", "run", "start"]
