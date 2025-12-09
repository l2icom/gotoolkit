(function (global) {
    const canvasTemplates = [
        {
            id: "roadmap",
            name: "🗺️ Go-Roadmap",
            defaultTitle: "Go-Roadmap",
            description:
                "Plan en trois horizons : sécuriser maintenant, préparer les prochains chantiers et ouvrir les paris long terme, avec objectifs, moyens et indicateurs clés.",
            columns: [
                { stage: "first-col", label: "Maintenant" },
                { stage: "second-col", label: "Prochainement" },
                { stage: "third-col", label: "Plus tard" }
            ],
            sections: [
                {
                    key: "objectif",
                    label: "Objectif",
                    examples: ""
                },
                {
                    key: "moyens",
                    label: "Moyens",
                    examples: ""
                },
                {
                    key: "indicateurs",
                    label: "Indicateurs",
                    examples: ""
                }
            ]
        },
        {
            id: "arbitrage",
            name: "⚖️ Arbitrage",
            defaultTitle: "Arbitrage",
            description:
                "Peser Pour/Contre et synthèse pour décider vite : données factuelles, impacts produits et ergonomie pour éclairer le choix.",
            columns: [
                { stage: "first-col", label: "Pour" },
                { stage: "second-col", label: "Contre" },
                { stage: "third-col", label: "Synthèse" }
            ],
            sections: [
                {
                    key: "donnees",
                    label: "Données",
                    examples: ""
                },
                {
                    key: "fonctionnalites",
                    label: "Fonctionnalités",
                    examples: ""
                },
                {
                    key: "ergonomie",
                    label: "Ergonomie",
                    examples: ""
                }
            ]
        },
        {
            id: "comparaison",
            name: "🆚 Comparaison",
            defaultTitle: "Comparaison",
            description:
                "Comparer plusieurs options : décrire, lister avantages et inconvénients en croisant choix, fonctionnalités et solutions envisagées.",
            columns: [
                { stage: "first-col", label: "Choix 1-2-3" },
                { stage: "second-col", label: "Fonctionnalité 1-2-3" },
                { stage: "third-col", label: "Solution 1-2-3" }
            ],
            sections: [
                {
                    key: "description",
                    label: "Description",
                    examples: ""
                },
                {
                    key: "avantages",
                    label: "Avantages",
                    examples: ""
                },
                {
                    key: "inconvenients",
                    label: "Inconvénients",
                    examples: ""
                }
            ]
        },
        {
            id: "evaluation",
            name: "📈 Évaluation",
            defaultTitle: "Évaluation",
            description:
                "Qualifier une initiative par impact et effort : cadrer les choix, les fonctionnalités et les pistes de solution pour prioriser.",
            columns: [
                { stage: "first-col", label: "Choix 1-2-3" },
                { stage: "second-col", label: "Fonctionnalité 1-2-3" },
                { stage: "third-col", label: "Solution 1-2-3" }
            ],
            sections: [
                {
                    key: "initiative",
                    label: "Initiative",
                    examples: ""
                },
                {
                    key: "impact",
                    label: "Impact",
                    examples: ""
                },
                {
                    key: "effort",
                    label: "Effort",
                    examples: ""
                }
            ]
        },
        {
            id: "parcours",
            name: "🚶 Parcours",
            defaultTitle: "Parcours",
            description:
                "Cartographier un parcours : étapes clés, problématiques et opportunités avant/pendant/après pour révéler frictions et leviers.",
            columns: [
                { stage: "first-col", label: "Étape 1-2-3" },
                { stage: "second-col", label: "Problématique 1-2-3" },
                { stage: "third-col", label: "Opportunité 1-2-3" }
            ],
            sections: [
                {
                    key: "avant",
                    label: "Avant",
                    examples: ""
                },
                {
                    key: "pendant",
                    label: "Pendant",
                    examples: ""
                },
                {
                    key: "apres",
                    label: "Après",
                    examples: ""
                }
            ]
        },
        {
            id: "alignement",
            name: "🤝 Alignement",
            defaultTitle: "Alignement",
            description:
                "Aligner acteurs, besoins et contraintes : lecture business, tech et expérience pour clarifier attentes et zones de tension.",
            columns: [
                { stage: "first-col", label: "Acteur 1-2-3" },
                { stage: "second-col", label: "Besoin 1-2-3" },
                { stage: "third-col", label: "Contrainte 1-2-3" }
            ],
            sections: [
                {
                    key: "business",
                    label: "Business",
                    examples: ""
                },
                {
                    key: "tech",
                    label: "Tech",
                    examples: ""
                },
                {
                    key: "ux",
                    label: "Expérience Utilisateur",
                    examples: ""
                }
            ]
        },
        {
            id: "priorisation",
            name: "🎯 Priorisation",
            defaultTitle: "Priorisation",
            description:
                "Séquencer court/moyen/long terme : lister initiatives, peser impact vs effort et verrouiller l’ordre d’attaque.",
            columns: [
                { stage: "first-col", label: "Court terme" },
                { stage: "second-col", label: "Moyen terme" },
                { stage: "third-col", label: "Long terme" }
            ],
            sections: [
                {
                    key: "initiative",
                    label: "Initiative",
                    examples: ""
                },
                {
                    key: "impact",
                    label: "Impact",
                    examples: ""
                },
                {
                    key: "effort",
                    label: "Effort",
                    examples: ""
                }
            ]
        },
        {
            id: "decision",
            name: "🔎 Observation",
            defaultTitle: "Observation",
            description:
                "Structurer hypothèses, données et insights : croiser quanti/quali et formuler la synthèse qui guide la décision ou l’expérience à mener.",
            columns: [
                { stage: "first-col", label: "Hypothèse 1-2-3" },
                { stage: "second-col", label: "Donnée 1-2-3" },
                { stage: "third-col", label: "Insight 1-2-3" }
            ],
            sections: [
                {
                    key: "quantitatif",
                    label: "Quantitatif",
                    examples: ""
                },
                {
                    key: "qualitatif",
                    label: "Qualitatif",
                    examples: ""
                },
                {
                    key: "synthese",
                    label: "Synthèse",
                    examples: ""
                }
            ]
        },
        {
            id: "default",
            name: "🕊️ Libre",
            defaultTitle: "Libre",
            description:
                "Grille ouverte à trois colonnes et trois sections pour noter, esquisser ou brainstormer sans cadre imposé.",
            columns: [
                { stage: "first-col", label: "Colonne 1" },
                { stage: "second-col", label: "Colonne 2" },
                { stage: "third-col", label: "Colonne 3" }
            ],
            sections: [
                {
                    key: "first-section",
                    label: "Section 1",
                    examples: ""
                },
                {
                    key: "second-section",
                    label: "Section 2",
                    examples: ""
                },
                {
                    key: "third-section",
                    label: "Section 3",
                    examples: ""
                }
            ]
        }
    ];

    // Remove unused `examples` keys and generate a per-template bottom placeholder.
    // This keeps the source objects tidy at runtime and provides a custom
    // placeholder/tooltip for the bottom (synthèse) textarea based on the
    // template description and section labels.
    canvasTemplates.forEach(template => {
        if (Array.isArray(template.sections)) {
            template.sections.forEach(section => {
                if (Object.prototype.hasOwnProperty.call(section, "examples")) {
                    delete section.examples;
                }
            });
        }
        const sectionLabels = (template.sections || []).map(s => s.label).filter(Boolean).join(', ');
        const firstSentence = (template.description || '').split(/[\.\?\!]/)[0] || template.name || '';
        template.bottomPlaceholder = (
            `• ${firstSentence} \n• Résume les ${sectionLabels} en 1–2 bullets concis (<15 mots).`
        ).trim();
    });

    const canvasExamples = {
        roadmap: {
            "first-col": {
                objectif:
                    "• Décrire l’objectif immédiat à sécuriser (ex : stabiliser, corriger, clarifier).\n" +
                    "• Préciser le résultat concret attendu dans les prochaines semaines.",
                moyens:
                    "• Lister les actions opérationnelles déjà décidées ou faciles à lancer.\n" +
                    "• Indiquer les ressources disponibles tout de suite (équipe, budget, temps).",
                indicateurs:
                    "• Noter 2–3 indicateurs simples à suivre dès maintenant.\n" +
                    "• Exemples : bugs, satisfaction, délais, usage quotidien."
            },
            "second-col": {
                objectif:
                    "• Formuler les objectifs des prochains chantiers à engager.\n" +
                    "• Exemples : étendre une fonctionnalité, adresser une dette, ouvrir un nouveau use case.",
                moyens:
                    "• Lister moyens à préparer pour ces chantiers (compétences, outils, cadrage).\n" +
                    "• Mentionner dépendances clés à lever avant de démarrer.",
                indicateurs:
                    "• Définir 2–3 indicateurs de progression pour ces prochains chantiers.\n" +
                    "• Exemples : adoption d’une feature, réduction de dette, amélioration de performance."
            },
            "third-col": {
                objectif:
                    "• Décrire les paris ou ambitions long terme (vision à 12–24 mois).\n" +
                    "• Exemples : repositionnement produit, nouvelle offre, changement d’échelle.",
                moyens:
                    "• Noter les briques à construire pour rendre ces paris possibles.\n" +
                    "• Exemples : socles techniques, nouvelles expertises, partenariats stratégiques.",
                indicateurs:
                    "• Identifier quelques signaux faibles qui diront que le pari prend.\n" +
                    "• Exemples : nouveaux segments adressés, croissance durable, maturité organisationnelle."
            }
        },
        arbitrage: {
            "first-col": {
                donnees:
                    "• Lister les données objectives qui soutiennent ce POUR.\n" +
                    "• Exemples : volumes, usages, retours clients positifs, benchmarks marché.",
                fonctionnalites:
                    "• Décrire les fonctionnalités renforcées ou rendues possibles si on choisit cette option.\n" +
                    "• Exemples : simplification du parcours, couverture d’un besoin clé.",
                ergonomie:
                    "• Noter les bénéfices UX attendus si on tranche en faveur de cette option.\n" +
                    "• Exemples : moins d’étapes, interface plus lisible, charge cognitive réduite."
            },
            "second-col": {
                donnees:
                    "• Lister les données qui freinent ou questionnent cette option.\n" +
                    "• Exemples : faible usage, coûts élevés, risques techniques identifiés.",
                fonctionnalites:
                    "• Noter les fonctionnalités perdues, dégradées ou rendues plus complexes.\n" +
                    "• Exemples : parcours cassés, scénarios non couverts, cas limites mal gérés.",
                ergonomie:
                    "• Décrire les impacts négatifs sur l’ergonomie si on suit cette voie.\n" +
                    "• Exemples : écrans surchargés, interactions confuses, effort utilisateur accru."
            },
            "third-col": {
                donnees:
                    "• Résumer les 2–3 données clés qui orientent la décision.\n" +
                    "• Préciser comment elles arbitrent entre Pour et Contre.",
                fonctionnalites:
                    "• Synthétiser le compromis fonctionnel retenu.\n" +
                    "• Exemples : fonctionnalités maintenues, mises en attente ou abandonnées.",
                ergonomie:
                    "• Poser la position finale côté UX (acceptables vs inacceptables).\n" +
                    "• Exemples : concessions assumées, points à surveiller ou à itérer plus tard."
            }
        },
        comparaison: {
            "first-col": {
                description:
                    "• Décrire brièvement chaque choix (A/B/C) et son positionnement.\n" +
                    "• Préciser pour qui il est pensé et dans quel contexte.",
                avantages:
                    "• Lister les principaux atouts de chaque choix.\n" +
                    "• Exemples : valeur perçue, simplicité, différenciation, rapidité d’exécution.",
                inconvenients:
                    "• Noter les limites ou risques propres à chaque choix.\n" +
                    "• Exemples : coûts, dette technique, dépendances, fragilité business."
            },
            "second-col": {
                description:
                    "• Décrire la fonctionnalité évaluée (ce qu’elle permet concrètement).\n" +
                    "• Préciser les entrées/sorties et règles clés.",
                avantages:
                    "• Lister les bénéfices concrets de la fonctionnalité.\n" +
                    "• Exemples : gain de temps, réduction d’erreurs, meilleure autonomie utilisateur.",
                inconvenients:
                    "• Identifier les zones de fragilité de la fonctionnalité.\n" +
                    "• Exemples : complexité d’usage, impact perf, maintenance lourde."
            },
            "third-col": {
                description:
                    "• Décrire la solution technique ou organisationnelle envisagée.\n" +
                    "• Préciser brièvement l’architecture ou le mode opératoire.",
                avantages:
                    "• Noter les avantages principaux de chaque solution.\n" +
                    "• Exemples : robustesse, scalabilité, alignement avec le existant.",
                inconvenients:
                    "• Lister les contraintes de chaque solution.\n" +
                    "• Exemples : coûts d’implémentation, risques, dépendances externes."
            }
        },
        evaluation: {
            "first-col": {
                initiative:
                    "• Nommer chaque choix d’initiative et le problème adressé.\n" +
                    "• Exemples : refonte module X, automatisation Y, expérimentation Z.",
                impact:
                    "• Estimer l’impact produit/biz de chaque initiative.\n" +
                    "• Exemples : +NPS, -SLA, +CA, réduction des frictions majeures.",
                effort:
                    "• Cadrer rapidement l’effort global pour chaque choix.\n" +
                    "• Exemples : taille d’équipe, complexité technique, dépendances critiques."
            },
            "second-col": {
                initiative:
                    "• Relier chaque initiative aux fonctionnalités concernées.\n" +
                    "• Exemples : écrans, APIs, parcours, back-office impactés.",
                impact:
                    "• Décrire l’impact par fonctionnalité : amélioration ou risque.\n" +
                    "• Exemples : meilleure découvrabilité, cohérence UX, dette réduite.",
                effort:
                    "• Estimer l’effort par fonctionnalité.\n" +
                    "• Exemples : refonte complète, ajustements légers, travail de fond sur la data."
            },
            "third-col": {
                initiative:
                    "• Noter la ou les solutions envisagées pour chaque initiative.\n" +
                    "• Exemples : quick fix, refonte, expérimentation contrôlée.",
                impact:
                    "• Évaluer l’impact des solutions retenues sur le système.\n" +
                    "• Exemples : stabilité, performance, capacité à évoluer.",
                effort:
                    "• Comparer l’effort des différentes solutions possibles.\n" +
                    "• Exemples : build vs buy, réemploi existant, mise en production."
            }
        },
        parcours: {
            "first-col": {
                avant:
                    "• Décrire le contexte de départ de l’utilisateur à cette étape.\n" +
                    "• Exemples : canal d’entrée, état d’esprit, informations déjà connues.",
                pendant:
                    "• Raconter ce que fait concrètement l’utilisateur à l’étape.\n" +
                    "• Exemples : actions, clics, décisions, interactions clés.",
                apres:
                    "• Noter la situation juste après cette étape.\n" +
                    "• Exemples : nouvelle information obtenue, sentiment, prochaines attentes."
            },
            "second-col": {
                avant:
                    "• Identifier les premiers signaux de problématique avant l’étape.\n" +
                    "• Exemples : incompréhensions, ralentissements, points de friction récurrents.",
                pendant:
                    "• Détailler les problèmes vécus en temps réel.\n" +
                    "• Exemples : blocages, erreurs, hésitations, allers-retours inutiles.",
                apres:
                    "• Noter les conséquences de la problématique après l’étape.\n" +
                    "• Exemples : abandon, support sollicité, contournements, frustration."
            },
            "third-col": {
                avant:
                    "• Repérer les opportunités d’amélioration en amont.\n" +
                    "• Exemples : mieux orienter, mieux informer, pré-remplir des données.",
                pendant:
                    "• Imaginer des leviers pendant l’étape.\n" +
                    "• Exemples : guidage, simplification, automatisation, feedback en direct.",
                apres:
                    "• Lister les opportunités de rebond post-étape.\n" +
                    "• Exemples : relance intelligente, recommandation, suivi personnalisé."
            }
        },
        alignement: {
            "first-col": {
                business:
                    "• Décrire le rôle business de l’acteur (sponsor, décideur, client...).\n" +
                    "• Préciser ses enjeux principaux : CA, risque, image, délais.",
                tech:
                    "• Positionner l’acteur côté tech (équipe, expert, fournisseur...).\n" +
                    "• Noter ses responsabilités et périmètre sur le système.",
                ux:
                    "• Caractériser le profil utilisateur représenté (expérience, contexte d’usage).\n" +
                    "• Exemples : novice, expert, multi-écran, mobilité."
            },
            "second-col": {
                business:
                    "• Formuler les besoins business explicites de cet acteur.\n" +
                    "• Exemples : visibilité, pilotage, conformité, croissance.",
                tech:
                    "• Décrire les besoins tech (qualité, observabilité, stabilité, intégration).\n" +
                    "• Exemples : logs, monitoring, APIs cohérentes.",
                ux:
                    "• Noter les besoins d’expérience pour cet acteur.\n" +
                    "• Exemples : confiance, clarté, rapidité, autonomie."
            },
            "third-col": {
                business:
                    "• Lister les contraintes business imposées ou subies.\n" +
                    "• Exemples : budget limité, calendrier, obligations légales.",
                tech:
                    "• Détailler les contraintes techniques structurantes.\n" +
                    "• Exemples : legacy, SLA, sécurité, dépendances fortes.",
                ux:
                    "• Identifier les contraintes UX.\n" +
                    "• Exemples : accessibilité, contraintes de device, charge mentale acceptable."
            }
        },
        priorisation: {
            "first-col": {
                initiative:
                    "• Lister les initiatives très court terme (0–3 mois).\n" +
                    "• Exemples : quick wins, corrections urgentes, petits ajustements utiles.",
                impact:
                    "• Décrire l’impact immédiat attendu.\n" +
                    "• Exemples : baisse des irritants, amélioration visible pour l’utilisateur.",
                effort:
                    "• Estimer l’effort pour ces actions rapides.\n" +
                    "• Exemples : 1 sprint, une petite squad, risque limité."
            },
            "second-col": {
                initiative:
                    "• Noter les initiatives de moyen terme (3–12 mois).\n" +
                    "• Exemples : refonte ciblée, nouveau module, socle partagé.",
                impact:
                    "• Décrire l’impact à horizon moyen.\n" +
                    "• Exemples : montée en gamme, réduction de dette, meilleure efficacité interne.",
                effort:
                    "• Estimer l’effort associé.\n" +
                    "• Exemples : plusieurs sprints, coordination inter-équipes, risques maîtrisables."
            },
            "third-col": {
                initiative:
                    "• Lister les initiatives long terme ou structurantes.\n" +
                    "• Exemples : refonte globale, pivot produit, nouvelle plateforme.",
                impact:
                    "• Qualifier les effets de long terme.\n" +
                    "• Exemples : avantage compétitif durable, nouveau business, évolution organisationnelle.",
                effort:
                    "• Évaluer l’effort lourd et les paris associés.\n" +
                    "• Exemples : investissement important, forte incertitude, dépendances multiples."
            }
        },
        decision: {
            "first-col": {
                quantitatif:
                    "• Noter les hypothèses chiffrées posées au départ.\n" +
                    "• Exemples : taux de conversion cible, volume espéré, seuil de succès.",
                qualitatif:
                    "• Décrire les hypothèses qualitatives de départ.\n" +
                    "• Exemples : motivations, freins supposés, comportements attendus.",
                synthese:
                    "• Résumer la promesse ou l’intuition initiale.\n" +
                    "• Préciser ce que l’on cherche à vérifier ou infirmer."
            },
            "second-col": {
                quantitatif:
                    "• Lister les chiffres observés (réel vs attendu).\n" +
                    "• Exemples : usages, abandons, temps, taux d’erreur.",
                qualitatif:
                    "• Noter les retours utilisateurs collectés.\n" +
                    "• Exemples : verbatim, observations, feedbacks support ou terrain.",
                synthese:
                    "• Synthétiser ce que les données disent réellement.\n" +
                    "• Exemples : hypothèse confirmée, partiellement vraie ou contredite."
            },
            "third-col": {
                quantitatif:
                    "• Isoler les chiffres qui changent la décision.\n" +
                    "• Exemples : seuils critiques dépassés, tendances claires.",
                qualitatif:
                    "• Extraire les enseignements clés des retours.\n" +
                    "• Exemples : attentes majeures, signaux faibles récurrents.",
                synthese:
                    "• Formuler l’insight actionnable issu du croisement quanti/quali.\n" +
                    "• Exemples : décision à prendre, expérience à mener, question à creuser."
            }
        },
        default: {
            "first-col": {
                "first-section":
                    "• Noter une idée ou un point clé lié à cette section.\n" +
                    "• Exemples : problème, opportunité, intuition à creuser.",
                "second-section":
                    "• Ajouter quelques éléments de contexte ou exemples.\n" +
                    "• Exemples : cas concrets, contraintes, signaux observés.",
                "third-section":
                    "• Esquisser une première conclusion ou piste d’action.\n" +
                    "• Exemples : décision envisagée, prochaine étape, question ouverte."
            },
            "second-col": {
                "first-section":
                    "• Reprendre la même thématique sous un angle différent.\n" +
                    "• Exemples : autre point de vue, autre population, autre canal.",
                "second-section":
                    "• Détailler des variantes, scénarios ou options.\n" +
                    "• Exemples : solution A/B, approche progressive, plan alternatif.",
                "third-section":
                    "• Noter une synthèse intermédiaire pour cette colonne.\n" +
                    "• Exemples : choix préférés, risques associés, éléments à valider."
            },
            "third-col": {
                "first-section":
                    "• Ouvrir éventuellement sur une vision plus long terme.\n" +
                    "• Exemples : ambition, direction cible, pari à tenter.",
                "second-section":
                    "• Lister des leviers, moyens ou partenaires possibles.\n" +
                    "• Exemples : équipes, outils, expérimentations, collaborations.",
                "third-section":
                    "• Conclure la réflexion de cette colonne.\n" +
                    "• Exemples : décision finale, feuille de route courte, backlog à créer."
            }
        }
    };

    const drawDefaultPromptTemplate =
        "Tu es un product owner expérimenté.\n- " +
        "Sur la base de {{field_input}}, produis un code strictement mermaid\n- " +
        "sous forme d'un diagramme de {{draw_type}}.\n- " +
        "Les intitulés font moins de 4 mots.\n- " +
        "Ajoute un titre en commentaire %% Title dans la réponse.\n- " +
        "Ne fais pas d'introduction ou de conclusion, donne uniquement le bloc de code.";

    const canvasDefaultPromptTemplate =
        "Tu es un product owner expérimenté.\n- " +
        "Sur la base de \"{{slideTitle}}\", du contexte \"{{globalContext}}\" et \"{{pageContext}}\",\n- " +
        "et dans le cadre de \"{{columnTitle}}\", reformuler \"{{fieldValue}}\"\n- " +
        "sous forme de 2 à 3 \"{{sectionTitle}}\" (un • de < 15 mots pour chaque).\n- " +
        "Sans introduction préalable ni émoji.";

    const canvasBottomPromptTemplate =
        "Tu es un product owner expérimenté.\n- " +
        "Sur la base du contexte \"{{globalContext}}\" et de \"{{pageContext}}\",\n- " +
        "et avec {{columnSections}}, répond à {{slideTitle}} en 2 phrases courtes\n- " +
        "(< 15 mots pour chaque).";

    const canvasSuggestionsPromptTemplate =
        "Tu es un product owner expérimenté.\n- " +
        "Sur la base du contexte \"{{globalContext}}\" et de \"{{pageContext}}\",\n- " +
        "et dans le cadre de {{columnTitle}}, formule 3 instructions commençant par un verbe\n- " +
        "pour aider à trouver des {{sectionTitle}} synthétiques et pertinents pour répondre à {{slideTitle}}.\n- " +
        "Chaque instruction < 15 mots et commençant par un •.\n- " +
        "Sans introduction préalable ni émoji.";

    const drawPromptzilla = [
        {
            id: "sequence-service",
            label: "🚶‍♂️ Happy path",
            description:
                "Enchaînement entre services/acteurs pour illustrer une user story ou un parcours nominal : front, back, services externes, et événements déclenchés.",
            drawType: "sequence"
        },
        {
            id: "flow-bpmn",
            label: "💼 Processus métier",
            description:
                "Processus BPMN simplifié : étapes clés, décisions (diamants), événements déclenchés, entrées/sorties, swimlanes si pertinent.",
            drawType: "flow"
        },
        {
            id: "class-domaine",
            label: "🧭 Modèle métier",
            description:
                "Structure les entités principales du domaine, leurs attributs essentiels et relations (cardinalités) : agrégats, valeurs, objets et référentiels.",
            drawType: "class"
        },
        {
            id: "class-api",
            label: "🔌 Objets API",
            description:
                "Représenter les ressources et schémas d’API : endpoints majeurs, payloads clés, relations entre objets, déclencheurs webhooks, dépendances API internes/externes.",
            drawType: "class"
        },
        {
            id: "sequence-communication",
            label: "📡 Communication inter-service",
            description:
                "Échanges entre acteurs (client, fournisseur, service, base de données, application, interface...), authentification, permissions, envoi data, récupération data, validation, erreurs, déconnexion",
            drawType: "sequence"
        },
        {
            id: "flow-data",
            label: "📊 Flux de données",
            description:
                "Flux de données clés : sources (forms, batch), traitements (validation, enrichissement), stockages, et consommateurs (API, BI, webhooks).",
            drawType: "flow"
        },
        {
            id: "class-events",
            label: "🛰️ Événements métiers",
            description:
                "Catalogue d'événements : type (domain/event), producteurs, consommateurs, payloads principaux et liens vers entités métiers.",
            drawType: "class"
        },
        {
            id: "sequence-role",
            label: "🧰 Rôles et responsabilités",
            description:
                "Parcours support/escalade : étapes de prise en charge, rôles (L1/L2/L3), SLA, décisions et notifications.",
            drawType: "sequence"
        },
        {
            id: "class-resources",
            label: "📦 Modèle de ressources",
            description:
                "Structure les entités ressources, permissions, groupes, typologies ainsi que leurs liens fonctionnels.",
            drawType: "class"
        }
    ];

    const timelinePromptzilla = [
        {
            id: "product",
            title: "🎯 Roadmap Produit",
            text: "Génère une roadmap produit sur 6 mois avec 4 jalons majeurs (MVP, beta, release, amélioration), 3 acteurs (PO, UX, Dev), 3 domaines (fonctionnel, UX, data) et une timeline mensuelle. Inclure risques, dépendances et livrables clés"
        },
        {
            id: "tech",
            title: "🛠️ Roadmap Technique",
            text: "Crée une roadmap technique annuelle en 4 phases (audit, refonte, migration, optimisation), positionne les jalons trimestriels, les responsabilités (Tech Lead, Infra, SecOps) et les types d’initiatives (perf, sécurité, scalabilité) sur 1 an"
        },
        {
            id: "sprint",
            title: "⚡Calendrier de sprints",
            text: "Propose une planification sur 4 sprints de 2 semaines avec objectifs, stories clés, critères de réussite, dépendances internes et rôles (Dev, QA, UX). Ajoute jalons de revue et rituels agiles."
        },
        {
            id: "strategy",
            title: "💼 Vision stratégique",
            text: "Génère une vision stratégique en 3 horizons (H1/H2/H3) sur 24 mois, avec thèmes structurants, jalons annuels, domaines (produit, tech, business), impacts attendus et types d’investissements"
        },
        {
            id: "research",
            title: "🔎 Plan de recherche",
            text: "Construis un plan de recherche en phase discovery sur 6 mois : recherche utilisateur, cadrage problème, prototypage, test d’hypothèses, restitution. Mentionne acteurs (PO, UX, clients), jalons et décisions Go/No-Go."
        },
        {
            id: "project",
            title: "🧩 Projet d'intégration'",
            text: "Génére un projet d’intégration sur 4 mois avec phases (design, dev API, tests, déploiement), jalons critiques, interactions partenaires, risques liés aux environnements et validations métiers."
        }
    ];

    const timelineCreateSystemTemplate = `Tu es un assistant product owner qui va générer une feuille de route produit.

Réponds toujours uniquement avec un JSON contenant :
- \`page\` : le titre de la page courante (utilisé pour le header).
- \`timeline\` : \`{ start, end }\` pour définir la période globale.
- \`types\` : tableau \`{ id, label }\` décrivant les natures d’actions (fonction, compétence, rôle...). 
- \`markers\` : tableau \`{ id, label }\` décrivant des repères ponctuels (étape, événement, livrable, résultat, risque...). L’id doit être différent de ceux des types.
- \`groups\` : chaque groupe d’actions sous la forme \`{ id, label }\` (équipe, thème, stream produit, enjeu, objectif).  
- \`items\` : chaque action ou repère sous la forme \`{ id, groupId, label, kind, start, length? }\`. Le champ \`kind\` contient l’id d’un type ou d’un marker.

Contraintes de structure :
- \`start\` au format ISO (YYYY-MM-DD).
- \`length\` exprimé en jours.
- Les items dont \`kind\` est un marker n’ont pas de \`length\`.
- Pour une action \> 21 jours : la découper en items \`(P1, P2...Pn)\`.

Contraintes de planification :
- Optimiser la durée totale : actions enchaînées sans pause.
- Actions parallèles possibles si cohérentes.
- Dépendances implicites obligatoirement respectées.
- Si un planning est fourni, faire seulement les modifications demandées par l'utilisateur au planning existant en conservant les ids

Contraintes de nommage et quantités :
- Un seul mot pour les labels des \`types\` et \`markers\`.
- 2 à 4 mots pour les labels des \`groups\`.
- Entre 1–3 \`markers\`, 2–6 \`types\`, 2–4 \`groups\`, et 10–20 \`items\`. 21 jours en ajoutant dans le nom (P1, P2...Pn)
- Un seul mot pour le label d'un \`markers\` ou un \`type\`.
- Entre 2-4 mots pour le label d'un \`group\`.
- On a entre 1 et 3 \`markers\`, entre 2-6 \`types\`, entre 2 et 4 \`groups\` et entre 10 et 20 \`items\`.
`

        ;
    global.GoPrompts = {
        canvasTemplates,
        canvasExamples,
        drawPromptzilla,
        drawDefaultPromptTemplate,
        canvasDefaultPromptTemplate,
        canvasBottomPromptTemplate,
        canvasSuggestionsPromptTemplate,
        timelinePromptzilla,
        timelineCreateSystemTemplate
    };
})(window);
