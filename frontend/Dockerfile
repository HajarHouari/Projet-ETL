# Étape 1 : Construction (Utilisation de Debian 'slim' pour éviter l'erreur 254)
FROM node:20-slim AS build-stage
WORKDIR /app

# Copie des fichiers de configuration
COPY package*.json ./

# Installation propre (plus robuste que sur Alpine)
RUN npm install

# Copie du reste du code et création du build
COPY . .
RUN npm run build

# Étape 2 : Serveur final léger pour la production
FROM nginx:alpine
# On copie le résultat du build vers le dossier Nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]