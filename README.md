# Go-Toolkit : la boîte à idées IA des Product Owners

Go-Toolkit est un trio d'apps front-only qui tournent dans le navigateur (pas de build requis) pour produire vite des supports produit :
- **Petit Robert** (`public/robert.html`) : grille de slides éditables avec IA pour générer contenus, suggestions par section et export PPTX/PNG/JSON.
- **Le Cardinal** (`public/cardinal.html`) : générateur de diagrammes Mermaid/Excalidraw avec titre détecté automatiquement et partage optionnel.
- **Go-Roadmap** (`public/roadmap.html`) : timeline interactive (Vis.js) avec IA pour créer/modifier un planning, export texte/image/Excel/JSON.

Les trois pages fonctionnent en local via un simple serveur statique, conservent l'état dans le navigateur et peuvent utiliser un proxy OpenAI/partage fourni dans `workers/`.

## Pour quoi faire ?
  - **Préparer un atelier** : esquisser une storyline (Petit Robert), dessiner un parcours (Le Cardinal), poser les jalons (Go-Roadmap) sans ouvrir de suite bureautique.
  - **Accélérer un brief** : demander à l'IA un draft par section ou un planning JSON, puis ajuster à la main directement dans la page.
  - **Partager vite** : exporter en PPTX/PNG/Excel/TXT/JSON ou publier un lien de partage si le proxy Firebase est configuré.
  - **Tester des variantes** : changer de modèle IA (via votre clé ou le proxy), ré-générer, comparer et revenir aux sauvegardes locales.

## Points forts pour les PO
- **Zero setup** : ouvrir les HTML dans `public/` ou servir le dossier (`npx serve public`), tout est déjà packagé.
  - **Exports natifs** : Petit Robert → PPTX/PNG/JSON, Le Cardinal → PNG/JSON Mermaid, Go-Roadmap → texte/image/Excel/JSON ; rien ne sort sans action explicite.
- **Assistants intégrés** : prompts contextualisés par outil, bouton d'effort de raisonnement (minimal/low/medium) et streaming en direct.
- **Partage optionnel** : hooks vers un worker Cloudflare + Firestore pour publier slides/timelines/diagrams; désactivé par défaut, données locales sinon.

## Freins à garder en tête
- **Clé OpenAI requise si pas de proxy** : sans clé, le front s'appuie sur le worker `openai-proxy` déjà déployé, sinon les appels échouent.
- **Partage nécessite Firebase** : le worker `share-proxy` demande un compte de service Firestore et des origines autorisées ; pas de multi-user natif sans ça.
- **Périmètre limité** : trois apps statiques, pas d'auth, pas de stockage serveur par défaut, pas de rétention longue durée.
- **Pas de mémoire croisée** : chaque outil garde son état localement (LocalStorage); pas de synchronisation entre appareils sans partage.

## Pistes d'amélioration (vision produit)
- Centraliser les modèles et prompts entre apps pour éviter la duplication.
- Ajouter des garde-fous IA (limite de tokens, validation JSON côté front) et des tests UI automatisés.
- Introduire un historique des versions et des commentaires légers sur les partages Firestore.
- Prévoir des thèmes/export styles communs (typo, couleurs) pour harmoniser slides, timelines et diagrammes.

## Nouveaux outils qui compléteraient le panel
- **Go-Backlog** : priorisation RICE/WSJF avec export vers tickets.
- **Go-Discovery** : canevas OST / personas / insights reliés à Petit Robert.
  - **Go-Metrics** : cadrage North Star et suivis trimestriels, connecté aux timelines Go-Roadmap.
- **Go-Pitch** : assembleur express de pitchs client/investisseur à partir des assets existants.

## Comment démarrer
1. Cloner puis servir `public/` : `npx serve public` (ou ouvrir les fichiers directement, certaines features nécessitent un serveur pour les exports).
2. Ouvrir une app : `robert.html` (Petit Robert), `cardinal.html` (Le Cardinal), `roadmap.html` (Roadmap).
3. Renseigner une clé OpenAI dans le modal IA ou laisser vide pour passer par `https://openai.gotoolkit.workers.dev/v1/responses` (proxy Cloudflare).
4. Choisir l'effort de raisonnement (minimal/low/medium), lancer la génération, éditer, puis exporter ou partager.
5. Activer le partage (optionnel) en déployant `workers/share-proxy` avec une clé de service Firebase, en définissant `GOOGLE_SERVICE_ACCOUNT_JSON` et `SHARE_ALLOWED_ORIGINS` (localhost autorisé par défaut).

## Notes techniques (IA & proxy)
- Front : `public/js/openai-client.js` appelle l'API **Responses** (`/v1/responses`) en SSE, normalise `output_text`/`output` et gère `reasoning: { effort }`.
- Proxy IA : `workers/openai-proxy` (Cloudflare) relaie vers OpenAI avec quotas KV (10 req/min, 100/jour par client), limite payload (~10KB), accepte localhost, modèle par défaut `gpt-5-nano`.
- Partage : `workers/share-proxy` expose `/v1/shares/{slides|timelines|diagrams}/{id}` vers Firestore (service account JWT). CORS basé sur `SHARE_ALLOWED_ORIGINS` + exception localhost/127.0.0.1.
- Hébergement : le dossier `public/` est prêt pour Firebase Hosting (`firebase.json` fourni) mais reste agnostique à l'hébergement.

Go-Toolkit aide à passer de l'idée à un support partageable sans pipeline complexe. Bonne exploration !
