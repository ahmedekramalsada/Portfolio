# Frontend Architecture
Version: 1.0
Status: Approved

---

# Overview

The frontend is the public face of Ahmed OS.

It is responsible for rendering the UI, handling user interactions, SEO, routing, authentication state, and communication with the backend.

Business logic must never exist inside the frontend.

---

# Technology

Framework
- Next.js 15+

Language
- TypeScript

UI
- shadcn/ui

Styling
- Tailwind CSS v4

State
- Zustand

Server State
- TanStack Query

Forms
- React Hook Form

Validation
- Zod

Animation
- Framer Motion

Icons
- Lucide React

Theme
- next-themes

Editor
- Tiptap

Markdown
- MDX

Charts
- Recharts

---

# Goals

- Fast
- Responsive
- SEO Optimized
- Accessible
- Reusable
- Component Driven

---

# Folder Structure

src/

app/

components/

features/

hooks/

lib/

providers/

services/

stores/

types/

utils/

styles/

middleware.ts

---

# App Router

Use Next.js App Router.

Every page must use Server Components unless Client Components are required.

---

# Route Structure

/

about

projects

projects/[slug]

blog

blog/[slug]

resume

contact

search

ai

dashboard

login

settings

---

# Layouts

Root Layout

Public Layout

Dashboard Layout

Authentication Layout

Error Layout

---

# Components

Component Types

- UI Components
- Shared Components
- Feature Components
- Layout Components

Every component must have a single responsibility.

---

# UI Components

buttons

cards

dialogs

tables

badges

inputs

forms

dropdowns

tooltips

avatars

breadcrumbs

tabs

accordions

---

# Feature Components

Blog

Projects

AI Chat

Search

Dashboard

Analytics

Media

Settings

Authentication

---

# State Management

Use Zustand only for client-side state.

Examples

- Sidebar
- Theme
- Modals
- Notifications
- User Preferences

Never store server data inside Zustand.

---

# Server State

Use TanStack Query.

Responsibilities

- Fetching
- Caching
- Revalidation
- Mutations
- Optimistic Updates

---

# API Layer

All API requests go through:

services/api

Never call fetch directly inside components.

---

# Authentication

JWT

HTTP Only Cookies

Protected Routes

Role Checking

Automatic Token Refresh

---

# Forms

React Hook Form

Zod Validation

Reusable Form Components

Shared Validation Rules

---

# Error Handling

Global Error Boundary

404 Page

500 Page

Loading States

Empty States

Retry Components

---

# Notifications

Toast System

Success

Error

Warning

Information

---

# Theme

Dark Mode

Light Mode

System Mode

Persist user preference.

---

# Images

Next Image

Lazy Loading

Optimization

Responsive Images

---

# SEO

Every page must include

Title

Description

OpenGraph

Twitter Card

Canonical URL

Structured Data

Robots

Metadata API

---

# Accessibility

WCAG AA

Keyboard Navigation

ARIA Labels

Focus States

Screen Reader Support

---

# Performance

Server Components First

Code Splitting

Lazy Loading

Dynamic Imports

Image Optimization

Font Optimization

Bundle Optimization

---

# Design Rules

Reusable Components

No duplicated UI

Composition over inheritance

Mobile First

Desktop Optimized

Consistent spacing

Consistent typography

---

# Folder Ownership

Every feature owns:

components

hooks

services

types

utils

No cross-feature dependencies.

---

# Final Statement

The frontend must remain clean, modular, reusable, accessible, and optimized for performance and SEO.
