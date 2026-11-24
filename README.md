# MOVENTHY — prototype

Le sport qui s'adapte à ta vie, et non l'inverse. *Move. Grow. Evolve.*

Application web installable (PWA), hors ligne, sans compte : toutes les données restent sur l'appareil.

## Mise en ligne (GitHub Pages)
1. Créer le dépôt `moventhy` sur GitHub et y déposer tout le contenu de ce dossier (à la racine).
2. Settings → Pages → Source : *Deploy from a branch*, branche `main`, dossier `/ (root)`.
3. Ouvrir `https://<compte>.github.io/moventhy/` dans Safari → Partager → *Sur l'écran d'accueil*.

## Fichiers
- `data.js` : disciplines, matériel, fiches exercices (v0.1, à valider par un coach), poses animées, événements de démo (fictifs)
- `engine.js` : moteur de coaching déterministe (génération, phases, faisabilité, recalculs)
- `fig.js` : démonstrations animées
- `app.js` : interface (onboarding, Aujourd'hui, Plan, Explorer, Progression, Profil, lecteur de séance)

Pour publier une mise à jour, changer `CACHE` dans `sw.js` (ex. `moventhy-0.1.1`).
