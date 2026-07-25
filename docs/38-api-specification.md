# REST API Specification
Version: 1.0
Status: Approved

---

# Overview

Ahmed OS exposes a versioned REST API.

Base URL

/api/v1

---

# Authentication

POST /auth/login

POST /auth/logout

POST /auth/refresh

GET /auth/me

PUT /auth/profile

PUT /auth/password

---

# Blog

GET /posts

GET /posts/:slug

POST /posts

PUT /posts/:id

DELETE /posts/:id

POST /posts/:id/publish

POST /posts/:id/archive

---

# Categories

GET /categories

POST /categories

PUT /categories/:id

DELETE /categories/:id

---

# Tags

GET /tags

POST /tags

DELETE /tags/:id

---

# Projects

GET /projects

GET /projects/:slug

POST /projects

PUT /projects/:id

DELETE /projects/:id

---

# Media

POST /media/upload

GET /media

DELETE /media/:id

PUT /media/:id

---

# Search

GET /search

GET /search/suggestions

GET /search/trending

---

# AI

POST /ai/chat

POST /ai/stream

POST /ai/summarize

POST /ai/rewrite

POST /ai/seo

---

# RAG

POST /rag/index

POST /rag/reindex

GET /rag/status

GET /rag/documents

---

# MCP

GET /mcp/tools

GET /mcp/resources

POST /mcp/call

---

# Analytics

GET /analytics/dashboard

GET /analytics/visitors

GET /analytics/content

GET /analytics/search

GET /analytics/ai

---

# SEO

POST /seo/generate

POST /seo/schema

GET /seo/sitemap

---

# Settings

GET /settings

PUT /settings

---

# Health

GET /health

GET /health/live

GET /health/ready

---

# Response Format

Success

{
  success: true,
  data: {},
  metadata: {}
}

Failure

{
  success: false,
  error: {
    code,
    message
  }
}

---

# Authentication

JWT

HTTP Only Cookies

Bearer Token (Future)

---

# Documentation

Swagger

OpenAPI 3.1

Every endpoint must include

Description

Request Schema

Response Schema

Examples

Error Codes

Permissions

---

# Versioning

Current

v1

Future

v2

Breaking changes require a new version.

---

# Final Statement

Every endpoint must be typed, documented, tested, and versioned.
