window.GO_INDEX_DEMO_DATA = {
    slides: [
        {
            templateId: "go-roadmap",
            tabLabel: "Page 1",
            title: "Go-Roadmap · Plateforme Data 2025",
            bgColor: "#ffffff",
            textStyleIndex: 0,
            fontSize: 14,
            context:
                "Le board attend une visibilité partagée sur les chemin critiques de la plateforme data pour le prochain trimestre, avec une gouvernance DataOps qui aligne les équipes produit, ingé et infra.",
            columns: [
                {
                    stage: "first-col",
                    stageLabel: "Now",
                    stageColor: "#2a7a57",
                    title: "Stabiliser la collecte",
                    sections: {
                        "first-section": {
                            label: "🧭 Objectifs",
                            text: "Centraliser les KPI critiques pour l’équipe DataOps et le comité.\nRéduire de 25 % les alertes support en automatisant les contrôles qualité.\nAssurer un reporting hebdo partagé avec les stakeholders."
                        },
                        "second-section": {
                            label: "🚀 Moyens",
                            text: "Inventorier les sources prioritaires, automatiser les pipelines et documenter les dépendances.\nCréer un canal de revue hebdo entre Product Ops et infra.\nStandardiser les playbooks DataOps pour les squads entrantes."
                        },
                        "third-section": {
                            label: "🔢 Indicateurs",
                            text: "Disponibilité des flux > 98 %.\nTaux de détection d’anomalies < 2 %.\nTemps moyen de résolution des incidents < 4 h."
                        }
                    }
                },
                {
                    stage: "second-col",
                    stageLabel: "Next",
                    stageColor: "#1f4f3d",
                    title: "Orchestrer les releases",
                    sections: {
                        "first-section": {
                            label: "🧭 Objectifs",
                            text: "Boucler les objectifs OKR sur les modules clients prioritaires.\nStructurer la coordination entre squads en phase de scaling.\nPartager le backlog et les dépendances avec les sponsors."
                        },
                        "second-section": {
                            label: "🚀 Moyens",
                            text: "Déployer un planning sprint 3 semaines par release et un kit de transfert pour les squads.\nPrototyper un dashboard d’avancement no-code et l’embarquer dans la revue produit.\nCollab planner : calendar commun pour les deliverables clés."
                        },
                        "third-section": {
                            label: "🔢 Indicateurs",
                            text: "Nombre de releases livrées par trimestre.\nSatisfaction stakeholders (NPS interne) > 60.\nTableau de bord live pour suivre l’état des releases."
                        }
                    }
                },
                {
                    stage: "third-col",
                    stageLabel: "Later",
                    stageColor: "#6f9882",
                    title: "Vision Q4",
                    sections: {
                        "first-section": {
                            label: "🧭 Objectifs",
                            text: "Cadrer l’architecture cible de la plateforme unifiée.\nPréparer une offre data packagée pour les équipes internationalisées.\nPréparer un dossier de gouvernance partagé avant Q4."
                        },
                        "second-section": {
                            label: "🚀 Moyens",
                            text: "Explorer l’automatisation IA pour la détection d’écarts.\nIdentifier les partenariats infra et sécurité requis.\nPlanifier des ateliers de co-création avec les BU."
                        },
                        "third-section": {
                            label: "🔢 Indicateurs",
                            text: "Roadmap stratégique partagée avec 3 BU.\nBudget validé à 90 %.\nArchitecture cible documentée dans un dossier opérationnel."
                        }
                    }
                }
            ]
        },
        {
            templateId: "go-design",
            tabLabel: "Page 1",
            title: "Go-Design · Parcours Data",
            bgColor: "#ffffff",
            textStyleIndex: 0,
            fontSize: 14,
            context:
                "L’équipe design doit clarifier les parcours data pour les analystes en mettant en évidence la valeur métier de chaque point de contact, avant d’inviter l’IA à produire des éléments de contenu.",
            columns: [
                {
                    stage: "first-col",
                    stageLabel: "Saisie de données",
                    stageColor: "#c35a1a",
                    title: "Guider la saisie",
                    sections: {
                        "first-section": {
                            label: "👥 Personas",
                            text: "DataOps junior qui doit valider un flux complet en moins de 10 minutes.\nResponsable métier frustré par les erreurs de saisie et les retours tardifs.\nCartographier les frictions via des sessions shadowing."
                        },
                        "second-section": {
                            label: "❤️ Besoins",
                            text: "Offrir un formulaire guidé avec aides contextuelles et validations instantanées.\nLimiter les doubles saisies grâce à des suggestions basées sur l’historique.\nProposer un système de feedback contextuel après chaque saisie."
                        },
                        "third-section": {
                            label: "⭐ Opportunités",
                            text: "Ajouter un assistant à la saisie qui reformule les champs.\nDonner un feedback immédiat sur les incohérences détectées.\nTester en binôme avec le support pour valider chaque hypothèse."
                        }
                    }
                },
                {
                    stage: "second-col",
                    stageLabel: "Consultation de données",
                    stageColor: "#a35b1e",
                    title: "Simplifier la lecture",
                    sections: {
                        "first-section": {
                            label: "👥 Personas",
                            text: "Utilisateur BI qui veut retrouver la bonne mesure en 3 clics.\nProduct leader qui compare rapidement plusieurs versions.\nAnalyste data qui cherche un aperçu consolidé en un instant."
                        },
                        "second-section": {
                            label: "❤️ Besoins",
                            text: "Filtrer par segment et sauvegarder des vues partagées.\nProposer des micro-visualisations prêtes à l’usage.\nDocumenter les filtres favoris par rôle pour les partager."
                        },
                        "third-section": {
                            label: "⭐ Opportunités",
                            text: "Créer des modèles de rapports interactifs pour les squads.\nDéployer un sélecteur intelligent d’indicateurs selon les rôles.\nDévelopper un guide visuel de contrôle pour les directions."
                        }
                    }
                },
                {
                    stage: "third-col",
                    stageLabel: "Analyse de données",
                    stageColor: "#775b2b",
                    title: "Industrialiser l’analyse",
                    sections: {
                        "first-section": {
                            label: "👥 Personas",
                            text: "Analyste R&D qui construit des hypothèses qualitatives.\nData scientist qui doit partager ses résultats avec les décideurs.\nProduct marketer qui documente les insights pour les dirigeants."
                        },
                        "second-section": {
                            label: "❤️ Besoins",
                            text: "Préparer des templates d’hypothèses et scénarios.\nFaciliter la création de storyboards expliquant les insights.\nAutomatiser la capture des retours via un kit de storyboard."
                        },
                        "third-section": {
                            label: "⭐ Opportunités",
                            text: "Prototyper 6 expérimentations trimestrielles.\nRéduire le temps de passage d’une idée à un prototype à 3 jours.\nIntégrer un feedback loop mensuel pour ajuster les expérimentations."
                        }
                    }
                }
            ]
        },
        {
            templateId: "go-solve",
            tabLabel: "Page 1",
            title: "Go-Solve · Cohérence UI/Data/API",
            bgColor: "#ffffff",
            textStyleIndex: 0,
            fontSize: 14,
            context:
                "La squad Solve vise à éliminer les frictions UI, data et API signalées par les utilisateurs internes, avant de faire appel à l’IA pour enrichir la documentation.",
            columns: [
                {
                    stage: "first-col",
                    stageLabel: "UI",
                    stageColor: "#1f4f3d",
                    title: "Débloquer l’interface",
                    sections: {
                        "first-section": {
                            label: "🌧️ Problèmes",
                            text: "Les utilisateurs abandonnent la saisie à la troisième étape du flow.\nLes erreurs restent invisibles jusqu’à la revue QA.\nLes tickets sont relancés manuellement hors sprint."
                        },
                        "second-section": {
                            label: "🍂 Causes",
                            text: "Absence de contextualisation des champs, validations trop tardives.\nUI trop chargée qui ne respecte pas les patterns adoptés.\nLes composants n’ont pas de guide d’usage partagé."
                        },
                        "third-section": {
                            label: "🌱 Solutions",
                            text: "Introduire des micro-assistants qui guident la saisie.\nRéorganiser les écrans en étapes progressives.\nValider l’UX avec 2 squads pilotes."
                        }
                    }
                },
                {
                    stage: "second-col",
                    stageLabel: "Data",
                    stageColor: "#2a7a57",
                    title: "Fiabiliser les données",
                    sections: {
                        "first-section": {
                            label: "🌧️ Problèmes",
                            text: "Les jeux de données sont incohérents entre les APIs.\nLa qualité chute hors des releases majeures.\nLes dashboards opérationnels reflètent des résultats divergents."
                        },
                        "second-section": {
                            label: "🍂 Causes",
                            text: "Modèle de données non aligné entre squads, pas de tests qualité.\nValidation et remontées d’erreurs encore manuelles.\nValidation manuelle ralentit la mise en prod."
                        },
                        "third-section": {
                            label: "🌱 Solutions",
                            text: "Définir un schéma canonique partagé et générer des mocks.\nAutomatiser le monitoring de la qualité avec des checkpoints.\nPublier un playbook sur la qualité data et la gouvernance."
                        }
                    }
                },
                {
                    stage: "third-col",
                    stageLabel: "API",
                    stageColor: "#4c7b9d",
                    title: "Narratives des intégrations",
                    sections: {
                        "first-section": {
                            label: "🌧️ Problèmes",
                            text: "Les endpoints manquent d’observabilité et produisent des tickets répétés.\nLe backlog API est saturé d’alignements.\nLes incidents ne sont pas tracés dans un outil commun."
                        },
                        "second-section": {
                            label: "🍂 Causes",
                            text: "Documentation obsolète et versionnement absent.\nManque de contrats partagés entre UX et backend.\nLes revues d’API ne se tiennent plus systématiquement."
                        },
                        "third-section": {
                            label: "🌱 Solutions",
                            text: "Déployer un gateway managé et des tests contractuels.\nNormaliser les payloads et les validations dans une bibliothèque commune.\nAutomatiser la mise à jour de la documentation via un pipeline CI."
                        }
                    }
                }
            ]
        }
    ]
};
