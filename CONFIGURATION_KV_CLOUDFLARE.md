# 🔧 Configuration KV Namespaces Cloudflare Pages

## ❌ Problème actuel

Les fonctionnalités suivantes ne marchent pas en production :
- ❌ Téléversement de photos
- ❌ Création de catégories
- ❌ Ajout de réalisations

**Cause** : Les KV Namespaces ne sont pas liés au projet Cloudflare Pages

## ✅ SOLUTION : Configuration KV sur Cloudflare Pages

### Étape 1 : Accéder aux paramètres

1. Allez sur https://dash.cloudflare.com/
2. Cliquez sur **Workers & Pages**
3. Sélectionnez votre projet : **pour-bien-vivre-ensemble**
4. Cliquez sur **Settings** (Paramètres)

### Étape 2 : Configurer les KV Bindings

1. Dans le menu de gauche, cliquez sur **Functions**
2. Faites défiler jusqu'à **KV namespace bindings**
3. Cliquez sur **Add binding** (Ajouter un binding)

### Étape 3 : Ajouter GALERIE_DATA

**Premier binding :**
- **Variable name** : `GALERIE_DATA`
- **KV namespace** : Créez un nouveau namespace ou sélectionnez existant
  - Si nouveau : Nom = `pbve-galerie-data`
  - Si existant : ID = `42da596772d84aa3bbf313755fca2fde`

### Étape 4 : Ajouter REALISATIONS_DATA

**Second binding :**
- **Variable name** : `REALISATIONS_DATA`
- **KV namespace** : Créez un nouveau namespace ou sélectionnez existant
  - Si nouveau : Nom = `pbve-realisations-data`
  - Si existant : ID = `66a3c6babc1d4867bd97f5d90b31a454`

### Étape 5 : Sauvegarder

1. Cliquez sur **Save**
2. Un message devrait apparaître : "Settings saved"

### Étape 6 : Redéployer

**Option A : Via Dashboard**
1. Allez dans **Deployments**
2. Sur le dernier déploiement (2319a33), cliquez sur **︙** (trois points)
3. Cliquez sur **Retry deployment**

**Option B : Via Git (Recommandé)**
```bash
git commit --allow-empty -m "chore: Trigger redeploy with KV configured"
git push origin main
```

## 📸 Guide visuel (étapes détaillées)

### 1. Dashboard Cloudflare
```
Dashboard → Workers & Pages → pour-bien-vivre-ensemble
```

### 2. Settings → Functions
```
Settings (menu gauche)
↓
Functions
↓
Scroll down to "KV namespace bindings"
↓
Click "Add binding"
```

### 3. Formulaire de binding
```
┌─────────────────────────────────────┐
│ Variable name: GALERIE_DATA         │
│ KV namespace: [Select or Create]    │
└─────────────────────────────────────┘

Si le namespace n'existe pas :
- Cliquez sur "Create new namespace"
- Nom : pbve-galerie-data
- Save

Si le namespace existe déjà :
- Sélectionnez-le dans la liste
```

### 4. Répétez pour REALISATIONS_DATA
```
┌─────────────────────────────────────┐
│ Variable name: REALISATIONS_DATA    │
│ KV namespace: [Select or Create]    │
└─────────────────────────────────────┘
```

## ✅ Vérification après configuration

### Test 1 : Créer une catégorie
1. Allez sur https://pourbienvivreensemble.com/admin/galerie-fonctionnelle
2. Dans "Gérer les Catégories", ajoutez "Test"
3. Cliquez sur le bouton "+"
4. ✅ La catégorie devrait apparaître dans "Catégories existantes"

### Test 2 : Téléverser une photo
1. Remplissez le formulaire "Ajouter une Photo"
2. Sélectionnez une image
3. Cliquez sur "Ajouter la Photo"
4. ✅ La photo devrait apparaître dans "Photos de la Galerie"

### Test 3 : Créer une réalisation
1. Allez sur /admin/realisations
2. Créez une nouvelle réalisation
3. ✅ Elle devrait apparaître dans la liste

## 🔍 Troubleshooting

### Erreur : "Cannot read properties of undefined"
- **Cause** : KV bindings pas configurés
- **Solution** : Suivez les étapes 1-6 ci-dessus

### Erreur : "KV namespace not found"
- **Cause** : L'ID du namespace est incorrect ou n'existe pas
- **Solution** : Créez de nouveaux namespaces

### Les données ne persistent pas
- **Cause** : Les bindings ne sont pas sauvegardés
- **Solution** : Vérifiez dans Settings → Functions que les deux bindings apparaissent

### Comment vérifier que c'est bien configuré ?
1. Settings → Functions → KV namespace bindings
2. Vous devriez voir :
```
GALERIE_DATA      → pbve-galerie-data
REALISATIONS_DATA → pbve-realisations-data
```

## 📊 Alternative : Utiliser la D1 Database

Si vous préférez utiliser une base de données SQL au lieu de KV :

### Configuration D1
```bash
# Créer la base de données
npx wrangler d1 create pbve-database

# Appliquer les migrations
npx wrangler d1 migrations apply pbve-database --remote

# Lier à Pages
# Dashboard → Settings → Functions → D1 database bindings
# Variable: DB
# Database: pbve-database
```

### Avantages D1
- ✅ Relations entre tables
- ✅ Requêtes SQL complexes
- ✅ Meilleure pour données structurées

### Avantages KV
- ✅ Plus rapide pour lecture
- ✅ Plus simple pour key-value
- ✅ Meilleur pour cache

## 🎯 Résumé des étapes

1. ✅ Aller sur Dashboard Cloudflare
2. ✅ Workers & Pages → pour-bien-vivre-ensemble
3. ✅ Settings → Functions → KV namespace bindings
4. ✅ Ajouter GALERIE_DATA
5. ✅ Ajouter REALISATIONS_DATA
6. ✅ Save
7. ✅ Redéployer (git push ou retry deployment)
8. ✅ Tester upload photos et catégories

## 📞 Support

Si problème persiste :
- Vérifiez la console navigateur (F12)
- Vérifiez les logs Cloudflare (Real-time Logs)
- Vérifiez que les bindings sont bien visibles dans Settings

---

**Une fois configuré, toutes les fonctionnalités de téléversement fonctionneront ! 🚀**
