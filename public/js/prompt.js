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
                { key: "objectif", label: "Objectif", examples: "" },
                { key: "moyens", label: "Moyens", examples: "" },
                { key: "indicateurs", label: "Indicateurs", examples: "" }
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
                { key: "donnees", label: "Données", examples: "" },
                { key: "fonctionnalites", label: "Fonctionnalités", examples: "" },
                { key: "ergonomie", label: "Ergonomie", examples: "" }
            ]
        },
        {
            id: "comparaison",
            name: "🆚 Comparaison",
            defaultTitle: "Comparaison",
            description:
                "Comparer plusieurs options : décrire, lister avantages et inconvénients en croisant choix, fonctionnalités et solutions envisagées.",
            columns: [
                { stage: "first-col", label: "Choix A/B/C" },
                { stage: "second-col", label: "Fonctionnalité A/B/C" },
                { stage: "third-col", label: "Solution A/B/C" }
            ],
            sections: [
                { key: "description", label: "Description", examples: "" },
                { key: "avantages", label: "Avantages", examples: "" },
                { key: "inconvenients", label: "Inconvénients", examples: "" }
            ]
        },
        {
            id: "evaluation",
            name: "📈 Évaluation",
            defaultTitle: "Évaluation",
            description:
                "Qualifier une initiative par impact et effort : cadrer les choix, les fonctionnalités et les pistes de solution pour prioriser.",
            columns: [
                { stage: "first-col", label: "Choix A/B/C" },
                { stage: "second-col", label: "Fonctionnalité A/B/C" },
                { stage: "third-col", label: "Solution A/B/C" }
            ],
            sections: [
                { key: "initiative", label: "Initiative", examples: "" },
                { key: "impact", label: "Impact", examples: "" },
                { key: "effort", label: "Effort", examples: "" }
            ]
        },
        {
            id: "parcours",
            name: "🚶 Parcours",
            defaultTitle: "Parcours",
            description:
                "Cartographier un parcours : étapes clés, problématiques et opportunités avant/pendant/après pour révéler frictions et leviers.",
            columns: [
                { stage: "first-col", label: "Étape A/B/C" },
                { stage: "second-col", label: "Problématique A/B/C" },
                { stage: "third-col", label: "Opportunité A/B/C" }
            ],
            sections: [
                { key: "avant", label: "Avant", examples: "" },
                { key: "pendant", label: "Pendant", examples: "" },
                { key: "apres", label: "Après", examples: "" }
            ]
        },
        {
            id: "alignement",
            name: "🤝 Alignement",
            defaultTitle: "Alignement",
            description:
                "Aligner acteurs, besoins et contraintes : lecture business, tech et expérience pour clarifier attentes et zones de tension.",
            columns: [
                { stage: "first-col", label: "Acteur A/B/C" },
                { stage: "second-col", label: "Besoin A/B/C" },
                { stage: "third-col", label: "Contrainte A/B/C" }
            ],
            sections: [
                { key: "business", label: "Business", examples: "" },
                { key: "tech", label: "Tech", examples: "" },
                { key: "ux", label: "Expérience Utilisateur", examples: "" }
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
                { key: "initiative", label: "Initiative", examples: "" },
                { key: "impact", label: "Impact", examples: "" },
                { key: "effort", label: "Effort", examples: "" }
            ]
        },
        {
            id: "decision",
            name: "🔎 Observation",
            defaultTitle: "Observation",
            description:
                "Structurer hypothèses, données et insights : croiser quanti/quali et formuler la synthèse qui guide la décision ou l’expérience à mener.",
            columns: [
                { stage: "first-col", label: "Hypothèse A/B/C" },
                { stage: "second-col", label: "Donnée A/B/C" },
                { stage: "third-col", label: "Insight A/B/C" }
            ],
            sections: [
                { key: "quantitatif", label: "Quantitatif", examples: "" },
                { key: "qualitatif", label: "Qualitatif", examples: "" },
                { key: "synthese", label: "Synthèse", examples: "" }
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
                { key: "first-section", label: "Section 1", examples: "" },
                { key: "second-section", label: "Section 2", examples: "" },
                { key: "third-section", label: "Section 3", examples: "" }
            ]
        }
    ];

    const drawDefaultPromptTemplate =
        "Tu es un product owner expérimenté, sur la base de {{field_input}}, produis un code strictement mermaid sous forme d'un diagramme rigoureux de {{draw_type}}. Les intitulés font moins de 4 mots. Ajoute un titre en commentaire %% Title dans la réponse. Ne fais pas d'introduction ou de conclusion, donne uniquement le bloc de code.";

    const canvasDefaultPromptTemplate =
        `Tu es un product owner expérimenté, sur la base de "{{slideTitle}}", du contexte "{{globalContext}}" et "{{pageContext}}" et dans le cadre de "{{columnTitle}}", reformuler "{{fieldValue}}" sous forme de 2 à 3 "{{sectionTitle}}" (un • de < 15 mots pour chaque) sans introduction préalable ni émoji`;
    const canvasBottomPromptTemplate =
        `Tu es un product owner expérimenté, sur la base du contexte "{{globalContext}}" et de "{{pageContext}}", et avec {{columnSections}}, répond à {{slideTitle}} en 2 phrases courtes (< 15 mots pour chaque).`;
    const canvasSuggestionsPromptTemplate =
        `Tu es un product owner expérimenté, sur la base du contexte "{{globalContext}}" et de "{{pageContext}}", et dans le cadre de {{columnTitle}}, formuler 3 instructions commençant par un verbe pour aider à trouver des {{sectionTitle}} synthétiques et pertinents pour répondre à {{slideTitle}} (< 15 mots pour chaque et en commençant chacune par un •). Tout ça sans introduction préalable ni émoji`;

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
- Si un planning est fourni, faire seulement des ajouts ou des modifications au planning existant en conservant les ids

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
        drawPromptzilla,
        drawDefaultPromptTemplate,
        canvasDefaultPromptTemplate,
        canvasBottomPromptTemplate,
        canvasSuggestionsPromptTemplate,
        timelinePromptzilla,
        timelineCreateSystemTemplate
    };
})(window);
