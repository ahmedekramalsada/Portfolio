# API Specification
Version: 1.0
Status: Approved

---

# Overview

The Ahmed OS backend exposes a REST API.

The API is:

- Versioned
- Stateless
- Secure
- Documented
- Production Ready

All endpoints are under:

/api/v1

---

# Standards

Protocol

HTTPS Only

Format

application/json

Encoding

UTF-8

Timezone

UTC

Date Format

ISO 8601

Authentication

JWT

Authorization

RBAC

---

# HTTP Methods

GET

Retrieve resources.

POST

Create resources.

PUT

Replace resources.

PATCH

Update resources.

DELETE

Soft Delete resources.

---

# Response Format

Success

{
  "success": true,
  "data": {},
  "meta": {},
  "message": ""
}

Error

{
  "success": false,
  "error": {
      "code": "",
      "message": "",
      "details": []
  }
}

---

# Status Codes

200 OK

201 Created

204 No Content

400 Bad Request

401 Unauthorized

403 Forbidden

404 Not Found

409 Conflict

422 Validation Error

429 Too Many Requests

500 Internal Server Error

---

# API Modules

Auth

Users

Posts

Projects

Categories

Tags

Media

Pages

Search

Knowledge

AI

RAG

MCP

Analytics

Settings

Notifications

Health

System

---

# Authentication

POST

/auth/login

POST

/auth/logout

POST

/auth/refresh

GET

/auth/me

PATCH

/auth/change-password

---

# Users

GET

/users

GET

/users/:id

POST

/users

PATCH

/users/:id

DELETE

/users/:id

---

# Posts

GET

/posts

GET

/posts/:slug

POST

/posts

PATCH

/posts/:id

DELETE

/posts/:id

POST

/posts/:id/publish

POST

/posts/:id/unpublish

POST

/posts/:id/schedule

---

# Projects

GET

/projects

GET

/projects/:slug

POST

/projects

PATCH

/projects/:id

DELETE

/projects/:id

---

# Categories

GET

/categories

POST

/categories

PATCH

/categories/:id

DELETE

/categories/:id

---

# Tags

GET

/tags

POST

/tags

PATCH

/tags/:id

DELETE

/tags/:id

---

# Media

POST

/media/upload

GET

/media

DELETE

/media/:id

PATCH

/media/:id

---

# Pages

GET

/pages

GET

/pages/:slug

POST

/pages

PATCH

/pages/:id

DELETE

/pages/:id

---

# Search

GET

/search

GET

/search/posts

GET

/search/projects

GET

/search/knowledge

---

# AI

POST

/ai/chat

POST

/ai/completion

POST

/ai/embeddings

GET

/ai/models

GET

/ai/history

DELETE

/ai/history/:id

---

# Knowledge

GET

/knowledge

POST

/knowledge/reindex

POST

/knowledge/rebuild

GET

/knowledge/status

---

# RAG

POST

/rag/query

POST

/rag/reindex

GET

/rag/statistics

GET

/rag/status

---

# MCP

GET

/mcp/tools

POST

/mcp/execute

GET

/mcp/status

POST

/mcp/reload

---

# Analytics

GET

/analytics/dashboard

GET

/analytics/visitors

GET

/analytics/pages

GET

/analytics/searches

---

# Notifications

GET

/notifications

PATCH

/notifications/:id/read

DELETE

/notifications/:id

---

# Settings

GET

/settings

PATCH

/settings

---

# Health

GET

/health

GET

/ready

GET

/live

---

# Pagination

?page=1

?limit=20

Default

20

Maximum

100

---

# Sorting

?sort=createdAt

?order=asc

?order=desc

---

# Filtering

?status=published

?featured=true

?category=docker

?tag=nestjs

---

# Searching

?q=docker

Supports

- Partial Match
- Full Text
- Semantic Search

---

# Validation

All input must be validated.

No endpoint accepts unknown properties.

All IDs are UUID.

---

# Security

JWT Required

HTTPS Required

Rate Limiting

Request Validation

Output Sanitization

RBAC

---

# API Documentation

Swagger

/api/docs

OpenAPI 3.1

Always synchronized with implementation.

---

# Versioning

/api/v1

Future

/api/v2

No breaking changes within the same version.

---

# Logging

Every request must log:

- Method
- Endpoint
- User
- Status
- Duration
- IP
- User Agent

---

# Error Handling

Global Exception Filter

Consistent Error Response

Detailed validation messages

No internal stack traces exposed.

---

# Rate Limiting

Public APIs

100 requests/minute

Authenticated APIs

300 requests/minute

AI APIs

Configurable

---

# Final Statement

Every endpoint must be documented.

Every endpoint must have validation.

Every endpoint must have authentication where required.

Every endpoint must include tests before release.
