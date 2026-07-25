# Database Schema
Version: 1.0
Status: Approved

---

# Overview

Ahmed OS uses PostgreSQL with Prisma ORM.

Database Design Principles

- UUID Primary Keys
- Strong Relationships
- Soft Delete
- Audit Fields
- Optimized Indexes
- Normalized Structure

---

# Global Fields

Every table contains

id UUID PRIMARY KEY

createdAt TIMESTAMP

updatedAt TIMESTAMP

deletedAt TIMESTAMP NULL

---

# User

id

name

email

passwordHash

avatar

role

status

lastLogin

createdAt

updatedAt

Relations

Sessions

Posts

Projects

---

# Session

id

userId

refreshTokenHash

ipAddress

userAgent

expiresAt

---

# BlogPost

id

title

slug

excerpt

content

coverImage

status

seoTitle

seoDescription

canonicalUrl

publishedAt

authorId

Relations

Tags

Category

Media

Revisions

---

# Category

id

name

slug

description

color

---

# Tag

id

name

slug

---

# BlogRevision

id

postId

content

editorId

createdAt

---

# Project

id

title

slug

description

content

coverImage

githubUrl

demoUrl

featured

status

difficulty

role

startDate

endDate

---

# ProjectTechnology

projectId

technologyId

---

# Technology

id

name

icon

website

category

---

# Media

id

filename

originalName

mimeType

size

width

height

provider

path

publicUrl

uploadedBy

---

# KnowledgeDocument

id

title

sourceType

sourceId

content

status

lastIndexed

---

# KnowledgeChunk

id

documentId

chunkIndex

content

tokenCount

embeddingId

metadata

---

# Embedding

id

provider

model

dimensions

vectorId

createdAt

---

# AIConversation

id

title

provider

model

totalTokens

estimatedCost

userId

---

# AIMessage

id

conversationId

role

content

tokenUsage

latency

---

# Prompt

id

name

version

category

content

variables

status

---

# SearchQuery

id

query

resultsCount

duration

userId

createdAt

---

# AnalyticsEvent

id

eventType

path

country

device

browser

metadata

createdAt

---

# Notification

id

title

body

type

status

recipient

---

# Setting

id

key

value

group

type

public

---

# AuditLog

id

userId

action

resource

resourceId

metadata

ipAddress

userAgent

createdAt

---

# Indexes

Blog

slug

publishedAt

status

Project

slug

featured

Technology

name

KnowledgeChunk

documentId

chunkIndex

SearchQuery

query

AuditLog

createdAt

---

# Constraints

Unique

email

slug

prompt name + version

technology name

---

# Soft Delete

Every business entity supports

deletedAt

Deleted records are excluded by default.

---

# Future Tables

API Keys

Teams

Comments

Bookmarks

Newsletter

OAuth Accounts

Passkeys

Webhooks

Deployments

Jobs

---

# Final Statement

The database is the single source of truth.

Every schema change must be introduced through Prisma migrations.
