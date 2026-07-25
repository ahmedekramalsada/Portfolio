# Git Workflow
Version: 1.0
Status: Approved

---

# Overview

Ahmed OS follows a Git-based development workflow designed for collaboration, traceability, and production stability.

---

# Goals

- Clean History
- Safe Releases
- Easy Rollback
- Predictable Development

---

# Branch Strategy

main

Production-ready code only.

develop

Integration branch.

feature/*

New features.

bugfix/*

Bug fixes.

hotfix/*

Production fixes.

release/*

Release preparation.

---

# Branch Naming

feature/blog-system

feature/ai-chat

feature/rag-search

bugfix/login-loop

hotfix/security-patch

release/v1.0.0

---

# Commit Convention

Format

type(scope): description

Examples

feat(blog): add markdown editor

fix(auth): refresh token bug

refactor(ai): improve prompt builder

docs(api): update endpoints

test(search): add integration tests

chore(deps): update packages

---

# Commit Types

feat

fix

docs

style

refactor

perf

test

build

ci

chore

revert

---

# Pull Request Rules

Every PR must include

- Clear description
- Linked issue
- Passing tests
- Updated documentation
- Code review approval

---

# Merge Strategy

Squash Merge

Reason

- Clean history
- One commit per feature

---

# Release Process

1. Create release branch
2. Run all tests
3. Update version
4. Update changelog
5. Merge into main
6. Tag release
7. Deploy

---

# Tags

v1.0.0

v1.0.1

v1.1.0

v2.0.0

Semantic Versioning required.

---

# Versioning

MAJOR

Breaking changes

MINOR

New features

PATCH

Bug fixes

---

# Code Review Checklist

Architecture

Security

Performance

Readability

Tests

Documentation

---

# Protected Branches

main

develop

Direct pushes are not allowed.

---

# CI Requirements

Every commit triggers

Lint

↓

Tests

↓

Build

↓

Security Scan

↓

Docker Build

---

# Changelog

Every release updates

CHANGELOG.md

Categories

Added

Changed

Fixed

Removed

Deprecated

Security

---

# Final Statement

Git history must remain clean, readable, and production-ready.
