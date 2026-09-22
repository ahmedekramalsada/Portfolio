# System Architecture
Version: 1.0
Status: Approved

---

# Overview

Ahmed OS is a modular personal developer platform.

The architecture must be scalable, maintainable, secure, and production-ready.

The system follows a Modular Monolith architecture.

Microservices are not allowed in Version 1.

Every module must be independently maintainable.

---

# Architecture Principles

- Modular Architecture
- Clean Architecture
- Domain Driven Design
- API First
- Docker First
- Documentation First
- Event Ready
- Security First
- SEO First

---

# High Level Architecture

Internet

↓

Cloudflare

↓

Traefik

↓

Next.js

↓

NestJS API

↓

PostgreSQL
Redis
Bunny Storage

---

# Applications

apps/

web

api

---

# Shared Packages

packages/

types

config

ui

sdk

utils

---

# Frontend Responsibilities

The frontend is responsible only for:

- UI
- Routing
- Rendering
- Forms
- Client Validation
- API Calls
- Authentication State
- Theme
- SEO Rendering

The frontend must never contain business logic.

---

# Backend Responsibilities

The backend owns all business logic.

Responsibilities

- Authentication
- Authorization
- CRUD
- Search
- Analytics
- Media
- Notifications
- Settings

---

# Backend Modules

Auth

Users

Blog

Projects

Categories

Tags

Media

Search

SEO

Analytics

Notifications

Settings

Health

System

Every module must be independent.

---

# Communication Rules

Frontend

↓

REST API

↓

Backend

↓

Database

Frontend never talks directly to:

- PostgreSQL
- Redis
- Storage

---

# Storage Flow

User Upload

↓

Backend

↓

Storage Provider

↓

Database Metadata

---

# Search Flow

User

↓

Backend

↓

PostgreSQL Full Text Search

↓

Results

Future

↓

Meilisearch

---

# Authentication Flow

Login

↓

JWT Access Token

↓

Refresh Token

↓

HTTP Only Cookie

↓

Authenticated Requests

---

# Authorization

RBAC

Roles

- Admin

Future

- Editor
- Reader

---

# Caching

Redis stores

- Sessions
- Search Cache
- Settings Cache

---

# Queue System

BullMQ

Jobs

- Image Processing
- Notifications
- Scheduled Publishing

---

# Media Processing

Upload

↓

Optimization

↓

Thumbnail

↓

Storage

↓

Database

---

# Logging

Every request must be logged.

Every error must be logged.

Structured JSON logs only.

---

# Monitoring

Prometheus

Grafana

Loki

OpenTelemetry

Health Endpoints

/api/health

/api/ready

/api/live

---

# API Rules

REST Only

Versioned

/api/v1

JSON Responses

Consistent Error Format

Validation Required

---

# Error Handling

Global Exception Filter

Validation Errors

Authentication Errors

Authorization Errors

Business Errors

Unexpected Errors

---

# Security

HTTPS Only

JWT

Rate Limiting

CORS

Helmet

Validation

Sanitization

Secrets via Environment Variables

---

# Deployment

Docker Compose

Traefik

Cloudflare

GitHub Actions

---

# Folder Architecture

apps/

web/

api/

packages/

docs/

docker/

scripts/

---

# Design Rules

No circular dependencies.

No module may directly access another module's database.

Modules communicate through services only.

Every feature must belong to exactly one module.

Shared code belongs only inside packages.

---

# Scalability

Version 1

Modular Monolith

Version 2

Extract modules into microservices only when necessary.

No premature optimization.

---

# Final Statement

This architecture is the official foundation of Ahmed OS.

Every implementation must follow this document.

Changing the architecture requires updating this document first.
