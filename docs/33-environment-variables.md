# Environment Variables
Version: 1.0
Status: Approved

---

# Overview

This document defines all environment variables used by Ahmed OS.

Secrets must never be committed to source control.

Every variable must be documented.

---

# Environment Files

.env.example

.env.development

.env.staging

.env.production

.env.local (ignored)

---

# Naming Rules

- Uppercase only
- Underscore separated
- Prefix by service when applicable
- No abbreviations unless standard

Example

DATABASE_URL

REDIS_URL

OPENAI_API_KEY

---

# Application

NODE_ENV

APP_NAME

APP_URL

APP_PORT

APP_VERSION

LOG_LEVEL

---

# Database

DATABASE_URL

DATABASE_HOST

DATABASE_PORT

DATABASE_NAME

DATABASE_USER

DATABASE_PASSWORD

---

# Redis

REDIS_URL

REDIS_HOST

REDIS_PORT

REDIS_PASSWORD

---

# Authentication

JWT_SECRET

JWT_REFRESH_SECRET

JWT_EXPIRES_IN

JWT_REFRESH_EXPIRES_IN

COOKIE_SECRET

---

# AI Providers

OPENAI_API_KEY

ANTHROPIC_API_KEY

GOOGLE_API_KEY

DEEPSEEK_API_KEY

OPENROUTER_API_KEY

OLLAMA_BASE_URL

DEFAULT_AI_PROVIDER

DEFAULT_AI_MODEL

---

# Vector Database

QDRANT_URL

QDRANT_API_KEY

QDRANT_COLLECTION

---

# Storage

BUNNY_STORAGE_KEY

BUNNY_STORAGE_ZONE

BUNNY_CDN_URL

---

# Email

SMTP_HOST

SMTP_PORT

SMTP_USER

SMTP_PASSWORD

SMTP_FROM

---

# Analytics

GOOGLE_ANALYTICS_ID

PLAUSIBLE_DOMAIN

---

# Cloudflare

CLOUDFLARE_API_TOKEN

CLOUDFLARE_ZONE_ID

---

# GitHub

GITHUB_TOKEN

GITHUB_REPOSITORY

---

# Security Rules

Never expose

- API Keys
- Tokens
- Passwords
- Secrets

Validate required variables at startup.

Application must fail fast if critical variables are missing.

---

# Secret Management

Development

.env.local

Production

Environment Variables

Future

Vault

AWS Secrets Manager

1Password Connect

---

# Validation

Use runtime validation.

Every required variable must have

- Type
- Description
- Validation

---

# Final Statement

Configuration must remain external to the application and never be hardcoded.
