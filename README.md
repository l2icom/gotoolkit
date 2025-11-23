# Go-Toolkit

Go-Toolkit regroupe deux outils statiques pensés pour les consultants : **Go-Slides** (présentation structurée) et **Go-Timeline** (planning visuel). Chaque expérience tourne entièrement dans le navigateur, sans backend (à part un proxy OpenAI facultatif), et se pilote directement depuis les fichiers présents dans `public/`.

## Go-Slides (public/index.html)

1. **Choisis un template** parmi les trois modèles (“Go-Roadmap”, “Go-Design”, “Go-Solve”). Chaque template expose des colonnes dédiées (Now / Next / Later, objectifs, indicateurs,…) et des sections personnalisables.
2. **Navigue via les onglets** pour passer d’une page à l’autre, renommer chaque onglet, ou en ajouter/supprimer à tout moment grâce aux boutons `+` / `🗑️`.
3. **Structure ton contenu** : chaque colonne propose des labels et des textarea pour les sections. Le bouton `✨` à côté de chaque champ invoque l’assistant IA (avec un compte à rebours visible) pour reformuler, enrichir ou générer un texte contextualisé.
4. **Personnalise les styles** (police, taille, ratio, fond, palette) dans le menu “Files” pour adapter les cartes à la charte client.
5. **Décris ton contexte** dans la modale “Contexte & prompts”, sauvegarde ta clé OpenAI (facultative), ajuste les prompts par section et active les modes IA (Express, Apprenti, Expérimental) pour choisir le niveau de guidage.
6. **Sers-toi de l’info-bulle et du tour guidé** qui apparaissent au chargement pour comprendre les principales actions et découvrir l’interface sans l’aide d’un manuel.
7. **Exporte facilement** :
   - `PNG` : capture une slide propre (textarea remplacés par du texte statique).
   - `PPTX` : génère un PowerPoint avec un tableau par slide en respectant le ratio sélectionné.
   - `JSON` : sauvegarde/importe l’état complet (slides + réglages) pour copier-coller entre sessions ou partage d’équipe.

> Astuce : les modifications sont persistées dans `localStorage`, donc tu peux recharger la page sans perdre ton travail.

## Go-Timeline (public/timeline.html)

1. **Lance l’interface** depuis `public/timeline.html` pour accéder au planning visuel complémentaire.
2. **Génère ou modifie un planning** en proposant une demande IA depuis la modal `✨`. Choisis le mode (“créer” vs “modifier”) pour lui fournir un prompt et (si besoin) le JSON existant du planning affiché.
3. **Navigue, zoome, ajuste** :
   - Barre d’outils : boutons de zoom, ajustement de la fenêtre visible et adaptation automatique de l’échelle (jour / semaine / mois).
   - Drag & drop : déplace, redimensionne ou supprime les éléments directement sur la timeline.
4. **Chronologie avec catégories** : les items peuvent porter des couleurs métier (fonctions, jalons, bugs, etc.). Le panneau latéral permet de paramétrer l’axe temporel, le snap et le mode d’affichage.
5. **Exports multi-format** : bouton “Fichier” pour récupérer le planning au format texte, image (capturée avec `html2canvas`) ou Excel (`xlsx`).
6. **Tour guidé dédié** présente les zones clés (outil IA, barre d’outils, export) pour prendre en main l’éditeur à la première visite.

## Débuter rapidement

1. Ouvre `public/index.html` et `public/timeline.html` directement dans un navigateur moderne (Chrome, Edge, Safari) ou via un serveur statique (`npx live-server public` / `http-server public` si tu veux un accès HTTP).
2. Les dépendances (`html2canvas`, `PptxGenJS`, `vis-timeline`, `html2canvas`, `xlsx`) sont chargées depuis des CDN. Il n’y a pas de `npm install`.
3. Pour déployer, utilise `firebase deploy` depuis la racine si tu veux mettre `public/` en ligne (configuration `firebase.json` incluse).

## Conseils utilisateur

- **Prépare ton contexte** avant d’activer l’IA (description du client, objectifs, contraintes) pour que les prompts génèrent des réponses précises.
- **Sers-toi des styles et palettes** pour harmoniser tes slides : chaque colonne peut avoir sa couleur, et les sections s’adaptent automatiquement à la police/ratio choisis.
- **Teste les prompts personnalisés** en mode “Apprenti” si tu veux superviser l’IA section par section, ou reste en “Express” pour des suggestions rapides.
- **Sauvegarde JSON puis importe** pour cloner un livrable validé vers un autre template ou une autre session.
- **Utilise les exports image/PPTX** pour intégrer les contenus dans des dossiers partageables (OneDrive, Notion, Confluence).

## À venir

- Centraliser les exports JSON/PPTX vers un espace de stockage partagé.
- Ajouter une couche de profils pour partager les prompts et palettes entre équipes.
- Proposer du suivi proactif (suggestions IA en fonction du contexte client).

Bonne préparation !
