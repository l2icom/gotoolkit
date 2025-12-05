# Go-Toolkit : la boîte à idées IA des Product Owners

Go-Toolkit rassemble trois mini-apps prêtes à l'emploi pour transformer vos idées en livrables sans friction :
- **Go-Slides** pour maqueter des présentations en quelques minutes.
- **Go-Draw** pour esquisser visuels et mindmaps.
- **Go-Timelines** pour planifier des roadmaps et cadencer vos releases.

Chaque outil tient dans un simple fichier HTML : ouvrez, personnalisez, exportez. Rien à installer, aucun setup technique : vous gardez le contrôle sur vos contenus, en ligne ou hors ligne.

## Pour quoi faire ?
- **Ateliers d'idéation** : poser rapidement une vision produit en diapositives, dessiner un parcours utilisateur, ou placer des jalons clés avant un comité.
- **Briefs et handoffs** : générer un premier draft de slides ou de planning à partager à l'équipe design/dev pour éviter les réunions "à blanc".
- **Comités et QBR** : aligner en direct sur la roadmap, réordonner les priorités et repartir avec un support exportable immédiatement.
- **Test & learn** : créer plusieurs variantes (pitch, storyboard, timeline) et comparer les options en quelques clics.

## Points forts pour les PO
- **Prêt à l'instant T** : pas d'app à déployer ni de compte à créer ; tout tient dans les fichiers `public/` que vous ouvrez dans le navigateur.
- **Exports formats métier** : récupérez vos supports en PNG, PPTX, JSON ou Excel pour intégrer facilement dans vos decks, tickets ou wiki.
- **Assistants IA contextualisés** : prompts préconfigurés par type d'outil (slides, dessin, planning) pour gagner du temps sans réécrire vos briefs à chaque fois.
- **Autonomie et sécurité** : vos données restent locales par défaut ; le partage n'est activé que si vous le décidez via le proxy de partage.

## Freins à garder en tête
- **Clé OpenAI à saisir** : l'assistance IA fonctionne avec votre propre clé ; si vous ne l'avez pas, les outils restent manuels.
- **Partage optionnel à configurer** : pour collaborer en ligne, il faut brancher le proxy de partage (compte de service requis).
- **Périmètre ciblé** : slides, dessin, timelines seulement ; ce n'est pas une suite complète de productivité.
- **Pas d'apprentissage global** : chaque session repart de zéro ; il n'y a pas (encore) de mémoire cross-projet.

## Pistes d'amélioration (vision produit)
- **Bibliothèque d'assets PO** : templates de pitch, matrices d'impact, cartes d'empathie ou cadres RICE prêts à injecter.
- **Assistant IA proactif** : suggestions automatiques quand une slide est vide, un jalon manque ou une dépendance est incohérente.
- **Mode collaboratif léger** : liens de partage temporaires, commentaires in-app et historique des versions.
- **Espace de publication** : un hub pour conserver vos exports clés (PPTX, PNG, Excel) et les retrouver par initiative.

## Nouveaux outils qui complèteraient le panel
- **Go-Backlog** : prioriser les user stories avec scoring RICE/WSJF et générer des briefs clairs pour l'équipe tech.
- **Go-Discovery** : cartographier les hypothèses, interviews et insights avec des canevas Discovery/Opportunity Solution Tree.
- **Go-Metrics** : cadrer les KPI North Star, aligner les métriques par persona et suivre les succès d'un quarter à l'autre.
- **Go-Pitch** : assembler en 5 minutes un pitch client/investisseur cohérent avec vos slides et votre roadmap.

## Comment démarrer
1. Ouvrez `public/index.html` (slides), `public/draw.html` (draw) ou `public/plan.html` (timelines) depuis votre navigateur. En local, servez le dossier `public/` (ex. `npx serve public`).
2. Ajoutez votre clé OpenAI dans l'interface si vous souhaitez les suggestions IA. Chaque outil a désormais un sélecteur "Effort de raisonnement" (minimal/low/medium, défaut : low) dans son modal IA.
3. L'IA appelle l'API OpenAI **Responses** (`/v1/responses`) avec le modèle `gpt-5-nano`, streaming activé, et passe par le worker proxy si aucune clé n'est saisie.
4. Personnalisez : blocs, couleurs, images, jalons. Tout se fait directement dans la page.
5. Exportez en un clic ou partagez via le proxy si vous travaillez à plusieurs.

## Notes techniques (IA & proxy)
- Les appels front (draw/think/plan) utilisent le nouvel endpoint `/v1/responses`; le proxy Cloudflare (`workers/openai-proxy`) relaie vers OpenAI et accepte localhost pour les tests.
- Le proxy applique des gardes (taille payload ~10KB, limite messages, quotas KV) et forwarde `reasoning: { effort }` sans convertir `reasoning_effort`.
- Modèle par défaut : `gpt-5-nano`, température 1, streaming SSE côté client.

Go-Toolkit vous aide à passer de l'idée à un support partageable en quelques minutes. Bonne exploration !
