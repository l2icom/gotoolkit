# Go-Toolkit — des livrables produit “prêts à partager”, en quelques minutes

Go-Toolkit est une boîte à outils pensée pour les Product Owners, consultants et équipes produit qui ont besoin de **mettre en forme une idée rapidement** : cadrage, ateliers, planning, schémas, tableaux… avec un **copilote IA** et des **exports immédiats**.

L’objectif n’est pas de “faire de l’IA”, mais de **sortir des supports clairs et actionnables** (slides, roadmap, diagrammes, tables) sans passer par une installation lourde ni un outillage complexe.

## Ce que ça apporte (côté métier)

- **Accélère la préparation d’ateliers** : structurer un sujet, cadrer une décision, aligner le vocabulaire.
- **Améliore la qualité des livrables** : formats cohérents, prompts contextualisés, modèles prêts à l’emploi.
- **Réduit le temps de mise en forme** : édition directe dans l’interface + export PowerPoint/Excel/image/CSV/JSON.
- **Garde le contrôle** : tout fonctionne dans le navigateur ; le partage est toujours une action volontaire.

## Les 4 modules

- **50 Nuances** (`public/canvas.html`) : des “planches” éditables pour cadrer un sujet (roadmap, arbitrage, comparaison, parcours, alignement, etc.) et produire un contenu synthétique et présentable. Exports `PPTX`, image, `JSON` (capsule) + lien de partage optionnel.
- **Goal Digger** (`public/timeline.html`) : une timeline interactive pour construire / ajuster un planning (jalons, durées, dépendances), avec génération assistée. Exports texte, image, `XLSX`, `JSON` + lien de partage optionnel.
- **Le Cardinal** (`public/draw.html`) : un module de diagrammes pour illustrer un raisonnement (processus, séquence, modèle métier, etc.) avec génération IA et édition visuelle/texte. Export capsule `JSON` + lien de partage optionnel.
- **Module Grid** (`public/grid.html`) : un générateur de tableaux de données pour passer d’un sujet flou à une **table structurée** éditable. Export `CSV` + capsule `JSON` + lien de partage optionnel.

## Comment ça se passe (en 3 étapes)

1. **Choisis un module** et un modèle (quand disponible).
2. **Décris ton contexte** en langage naturel, puis lance la génération IA.
3. **Affines** (édition directe) puis **exportes** ou **partages** un lien.

## Confidentialité & partage

- Par défaut, les données restent **dans ton navigateur** (brouillons sauvegardés localement).
- Les exports sont **locaux** (fichiers téléchargés).
- Les **capsules** (fichiers `JSON`) servent à sauvegarder un livrable et à le reprendre plus tard.
- Le bouton **☍ Nexus** permet de générer un **lien de partage** uniquement si une API de partage est configurée.

## Essayer en 2 minutes

- Ouvre le lanceur : `public/index.html` (ou directement un des fichiers : `canvas.html`, `timeline.html`, `draw.html`, `grid.html`).
- Si besoin, sers le dossier `public/` (utile pour certaines fonctionnalités d’export) : `npx serve public`
- Configure l’IA depuis l’interface (clé OpenAI, proxy, ou WebLLM “dev” selon ta configuration).

## Déploiement (simple)

Go-Toolkit est un site statique : héberge simplement le dossier `public/` (Firebase Hosting est prêt à l’emploi via `firebase.json`, mais ce n’est pas obligatoire).

## Option “équipe” (si tu veux un partage interne)

Le repo contient des workers dans `workers/` pour :

- **Relayer l’IA** (proxy) si tu ne veux pas gérer des clés côté navigateur.
- **Activer le partage** via une base Firestore (liens Nexus).

Ces options restent facultatives : Go-Toolkit fonctionne déjà en mode local sans serveur.

## Limites actuelles (assumées)

- Pas d’authentification / gestion d’utilisateurs : c’est un outil léger orienté livrables.
- Pas de synchronisation multi-appareils sans activer le partage.
- Chaque module est autonome (pas de “mémoire” partagée entre modules).

Si tu veux que le README mette l’accent sur un cas d’usage (PO, consulting, sales enablement, delivery), dis-moi ton public cible et je l’adapte.
