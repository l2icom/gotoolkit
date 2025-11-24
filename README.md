# Go-Toolkit

Go-Toolkit combine deux expériences pensées pour les consultants : **Go-Slides** (pour créer des planches claires et structurées) et **Go-Timeline** (pour visualiser et ajuster un planning). Chaque outil s’utilise en ouvrant directement son fichier dans un navigateur, avec des assistants IA, des exports réactifs et des modèles prêts à l’emploi.

## Go-Slides (public/index.html)

1. **Choisis ton modèle** (“Go-Roadmap”, “Go-Design” ou “Go-Solve”) pour afficher des colonnes, des sections et des idées déjà structurées ; les exemples embarqués sont définis dans `public/demo.js` et tu peux les surcharger ou importer ton propre JSON pour amorcer un board.
2. **Change de page** avec les onglets : renomme-les, duplique une structure, ajoute une nouvelle page ou supprime une ancienne sans perdre ton travail.
3. **Rédige librement** : chaque colonne contient des labels et des blocs de texte. Le bouton `✨` lance l’assistant IA pour reformuler, enrichir ou générer du contenu immédiatement à partir de ton contexte.
4. **Ajuste le rendu** dans le menu “Files” (polices, tailles, proportions, couleurs, palettes) pour coller à ta charte, et utilise les styles prédéfinis pour garder une cohérence visuelle instantanée.
5. **Décris ton contexte** dans la fenêtre “Contexte & prompts”, indique ta clé OpenAI si tu en as une et choisis un mode IA (Express, Apprenti ou Expérimental) pour gérer ton niveau d’accompagnement.
6. **Démarre avec le tour guidé** et les bulles d’info pour découvrir les actions clés dès le chargement.
7. **Exporte et partage** : PNG pour capturer une slide propre, PPTX pour convertir tes tableaux en diapositives et JSON pour réimporter ou synchroniser avec une autre session.
8. **Partage en toute sécurité** en pointant `window.GO_TOOLKIT_SHARE_API_URL` vers ton worker Cloudflare (voir la section technique) et en lançant la fenêtre “Partager” pour sauvegarder/charger sans exposer ta base.

## Go-Timeline (public/timeline.html)

1. **Ouvre l’interface planning** et choisis un horizon (jour, semaine, mois) pour jouer avec la granularité.
2. **Demande de l’aide IA** avec le bouton `✨`, choisis le mode “créer” ou “modifier” et décris l’objectif pour générer un planning cohérent et articulé sur les livrables.
3. **Déplace et ajuste** les éléments directement sur la timeline : zoom, glisser-déposer, duplication, modification des durées et gestion fine des chevauchements.
4. **Utilise les catégories** colorées pour distinguer fonctions, jalons, risques, bugs, dépendances ou actions commerciales.
5. **Exporte ton planning** en texte, en image (capture) ou en Excel pour le partager rapidement avec ton équipe.
6. **Partage tes projets** via le même worker Cloudflare configuré par `window.GO_TOOLKIT_SHARE_API_URL` afin d’uniformiser les états entre collaborateurs.
7. **Découvre le tour guidé** pour prendre en main les outils IA, la barre d’outils et les exports dès la première visite.

## Pour commencer

1. Ouvre les fichiers `public/index.html` et `public/timeline.html` dans ton navigateur préféré (Chrome, Firefox, Edge, Safari…).
2. Tu n’as rien à installer : l’interface est entièrement statique et ne dépend que de scripts embarqués et d’APIs publiques.
3. Pour diffuser une version en ligne, dépose le dossier `public/` sur ton hébergeur habituel ou sur la plateforme de ton choix, puis configure `window.GO_TOOLKIT_SHARE_API_URL` pour pointer vers ton worker partagé.

## Conseils pratiques

- Prépare ton contexte (client, objectifs, contraintes) avant d’activer l’IA pour obtenir des réponses pertinentes.
- Harmonise les colonnes avec les styles et palettes pour coller à ta charte.
- Essaie le mode “Apprenti” si tu veux guider section par section, ou reste en “Express” pour aller plus vite.
- Sauvegarde et réimporte les fichiers JSON pour reproduire un livrable validé sur une autre session ou un autre modèle.
- Utilise les exports image/PPTX ou Excel pour partager tes supports dans OneDrive, Notion, Confluence ou directement avec tes clients.
- Configure ton worker Cloudflare (voir la section technique) avant de partager un lien : l’UI masque les accès Firestore et consomme `window.goToolkitShareWorker`.

## Pistes

- Centraliser les exports pour les retrouver facilement dans un espace partagé.
- Partager les prompts et palettes avec les autres membres de ton équipe.
- Proposer des suggestions proactives en fonction du contexte de ton client.

## Implémentation technique

- **Front-end statique** : `public/index.html` et `public/timeline.html` embarquent toutes les interactions (modèles, blocs de texte, IA, exports). Les exemples et configurations de colonnes proviennent de `public/demo.js`, tu peux surcharger `window.GO_INDEX_DEMO_DATA` ou injecter ton propre JSON pour précharger des cas d’usage.
- **Partages Firestore** : l’interface invoque `window.goToolkitShareWorker` (voir `public/js/share-worker-client.js`) ; ce client redirige les `GET` et `PUT` vers le worker Cloudflare `workers/share-proxy/index.js`. Ce worker :
  - Valide les chemins `/v1/shares/{collection}/{document}` uniquement pour `slides` et `timelines`.
  - Tire un token OAuth2 Google à partir de la clé `FIREBASE_SERVICE_ACCOUNT`, signe les JWT, cache le jeton et parle à l’API Firestore sans dépendances externes.
  - Gère les en-têtes CORS, limite les écritures quand `env.RATE_LIMIT` est configuré et renvoie des erreurs lisibles pour l’UI.
- **Sécurité Firestore** : `firestore.rules` interdit tout `read`/`write` direct en production ; seul le worker Cloudflare, avec le compte de service, possède les droits d’écriture. Avant de déployer depuis `workers/share-proxy`, configure les secrets : `wrangler secret put FIREBASE_SERVICE_ACCOUNT "<JSON de la clé de service>"`, puis (optionnellement) `FIREBASE_PROJECT_ID` et `SHARE_ALLOWED_ORIGINS`.
- **Personnalisation IA & partages** : modifie `window.GO_TOOLKIT_SHARE_API_URL` dans `public/index.html` et `public/timeline.html` pour pointer vers ton worker, alimente la clé OpenAI et sélectionne le mode IA qui correspond à ton workflow pour activer les assistants de génération / reformulation.

Bonne préparation !
