# Étape 1 : Construction (Build)
# On utilise une image Debian (plus stable qu'alpine pour npm install)
FROM node:20 AS build-stage
WORKDIR /app

# On copie les fichiers de dépendances
COPY package*.json ./
RUN npm install

# On copie le reste du code et on build
COPY . .
RUN npm run build

# Étape 2 : Serveur final (Production)
# On utilise l'image officielle Nginx
FROM nginx:alpine
# On copie les fichiers générés depuis l'étape de build vers le dossier Nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]