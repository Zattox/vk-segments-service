FROM node:18-alpine

# Рабочая директория
WORKDIR /app

# Копируем package-файлы и устанавливаем зависимости
COPY package.json package-lock.json ./
RUN npm install

# Копируем весь фронтенд-код
COPY . .

# Открываем порт
EXPOSE 3000

# Запуск dev-сервера
CMD ["npm", "start"]
