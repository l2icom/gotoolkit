# Go-Toolkit

Go-Toolkit est une application statique packagée dans `public/index.html`. Elle permet aux consultants de générer des planches structurées (Now / Next / Later, Go-Design, Go-Solve) et d’activer un assistant IA pour peupler des champs métier. L’interface s’exécute entièrement dans le navigateur ; il n’y a pas de serveur backend autre qu’un proxy OpenAI optionnel.

## Architecture technique

- **Stack** : HTML + CSS + Vanilla JavaScript. Les dépendances externes (`html2canvas` et `PptxGenJS`) sont chargées depuis des CDN.
- **Décomposition** : toute la logique vit dans un `<script>` en bas de `public/index.html`. Le DOM est généré dynamiquement à partir d’une configuration `templates`, des styles (`textStyles`, `ratioOptions`) et d’un état (`templateSlides`, `promptLibrary`).
- **Templates** : chaque template (`go-roadmap`, `go-design`, `go-solve`) déclare des colonnes (`stage`, `label`) et des sections (`Objectifs`, `Moyens`, `Indicateurs`, etc.) avec des icônes et des exemples. Les slides sont créées via `createSlide` et `createColumn`, qui injectent la structure DOM par template et seed.
- **Gestion d’état** :
  - `templateSlides` stocke la liste de slides indexées par template.
  - `collectAllSlides()` extrait les titres, colonnes, sections et styles depuis le DOM pour sérialiser l’état.
  - `schedulePersist()` tamponne les appels à `persistState()` pour limiter les écritures.
  - `persistState()` enregistre `slides` et `settings` (`ratioIndex`, `textStyleIndex`, `fontSize`, clé OpenAI, contexte, prompts, templates) sous `localStorage["go-roadmap-state"]`.
  - `loadSavedState()` restaure le payload, recrée `templateSlides` et applique les settings (ratio, police, prompts, sélection par défaut).
- **Navigation / onglets** : `renderSlidesForTemplate` reconstruit les slides, `refreshTabs` reconstruit les boutons d’onglet et `setActiveTab` masque/affiche les slides. L’utilisateur peut renommer les onglets, ajouter (`+`) ou supprimer (`🗑️`).
- **Personnalisation visuelle** :
  - `textStyles` et `fontSizeInput` changent la police et la taille via `applyTextStyleToSlide`.
  - `ratioOptions` ajustent `--slide-aspect-ratio` et sont exposés dans un menu.
  - `backgroundSelector` applique la couleur de fond, met à jour les variables CSS et choisit une couleur de texte adaptée (`getTextColorForBackground`).
  - `stageColors` et `selectColumnForPalette` permettent de colorer chaque colonne avec une palette glissante.
- **Interaction dans les sections** :
  - Chaque section comporte un label (`contenteditable`) et un textarea éditable.
  - `monitorTextareaOverflow` signale quand le contenu dépasse, formate les listes à puces (`normalizeBullets`) et gère l’insertion automatique de `•`.
  - Les boutons `✨` activent `handleFieldAi` pour générer du contenu.
- **IA & prompts** :
  - `contextModal` contient `contextField`, les prompts par section (`promptLibrary`) et un champ pour la clé OpenAI (`apiKeyInput`).
  - `defaultPromptTemplate` est interpolé avec `contextField`, `columnTitle`, `sectionTitle` et le texte courant.
  - `callOpenAI` poste vers `https://api.openai.com/v1/chat/completions` (ou `https://openai.tranxq.workers.dev/v1/chat/completions` si pas de clé) avec `gpt-5-nano`, `temperature=1`, `max_tokens=800`.
  - `promptLibrary` conserve un prompt par template/section et est persistant dans `localStorage`.
- **Exports** :
  - Export PNG : `prepareSlideForExport` clone la slide, remplace les textarea par des `div` statiques puis `html2canvas` rasterise l’aperçu.
  - Export PPTX : `exportPptxFromSlides` transforme chaque slide en tableau (`addTable`) en respectant le ratio sélectionné (`ratioOptions[].pptx`).
  - Import/Export JSON (`importJsonBtn`, `exportJsonBtn`) lit/écrit un objet `{ slides, settings }`.
- **Onboarding & aide** :
  - `tourSteps` orchestre un guidage visuel (mise en surbrillance + modale) contrôlé par le `tourOverlay`.
  - `infoPopup` expose la version 0.11.22, l’auteur et un bouton “Tour guidé”.

## Développement local & déploiement

1. Cloner le dépôt et ouvrir `public/index.html` directement dans un navigateur moderne ou servir `public/` avec `npx live-server public`/`http-server public`.
2. Mettre à jour les templates, prompts ou styles à même `public/index.html`. Il n’y a pas de compilation.
3. Déploiement : la configuration Firebase est déjà présente dans `firebase.json`; depuis la racine du dépôt `firebase deploy` publie `public`.

Les dépendances tierces sont chargées via CDN, il n’y a donc pas de `npm install`.

## Extension & maintenance

- **Ajouter un template** : ajouter un objet dans `templates` avec `id`, `emoji`, `columns` et `sections`, puis l’inclure via `populateTemplateSelectors`.
- **Mettre à jour les prompts** : modifier `promptLibrary` ou les valeurs par défaut `defaultPromptTemplate`, puis utiliser `resetPromptsBtn` ou `import JSON`.
- **Modes IA** : la modal IA propose trois modes (⚡ Express par défaut, 💡 Apprenti, 🧪 Expérimental) qui masquent ou affichent l’éditeur de prompts et appliquent respectivement le prompt par défaut, le prompt coach ou la saisie personnalisée.
- **Adapter les exports** : la fonction `buildTableDataForSlide` icône les colonnes et sections. Vous pouvez y injecter d’autres formats (Markdown, CSV, API interne).
- **Tour & onboarding** : enrichir `tourSteps` pour guider les nouvelles fonctionnalités.
- **Proxy IA** : le proxy `https://openai.tranxq.workers.dev` est utilisé dès que l’utilisateur n’a pas sa clé OpenAI pour garantir un fallback limité.

## Pistes d’amélioration métier

1. **Capitaliser les livrables** : proposer une synchronisation avec un repo interne (Google Drive, Notion, Confluence) pour stocker les exports JSON/PPTX et recharger les templates validées.
2. **Multiples équipes & droits** : intégrer une couche d’authentification (SSO Savane) et de profils pour partager des contextes, prompts et palettes métiers entre équipes.
3. **Assistant IA contextuel** : suivre les modifications de contexte et proposer des suggestions proactives (modèle fine-tuning ou embeddings) par rapport aux grands comptes ou aux clients stratégiques.
4. **Metrics & scoring** : enrichir chaque slide avec des métadonnées (risques, effort, priorité) et générer un reporting généré automatiquement pour alerter sur les écarts par rapport aux roadmaps clients antérieures.
