# Node.js imajını kullan
FROM node:18-alpine AS build

# Çalışma dizinini ayarla
WORKDIR /app

# package.json ve package-lock.json dosyalarını kopyala ve bağımlılıkları yükle
COPY package.json package-lock.json ./
RUN npm install

# Tüm dosyaları kopyala ve projeyi üretim moduna derle
COPY . .
RUN npm run build

# Çalıştırma aşaması
EXPOSE 3000
CMD ["npm", "start"]
