# AI Virtual Staff — Architecture produit

## 1. Flux global
1. Créer → 2. Personnaliser → 3. Entraîner → 4. Publier → 5. Utiliser → 6. Analyser

## 2. Wizard de création (6 étapes)
| # | Étape | Données | Sortie technique |
|---|-------|---------|-------------------|
| 1 | Avatar | Genre, apparence, voix | avatar_id, voice_id |
| 2 | Identité | Nom, personnalité, ton | Prompt système (persona) |
| 3 | Activité | Description libre du métier | Rôle/objectifs générés par LLM |
| 4 | Connaissances | Site, PDF, FAQ, produits | Corpus vectorisé (RAG) |
| 5 | Fonctions | Téléphonie, RDV, CRM... | Modules/webhooks activés |
| 6 | Langues & lancement | Langues, voix | Déploiement multicanal |

## 3. Runtime
Client appelle/écrit → Assistant répond (RAG + persona) → Action automatique → Transfert humain si complexe → Suivi & fidélisation.

## 4. Modèle de packs
Basic (79€), Business (149€), Pro (249€), Premium (sur devis).

## 5. Stack suggérée
React (front), API REST + orchestrateur LLM, base vectorielle (RAG), STT/TTS, webhooks CRM/paiement/calendrier.
