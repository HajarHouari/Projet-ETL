# 🚀 Guide d'accès au Cluster Kubernetes (VPS IONOS)

Ce projet utilise un cluster K3s hébergé sur un VPS IONOS (74.208.149.167). Pour piloter le cluster depuis votre machine locale, suivez ces étapes.

## 1. Configuration du Kubeconfig

Le fichier de configuration (Kubeconfig) est stocké dans les GitHub Secrets du dépôt sous le nom `KUBE_CONFIG`.

### Pour votre machine locale (Mac/Linux) :

1. Récupérez la valeur du secret auprès de Nadim ou via le coffre-fort de l'équipe.

2. Créez un fichier local :
   ```bash
   nano ~/.kube/config-vps
   ```

3. Collez le contenu et enregistrez.

4. Activez la configuration dans votre terminal :
   ```bash
   export KUBECONFIG=~/.kube/config-vps
   ```

## 2. Alias et Namespace par défaut

Pour gagner du temps et éviter d'écrire `-n tp-microservices` à chaque commande, ajoutez ceci à votre fichier de configuration (`.zshrc` ou `.bashrc`) :

```bash
# Alias de base
alias k="kubectl"

# Configuration du fichier
export KUBECONFIG=~/.kube/config-vps

# Switch vers le namespace du projet
alias ktp='kubectl config set-context --current --namespace=tp-microservices'
```

N'oubliez pas de recharger votre terminal :
```bash
source ~/.zshrc
```

## 3. Commandes Utiles

Une fois configuré, vous pouvez surveiller l'infrastructure :

- **Vérifier les Pods :**
  ```bash
  k get pods
  ```

- **Voir les logs du Backend :**
  ```bash
  k logs -f deployment/backend-etl
  ```

- **Accès au Frontend :**  
  L'application est exposée sur http://74.208.149.167:30766

## ⚠️ Règles de sécurité

- **Namespace :** Travaillez uniquement dans `tp-microservices`. Ne modifiez pas les ressources dans `kube-system` ou `default`.

- **Ressources :** Ce serveur héberge d'autres projets personnels. Merci de toujours inclure des limits de RAM et CPU dans vos nouveaux déploiements.

- **Secrets :** Ne pushez jamais de fichiers `secrets.yaml` en clair sur GitHub. Utilisez les GitHub Secrets pour le pipeline CI/CD.