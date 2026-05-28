# BMS — Bus Management System

ระบบจัดการรถโดยสารภายในองค์กร (MinebeaMitsumi) รองรับ 3 โรงงาน: บางปะอิน / อยุธยา / ลพบุรี

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS + Custom CSS Design System |
| Backend / DB | Supabase (PostgreSQL + Auth) |
| Deploy | Vercel |
| Version Control | GitHub |

## โครงสร้าง Project

```
src/
├── App.jsx                   # Router หลัก + ProtectedRoute
├── main.jsx
├── index.css                 # Design system tokens + global styles
│
├── lib/
│   ├── supabase.js           # Supabase client
│   ├── utils.js              # Shared helpers: formatBaht, formatNumber, initials, bahtCompact
│   ├── constants.js          # Shared constants: FACTORIES, ROUTES, SHIFTS
│   └── mockData.js           # Mock display data สำหรับ Dashboard (รอ connect Supabase)
│
├── contexts/
│   └── AuthContext.jsx       # Auth state, user, role, signOut
│
├── components/
│   ├── ErrorBoundary.jsx     # Global error catch
│   ├── Layout.jsx            # Shell: Sidebar + Topbar + <Outlet>
│   ├── Sidebar.jsx           # Navigation menu
│   ├── Topbar.jsx            # Search + Notification bell
│   ├── Icon.jsx              # SVG icon library (inline paths)
│   ├── Charts.jsx            # LineChart, BarChart, DonutChart
│   └── ui.jsx                # Shared UI: KPI, StatusBadge, Drawer, Avatar, Pagination
│
├── hooks/                    # Data layer — Supabase CRUD แยกตามโมดูล
│   ├── useDrivers.js
│   ├── useBuses.js
│   ├── useMaintenance.js
│   ├── useCosts.js
│   ├── useTransportCompanies.js
│   └── useUsers.js
│
└── pages/                    # UI layer — 1 ไฟล์ต่อ 1 โมดูล
    ├── Login.jsx
    ├── Dashboard.jsx
    ├── Drivers.jsx
    ├── Buses.jsx
    ├── TransportCompanies.jsx
    ├── Maintenance.jsx
    ├── Cost.jsx
    ├── Users.jsx
    └── StubPage.jsx          # Placeholder สำหรับโมดูลที่ยังไม่ implement
```

## Modules

| เส้นทาง | โมดูล | สถานะ |
|---|---|---|
| `/` | Dashboard | ✅ Mock data |
| `/driver` | Driver Management | ✅ Supabase |
| `/bus` | Bus Fleet | ✅ Supabase |
| `/companies` | Transport Company | ✅ Supabase |
| `/maintenance` | Maintenance Log | ✅ Supabase |
| `/cost` | Cost Control | ✅ Supabase |
| `/fuel` | Fuel (ATG) | 🔲 Stub |
| `/training` | Training | 🔲 Stub |
| `/license` | License & Insurance | 🔲 Stub |
| `/complaint` | Customer Complaint | 🔲 Stub |
| `/safety` | Safety Measurement | 🔲 Stub |
| `/purchase` | Purchase | 🔲 Stub |
| `/users` | User Management | ✅ Supabase (Admin only) |

## Auth & Roles

- Email + Password ผ่าน Supabase Auth
- **Admin** — เข้าถึงได้ทุกโมดูล รวม User Management + เห็นทุกบริษัทขนส่ง
- **Operation** — เข้าถึงโมดูลปฏิบัติการ + กำหนดสิทธิ์บริษัทขนส่งรายคน

## Infrastructure

| Service | Value |
|---|---|
| Supabase | `gbkntitpkpuistmhmuuv.supabase.co` |
| Vercel Project | `prj_G6vXzjiinKqwjkbUwDnfEOs2ESXL` |
| GitHub | `github.com/znookz/BMS` |

## Run Locally

```bash
npm install
npm run dev
```

## Pattern

```
hooks/use*.js   →  Supabase queries + state (load / add / update / remove)
pages/*.jsx     →  UI only, ไม่มี fetch logic, รับ data จาก hook
components/     →  Reusable UI ไม่มี data dependency
lib/utils.js    →  Pure functions เท่านั้น ไม่มี side effects
```
