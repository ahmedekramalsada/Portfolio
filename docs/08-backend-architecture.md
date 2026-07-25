# Backend Architecture
Version: 1.0
Status: Approved

---

# Overview

The backend is the core of Ahmed OS.

It owns all business logic, security, AI integrations, data processing, storage, and system orchestration.

The backend exposes a REST API consumed by the frontend and AI services.

---

# Technology

Framework

NestJS

Language

TypeScript

ORM

Prisma

Database

PostgreSQL

Cache

Redis

Queue

BullMQ

AI

LangChain.js

Vector Database

Qdrant

---

# Architecture

Modular Monolith

Every module must be independent.

Communication between modules occurs only through services.

---

# Folder Structure

src/

modules/

common/

config/

database/

middleware/

guards/

filters/

interceptors/

decorators/

jobs/

providers/

types/

utils/

main.ts

---

# Module Structure

module/

controller/

service/

repository/

dto/

entities/

validators/

interfaces/

types/

events/

tests/

---

# Core Modules

Auth

Users

Blog

Projects

Media

Search

Knowledge

AI

RAG

MCP

Analytics

Notifications

Settings

Health

System

---

# Module Rules

Each module owns

Controllers

Services

Database Access

DTOs

Validation

Tests

Documentation

Modules may not directly access another module's database logic.

---

# Controllers

Responsibilities

Receive Requests

Validate Input

Call Services

Return Responses

Controllers must never contain business logic.

---

# Services

Responsibilities

Business Logic

Transactions

External Integrations

Validation

Authorization

Events

---

# Repositories

Prisma Only

No raw SQL unless necessary.

All database access is centralized.

---

# DTOs

Every request

Every response

Every mutation

Must have strongly typed DTOs.

---

# Validation

class-validator

ValidationPipe

Whitelist

Transform

Forbid Unknown Values

---

# Authentication

JWT

Refresh Tokens

Passport

Guards

Role Checking

---

# Authorization

RBAC

Admin

Future

Editor

Reader

---

# Middleware

Request ID

Logging

Security Headers

Compression

Localization

---

# Guards

Authentication Guard

Role Guard

Permission Guard

Rate Limit Guard

---

# Interceptors

Logging

Timing

Response Transformation

Caching

---

# Filters

Global Exception Filter

Validation Filter

Database Error Filter

---

# Events

Modules communicate through domain events when appropriate.

Future event bus support must be possible without major refactoring.

---

# AI Module

Responsibilities

Model Selection

Prompt Templates

Conversation Memory

Tool Calling

Streaming

Embeddings

RAG Integration

---

# RAG Module

Responsibilities

Chunking

Embedding

Retrieval

Re-ranking

Context Assembly

Knowledge Synchronization

---

# MCP Module

Responsibilities

Expose MCP Tools

Authentication

Authorization

Logging

Tool Registry

Execution Engine

---

# Queue Jobs

Embedding Generation

Scheduled Publishing

Thumbnail Generation

Notifications

Background Processing

Cleanup

---

# Scheduler

Cron Jobs

Daily Cleanup

Analytics Aggregation

Knowledge Sync

Health Checks

Cache Cleanup

---

# Caching

Redis

AI Cache

Search Cache

Settings Cache

Statistics Cache

---

# Error Handling

Global Exception Filter

Consistent Error Format

No Internal Stack Traces

Structured Logging

---

# Logging

Pino

JSON Logs

Correlation ID

Execution Time

Request Metadata

---

# Security

Helmet

CORS

Rate Limiting

Input Validation

Output Sanitization

Secure Headers

Environment Variables

---

# Performance

Connection Pooling

Efficient Queries

Database Indexes

Pagination

Caching

Background Jobs

Streaming

---

# API Rules

REST

Versioned

OpenAPI

Consistent Responses

Typed DTOs

Validation Required

---

# Testing

Unit Tests

Integration Tests

E2E Tests

Testcontainers

Coverage Required

---

# Deployment

Docker

Health Endpoints

Graceful Shutdown

Readiness Checks

Liveness Checks

---

# Architecture Rules

Business logic exists only in services.

Controllers remain thin.

Modules remain independent.

Everything is strongly typed.

Everything is tested.

Everything is documented.

---

# Final Statement

The backend is the single source of business logic for Ahmed OS.

Every new feature must follow this architecture without exception.
