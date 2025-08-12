# ── 1. Этап сборки ─────────────────────────────────────────────
FROM node:18-alpine AS builder

WORKDIR /app

# Копируем package и lock-файл, устанавливаем зависимости
COPY package.json package-lock.json ./
RUN npm ci

# Копируем исходники и собираем
COPY . .
RUN npm run build

# ── 2. Этап финального образа ────────────────────────────────
FROM nginx:stable-alpine

# Убираем дефолтный конфиг и подставляем наш
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/

# Копируем собранную статику из builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Открываем порт
EXPOSE 80

# Запускаем nginx
CMD ["nginx", "-g", "daemon off;"]
