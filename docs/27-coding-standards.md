# Coding Standards
Version: 1.0
Status: Approved

---

# Overview

This document defines the official coding standards for Ahmed OS.

Every contributor and AI agent must follow these standards.

---

# General Principles

- Readability over cleverness.
- Simplicity over complexity.
- Composition over inheritance.
- Explicit over implicit.
- Small reusable functions.
- Single Responsibility Principle.
- DRY (Don't Repeat Yourself).
- KISS (Keep It Simple).

---

# TypeScript

Strict Mode

Enabled

No

- any
- @ts-ignore
- non-null assertions unless necessary

Prefer

- interfaces
- readonly
- enums only when appropriate
- utility types

---

# Naming

Variables

camelCase

Functions

camelCase

Classes

PascalCase

Interfaces

PascalCase

Enums

PascalCase

Constants

UPPER_SNAKE_CASE

Files

kebab-case

Folders

kebab-case

---

# Imports

Order

1. Node Modules
2. External Libraries
3. Internal Modules
4. Relative Imports

Avoid wildcard imports.

---

# Functions

Maximum Length

40 lines

Maximum Parameters

4

Prefer early return.

Avoid nested conditions.

---

# Classes

Maximum Responsibility

One

Use Dependency Injection.

Avoid static state.

---

# Controllers

Responsibilities

- Validate
- Authorize
- Call Service
- Return Response

Never implement business logic.

---

# Services

Contain

- Business Logic
- Transactions
- External Integrations

---

# DTOs

Every request

Every response

Must use DTOs.

---

# Comments

Explain

WHY

Not

WHAT

Remove commented code before merging.

---

# Logging

Structured JSON

Never log

- Passwords
- Tokens
- Secrets

---

# Errors

Throw meaningful exceptions.

Never swallow errors.

Never expose stack traces.

---

# Async

Prefer async/await.

Avoid Promise chains.

---

# Performance

Avoid unnecessary allocations.

Cache expensive operations.

Optimize only when measured.

---

# Security

Validate every input.

Escape every output.

Never trust user input.

---

# Testing

Every public service

Unit Tests

Critical flows

Integration Tests

User journeys

E2E Tests

---

# Final Statement

Code should be understandable by another engineer within five minutes.
