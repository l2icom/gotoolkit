(function (global) {
    const canvasTemplates = [
        {
            id: "roadmap",
            name: "🗺️ Roadmap",
            label: "Planifie maintenant, bientôt, plus tard",
            defaultTitle: "Roadmap",
            description:
                "Planifie maintenant, bientôt, plus tard.\n" +
                "☐ Temporalité\n" +
                "☐ Objectifs\n" +
                "☐ Moyens\n" +
                "☐ Indicateurs",
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
            label: "Comparer pour et contre clairement",
            defaultTitle: "Arbitrage",
            description:
                "Comparer pour et contre clairement.\n" +
                "☐ Décisions\n" +
                "☐ Données\n" +
                "☐ Fonctionnalités\n" +
                "☐ Ergonomie",
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
            label: "Choisir entre options et solutions",
            defaultTitle: "Comparaison",
            description:
                "Choisir entre options et solutions.\n" +
                "☐ Choix\n" +
                "☐ Solutions\n" +
                "☐ Fonctionnalités\n" +
                "☐ Avantages\n" +
                "☐ Inconvénients\n",

            columns: [
                { stage: "first-col", label: "Choix 1-2-3" },
                { stage: "second-col", label: "Fonctionnalité 1-2-3" },
                { stage: "third-col", label: "Solution 1-2-3" }
            ],
            sections: [
                {
                    key: "solutions",
                    label: "Solutions",
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
            label: "Qualifier impact et effort par initiative",
            defaultTitle: "Évaluation",
            description:
                "Qualifier impact et effort par initiative.\n" +
                "☐ Initiative\n" +
                "☐ Impact\n" +
                "☐ Effort\n" +
                "☐ Choix\n" +
                "☐ Fonctionnalités\n" +
                "☐ Solutions",
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
            label: "Cartographier étapes, problèmes, opportunités",
            defaultTitle: "Parcours",
            description:
                "Cartographier étapes, problèmes, opportunités.\n" +
                "☐ Étapes\n" +
                "☐ Problématique\n" +
                "☐ Opportunités\n" +
                "☐ Temporalité",
            columns: [
                { stage: "first-col", label: "Étape 1-2-3" },
                { stage: "second-col", label: "Problématique 1-2-3" },
                { stage: "third-col", label: "Opportunité 1-2-3" }
            ],
            sections: [
                {
                    key: "debut",
                    label: "Début",
                    examples: ""
                },
                {
                    key: "intermediaire",
                    label: "Intermédiaire",
                    examples: ""
                },
                {
                    key: "fin",
                    label: "Fin",
                    examples: ""
                }
            ]
        },
        {
            id: "alignement",
            name: "🤝 Alignement",
            label: "Aligner acteurs, besoins et contraintes",
            defaultTitle: "Alignement",
            description:
                "Aligner acteurs, besoins et contraintes.\n" +
                "☐ Acteurs\n" +
                "☐ Besoins\n" +
                "☐ Contraintes\n" +
                "☐ Business\n" +
                "☐ Tech\n" +
                "☐ UX",
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
            label: "Prioriser initiatives dans le temps",
            defaultTitle: "Priorisation",
            description:
                "Prioriser initiatives dans le temps.\n" +
                "☐ Temporalité\n" +
                "☐ Initiative\n" +
                "☐ Impact\n" +
                "☐ Effort\n",
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
            label: "Observer données et conclure simplement",
            defaultTitle: "Observation",
            description:
                "Observer données et conclure simplement.\n" +
                "☐ Hypothèses\n" +
                "☐ Données\n" +
                "☐ Insights\n" +
                "☐ Décision",
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
            name: "🕊️ Générique",
            label: "Modèle générique pour structurer tes idées",
            defaultTitle: "Générique",
            description:
                "Modèle générique pour structurer tes idées.\n",
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
                    "" +
                    "",
                "second-section":
                    "" +
                    "",
                "third-section":
                    "" +
                    ""
            },
            "second-col": {
                "first-section":
                    "" +
                    "",
                "second-section":
                    "" +
                    "",
                "third-section":
                    "" +
                    ""
            },
            "third-col": {
                "first-section":
                    "" +
                    "",
                "second-section":
                    "" +
                    "",
                "third-section":
                    "" +
                    ""
            }
        }
    };

    const drawDefaultPromptTemplate =
        "Sur la base de {{field_input}}, produis un code strictement mermaid\n- " +
        "sous forme d'un diagramme de {{draw_type}}.\n- " +
        "Les intitulés font moins de 4 mots.\n- " +
        "Ajoute un titre en commentaire %% Title dans la réponse.\n- " +
        "Ne fais pas d'introduction ou de conclusion, donne uniquement le bloc de code.";

    const canvasDefaultPromptTemplate =
        "Sur la base de \"{{slideTitle}}\", du contexte \"{{globalContext}}\" et \"{{pageContext}}\",\n- " +
        "et dans le cadre de \"{{columnTitle}}\", reformuler \"{{fieldValue}}\"\n- " +
        "sous forme de 2 à 3 \"{{sectionTitle}}\" (un • de < 15 mots pour chaque).\n- " +
        "Sans introduction préalable ni émoji.";

    const canvasBottomPromptTemplate =
        "Sur la base du contexte \"{{globalContext}}\" et de \"{{pageContext}}\",\n- " +
        "et avec {{columnSections}}, répond à {{slideTitle}} en 2 phrases de moins de 15 mots précédés d'un •\n- " +
        "(< 15 mots pour chaque).";

    const canvasSuggestionsPromptTemplate = `
- En partant du contexte "{{globalContext}}" et en connaissant la section "{{sectionLabel}}" de {{columnSection}},
- Si {{fieldValue}} est vide, propose exactement deux conseils • de moins de 15 mots chacune, pour remplir cette saisie ; (le deuxième étant des mots clés d'exemples de réponse) ;
- Si {{fieldValue}} est rempli, suggère deux points positifs de la saisie (précédés chacun de + et commençant par un nom)
- Et suggère deux critiques constructives sur la saisie (précédés chacun de - et commençant par un verbe)
- Réponds uniquement sans autre texte ni émoji avec moins de 15 mots par point
`;

    const drawPromptzilla = [
        {
            id: "sequence-service",
            label: "🚶‍♂️ Happy path",
            description:
                "Tracer le scénario nominal et ses interactions clés.\n" +
                "☐ Services\n" +
                "☐ Acteurs\n" +
                "☐ User story\n" +
                "☐ Événements",
            drawType: "sequence"
        },
        {
            id: "flow-bpmn",
            label: "💼 Processus métier",
            description:
                "Cartographier le processus métier et ses décisions clés.\n" +
                "☐ Étapes\n" +
                "☐ Décisions\n" +
                "☐ Événements\n" +
                "☐ Swimlanes",
            drawType: "flow"
        },
        {
            id: "class-domaine",
            label: "🧭 Modèle métier",
            description:
                "Structurer les entités et relations du domaine.\n" +
                "☐ Entités\n" +
                "☐ Attributs\n" +
                "☐ Relations\n" +
                "☐ Agrégats",
            drawType: "class"
        },
        {
            id: "class-api",
            label: "🔌 Objets API",
            description:
                "Lister les objets API et leurs relations.\n" +
                "☐ Endpoints\n" +
                "☐ Payloads\n" +
                "☐ Relations\n" +
                "☐ Webhooks",
            drawType: "class"
        },
        {
            id: "sequence-communication",
            label: "📡 Communication inter-service",
            description:
                "Décrire les échanges et contrôles entre services.\n" +
                "☐ Authentification\n" +
                "☐ Permissions\n" +
                "☐ Validation\n" +
                "☐ Erreurs",
            drawType: "sequence"
        },
        {
            id: "flow-data",
            label: "📊 Flux de données",
            description:
                "Visualiser le parcours complet des données.\n" +
                "☐ Sources\n" +
                "☐ Traitements\n" +
                "☐ Stockages\n" +
                "☐ Consommateurs",
            drawType: "flow"
        },
        {
            id: "class-events",
            label: "🛰️ Événements métiers",
            description:
                "Cartographier les événements métiers et leurs flux.\n" +
                "☐ Événements\n" +
                "☐ Producteurs\n" +
                "☐ Consommateurs\n" +
                "☐ Payloads",
            drawType: "class"
        },
        {
            id: "sequence-role",
            label: "🧰 Rôles et responsabilités",
            description:
                "Clarifier rôles, décisions et notifications clés.\n" +
                "☐ Rôles\n" +
                "☐ SLA\n" +
                "☐ Décisions\n" +
                "☐ Notifications",
            drawType: "sequence"
        },
        {
            id: "class-resources",
            label: "📦 Modèle de ressources",
            description:
                "Décrire ressources, permissions et liens associés.\n" +
                "☐ Ressources\n" +
                "☐ Permissions\n" +
                "☐ Groupes\n" +
                "☐ Liens",
            drawType: "class"
        }
    ];

    const timelinePromptzilla = [
        {
            id: "product",
            title: "🎯 Roadmap Produit",
            text:
                "Tracer une roadmap produit avec thèmes, livrables et risques.\n" +
                "☐ Thèmes\n" +
                "☐ Livrables\n" +
                "☐ Risques\n" +
                "☐ Jalons"
        },
        {
            id: "tech",
            title: "🛠️ Roadmap Technique",
            text:
                "Planifier les phases techniques et responsabilités.\n" +
                "☐ Périmètre\n" +
                "☐ Dépendances\n" +
                "☐ Ressources\n" +
                "☐ Risques"
        },
        {
            id: "default",
            title: "🕊️ Générique",
            text:
                "Organiser des événements dans le temps.\n" +
                "☐ Actions\n" +
                "☐ Groupes\n" +
                "☐ Repères\n" +
                "☐ Types"
        },
        {
            id: "sprint",
            title: "⚡Calendrier de sprints",
            text:
                "Organiser les sprints, objectifs et dépendances.\n" +
                "☐ Objectifs\n" +
                "☐ Stories\n" +
                "☐ Équipe\n" +
                "☐ Rituels"
        },
        {
            id: "strategy",
            title: "💼 Vision stratégique",
            text:
                "Projeter la vision stratégique sur plusieurs horizons.\n" +
                "☐ Ambitions\n" +
                "☐ Initiativess\n" +
                "☐ Investissements\n" +
                "☐ Indicateurs"
        },
        {
            id: "research",
            title: "🔎 Plan de recherche",
            text:
                "Programmer la recherche, jalons et décisions clés.\n" +
                "☐ Hypothèses\n" +
                "☐ Domaines\n" +
                "☐ Études\n" +
                "☐ Résultats"
        },
        {
            id: "project",
            title: "🧩 Projet d'intégration",
            text:
                "Piloter un projet d’intégration avec phases et risques.\n" +
                "☐ Acteurs\n" +
                "☐ Phases\n" +
                "☐ Livrables\n" +
                "☐ Risques"
        },
        {
            id: "journey",
            title: "👤 Customer Journey Timeline",
            text:
                "Visualiser l’expérience utilisateur dans le temps.\n" +
                "☐ Étapes clés\n" +
                "☐ Émotions / irritants\n" +
                "☐ Points de contact\n" +
                "☐ Opportunités"
        },
        {
            id: "change-management",
            title: "🔄 Conduite du changement",
            text:
                "Piloter l’adoption et l’alignement des acteurs.\n" +
                "☐ Parties prenantes\n" +
                "☐ Messages clés\n" +
                "☐ Actions d’accompagnement\n" +
                "☐ Indicateurs d’adoption"
        },
    ];

    const timelineCreateSystemTemplate = `Tu vas aider à générer un planning précis à partir des infos fournises.

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
- Si un planning est fourni, faire les modifications demandées par l'utilisateur sur le planning existant et le renvoyer en entier.

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
