# Plateforme SaaS de Gestion de Cabinets Médicaux

**Cahier de spécifications fonctionnelles et techniques**
Version 2.1 — Architecture modulaire hexagonale (par module) + DevOps

Stack : Spring Boot · Next.js · React Native · PostgreSQL/MySQL · Stripe · Firebase Cloud Messaging

---

## Sommaire

1. [Présentation générale](#1-présentation-générale)
2. [Objectifs du projet](#2-objectifs-du-projet)
3. [Acteurs et fonctionnalités](#3-acteurs-et-fonctionnalités)
4. [Modèle de données](#4-modèle-de-données)
5. [Architecture technique modulaire hexagonale](#5-architecture-technique-modulaire-hexagonale)
6. [Sécurité et confidentialité](#6-sécurité-et-confidentialité)
7. [Liste des endpoints API](#7-liste-des-endpoints-api-aperçu)
8. [Planification du projet](#8-planification-du-projet)
9. [DevOps & Déploiement Cloud (AWS EC2)](#9-devops--déploiement-cloud-aws-ec2)
10. [Conclusion et perspectives](#10-conclusion-et-perspectives)

---

## 1. Présentation générale

Ce document présente la planification complète d'une plateforme **SaaS multi-cabinets** destinée à la gestion de cabinets médicaux. Chaque médecin dispose de son propre espace (cabinet), avec ses propres horaires, ses propres patients et son propre abonnement. Le médecin peut créer un compte secrétaire pour déléguer la gestion quotidienne.

Le projet est découpé en trois applications complémentaires :

| Application | Rôle | Stack |
|---|---|---|
| **Backend API** | Cœur du système : auth, logique métier, base de données | Spring Boot, Spring Security (JWT), Spring Data JPA, PostgreSQL/MySQL |
| **Web (vitrine + dashboard)** | Site vitrine + tableau de bord médecin/secrétaire/admin | Next.js, React, Tailwind CSS, React Query |
| **Mobile (patients)** | Recherche de médecin, prise de rendez-vous, dossier médical | React Native, Expo, Firebase (push) |

### Intérêt pédagogique
Ce projet permet de mettre en pratique : authentification et RBAC, logique métier autour des créneaux horaires, architecture multi-tenant (isolation des données par cabinet), gestion de données sensibles (dossiers médicaux), notifications temps réel, intégration d'un paiement récurrent (Stripe), et **déploiement cloud complet**.

---

## 2. Objectifs du projet

- Permettre à un médecin de créer et configurer son cabinet (informations, spécialité, horaires).
- Définir des horaires de disponibilité récurrents et des périodes d'indisponibilité (congés, urgences).
- Générer automatiquement les créneaux de rendez-vous disponibles.
- Créer un compte secrétaire avec permissions limitées.
- Permettre à un patient de rechercher un médecin (spécialité/localisation) et de prendre rendez-vous.
- Éviter les conflits de réservation (double prise sur le même créneau).
- Consulter et mettre à jour le dossier médical des patients (diagnostics, ordonnances, notes).
- Envoyer des notifications (email/push) : rappels, confirmations, annulations.
- Mettre en place un modèle d'abonnement SaaS (plan gratuit limité, plans payants).
- Fournir un tableau de bord avec statistiques (RDV, taux d'annulation, fréquentation).
- Garantir la confidentialité et la sécurité des données médicales (contrôle d'accès strict, journalisation).
- **Déployer la plateforme sur une infrastructure cloud scalable et sécurisée.**

---

## 3. Acteurs et fonctionnalités

### 3.1 Administrateur de la plateforme
Supervise l'ensemble des cabinets, gère les abonnements et l'activité globale.

| Fonctionnalité | Description |
|---|---|
| Authentification sécurisée | Connexion JWT, rôle `ADMIN` |
| Gestion des cabinets | Lister, activer, suspendre, supprimer |
| Gestion des plans d'abonnement | Créer/modifier/désactiver les offres et tarifs |
| Supervision des paiements | Historique et statut de chaque cabinet |
| Statistiques globales | Cabinets, médecins, patients, RDV, chiffre d'affaires |
| Gestion des utilisateurs | Rechercher, consulter, bloquer un compte |

### 3.2 Médecin
Propriétaire d'un cabinet, configure planning, patients et abonnement.

| Fonctionnalité | Description |
|---|---|
| Inscription et création du cabinet | Nom, spécialité, adresse, ville, téléphone |
| Configuration des horaires | Jours/heures de consultation, durée de créneau, pauses |
| Gestion des indisponibilités | Congés, formations, urgences |
| Gestion du personnel | Créer des comptes secrétaire, attribuer des permissions |
| Consultation du planning | Vue calendrier (jour/semaine/mois) |
| Gestion des rendez-vous | Confirmer, reporter, annuler, note interne |
| Dossier médical | Consulter/ajouter diagnostics, observations, pièces jointes |
| Ordonnances | Médicaments, posologie, durée du traitement |
| Statistiques du cabinet | RDV par période, taux d'annulation, nouveaux patients |
| Gestion de l'abonnement | Choisir/mettre à niveau/annuler le plan, factures |

### 3.3 Secrétaire
Compte créé par le médecin, accès restreint (pas de données médicales confidentielles sauf droits étendus).

| Fonctionnalité | Description |
|---|---|
| Authentification | Rôle `SECRETAIRE` rattaché au cabinet |
| Consultation du planning | Agenda du médecin |
| Gestion des rendez-vous | Créer, confirmer, reporter, annuler |
| Enregistrement des patients | Fiche patient à la première visite |
| Liste des patients du jour | Heure et motif de consultation |
| Rappels | Envoi de rappel email/SMS |
| Mise à jour des infos patient | Téléphone, adresse, email |

### 3.4 Patient
Utilisateur final de l'application mobile.

| Fonctionnalité | Description |
|---|---|
| Création de compte | Email/téléphone |
| Recherche de médecin | Par spécialité, ville ou nom |
| Consultation des créneaux | Calendrier de disponibilités |
| Prise de rendez-vous | Sélection créneau + motif |
| Gestion des rendez-vous | Consulter, annuler, demander un report |
| Dossier médical personnel | Historique, diagnostics, ordonnances |
| Notifications | Confirmation, rappel 24h avant, annulation |
| Avis | Note + commentaire après consultation |
| Gestion du profil | Infos personnelles, préférences |

---

## 4. Modèle de données

| Entité | Rôle | Champs clés |
|---|---|---|
| **CABINET** | Cabinet médical inscrit | nom, spécialité, adresse, ville, statut, date_creation |
| **UTILISATEUR** | Table centrale d'authentification (tous rôles) | email, mot_de_passe, role (MEDECIN/SECRETAIRE/PATIENT/ADMIN), id_cabinet |
| **PATIENT** | Infos médicales/personnelles (1-1 avec Utilisateur) | date_naissance, sexe, groupe_sanguin, allergies, antécédents |
| **DISPONIBILITE_MEDECIN** | Règles récurrentes de disponibilité | jour_semaine, heure_debut, heure_fin, duree_creneau_min |
| **INDISPONIBILITE** | Périodes exceptionnelles bloquantes | date_debut, date_fin, motif |
| **RENDEZ_VOUS** | Réservation patient/médecin | date_rdv, heure_debut/fin, statut, motif, cree_par |
| **DOSSIER_MEDICAL** | Historique médical | diagnostic, notes, fichiers_joints |
| **ORDONNANCE** | Prescription liée au dossier | médicaments, posologie, durée_traitement |
| **NOTIFICATION** | Notifications utilisateur | type, message, lu |
| **ABONNEMENT** | Abonnement SaaS du cabinet (1-1) | plan (GRATUIT/STANDARD/PREMIUM), statut_paiement, montant |
| **AVIS** | Notation d'un médecin par un patient | note (1-5), commentaire |

**Points clés du modèle :** `UTILISATEUR` centralise l'authentification pour tous les rôles ; un cabinet regroupe un médecin et ses secrétaires via `id_cabinet` ; un rendez-vous donne naissance, après consultation, à une entrée de dossier médical pouvant contenir une ou plusieurs ordonnances ; chaque cabinet est lié à un abonnement unique.

---

## 5. Architecture technique modulaire hexagonale

### 5.1 Vue d'ensemble

L'architecture repose sur une séparation claire entre les clients (Next.js, React Native) et le backend Spring Boot, qui expose une **API REST unique** consommée par les deux clients. Le backend adopte une **architecture modulaire par domaine métier** (un sous-package par module fonctionnel) et, **à l'intérieur de chaque module**, une **architecture hexagonale (Ports & Adapters)**. Autrement dit :

- Au niveau **macro** : le découpage est **modulaire** (un module = un domaine métier : `auth`, `cabinet`, `rendezvous`, etc.), ce qui garde les responsabilités isolées et prépare une future extraction en microservices.
- Au niveau **micro** : chaque module applique **sa propre hexagonale** — un cœur métier (`domain`) totalement indépendant de Spring/JPA/REST, entouré de **ports** (interfaces) et d'**adaptateurs** (implémentations techniques d'entrée et de sortie).

```
com.cabinetsaas
│
├── auth/                → Authentification & utilisateurs        (hexagone)
├── cabinet/             → Cabinets médicaux                       (hexagone)
├── patient/             → Profils patients                        (hexagone)
├── planning/            → Disponibilités & indisponibilités        (hexagone)
├── rendezvous/          → Rendez-vous                               (hexagone)
├── dossiermedical/      → Dossiers médicaux & ordonnances            (hexagone)
├── notification/        → Notifications                             (hexagone)
├── abonnement/          → Abonnements SaaS & paiement Stripe         (hexagone)
├── avis/                → Avis patients                              (hexagone)
├── admin/               → Supervision plateforme (agrège les ports d'entrée des autres modules)
├── common/              → Exceptions, audit log, enums transverses, kernel partagé
└── config/              → Sécurité, JWT, CORS, Swagger, injection des adaptateurs
```

### 5.2 Anatomie d'un hexagone (structure appliquée à chaque module)

Chaque module métier suit **exactement la même structure interne** en 3 couches :

```
<module>/
│
├── domain/                          ◄── CŒUR MÉTIER (aucune dépendance Spring/JPA/HTTP)
│   ├── model/                       → Entités métier / Value Objects / Agrégats (POJO purs)
│   └── exception/                   → Exceptions métier (ex. CreneauIndisponibleException)
│
├── application/                     ◄── ORCHESTRATION DES CAS D'USAGE
│   ├── port/
│   │   ├── in/                      → Ports d'entrée = interfaces des cas d'usage
│   │   │                              (ex. CreerRendezVousUseCase)
│   │   └── out/                     → Ports de sortie = interfaces dont le domaine a besoin
│   │                                  (ex. RendezVousRepositoryPort, NotificationPort)
│   └── service/                     → Implémentation des ports d'entrée (use cases),
│                                       orchestrent le domaine + appellent les ports de sortie
│
└── adapter/                         ◄── DÉTAILS TECHNIQUES (remplaçables)
    ├── in/
    │   └── web/                     → Contrôleurs REST + DTOs (implémentent/appellent les ports "in")
    └── out/
        └── persistence/             → Entités JPA, Repository Spring Data,
                                        Mapper domaine ↔ JPA (implémentent les ports "out")
```

**Règle de dépendance (la règle d'or de l'hexagonale) :** les flèches de dépendance pointent toujours **vers l'intérieur**.
`adapter` → dépend de → `application` (via les ports) → dépend de → `domain`.
Le `domain` ne connaît **jamais** Spring, JPA, ni le web : il ne dépend d'aucune couche externe, ce qui le rend testable unitairement sans base de données ni serveur.

### 5.3 Exemple concret : l'hexagone du module `rendezvous/`

```
rendezvous/
├── domain/
│   ├── model/
│   │   ├── RendezVous.java              (agrégat métier : statut, créneau, règles anti-conflit)
│   │   └── StatutRendezVous.java        (value object / enum métier)
│   └── exception/
│       └── CreneauIndisponibleException.java
│
├── application/
│   ├── port/
│   │   ├── in/
│   │   │   ├── CreerRendezVousUseCase.java
│   │   │   ├── AnnulerRendezVousUseCase.java
│   │   │   └── ConsulterPlanningUseCase.java
│   │   └── out/
│   │       ├── RendezVousRepositoryPort.java   (persistance abstraite)
│   │       ├── DisponibilitePort.java          (appel au module planning)
│   │       └── NotificationPort.java           (appel au module notification)
│   └── service/
│       └── RendezVousService.java       (implémente les UseCase, logique anti-conflit,
│                                          orchestre domaine + ports de sortie)
│
└── adapter/
    ├── in/
    │   └── web/
    │       ├── RendezVousController.java        (appelle les ports "in")
    │       ├── RendezVousCreateDto.java
    │       ├── RendezVousResponseDto.java
    │       └── RendezVousMapper.java             (DTO ↔ domaine)
    └── out/
        └── persistence/
            ├── RendezVousJpaEntity.java
            ├── RendezVousJpaRepository.java      (Spring Data JPA)
            ├── RendezVousPersistenceAdapter.java  (implémente RendezVousRepositoryPort)
            └── RendezVousPersistenceMapper.java   (domaine ↔ entité JPA)
```

> **Note d'architecture :** ce double découpage (modulaire + hexagonal) prépare une future évolution vers des microservices : chaque module peut être extrait tel quel, car son `domain` et son `application` sont déjà indépendants des détails techniques (base de données, framework web), et ses ports définissent une frontière claire.

### 5.4 Détail par module (entités du domaine + ports de sortie clés)

#### `auth/`
Inscription, connexion, JWT, gestion des rôles.
**Domaine :** `Utilisateur` (agrégat central, commun à tous les rôles).
**Ports out clés :** `UtilisateurRepositoryPort`, `PasswordEncoderPort`, `JwtTokenPort`.

#### `cabinet/`
Création/configuration du cabinet, gestion du personnel.
**Domaine :** `Cabinet`.
**Ports out clés :** `CabinetRepositoryPort`, et un port vers `auth` (`CreerCompteSecretairePort`) pour créer un compte secrétaire sans dupliquer l'entité `Utilisateur`.

#### `patient/`
Profil médical/personnel complémentaire.
**Domaine :** `Patient` (relation 1-1 avec `Utilisateur`).
**Ports out clés :** `PatientRepositoryPort`.

#### `planning/`
Règles d'horaires récurrentes, congés, génération des créneaux.
**Domaine :** `DisponibiliteMedecin`, `Indisponibilite`.
**Ports out clés :** `DisponibiliteRepositoryPort`, `IndisponibiliteRepositoryPort`.

#### `rendezvous/`
Réservation, gestion des statuts, détection de conflits.
**Domaine :** `RendezVous`.
**Ports out clés :** `RendezVousRepositoryPort`, `DisponibilitePort` (appel vers `planning`), `NotificationPort` (appel vers `notification`).

#### `dossiermedical/`
Historique médical, ordonnances.
**Domaine :** `DossierMedical`, `Ordonnance`.
**Ports out clés :** `DossierMedicalRepositoryPort`, `AuditLogPort`.

#### `notification/`
Envoi et suivi des notifications (email/push).
**Domaine :** `Notification`.
**Ports out clés :** `NotificationRepositoryPort`, `EmailSenderPort` (SES), `PushSenderPort` (Firebase).

#### `abonnement/`
Plans SaaS, intégration Stripe, webhooks.
**Domaine :** `Abonnement`.
**Ports out clés :** `AbonnementRepositoryPort`, `PaiementProviderPort` (implémenté par un adaptateur Stripe).

#### `avis/`
Notation des médecins par les patients.
**Domaine :** `Avis`.
**Ports out clés :** `AvisRepositoryPort`.

#### `admin/`
Supervision transverse (cabinets, statistiques, paiements).
**Domaine :** aucune entité propre — ce module expose ses propres ports d'entrée (`ConsulterStatistiquesUseCase`, `SuperviserCabinetsUseCase`) et consomme les **ports d'entrée** (jamais les entités JPA directement) des autres modules, ce qui respecte la frontière hexagonale de chacun.

#### `common/`
Kernel partagé sans entité propre : exceptions globales, `AuditLog`, enums transverses (`Role`, `StatutRdv`...). Ce module ne contient que des éléments neutres pouvant être référencés par les couches `domain` de tous les modules, sans jamais introduire de dépendance vers Spring/JPA.

### 5.5 Composants applicatifs

| Composant | Détail |
|---|---|
| **Backend** | API REST sécurisée JWT ; Spring Security gère l'autorisation par rôle (ADMIN/MEDECIN/SECRETAIRE/PATIENT) ; chaque module expose ses adaptateurs `web` comme point d'entrée unique vers ses ports |
| **Web — Next.js** | Vitrine publique (SEO) + dashboard privé (calendrier, patients, statistiques) |
| **Mobile — React Native** | Recherche médecin, créneaux, RDV, dossier médical, notifications push (Expo) |
| **Persistance** | PostgreSQL/MySQL (données relationnelles) via les adaptateurs `out/persistence` de chaque module + stockage fichiers (S3/MinIO) via un `FileStoragePort` |

### 5.6 Bénéfices de l'approche modulaire + hexagonale

- **Testabilité** : le `domain` et l'`application` de chaque module se testent unitairement sans Spring context, sans base de données, en simulant les ports (mocks/fakes).
- **Remplaçabilité des adaptateurs** : passer de PostgreSQL à un autre SGBD, ou de Stripe à un autre PSP, ne touche que l'`adapter/out` concerné, jamais la logique métier.
- **Frontières claires entre modules** : un module ne dépend jamais directement de l'entité JPA d'un autre module, mais uniquement de ses **ports d'entrée** (use cases) — ce qui limite le couplage et prépare l'extraction en microservices.
- **Lisibilité** : la structure `domain / application / adapter` est identique dans chaque module, ce qui rend le codebase prévisible pour un nouveau développeur.

---

## 6. Sécurité et confidentialité

- Authentification par **JWT** : jeton d'accès de courte durée + jeton de rafraîchissement.
- Contrôle d'accès basé sur les rôles (**RBAC**) : chaque endpoint vérifie le rôle et l'appartenance au cabinet (`id_cabinet`).
- **Isolation des données par cabinet** : toute requête d'un médecin/secrétaire est filtrée automatiquement par `id_cabinet`.
- Chiffrement des mots de passe (**BCrypt**) et des données sensibles si nécessaire.
- **Journalisation** des accès aux dossiers médicaux (qui a consulté quel dossier et quand).
- Validation systématique des entrées utilisateur (DTO + annotations Spring Validation).

---

## 7. Liste des endpoints API (aperçu)

| Méthode | Endpoint | Description | Accès |
|---|---|---|---|
| POST | `/api/auth/register` | Création d'un compte (patient ou médecin) | Public |
| POST | `/api/auth/login` | Connexion, génération JWT | Public |
| POST | `/api/auth/refresh` | Rafraîchissement du jeton | Authentifié |
| GET | `/api/cabinets` | Recherche de cabinets/médecins | Public |
| GET | `/api/cabinets/{id}` | Détails d'un cabinet | Public |
| PUT | `/api/cabinets/{id}` | Mise à jour des infos du cabinet | Médecin |
| POST | `/api/cabinets/{id}/secretaires` | Création d'un compte secrétaire | Médecin |
| GET | `/api/medecins/{id}/disponibilites` | Liste des disponibilités | Médecin |
| POST | `/api/medecins/{id}/disponibilites` | Ajout d'une plage récurrente | Médecin |
| POST | `/api/medecins/{id}/indisponibilites` | Ajout d'une indisponibilité | Médecin |
| GET | `/api/medecins/{id}/creneaux?date=` | Créneaux disponibles pour une date | Public/Patient |
| POST | `/api/rendez-vous` | Création d'un rendez-vous | Patient/Secrétaire |
| GET | `/api/rendez-vous?cabinetId=` | Planning d'un cabinet | Médecin/Secrétaire |
| GET | `/api/rendez-vous/me` | RDV du patient connecté | Patient |
| PATCH | `/api/rendez-vous/{id}/statut` | Mise à jour du statut | Médecin/Secrétaire |
| GET | `/api/patients/{id}/dossier` | Consultation du dossier médical | Médecin |
| POST | `/api/patients/{id}/dossier` | Ajout d'une entrée au dossier | Médecin |
| POST | `/api/dossiers/{id}/ordonnances` | Création d'une ordonnance | Médecin |
| GET | `/api/notifications/me` | Notifications de l'utilisateur connecté | Authentifié |
| GET | `/api/abonnements/{cabinetId}` | Détails de l'abonnement | Médecin/Admin |
| POST | `/api/abonnements/{cabinetId}/checkout` | Session de paiement Stripe | Médecin |
| POST | `/api/webhooks/stripe` | Réception des événements Stripe | Stripe (interne) |
| GET | `/api/admin/cabinets` | Liste de tous les cabinets | Admin |
| PATCH | `/api/admin/cabinets/{id}/statut` | Activation/suspension | Admin |
| GET | `/api/admin/statistiques` | Statistiques globales | Admin |

---

## 8. Planification du projet

Estimation pour un développeur seul, à temps partiel (10-15h/semaine).

| Phase | Durée estimée | Contenu | Livrable |
|---|---|---|---|
| 0 — Préparation | 1 semaine | Cahier des charges, wireframes, choix techno, dépôts Git | Cahier des charges, maquettes |
| 1 — Backend : socle | 2-3 semaines | Spring Boot, DB, Spring Security/JWT, `Utilisateur`/`Cabinet` | API d'authentification |
| 2 — Backend : planning | 2 semaines | `DisponibiliteMedecin`, `Indisponibilite`, génération des créneaux | API de disponibilités |
| 3 — Backend : rendez-vous | 2 semaines | `RendezVous`, statuts, anti-conflit, notifications email | API de RDV complète |
| 4 — Backend : dossier médical | 1-2 semaines | `DossierMedical`, `Ordonnance`, contrôle d'accès strict | API dossiers médicaux |
| 5 — Web Next.js (dashboard) | 3 semaines | Auth front, calendrier, gestion patients, statistiques | Dashboard fonctionnel |
| 6 — Web Next.js (vitrine + admin) | 1-2 semaines | Pages publiques, interface admin | Vitrine + admin |
| 7 — Mobile React Native | 3 semaines | Recherche, réservation, dossier, notifications push | App mobile patient |
| 8 — Abonnement SaaS | 2 semaines | Stripe (plans, paiement, webhooks) | Module de facturation |
| 9 — Tests et sécurisation | 1-2 semaines | Tests unitaires/intégration/E2E, revue sécurité | Suite de tests |
| 10 — Déploiement | 1 semaine | Environnement de production, variables d'env, clés API | Plateforme déployée |

**Durée totale estimée : 18 à 22 semaines (4 à 5 mois)** à temps partiel. Le dashboard (phase 5) peut être développé en parallèle de la phase 3 une fois l'API de planning disponible.

---

## 9. DevOps & Déploiement Cloud (AWS EC2)

### 9.1 Objectif

Déployer les trois composants (backend Spring Boot, frontend Next.js, backend d'API mobile) sur une infrastructure **AWS** simple, économique et évolutive, centrée sur une instance **EC2**, avec possibilité de montée en charge progressive.

### 9.2 Architecture cloud cible

```
                         ┌───────────────────────────┐
                         │        Route 53 (DNS)      │
                         └──────────────┬─────────────┘
                                        │
                         ┌──────────────▼─────────────┐
                         │   CloudFront (CDN, HTTPS)   │  ← assets Next.js statiques
                         └──────────────┬─────────────┘
                                        │
                         ┌──────────────▼─────────────┐
                         │  Application Load Balancer  │  (HTTPS via ACM)
                         └──────────────┬─────────────┘
                                        │
              ┌─────────────────────────┼─────────────────────────┐
              │                         │                         │
     ┌────────▼────────┐      ┌─────────▼────────┐     ┌──────────▼─────────┐
     │  EC2 — Backend    │      │  EC2 — Next.js    │     │   EC2 — (option)    │
     │  Spring Boot (JAR) │      │  (SSR / Node)      │     │   Auto Scaling Grp  │
     │  Docker container   │      │  Docker container   │     │                     │
     └────────┬────────┘      └───────────────────┘     └─────────────────────┘
              │
     ┌────────▼─────────────┐        ┌──────────────────────┐
     │  Amazon RDS           │        │  Amazon S3            │
     │  PostgreSQL/MySQL     │        │  Fichiers joints,      │
     │  (multi-AZ si besoin) │        │  photos, documents      │
     └────────────────────┘        └──────────────────────┘

     Services transverses : CloudWatch (logs/monitoring) · Secrets Manager (clés API/DB)
                           · SES (emails) · SNS/Firebase (push mobile)
```

### 9.3 Composants AWS utilisés

| Service AWS | Usage |
|---|---|
| **EC2** | Hébergement du backend Spring Boot (conteneur Docker) et éventuellement du frontend Next.js en SSR |
| **RDS (PostgreSQL/MySQL)** | Base de données managée, sauvegardes automatiques, option Multi-AZ |
| **S3** | Stockage des fichiers joints (radios, documents), assets statiques Next.js |
| **CloudFront** | CDN pour les assets statiques et la vitrine publique (cache + HTTPS) |
| **Application Load Balancer (ALB)** | Répartition de charge, terminaison SSL/TLS, routage vers EC2 |
| **Route 53** | Gestion du nom de domaine (ex. `api.cabinet-saas.com`) |
| **ACM (Certificate Manager)** | Certificats HTTPS gratuits pour l'ALB/CloudFront |
| **Secrets Manager / Parameter Store** | Stockage sécurisé des secrets (DB password, clé Stripe, clé JWT) |
| **CloudWatch** | Logs applicatifs, métriques, alarmes (CPU, erreurs 5xx) |
| **SES** | Envoi des emails transactionnels (confirmation, rappel RDV) |
| **Auto Scaling Group (optionnel)** | Scalabilité horizontale du backend en cas de montée en charge |
| **IAM** | Rôles et permissions restreintes par service (principe du moindre privilège) |

### 9.4 Conteneurisation

Chaque application est packagée en image **Docker** :

```dockerfile
# Backend — Dockerfile (Spring Boot)
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY target/cabinet-saas-backend.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

```dockerfile
# Frontend — Dockerfile (Next.js)
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install && npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 3000
CMD ["npm", "start"]
```

`docker-compose.yml` utilisé en local et comme base de déploiement sur EC2 :

```yaml
version: "3.9"
services:
  backend:
    build: ./backend
    ports:
      - "8080:8080"
    env_file: .env
    depends_on:
      - db
  frontend:
    build: ./web
    ports:
      - "3000:3000"
    depends_on:
      - backend
  db:
    image: postgres:16
    environment:
      POSTGRES_DB: cabinetsaas
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - pgdata:/var/lib/postgresql/data
volumes:
  pgdata:
```

> En production, la base de données est déportée vers **RDS** (et non un conteneur `db` sur l'instance EC2) pour la fiabilité, les sauvegardes automatiques et la scalabilité.

### 9.5 Étapes de déploiement sur EC2

1. **Provisionnement**
   - Créer une instance EC2 (ex. `t3.medium`, Ubuntu 22.04 LTS).
   - Configurer un groupe de sécurité (Security Group) : ports 80/443 ouverts au public, port 22 (SSH) restreint à une IP, port 8080 accessible uniquement depuis l'ALB.
   - Attacher une **Elastic IP** pour une adresse fixe.

2. **Installation de l'environnement**
   ```bash
   sudo apt update && sudo apt upgrade -y
   sudo apt install docker.io docker-compose -y
   sudo systemctl enable docker
   sudo usermod -aG docker $USER
   ```

3. **Base de données**
   - Créer une instance **RDS PostgreSQL** dans le même VPC.
   - Restreindre l'accès RDS au Security Group de l'EC2 uniquement.

4. **Variables d'environnement / secrets**
   - Stocker les secrets (`JWT_SECRET`, `STRIPE_SECRET_KEY`, `DB_PASSWORD`, `FIREBASE_KEY`) dans **AWS Secrets Manager** ou **SSM Parameter Store**.
   - Injecter au démarrage du conteneur via un script ou l'agent SSM.

5. **Déploiement de l'application**
   ```bash
   git clone <repo> && cd cabinet-saas
   docker compose -f docker-compose.prod.yml up -d --build
   ```

6. **Reverse proxy & HTTPS**
   - Mettre en place **Nginx** (ou l'ALB directement) en reverse proxy devant les conteneurs.
   - Certificat HTTPS via **ACM** (si ALB) ou **Let's Encrypt/Certbot** (si Nginx sur l'EC2 en direct).

7. **Nom de domaine**
   - Configurer les enregistrements DNS dans **Route 53** :
     - `app.cabinet-saas.com` → dashboard Next.js
     - `api.cabinet-saas.com` → backend Spring Boot (via ALB)

8. **Monitoring et logs**
   - Installer l'agent **CloudWatch** sur l'EC2 pour remonter logs et métriques (CPU, mémoire, disque).
   - Configurer des alarmes CloudWatch (ex. CPU > 80 %, erreurs 5xx > seuil).

9. **Sauvegardes**
   - Activer les snapshots automatiques quotidiens sur RDS.
   - Sauvegarder les fichiers S3 avec versioning activé.

### 9.6 CI/CD (intégration et déploiement continus)

Pipeline recommandé via **GitHub Actions** :

```yaml
name: Deploy Backend
on:
  push:
    branches: [main]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build JAR
        run: ./mvnw clean package -DskipTests
      - name: Build & push Docker image
        run: |
          docker build -t $ECR_REPO:latest .
          docker push $ECR_REPO:latest
      - name: Deploy to EC2
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ubuntu
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            docker pull $ECR_REPO:latest
            docker compose -f docker-compose.prod.yml up -d
```

- **Amazon ECR** stocke les images Docker versionnées.
- Chaque push sur `main` déclenche : build → tests → build image → push ECR → déploiement SSH sur EC2 (ou mise à jour d'un Auto Scaling Group).
- Le frontend Next.js suit le même pipeline, ou est déployé séparément (ex. via **Vercel** pour la vitrine si l'on souhaite alléger l'EC2, tout en gardant le dashboard privé sur EC2 pour rester dans l'écosystème AWS).

### 9.7 Évolution vers plus de scalabilité (optionnel)

| Besoin | Évolution possible |
|---|---|
| Charge variable | Remplacer l'EC2 unique par un **Auto Scaling Group** derrière l'ALB |
| Simplicité opérationnelle | Migrer les conteneurs vers **ECS Fargate** (sans gestion de serveurs) |
| Fichiers médias volumineux | Servir via **CloudFront + S3** avec URLs signées |
| Haute disponibilité DB | Activer **RDS Multi-AZ** + read replicas |
| Sécurité renforcée | **WAF** devant l'ALB, VPC privé pour RDS, rotation automatique des secrets |

### 9.8 Estimation des coûts (ordre de grandeur, usage modéré)

| Ressource | Exemple | Coût mensuel approximatif |
|---|---|---|
| EC2 t3.medium | Backend + frontend | ~30 $ |
| RDS db.t3.micro (PostgreSQL) | Base de données | ~15-20 $ |
| S3 | Stockage fichiers (quelques Go) | ~1-5 $ |
| ALB | Load balancer | ~16-20 $ |
| Route 53 + ACM | DNS + certificat | ~1 $ (certificat gratuit) |
| CloudWatch | Logs/monitoring de base | ~5 $ |
| **Total estimé** | | **~70-90 $/mois** |

*(Estimation indicative pour un environnement de démarrage à trafic modéré ; à ajuster selon la charge réelle et la région AWS choisie.)*

---

## 10. Conclusion et perspectives

Ce document fournit une base de planification complète pour le développement d'une plateforme SaaS de gestion de cabinets médicaux, couvrant les aspects fonctionnels (acteurs, cas d'utilisation), techniques (modèle de données, architecture modulaire, endpoints), organisationnels (phases de développement) et **opérationnels (déploiement cloud AWS EC2, CI/CD)**.

### Évolutions possibles
- Téléconsultation par visioconférence.
- Paiement en ligne des consultations.
- Gestion multi-médecins au sein d'un même cabinet (cliniques).
- Module de facturation et de comptabilité pour les cabinets.
- Messagerie instantanée sécurisée médecin/patient.
- Module de gestion des stocks (cabinets dentaires, pharmacies associées).
- Migration progressive vers **ECS/Fargate** ou **Kubernetes (EKS)** si la charge le justifie.

### Récapitulatif de la stack technique

| Couche | Technologie |
|---|---|
| Backend | Spring Boot, Spring Security, Spring Data JPA |
| Frontend web | Next.js, React, Tailwind CSS |
| Mobile | React Native (Expo) |
| Base de données | PostgreSQL / MySQL (Amazon RDS) |
| Paiement | Stripe |
| Notifications | Firebase Cloud Messaging, Amazon SES |
| Stockage fichiers | Amazon S3 |
| Hébergement | AWS EC2 + ALB + CloudFront + Route 53 |
| CI/CD | GitHub Actions + Amazon ECR |
| Monitoring | Amazon CloudWatch |
