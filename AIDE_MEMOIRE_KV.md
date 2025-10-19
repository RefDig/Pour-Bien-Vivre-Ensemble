# 🎯 AIDE-MÉMOIRE RAPIDE - Configuration KV

## 📍 Où vous êtes maintenant
Dashboard Cloudflare ouvert → Cherchez votre projet

## 🗺️ Chemin complet à suivre

```
Dashboard Cloudflare
    ↓
Workers & Pages (menu gauche)
    ↓
pour-bien-vivre-ensemble (cliquez sur le nom)
    ↓
Settings (onglet en haut)
    ↓
Functions (menu gauche)
    ↓
Scroll down → KV namespace bindings
    ↓
Add binding (bouton)
```

## ✏️ Informations à saisir

### Binding 1 - Galerie
```
Variable name: GALERIE_DATA
KV namespace: [Create new namespace]
Namespace name: pbve-galerie-data
```

### Binding 2 - Réalisations
```
Variable name: REALISATIONS_DATA
KV namespace: [Create new namespace]
Namespace name: pbve-realisations-data
```

## 🎯 Résultat final attendu

Après configuration, vous devriez voir :
```
KV namespace bindings:
- GALERIE_DATA      → pbve-galerie-data
- REALISATIONS_DATA → pbve-realisations-data
```

## ⚡ Actions après Save

1. Aller dans "Deployments"
2. Trouver le dernier déploiement (commit 2319a33)
3. Cliquer sur les 3 points (︙)
4. Cliquer sur "Retry deployment"
5. Attendre 1-2 minutes
6. Tester l'upload !

## 🎊 Test de validation

Une fois redéployé, testez :
```
https://pourbienvivreensemble.com/admin/galerie-fonctionnelle

1. Créer une catégorie "Test"
2. Si ça marche → ✅ KV configuré !
3. Si erreur → Vérifier les bindings
```

---

**Gardez ce fichier ouvert pendant la configuration !**
