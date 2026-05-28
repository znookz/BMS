# BMS — Tech Stack

## Runtime & Build

| Tool | Version | Role |
|---|---|---|
| Node.js | ≥ 18 | JavaScript runtime |
| Vite | ^6.3 | Dev server + build bundler |
| ESM | native | Module system (`"type": "module"`) |

## Frontend

| Library | Version | Role |
|---|---|---|
| React | ^19.1 | UI framework |
| React DOM | ^19.1 | DOM renderer |
| React Router DOM | ^7.6 | Client-side routing (BrowserRouter) |
| Tailwind CSS | ^3.4 | Utility-first styling |
| PostCSS + Autoprefixer | ^8.5 / ^10.4 | CSS processing pipeline |

### Tailwind Theme
- **Font**: Sarabun (Thai-first sans-serif)
- **Primary**: `#1E3A5F` (navy)
- **Accent**: `#F59E0B` (amber)
- **Background**: `#F8FAFC`

## Backend / Database

| Service | Detail |
|---|---|
| Supabase | PostgreSQL DB + Auth + Storage |
| `@supabase/supabase-js` | ^2.50 — JS client |
| Auth method | Username → email lookup via RPC `get_email_by_username`, then `signInWithPassword` |
| Role storage | `user_metadata.role` in Supabase Auth (`admin` / `operation`) |

### Environment Variables
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## Deployment

| Service | Detail |
|---|---|
| Vercel | Static hosting + edge CDN |
| Project ID | `prj_G6vXzjiinKqwjkbUwDnfEOs2ESXL` |
| GitHub Repo | https://github.com/znookz/BMS |

## Project Structure

```
project-bms/
├── src/
│   ├── contexts/       # AuthContext (global auth state)
│   ├── components/     # Shared UI — Layout, Sidebar, Topbar, Charts, Icon, ui, ErrorBoundary
│   ├── pages/          # One file per route
│   ├── hooks/          # Data hooks (useDrivers, useBuses, useMaintenance, useCosts, ...)
│   └── lib/            # supabase client, constants, utils, mockData
├── index.html
├── vite.config.js
├── tailwind.config.js
└── .env.local
```

## Routing

| Path | Page | Auth |
|---|---|---|
| `/login` | Login | Public |
| `/` | Dashboard | Protected |
| `/driver` | Drivers | Protected |
| `/bus` | Buses | Protected |
| `/companies` | Transport Companies | Protected |
| `/maintenance` | Maintenance | Protected |
| `/cost` | Cost Control | Protected |
| `/fuel` | Fuel (ATG) — stub | Protected |
| `/training` | Training — stub | Protected |
| `/license` | License & Insurance — stub | Protected |
| `/complaint` | Customer Complaint — stub | Protected |
| `/safety` | Safety Measurement — stub | Protected |
| `/purchase` | Purchase — stub | Protected |
| `/users` | User Management | Protected (admin) |
