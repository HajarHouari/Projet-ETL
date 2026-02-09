# Étape 1 : Construction (Build)
FROM node:20-slim AS build-stage
WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./

# Allocation de mémoire pour éviter les crashs (erreur 254)
ENV NODE_OPTIONS="--max-old-space-size=4096"

RUN npm install

# Copie du reste du code source
COPY . .

# Construction de l'application (génère le dossier /app/dist)
RUN npm run build

# Étape 2 : Serveur de production (Nginx)
FROM nginx:alpine

# Copie des fichiers compilés vers Nginx
# Vite génère par défaut un dossier 'dist'
COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]