# Claude Design Prompt — BMS Web Application

## Prompt (copy และวางใน Claude Design)

---

Design a professional internal web application called **BMS (Bus Management System)** for a transportation operations team in Thailand.

---

## Design Direction

- **Style**: Clean, minimal, data-dense but easy to scan. Think modern admin dashboard — not flashy, just clear and functional.
- **Layout**: Sidebar navigation (fixed left) + main content area. PC-first (1440px), but must be responsive to mobile.
- **Color palette**:
  - Primary: Deep navy blue `#1E3A5F`
  - Accent: Amber/orange `#F59E0B` (for alerts, highlights, CTAs)
  - Background: Light gray `#F8FAFC`
  - Surface: White `#FFFFFF`
  - Text: Slate `#334155`
  - Success: `#22C55E` | Warning: `#F59E0B` | Danger: `#EF4444`
- **Typography**: Clean sans-serif, Thai-compatible (e.g., Noto Sans Thai / Sarabun)
- **Tone**: Professional, trustworthy, operational — not playful

---

## System Overview

BMS manages a fleet of **88 buses** (68 air-conditioned + 20 fan buses) across **3 factory zones** (Bangpa-in, Ayutthaya, Lopburi). Users are internal staff with 2 roles: **Admin** and **Operation**.

---

## Key Pages to Design

### 1. Login Page
- Logo + system name center
- Email + Password fields
- Clean, minimal — not decorative

### 2. Overview Dashboard (Home)
- Top KPI cards:
  - Total buses active / in maintenance
  - This month's total cost
  - Open complaints (unresolved)
  - Licenses expiring within 30 days
- Line chart: Monthly cost trend (air bus vs fan bus)
- Bar chart: Fuel consumption by company (7 companies)
- Alert panel: Top 5 upcoming expiry notifications
- Recent activity feed (right sidebar or bottom)

### 3. Driver Management
- Table list: Name, ID card, route, shift, status (active/inactive)
- Search + filter bar (by factory, route, shift)
- Row click → Driver detail page (tabs: Info / Health Records / Training History)
- Add/Edit drawer from the right side

### 4. Bus Fleet Management
- Toggle: Air Bus / Fan Bus (tab or toggle switch)
- Card grid or table: Bus plate, brand, factory, driver, status badge (Active / In Maintenance / Retired)
- Status badge color: Green / Orange / Gray
- Bus detail → tabs: Info / Maintenance History / Insurance

### 5. Maintenance
- Table: Bus plate, last service date, current mileage, next service mileage, progress bar showing % to next service
- Progress bar turns orange at 80%, red at 100%
- Maintenance log form: date, type (scheduled / breakdown / accident), cost, description, photo upload
- Filter by factory, status

### 6. Cost Control
- Date range picker (month/year)
- Stacked bar or donut chart: cost breakdown by category
- Table: date, category, bus type, amount
- Total summary card at top
- Export button (Excel / PDF)

### 7. Fuel (ATG) — Real-time
- Daily fuel table: company, bus plate, driver, liters, price/liter, total cost, timestamp
- Summary cards: Today's total liters, Today's total cost
- Bar chart: fuel per company
- Auto-refresh indicator

### 8. License & Insurance
- Table: type, bus/driver, issue date, expiry date, days remaining, status badge
- Days remaining column: green (>30 days) / orange (≤30 days) / red (expired)
- Claim records section below
- Photo attachment viewer

### 9. Notification Panel
- Bell icon in top navbar with unread count badge
- Dropdown list: icon + message + time ago
- Types: 🔧 Maintenance due | 📄 License expiry | 🎓 Training expiry | ⚠️ Unresolved complaint

### 10. User Management (Admin only)
- Simple table: name, email, role badge, last login, actions
- Add/Edit user modal
- Role toggle: Admin / Operation

---

## Navigation (Sidebar)
```
🏠 Dashboard
👤 Driver
🚌 Bus Fleet
🔧 Maintenance
💰 Cost Control
⛽ Fuel (ATG)
📋 Training
📄 License & Insurance
😤 Customer Complaint
🛡️ Safety Measurement
🛒 Purchase
👥 User Management  ← Admin only (hidden for Operation role)
```

---

## UI Components to Include
- Data tables with sort/filter/pagination
- KPI summary cards with icon + number + trend arrow
- Status badges (colored pill shapes)
- Progress bars for mileage tracking
- Charts: line, bar, donut
- Right-side drawer for add/edit forms
- Modal for confirmations
- Toast notifications
- File upload zone (drag & drop)
- Date range picker

---

## What NOT to do
- No gradients or heavy shadows
- No dark mode (not required)
- No animations that slow perception
- No cluttered sidebars with nested menus more than 1 level deep

---

Please design the **Dashboard**, **Driver Management**, and **Bus Fleet** pages fully. Show the sidebar in all screens. Use realistic Thai mock data (Thai names, Thai license plates).
