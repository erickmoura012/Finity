# Etapa 1: instala as dependências e gera o build com o Vite
FROM node:24-alpine AS build

WORKDIR /app

# copia primeiro só o package.json pra aproveitar o cache do Docker
# (se as dependências não mudarem, o npm ci não roda de novo)
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Etapa 2: só a pasta dist vai pra imagem final, servida pelo Nginx
FROM nginx:stable-alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
