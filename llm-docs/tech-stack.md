trigger: Read this file before making any architecture, dependency, or infrastructure decisions in BMS.

# BMS Tech Stack Reference

## Frontend
| Item | Value |
|---|---|
| Framework | React (Vite) |
| Styling | Tailwind CSS |
| Routing | React Router DOM |
| Target | PC-first, mobile-responsive |
| Language | Thai UI |

## Backend / Database
| Item | Value |
|---|---|
| Platform | Supabase (managed PostgreSQL) |
| Auth | Supabase Auth — email + password |
| Storage | Supabase Storage (file attachments) |
| Realtime | Supabase Realtime (if needed) |
| URL | https://gbkntitpkpuistmhmuuv.supabase.co |

## Deployment
| Item | Value |
|---|---|
| Host | Vercel |
| Project ID | prj_G6vXzjiinKqwjkbUwDnfEOs2ESXL |
| CI/CD | GitHub → Vercel (auto-deploy on push) |
| Repo | https://github.com/znookz/BMS |

## Auth & Roles
- Provider: Supabase Auth (email/password only — no OAuth)
- Roles stored in custom `users` table or user metadata
- Role values: `admin` | `operation`
- Role enforcement: RLS policies on Supabase + frontend route guards

## Key Constraints
- No new dependencies without explicit instruction
- No hardcoded values — use constants or config files
- All secrets via environment variables (never committed)
- File attachments: jpg / png / pdf, max 10 MB — Supabase Storage
- Export: Excel (.xlsx) + PDF for all modules

## Environment Variables (required)
```
VITE_SUPABASE_URL=https://gbkntitpkpuistmhmuuv.supabase.co
VITE_SUPABASE_ANON_KEY=<anon key>
```
