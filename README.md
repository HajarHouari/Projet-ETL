# ☕ Cafe Sales ETL Project

Ce projet est une application web complète **(Fullstack)** permettant de traiter, transformer et visualiser des données de ventes de café. Il intègre un pipeline **ETL** (Extract, Transform, Load), une API REST avec **FastAPI** et un tableau de bord **React**.

---

## 🏗️ Architecture du Projet

Le projet est divisé en trois composants principaux :

- **Backend (FastAPI)** : Gère le pipeline ETL (extraction depuis CSV, transformation et chargement dans une base SQLite) et expose les données via une API.
- **Frontend (React + Vite)** : Un tableau de bord interactif utilisant Chart.js pour visualiser les tendances de ventes et les statistiques.
- **Infrastructure** : Déploiement conteneurisé avec Docker Compose et orchestration sur un cluster Kubernetes (K3s).

---

## 🚀 Installation Rapide (Docker)

Le moyen le plus simple de lancer le projet localement est d'utiliser Docker Compose :

1. Cloner le dépôt :
   ```bash
   git clone <url-du-repo>
   cd Projet-ETL
   ```

2. Lancer les services :
   ```bash
   docker-compose up --build
   ```

3. Accéder aux services :
   - **Frontend** : http://localhost:3000
   - **Backend (API)** : http://localhost:8000

---

## 🛠️ Stack Technique

### Backend
| Composant | Technologie |
|-----------|-------------|
| Framework | FastAPI |
| Base de données | SQLite |
| Pipeline ETL | Scripts Python personnalisés |
| CORS | Configuré pour toutes les origines |

### Frontend
| Composant | Technologie |
|-----------|-------------|
| Framework | React 19 |
| Outil de build | Vite |
| Visualisation | Chart.js |
| Styles | CSS standard |

---

## 🌐 Déploiement Kubernetes

Le projet est configuré pour être déployé sur un cluster **K3s**.

- **Namespace dédié** : `tp-microservices`
- **Accès distant** : `http://74.208.149.167:30766`
- **CI/CD** : Déploiements automatisés via GitHub Actions

### Commandes utiles

```bash
# Changer de namespace
alias ktp='kubectl config set-context --current --namespace=tp-microservices'

# Voir les pods
kubectl get pods

# Voir les logs du backend
kubectl logs -f deployment/backend-etl

# Voir les services
kubectl get services
```

---

## 📂 Structure des Fichiers

```
cafe-sales-etl/
├── backend/          # Code source de l'API et logique ETL
├── frontend/         # Application React et composants UI
├── deploy/           # Manifestes Kubernetes (Deployments, Services, Ingress, PVC)
└── docker-compose.yml  # Configuration pour le développement local
```

---

## 🔄 Pipeline ETL

Le pipeline ETL suit les étapes suivantes :

1. **Extract** — Lecture des données brutes depuis un fichier CSV
2. **Transform** — Nettoyage, validation et agrégation des données
3. **Load** — Chargement des données transformées dans SQLite


---

## 📝 Licence

Ce projet est à usage éducatif.




