# Go-Toolkit

Go-Toolkit combine deux expériences pensées pour les consultants : **Go-Slides** (pour créer des planches claires et structurées) et **Go-Timeline** (pour visualiser et ajuster un planning). Chaque outil s’utilise en ouvrant directement son fichier dans un navigateur.

## Go-Slides (public/index.html)

1. **Choisis ton modèle** (“Go-Roadmap”, “Go-Design” ou “Go-Solve”) pour afficher des colonnes, des sections et des idées déjà structurées.
2. **Change de page** avec les onglets : renomme-les, ajoute une nouvelle page ou supprime une ancienne sans perdre ton travail.
3. **Rédige librement** : chaque colonne contient des labels et des blocs de texte. Le bouton `✨` à côté d’un champ lance l’assistant IA pour reformuler ou enrichir ton contenu à partir de ce que tu as déjà écrit.
4. **Ajuste le rendu** dans le menu “Files” (polices, tailles, proportions, couleurs, palettes) pour correspondre à ta charte ou ton client.
5. **Décris ton contexte** dans la fenêtre “Contexte & prompts”, précise ta clé OpenAI si tu en as une et choisis un mode IA (Express, Apprenti ou Expérimental) pour définir ton degré d’accompagnement.
6. **Suis le tour guidé** et l’info-bulle qui s’ouvrent au démarrage pour découvrir les actions clés sans devoir lire de documentation.
7. **Export en un clic** :
   - `PNG` pour capturer une slide propre,
   - `PPTX` pour convertir tes tableaux en diapositives,
   - `JSON` pour copier la version complète vers un autre poste ou un collègue.

> Tous tes changements sont sauvegardés dans le navigateur, tu peux donc recharger la page sans perdu.

## Go-Timeline (public/timeline.html)

1. **Lance l’interface planning** depuis `public/timeline.html`.
2. **Demande de l’aide IA** avec le bouton `✨`, choisis le mode “créer” ou “modifier” et décris ta demande pour générer un planning cohérent.
3. **Déplace et ajuste** les éléments directement sur la timeline : zoom, glisser-déposer et modification des durées.
4. **Utilise les catégories** colorées pour distinguer les fonctions, jalons, risques, bugs, etc.
5. **Exporte ton planning** en texte, image (capture) ou Excel pour le partager rapidement.
6. **Profite du tour guidé** pour comprendre les outils IA, la barre d’outils et les exports dès ta première visite.

## Pour commencer

1. Ouvre les fichiers `public/index.html` et `public/timeline.html` dans ton navigateur préféré (Chrome, Firefox, Edge, Safari…).
2. Tu n’as rien à installer : l’interface utilise uniquement des ressources accessibles en ligne.
3. Si tu veux diffuser une version en ligne, dépose le dossier `public/` sur ton hébergeur habituel ou sur la plateforme que tu utilises.

## Conseils pratiques

- Prépare ton contexte (client, objectifs, contraintes) avant d’activer l’IA pour obtenir des réponses pertinentes.
- Harmonise les colonnes avec les styles et palettes pour coller à ta charte.
- Essaie le mode “Apprenti” si tu veux guider section par section, ou reste en “Express” pour aller plus vite.
- Sauvegarde et réimporte les fichiers JSON pour reproduire un livrable validé sur une autre session ou un autre modèle.
- Utilise les exports image/PPTX pour partager tes supports dans OneDrive, Notion, Confluence ou directement avec tes clients.

## Pistes

- Centraliser les exports pour les retrouver facilement dans un espace partagé.
- Partager les prompts et palettes avec les autres membres de ton équipe.
- Proposer des suggestions proactives en fonction du contexte de ton client.

## Partages sécurisés via Cloudflare Workers

- Le worker `workers/share-proxy/index.js` est la seule passerelle autorisée vers les collections `slides` et `timelines` :
  - Il tire un token OAuth2 Google avec la clé de service `FIREBASE_SERVICE_ACCOUNT` et écrit dans Firestore avec un compte privilégié.
  - Les accès en lecture/écriture directs sont bloqués (`firestore.rules` n’autorise plus aucun `read` ni `write`), ce qui évite d’exposer la base au navigateur.
  - Déploie-le avec `wrangler` depuis le dossier `workers/share-proxy`, puis configure les secrets :
    1. `wrangler secret put FIREBASE_SERVICE_ACCOUNT "<JSON de la clé de service>"`
    2. (optionnel) `wrangler secret put FIREBASE_PROJECT_ID "<ID du projet>"`
    3. (optionnel) `wrangler secret put SHARE_ALLOWED_ORIGINS "https://gotoolkit.app,https://ton-domaine"`
    4. `wrangler publish`

- Le helper `public/js/share-worker-client.js` consomme ce worker. Il lit l’URL de base via `window.GO_TOOLKIT_SHARE_API_URL` (valuée par défaut à `https://gotoolkit.tranxq.workers.dev`, modifie-la si tu publies ailleurs) et masque toute logique Firestore côté client.
- Au besoin, change le script inline `<script>window.GO_TOOLKIT_SHARE_API_URL = ...</script>` dans `public/index.html` et `public/timeline.html` pour pointer vers ton domaine Cloudflare.

Bonne préparation !
