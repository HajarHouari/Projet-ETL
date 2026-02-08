# Étape 1 : Construction (Build)
FROM node:20-slim AS build-stage
WORKDIR /app

COPY package*.json ./

# Allocation de RAM pour éviter l'erreur 254
ENV NODE_OPTIONS="--max-old-space-size=4096"

RUN npm install

COPY . .
RUN npm run build

# Étape 2 : Serveur de production (C'est cette partie qui manque !)
FROM nginx:alpine

# On copie le résultat du build vers le dossier par défaut de Nginx
# Note : vérifiez bien si votre projet génère 'dist' ou 'build'
COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80

# Nginx reste au premier plan pour maintenir le conteneur en vie
CMD ["nginx", "-g", "daemon off;"]