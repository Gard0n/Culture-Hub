# 🚀 Déployer Culture Hub en ligne (Firebase Hosting)

## Étape 1 : Installer Firebase CLI

```bash
npm install -g firebase-tools
```

## Étape 2 : Se connecter à Firebase

```bash
firebase login
```

(Une fenêtre de navigateur s'ouvrira pour te connecter avec ton compte Google)

## Étape 3 : Initialiser Firebase dans le projet

```bash
cd project-ideas/culture-hub/app
firebase init hosting
```

**Réponses aux questions** :
- Use an existing project ? → **Oui**
- Sélectionner : **culture-hub-grdn**
- What do you want to use as your public directory? → **dist**
- Configure as a single-page app? → **Yes**
- Set up automatic builds and deploys with GitHub? → **No** (pour l'instant)
- File dist/index.html already exists. Overwrite? → **No**

## Étape 4 : Build & Deploy

```bash
npm run build
firebase deploy
```

## Étape 5 : C'est en ligne ! 🎉

Firebase te donnera une URL comme :
```
https://culture-hub-grdn.web.app
```

ou

```
https://culture-hub-grdn.firebaseapp.com
```

---

## ⚠️ Mais AVANT de déployer...

**Il vaut mieux d'abord** :
1. ✅ Tester que tout fonctionne en local
2. ✅ Configurer les Firestore Rules
3. ✅ Vérifier que signup/login marchent

**Ensuite** on pourra déployer proprement.

---

## Alternative rapide : Vercel (plus simple)

Si tu veux un déploiement ultra-rapide :

```bash
npm install -g vercel
cd project-ideas/culture-hub/app
vercel
```

Vercel détecte automatiquement Vite et déploie en 30 secondes.

---

**Pour l'instant, concentre-toi sur tester en local !**
Une fois que tout marche bien, on déploie. 🚀
