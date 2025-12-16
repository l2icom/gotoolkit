# Go-Toolkit : la boîte à idées IA des Product Owners

Go-Toolkit rassemble trois outils front-only que l'on ouvre dans le navigateur sans build, pour produire rapidement des supports produit assistés par l'IA. Chaque app gère son propre mini-flow (content, diagrammes, planning) avec des exports locaux, une mémoire navigateur et la possibilité de passer par les proxys OpenAI/partage fournis dans `workers/`.

## Fonctionnalités par app

- **50 Nuances (`public/canvas.html`)** : grille de slides éditables, prompts IA contextualisés par section, génération guidée (effort minimal/low/medium), édition en ligne puis export PPTX/PNG/JSON ou partage si un proxy Firebase est configuré.
- **Le Cardinal (`public/draw.html`)** : générateur visuel Mermaid/Excalidraw qui détecte automatiquement le titre, propose un assistant IA pour structurer le diagramme, offre un mode partage optionnel et exporte en PNG ou JSON.
- **Go-Roadmap (`public/timeline.html`)** : timeline interactive (Vis.js) pour créer ou adapter un planning produit, avec IA pour générer des jalons et des durées, éditeur direct, exports texte/image/Excel/JSON et partage optionnel.

## Expériences transversales

- **Zero setup** : ouvrir l’un des HTML dans `public/` ou servir le dossier (`npx serve public`) suffit, tout fonctionne côté client avec LocalStorage pour garder les brouillons.
- **Assistants IA contextualisés** : chaque outil embarque ses propres prompts, un bouton de niveau d’effort, des réponses en streaming via `/v1/responses` et des formats prêts à l’export.
- **Exports locaux** : PPTX/PNG/JSON (50 Nuances), PNG/JSON Mermaid (Le Cardinal), texte/image/Excel/JSON (Go-Roadmap) ; rien n’est partagé sans action explicite.
- **Partage optionnel** : si vous déployez `workers/share-proxy`, les slides, diagrammes ou timelines peuvent être publiés via Firestore avec autorisations d’origines configurables.

## Mise en route rapide

1. Cloner le repo et servir `public/` : `npx serve public` (certaines exportations demandent un serveur pour fonctionner).
2. Ouvrir `canvas.html`, `draw.html` ou `timeline.html` selon l’usage.
3. Définir une clé OpenAI dans le modal IA ou laisser vide pour utiliser le proxy `https://openai.gotoolkit.workers.dev/v1/responses`.
4. Régler l’effort de raisonnement, lancer la génération, affiner dans l’interface, puis exporter ou partager.
5. (Optionnel) Activer les partages en déployant `workers/share-proxy` avec un compte de service Firebase, `GOOGLE_SERVICE_ACCOUNT_JSON` et `SHARE_ALLOWED_ORIGINS`.

## Notes techniques

- **Front IA** : `public/js/ia-client.js` appelle l’API Responses, normalise les sorties, gère la progression et transmet `reasoning.effort`.
- **Proxy OpenAI** : `workers/openai-proxy` relaie les requêtes vers OpenAI (`gpt-5-nano` par défaut) avec quotas KV (10 req/min, 100/jour) et limite payload (~10 Ko).
- **Partage** : `workers/share-proxy` publie `/v1/shares/{slides|timelines|diagrams}/{id}` vers Firestore (JWT service account) ; CORS basé sur `SHARE_ALLOWED_ORIGINS`, localhost autorisé.
- **Hébergement** : `public/` est prêt pour Firebase Hosting (`firebase.json` fourni) mais reste agnostique à l’hébergement.

## Limitations actuelles

- Pas d’auth, pas de stockage serveur par défaut, pas de synchronisation multi-appareils sans le partage Firebase.
- Chaque outil garde son état dans le navigateur (LocalStorage), il n’y a pas de mémoire partagée.
- Le proxy IA est nécessaire si vous ne fournissez pas votre propre clé OpenAI.
- Le partage Firestore nécessite un compte de service et une configuration explicite des origines autorisées.

## Extensions envisagées

- Harmoniser prompts et modèles entre apps pour éviter la duplication.
- Ajouter des gardes-fous IA (limitation de tokens, validation JSON côté front) et des tests UI automatisés.
- Introduire un historique et des commentaires légers sur les partages Firestore.
- Proposer des thèmes/export communs (typographie, couleurs) pour uniformiser slides, timelines et diagrammes.
- Imaginer de nouveaux outils complémentaires : Go-Backlog (priorisation), Go-Discovery (canevas utilisateurs), Go-Metrics (North Star), Go-Pitch (pitch express).

Go-Toolkit aide les PO à aller de l’idée à un support partageable sans pipeline complexe. Bonne exploration !
