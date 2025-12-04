# Go-Toolkit : assistant IA local pour slides et plannings

Go-Toolkit regroupe **Go-Slides** (`public/index.html`) et **Go-Timeline** (`public/timeline.html`) dans une interface 100 % statique : ouvre simplement les fichiers HTML, ajoute ta clé OpenAI et, si besoin, configure un worker Cloudflare pour partager les états. L’UI embarque les modèles, exports (PNG/PPTX/JSON/Excel) et assistants IA, sans dépendance serveur côté front.

## Pourquoi l’utiliser en tant que PO (vs ChatGPT et autres)

- **Prêt à l’emploi et hors-ligne** : aucune installation, tout est dans les fichiers HTML et les scripts de `public/js/`. Tu démarres un canevas de slides ou un planning en quelques secondes, alors qu’un chatbot générique nécessite de reproduire l’ergonomie et le format attendu.【F:public/index.html†L1-L25】【F:public/timeline.html†L1-L28】
- **Exports adaptés aux livrables** : captures PNG, PPTX structurés et sauvegardes JSON/Excel intégrées pour partager des supports conformes sans repasser par un copier-coller manuel.【F:public/index.html†L1544-L1554】【F:public/timeline.html†L1578-L1586】
- **Modes IA contextualisés** : Go-Slides offre les modes Express et Expérimental directement depuis les blocs, tandis que Go-Timeline alterne entre les modes "Magique" (création) et "Guidé" (édition) dans son assistant IA pour générer ou ajuster un planning structuré.【F:public/index.html†L1620-L1650】【F:public/timeline.html†L1684-L1716】
- **Partage maîtrisé** : les sauvegardes passent par un worker Cloudflare (`workers/share-proxy/index.js`) qui proxifie Firestore, valide les collections (`slides`/`timelines`), ajoute du cache et contrôle les origines autorisées. Les règles `firestore.rules` interdisent l’accès direct pour éviter l’exposition de secrets côté client.【F:workers/share-proxy/index.js†L1-L134】【F:firestore.rules†L1-L26】

## Limites actuelles

- **Clé OpenAI requise** : l’assistance IA dépend d’une clé fournie par l’utilisateur dans les modales “Contexte & prompts” (slides) ou “Assistant IA” (planning) ; aucun quota partagé ou modèle embarqué n’est disponible côté front.【F:public/index.html†L1620-L1650】【F:public/timeline.html†L1684-L1716】
- **Partage à configurer** : pour collaborer, il faut déployer et paramétrer le worker Cloudflare (`GO_TOOLKIT_SHARE_API_URL` ou `GO_TOOLKIT_SHARE_API_URLS`) avec un compte de service Firestore et, si besoin, une limite d’écriture (`RATE_LIMIT`).【F:public/js/share-worker-client.js†L1-L69】【F:workers/share-proxy/index.js†L135-L206】
- **Portée fonctionnelle ciblée** : l’outillage est centré sur slides et plannings ; il n’existe pas de hub commun pour retrouver tous les exports ou mutualiser prompts/palettes comme dans des assistants généralistes.
- **Aucun apprentissage global** : chaque session reste locale ou liée à un partage ponctuel ; pas de suggestions proactives ou d’optimisations continues basées sur l’historique des projets.

## Pistes d’amélioration

- **Hub partagé des exports** : ajouter une liste des rendus (PNG/PPTX/JSON/Excel) côté UI et une route `GET /v1/exports` dans le worker pour centraliser les livrables par collection.
- **Bibliothèque commune de prompts/palettes** : exposer des endpoints dédiés dans le worker et un sélecteur dans l’UI pour réutiliser rapidement des configurations validées par l’équipe.
- **Suggestions IA proactives** : surveiller les sections vides ou incohérentes dans les slides/timelines et proposer des recommandations applicables en un clic (mode Expérimental).

## Démarrage rapide

1. **Ouvre l’outil** : double-clique `public/index.html` (slides) ou `public/timeline.html` (planning) dans ton navigateur (Chrome, Firefox, Edge, Safari…).
2. **Ajoute ta clé OpenAI** : dans “Contexte & prompts”, choisis un mode IA et active le bouton `✨` pour générer ou reformuler directement dans l’UI.
3. **Personnalise le rendu** : ajuste polices, palettes et modèles intégrés ; duplique ou renomme les pages/colonnes pour structurer ton livrable.
4. **Exporte/partage** : télécharge en PNG/PPTX/JSON/Excel ou configure `GO_TOOLKIT_SHARE_API_URL` vers ton worker Cloudflare pour charger/sauvegarder des états partagés.

## Architecture technique (vue rapide)

- **Front-end statique** : tout est servi depuis `public/` (HTML, CSS, JS) avec des données de démonstration déclarées dans `window.GO_INDEX_DEMO_DATA` et des helpers dédiés pour la timeline et les slides.【F:public/index.html†L40-L80】【F:public/timeline.html†L46-L86】
- **Client de partage** : `public/js/share-worker-client.js` sélectionne automatiquement un worker Cloudflare, applique un fallback multi-URL et encapsule les appels `GET/PUT` pour `slides` et `timelines` avec gestion des erreurs réseau.【F:public/js/share-worker-client.js†L1-L86】
- **Worker Cloudflare** : `workers/share-proxy/index.js` construit un client Firestore à partir du secret `FIREBASE_SERVICE_ACCOUNT`, signe les JWT, ajoute un cache token, applique des limites d’écriture optionnelles et renforce les entêtes CORS selon `SHARE_ALLOWED_ORIGINS`. Les routes acceptées sont strictement `GET/PUT /v1/shares/:collection/:token`.【F:workers/share-proxy/index.js†L1-L206】
- **Sécurité Firestore** : `firestore.rules` bloque toute lecture/écriture directe (production) pour forcer le passage par le worker, afin d’éviter l’exposition de clés ou d’ID de projet dans le front-end statique.【F:firestore.rules†L1-L26】

Bonne préparation !
