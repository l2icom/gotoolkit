# Go-Toolkit

Ce dépôt héberge l’outil **Go-Toolkit**, un générateur de planches inspirées des roadmaps de produit. L’interface fonctionne entièrement depuis `public/index.html` et n’a pas besoin de serveur : il suffit d’ouvrir la page dans un navigateur moderne pour travailler.

## Guide d’utilisation

1. **Ouvrir l’outil**
   - Dans un contexte local, ouvrez `public/index.html` dans votre navigateur (double-clic ou `file://`). Sinon, servez la racine `public/` via Firebase Hosting ou un simple `http-server`.

2. **Créer et gérer les slides**
   - Chaque onglet représente une slide. Utilisez les boutons `+` et `–` pour ajouter ou supprimer des slides.
   - Remplissez les titres, sous-titres et champs par section dans les colonnes (Now / Next / Later par défaut).
   - Chaque colonne contient des sections pré-remplies (contexte, actions, risques, etc.) que vous pouvez modifier librement.

3. **Personnaliser le style**
   - La barre d’actions permet de changer le ratio, la taille de la police, le style de texte et les couleurs de colonnes.
   - Les palettes de couleurs, les styles de texte et les paramètres de police sont persistés dans le stockage local.

4. **Contexte et prompts intelligents**
   - Le bouton `Contexte` ouvre la modal permettant de saisir le contexte global (équipe, objectif, etc.).
   - Les champs `✨` à l’intérieur des sections sollicitent l’IA (via la clé OpenAI ou le proxy intégré) pour générer automatiquement du texte.
   - Les modèles de prompts sont gérés dans la modal ; vous pouvez réinitialiser un modèle ou basculer entre plusieurs presets.

5. **Importer / Exporter / Partager**
   - Exportez la structure complète au format JSON (`go-roadmap.json`), PNG (slide unique) ou PPTX.
   - Importez un fichier JSON enregistré précédemment pour restaurer les slides et paramètres.
   - Les paramètres enregistrés incluent ratios, styles, contexte et prompts.

6. **Sauvegarde automatique**
   - L’outil persiste tout dans `localStorage`; vos modifications survivent aux rechargements de page.

## Déploiement

Le site est prêt pour Firebase Hosting (configuration déjà présente dans `firebase.json`).

1. Installez Firebase CLI si nécessaire.
2. Lancez `firebase deploy` depuis la racine du dépôt pour mettre à jour le contenu hébergé.

Vous pouvez aussi déployer sur n’importe quel hébergeur statique en téléversant le dossier `public`.

## Pistes d’améliorations

- Ajouter une page d’accueil documentaire pour présenter les modèles.
- Gérer plusieurs utilisateurs ou équipes via une couche de données externe.
- Proposer des exports Markdown ou CSV pour les sections.
