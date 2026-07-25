# Database Design
Version: 1.0
Status: Approved

---

# Overview

PostgreSQL is the single source of truth.

The database must be normalized, scalable, indexed, and migration-driven.

Prisma is the only ORM.

Direct SQL should only be used when absolutely necessary.

---

# General Rules

- UUID Primary Keys
- Soft Deletes
- createdAt
- updatedAt
- deletedAt
- Foreign Keys Required
- Cascade only when appropriate
- Index searchable fields
- Use snake_case for database tables
- Use camelCase in TypeScript

---

# Naming Convention

Tables

users
posts
projects

Columns

id
created_at
updated_at

---

# Tables

## users

Fields

- id
- email
- password_hash
- first_name
- last_name
- avatar
- role
- is_active
- last_login
- created_at
- updated_at

---

## posts

Fields

- id
- title
- slug
- excerpt
- content
- cover_image
- status
- reading_time
- seo_title
- seo_description
- published_at
- author_id
- created_at
- updated_at
- deleted_at

Indexes

- slug
- published_at
- status

---

## categories

Fields

- id
- name
- slug
- description
- created_at

---

## tags

Fields

- id
- name
- slug

---

## post_tags

Fields

- post_id
- tag_id

Composite Primary Key

(post_id, tag_id)

---

## projects

Fields

- id
- title
- slug
- description
- content
- cover_image
- github_url
- demo_url
- status
- featured
- created_at
- updated_at

---

## project_tags

Fields

- project_id
- tag_id

---

## media

Fields

- id
- filename
- original_name
- mime_type
- size
- width
- height
- storage_provider
- storage_key
- uploaded_by
- created_at

---

## pages

Fields

- id
- title
- slug
- content
- seo_title
- seo_description
- published
- created_at
- updated_at

---

## notes

Private knowledge.

Fields

- id
- title
- content
- visibility
- created_at

---

## case_studies

Fields

- id
- title
- slug
- problem
- solution
- lessons
- created_at

---

## certificates

Fields

- id
- title
- issuer
- issue_date
- expiration_date
- credential_url
- image

---

## experiences

Fields

- id
- company
- position
- start_date
- end_date
- description

---

## skills

Fields

- id
- name
- category
- level
- icon

---

## contacts

Fields

- id
- name
- email
- subject
- message
- ip
- created_at

---

## ai_conversations

Fields

- id
- user_id
- title
- model
- created_at

---

## ai_messages

Fields

- id
- conversation_id
- role
- content
- tokens
- created_at

---

## knowledge_chunks

Fields

- id
- source_type
- source_id
- chunk_index
- content
- embedding_status
- created_at

---

## embeddings

Fields

- id
- chunk_id
- vector_id
- provider
- model
- created_at

---

## search_logs

Fields

- id
- query
- results
- created_at

---

## analytics_events

Fields

- id
- event
- page
- referrer
- country
- browser
- device
- created_at

---

## notifications

Fields

- id
- title
- body
- type
- read
- created_at

---

## settings

Fields

- key
- value

---

# Relationships

User

↓

Posts

User

↓

Media

Post

↓

Tags

Project

↓

Tags

Knowledge

↓

Chunks

Chunks

↓

Embeddings

Conversation

↓

Messages

---

# Soft Delete

Tables supporting soft delete

- posts
- projects
- media
- pages

---

# Search Indexes

Create indexes on

- slug
- title
- published_at
- email
- created_at

Use PostgreSQL Full Text Search for

- Posts
- Projects
- Pages
- Notes
- Case Studies

---

# Migrations

Only Prisma Migrations are allowed.

Never modify production schema manually.

---

# Backup Rules

Daily Backup

Weekly Backup

Monthly Backup

Point In Time Recovery Ready

---

# Future Tables

comments

newsletter_subscribers

webhooks

api_keys

audit_logs

mcp_logs

rag_jobs

deployments

system_logs

---

# Final Statement

The database schema must remain modular.

Every new feature must introduce its own table(s) through Prisma migrations.

No schema changes are allowed without updating this document.
