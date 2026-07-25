# Technology Stack
Version: 3.0
Status: Approved

---

# Overview

This document defines the official technology stack for Ahmed OS.

No technology may be replaced without updating this document and receiving approval.

---

# Engineering Principles

- AI First
- API First
- SEO First
- Performance First
- Security First
- Documentation First
- Docker First
- Cloud Agnostic
- Modular Architecture
- Clean Architecture
- Type Safety Everywhere

---

# Frontend

Framework
- Next.js 15+

Language
- TypeScript

Styling
- Tailwind CSS v4

UI Components
- shadcn/ui

Icons
- Lucide React

Animation
- Framer Motion

Forms
- React Hook Form

Validation
- Zod

State Management
- Zustand

Server State
- TanStack Query

Tables
- TanStack Table

Theme
- next-themes

Markdown
- MDX

Editor
- Tiptap

Charts
- Recharts

Package Manager
- pnpm

Testing
- Vitest
- Playwright

Linting
- ESLint

Formatting
- Prettier

---

# Backend

Framework
- NestJS

Language
- TypeScript

Runtime
- Node.js 22 LTS

Package Manager
- pnpm

ORM
- Prisma

Validation
- class-validator
- class-transformer

Authentication
- Passport.js

Authorization
- RBAC

Documentation
- OpenAPI (Swagger)

Logging
- Pino

Scheduling
- @nestjs/schedule

Caching
- Redis

Queues
- BullMQ

Testing
- Jest
- Supertest

---

# Database

Primary Database

- PostgreSQL 17

Extensions

- pg_trgm
- uuid-ossp

---

# Cache

Redis

Uses

- Cache
- Sessions
- Rate Limiting
- AI Cache
- Job Queue
- Temporary Data

---

# AI

Framework

- LangChain.js

Providers

- OpenAI
- Anthropic
- Gemini
- DeepSeek
- Ollama
- OpenRouter

Capabilities

- Chat
- Tool Calling
- Structured Output
- Streaming
- Memory

---

# Embeddings

Supported

- BAAI BGE
- Nomic
- Jina
- OpenAI
- Ollama

---

# Vector Database

Qdrant

Purpose

- Semantic Search
- Knowledge Base
- RAG
- Embeddings

---

# Search

Phase 1

PostgreSQL Full Text Search

Phase 2

Meilisearch

---

# Storage

Primary

- Bunny Storage

Future

- Cloudflare R2
- Amazon S3
- MinIO

---

# CDN

Cloudflare

Responsibilities

- CDN
- DNS
- SSL
- Cache
- WAF
- DDoS Protection

---

# Authentication

JWT Access Tokens

JWT Refresh Tokens

HTTP Only Cookies

Password Hashing

- Argon2

Future

- Google OAuth
- GitHub OAuth

---

# Email

SMTP

Future

- Resend

---

# Notifications

- Telegram
- Email
- Discord

---

# Deployment

Docker

Docker Compose

Future

- Kubernetes

---

# Reverse Proxy

Traefik

Responsibilities

- SSL
- Routing
- Load Balancing
- Automatic HTTPS

---

# CI/CD

GitHub Actions

Pipeline

- Lint
- Test
- Build
- Docker Build
- Security Scan
- Deploy

---

# Monitoring

Prometheus

Grafana

Loki

Alertmanager

Uptime Kuma

OpenTelemetry

---

# Security

Helmet

CORS

CSRF Protection

Content Security Policy

Rate Limiting

Input Validation

Output Sanitization

Environment Variables

Secret Management

---

# Documentation

Markdown

OpenAPI

ER Diagrams

Architecture Diagrams

Sequence Diagrams

ADR Documents

---

# Monorepo

Tool

- Turborepo

Package Manager

- pnpm Workspaces

Structure

apps/
packages/

---

# Applications

apps/web

Next.js Frontend

apps/api

NestJS Backend

packages/ui

Shared UI Components

packages/types

Shared Types

packages/config

Shared Config

packages/utils

Shared Utilities

packages/sdk

Shared SDK

---

# File Storage

Images

Documents

Videos

Attachments

---

# Code Quality

ESLint

Prettier

Husky

lint-staged

Commitlint

Conventional Commits

---

# Browser Support

- Chrome
- Edge
- Firefox
- Safari

---

# Mobile

Responsive Design

PWA Ready

---

# Future Stack

- Kubernetes
- ArgoCD
- NATS
- Temporal
- AI Gateway

---

# Forbidden Technologies

- WordPress
- PHP
- jQuery
- Bootstrap
- Angular
- Vue
- MongoDB
- Firebase

---

# Architecture Rules

- Backend owns all business logic.
- Frontend never contains business logic.
- AI communicates only through backend services.
- Every module must be independent.
- Every API must be versioned.
- Every feature must be documented.
- Every service must be dockerized.
- No duplicated code.
- No hardcoded secrets.
- No breaking changes without approval.
- Type safety is mandatory.
- Everything must be production-ready.

---

# Final Decision

This document defines the official technology stack for Ahmed OS.

Every future implementation must follow this specification.
