# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a real estate application. Update this section as the project takes shape with details about the tech stack, purpose, and key features.

## Git Operations

**Every code change must be committed and pushed to GitHub.**

After any modification to source files:

```bash
git add <changed-files>
git commit -m "brief description of change"
git push origin main
```

- Stage specific files, not `git add .` or `git add -A`, to avoid accidentally committing sensitive files.
- Write commit messages in the imperative mood (e.g. "add property listing page", "fix search filter bug").
- Never force-push to `main`/`master`.
- Never skip hooks with `--no-verify`.

## Development Commands

> Update this section once the tech stack is decided (e.g. Next.js, React, Django, etc.).

Typical placeholders — replace with actual commands:

```bash
# Install dependencies
npm install          # or: pip install -r requirements.txt

# Start dev server
npm run dev          # or: python manage.py runserver

# Run all tests
npm test             # or: pytest

# Run a single test file
npm test -- path/to/test.spec.ts   # or: pytest path/to/test.py

# Lint
npm run lint         # or: flake8 .

# Build for production
npm run build
```

## Architecture

> Fill in this section as the project structure is established.

Key areas to document here:
- **Data models** — Property, Listing, User, etc.
- **API layer** — how the frontend talks to the backend (REST, GraphQL, etc.)
- **Authentication** — session, JWT, OAuth, etc.
- **Search / filtering** — how property searches are handled
- **Media handling** — property photos upload and storage
