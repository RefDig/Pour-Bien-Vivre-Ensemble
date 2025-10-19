# 🚀 SCRIPT DE CONFIGURATION INTERACTIVE KV

## ✅ ÉTAPE 1 : Accéder au projet
**Action** : Dans Dashboard Cloudflare
- [ ] Menu gauche → "Workers & Pages"
- [ ] Trouver "pour-bien-vivre-ensemble"
- [ ] Cliquer sur le nom du projet

✅ **Fait ? Passez à l'étape 2**

---

## ✅ ÉTAPE 2 : Aller dans Settings
**Action** : Une fois sur la page du projet
- [ ] Cliquer sur l'onglet "Settings" (en haut)
- [ ] Dans le menu latéral gauche, trouver "Functions"
- [ ] Cliquer sur "Functions"

✅ **Fait ? Passez à l'étape 3**

---

## ✅ ÉTAPE 3 : Trouver KV bindings
**Action** : Sur la page Functions
- [ ] Scrollez vers le bas
- [ ] Trouvez la section "KV namespace bindings"
- [ ] Vous devriez voir un bouton "Add binding"

✅ **Fait ? Passez à l'étape 4**

---

## ✅ ÉTAPE 4 : Créer le premier binding (GALERIE)

**Action** : Cliquer sur "Add binding"

Un formulaire apparaît :

### Champ 1 : Variable name
```
GALERIE_DATA
```
⚠️ **Important** : Copiez exactement, avec les majuscules !

### Champ 2 : KV namespace
- [ ] Cliquez sur le menu déroulant
- [ ] Si un namespace existe déjà avec "galerie", sélectionnez-le
- [ ] Sinon, cliquez sur "Create new namespace"

### Si vous créez un nouveau namespace :
```
Namespace name: pbve-galerie-data
```

- [ ] Cliquez "Create"
- [ ] Le namespace est créé et sélectionné automatiquement

✅ **Fait ? Passez à l'étape 5**

---

## ✅ ÉTAPE 5 : Créer le second binding (REALISATIONS)

**Action** : Cliquer à nouveau sur "Add binding"

### Champ 1 : Variable name
```
REALISATIONS_DATA
```
⚠️ **Important** : Copiez exactement, avec les majuscules !

### Champ 2 : KV namespace
- [ ] Cliquez sur le menu déroulant
- [ ] Si un namespace existe déjà avec "realisations", sélectionnez-le
- [ ] Sinon, cliquez sur "Create new namespace"

### Si vous créez un nouveau namespace :
```
Namespace name: pbve-realisations-data
```

- [ ] Cliquez "Create"
- [ ] Le namespace est créé et sélectionné automatiquement

✅ **Fait ? Passez à l'étape 6**

---

## ✅ ÉTAPE 6 : Sauvegarder

**Action** : En bas de la page
- [ ] Cliquez sur le bouton "Save" (ou "Enregistrer")
- [ ] Attendez le message de confirmation
- [ ] ✅ "Settings saved" ou "Paramètres enregistrés"

### Vérification
Vous devriez maintenant voir dans "KV namespace bindings" :
```
GALERIE_DATA      → pbve-galerie-data
REALISATIONS_DATA → pbve-realisations-data
```

✅ **C'est bon ? Passez à l'étape 7**

---

## ✅ ÉTAPE 7 : Redéployer

**Action** : Maintenant que les KV sont configurés, redéployez

### Option A : Via Dashboard (Recommandé)
- [ ] Cliquez sur l'onglet "Deployments" (en haut)
- [ ] Trouvez le dernier déploiement (normalement commit 2319a33)
- [ ] À droite, cliquez sur les 3 points verticaux (︙)
- [ ] Cliquez sur "Retry deployment"
- [ ] Attendez 1-2 minutes que le build se termine

### Option B : Via Git
```bash
git commit --allow-empty -m "chore: Redeploy with KV configured"
git push origin main
```

✅ **Déploiement lancé ? Passez à l'étape 8**

---

## ✅ ÉTAPE 8 : Vérifier que le déploiement a réussi

**Action** : Sur la page Deployments
- [ ] Attendez que le statut devienne "Success" (vert)
- [ ] Vous devriez voir le badge ✅ vert à côté du commit

⏱️ **Temps estimé** : 1-2 minutes

✅ **Build réussi ? Passez à l'étape 9**

---

## ✅ ÉTAPE 9 : TESTER !

**Action** : Testez l'upload de photos

1. **Ouvrez** : https://pourbienvivreensemble.com/admin/galerie-fonctionnelle

2. **Test 1 - Créer une catégorie** :
   - [ ] Dans "Gérer les Catégories"
   - [ ] Tapez "Test" dans le champ
   - [ ] Cliquez sur le bouton "+" bleu
   - [ ] ✅ La catégorie "Test" apparaît dans "Catégories existantes"

3. **Test 2 - Ajouter une photo** :
   - [ ] Remplissez le formulaire "Ajouter une Photo"
   - [ ] Titre : "Photo test"
   - [ ] Description : "Test upload"
   - [ ] Catégorie : Sélectionnez "Test"
   - [ ] Sélectionnez une image
   - [ ] Cliquez "Ajouter la Photo"
   - [ ] ✅ La photo apparaît dans "Photos de la Galerie (1)"

---

## 🎉 SUCCÈS !

Si les deux tests fonctionnent :
- ✅ **KV Namespaces configurés correctement**
- ✅ **Upload de photos fonctionne**
- ✅ **Création de catégories fonctionne**
- ✅ **Application 100% opérationnelle**

---

## ⚠️ DÉPANNAGE

### La catégorie ne s'ajoute pas
- Vérifiez que GALERIE_DATA est bien lié dans Settings → Functions
- Vérifiez que le redéploiement a réussi
- Ouvrez la console (F12) et vérifiez les erreurs

### L'upload de photo ne marche pas
- Même vérifications que ci-dessus
- Vérifiez la taille de l'image (< 25MB)
- Vérifiez le format (jpg, png, gif)

### Message "KV namespace not found"
- Retournez dans Settings → Functions
- Vérifiez que les deux bindings sont présents
- Si absents, recommencez l'étape 4 et 5

---

## 📞 BESOIN D'AIDE ?

Si vous êtes bloqué à une étape :
1. Notez le numéro de l'étape
2. Notez le message d'erreur (si erreur)
3. Faites une capture d'écran
4. Demandez de l'aide avec ces informations

---

**Temps total estimé** : 5-10 minutes
**Niveau de difficulté** : Facile ⭐

🚀 **Bonne configuration !**
