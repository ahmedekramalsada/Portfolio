# Development Rules
Version: 1.0
Status: Approved

---

# Overview

These rules define how Ahmed OS must be developed.

Every contributor and every AI agent must follow these rules.

---

# General Rules

- Write clean code.
- Keep functions small.
- Avoid duplicated code.
- Prefer readability over cleverness.
- Always document public APIs.

---

# Architecture Rules

- Follow Modular Monolith architecture.
- No circular dependencies.
- No business logic in controllers.
- No direct database access outside repositories/services.
- One responsibility per module.

---

# TypeScript Rules

- Strict Mode enabled.
- No "any" type.
- Prefer interfaces for contracts.
- Prefer readonly when possible.

---

# Naming

Files

kebab-case

Variables

camelCase

Classes

PascalCase

Constants

UPPER_SNAKE_CASE

Database

snake_case

---

# API Rules

Every endpoint must

- Validate input
- Return consistent responses
- Handle errors
- Be documented
- Be tested

---

# Frontend Rules

- Use Server Components by default.
- Client Components only when necessary.
- Never call APIs directly from UI components.
- Reuse components whenever possible.

---

# Backend Rules

- Thin Controllers
- Business Logic in Services
- DTO Validation Required
- Dependency Injection Only

---

# Database Rules

- Prisma Migrations only
- UUID Primary Keys
- Index searchable fields
- No manual schema changes

---

# Git Rules

Feature Branches

Conventional Commits

Pull Requests Required

No direct commits to main

---

# Testing Rules

Every feature requires

- Unit Tests
- Integration Tests (when applicable)
- E2E Tests for critical flows

---

# Security Rules

- Never expose secrets
- Never trust user input
- Validate everything
- Sanitize output

---

# AI Rules

- AI never bypasses permissions.
- AI must use application services.
- AI cannot access secrets.
- AI actions must be logged.

---

# Documentation Rules

Every feature must include

- Documentation
- API updates
- Architecture updates (if required)

---

# Code Review Checklist

- Readable
- Tested
- Secure
- Documented
- Performant
- Reusable

---

# Forbidden

- Hardcoded secrets
- Duplicate code
- Large controllers
- Untested features
- Console logs in production
- Dead code

---

# Final Statement

Code quality is a product feature.

Every change must leave the codebase cleaner than before.
