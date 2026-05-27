# BMS — Bus Management System

## Project Overview
Internal web app for managing bus fleet operations across 3 factories.
PC-first, mobile-responsive. Thai language UI.

## Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React + Tailwind CSS |
| Backend/DB | Supabase (PostgreSQL) |
| Deploy | Vercel |
| Auth | Supabase Auth — email/password + role-based |
| Version Control | GitHub |

## Infrastructure
| Service | Value |
|---|---|
| Supabase URL | https://gbkntitpkpuistmhmuuv.supabase.co |
| Vercel Project ID | prj_G6vXzjiinKqwjkbUwDnfEOs2ESXL |
| GitHub Repo | https://github.com/znookz/BMS |

## Business Context
- **Buses**: 68 air-conditioned buses (Benz / Hino), 3 factory zones
  - Bangpa-in: 43 buses
  - Ayutthaya: 2 buses
  - Lopburi: 23 buses
- **Bus companies**: 7 companies (fuel tracking per company)
- **Bus types**: Air-conditioned and fan buses (cost tracking split by type)

## Modules
| Module | Description |
|---|---|
| **Overview Dashboard** | KPI summary across all modules, cost graphs |
| **Driver** | Personal info, route assignment, shift, health checkup records, training history |
| **Bus** | Fleet registry (air + fan), status (active/maintenance), insurance dates, driving behavior link |
| **Maintenance** | Daily mileage log, service schedule, repair cost, accident repair, photo attachments |
| **Cost Control** | All bus-related expenses, split by air/fan buses, dashboard view |
| **Training** | Course registry, per-driver training history, expiry alerts |
| **License & Insurance** | License expiry alerts, claim records, cost tracking for renewal analysis, photo attachments |
| **Customer Complaint** | Complaint log with date and resolution tracking |
| **Safety Measurement** | Pre-trip checklist, breathalyzer log, near-miss, speed violations (Mock) |
| **Purchase** | Equipment orders for air buses and fuel station |
| **Fuel (ATG)** | Real-time daily fuel fill records, split by 7 bus companies, linked to ATG system |
| **User Management** | Admin-only: CRUD users, assign roles, audit log |

## Auth & Roles
- Simple: email + password via Supabase Auth
- Roles: `admin`, `operation`
- operation cannot access User Management

## System Features
- **Notifications**: In-app only — mileage alert (80% of service interval), license/training expiry (30 days), unresolved complaint (7 days)
- **Export**: Excel (.xlsx) + PDF for all modules
- **File Attachments**: jpg/png/pdf, max 10MB — Maintenance & License modules
- **Audit Log**: admin-only, tracks create/update/delete with before/after values

## External Integrations (Future)
- ATG system (fuel tracking)
- Driving behavior detection system

## Project Documentation Convention
| Directory | Audience | Language |
|---|---|---|
| `docs/` | Human | Thai |
| `llm-docs/` | LLM | English |

- `llm-docs/` files must start with a `trigger:` line

## Response Language
Respond to user primarily in **Thai**. English only for technical terms or short inline labels where Thai is awkward. All LLM-facing files (CLAUDE.md, llm-docs/, memory/) in **English**.

## Core Rules
- No hardcoding — use constants or config
- No new dependencies without instruction
- Confirm before any destructive action
- Show plan and confirm before file writes or multi-step tasks
- Use Context7 MCP for library docs when available

## Phase Reference
_(Fill in as phases are defined)_

| Phase | Description | Required Files |
|---|---|---|
| 1 | Project setup + Auth | — |
| 2 | Driver module | — |
| 3 | Bus module | — |
| ... | ... | ... |
