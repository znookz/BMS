trigger: Read this file before implementing any module, data model, or feature in BMS.

# BMS Requirements Reference

## Stack
- Frontend: React + Tailwind CSS (PC-first, mobile-responsive)
- DB: Supabase (PostgreSQL)
- Deploy: Vercel + GitHub
- Auth: Supabase Auth — email/password, roles: `admin` | `operation`

## Business Data (Hard Facts)
- AC buses: 68 total — Bangpa-in 43, Ayutthaya 2, Lopburi 23 (Benz / Hino)
- Fan buses: 20 MOCK — Bangpa-in 12, Ayutthaya 3, Lopburi 5 (Toyota Coaster / Isuzu)
- Bus companies: 7 (CO-01 to CO-07), fuel tracked per company
- UI language: Thai

## Roles & Access
| Module | admin | operation |
|---|---|---|
| All modules | ✅ | ✅ |
| User Management | ✅ | ❌ |

## Modules Summary
| Module | Key Data | Linked To |
|---|---|---|
| Overview Dashboard | KPI summary, cost graphs | All modules |
| Driver | Personal info, shift, health, training history | Bus, Training |
| Bus | Fleet (air+fan), status, insurance dates, behavior link | Driver, Maintenance |
| Maintenance | Daily mileage, service schedule, repair cost, photos | Bus, Insurance |
| Cost Control | All bus expenses, split air/fan, dashboard | — |
| Training | Courses, per-driver attendance | Driver |
| License & Insurance | License expiry, claim records, photos | Maintenance |
| Customer Complaint | Complaint log, resolution status | Driver, Bus |
| Safety Measurement | Pre-trip checklist, alcohol test, near-miss, speed log | Bus, Driver |
| Purchase | Equipment orders for AC buses and fuel station | — |
| Fuel (ATG) | Real-time daily fuel, per company/bus | Bus, Cost Control |
| User Management | CRUD users, assign roles, audit log | — |

## ATG Mock Payload
```json
{
  "record_id": "ATG-20240115-001",
  "timestamp": "2024-01-15T08:30:00+07:00",
  "station_id": "STN-BANGPA-IN-01",
  "company_id": "CO-03",
  "bus_plate": "นก 1234 อยุธยา",
  "bus_type": "air",
  "driver_id": "DRV-045",
  "fuel_type": "diesel",
  "liters": 85.5,
  "price_per_liter": 29.84,
  "total_cost": 2551.42,
  "odometer": 45230
}
```

## System Features
### Notifications (in-app only)
- Mileage at 80% of service interval → maintenance alert
- License/insurance expiry → 30 days advance
- Training cert expiry → 30 days advance
- Unresolved complaint → every 7 days

### Export
- All modules: Excel (.xlsx) + PDF
- User selects date range before export

### File Attachments (Maintenance, License & Insurance)
- Formats: jpg, png, pdf — max 10MB per file

### Audit Log (Admin only)
- Tracks: create / update / delete
- Stores: user, timestamp, field changed, before/after values

## Safety Measurement (Mock)
- Pre-trip inspection checklist (daily, before departure)
- Breathalyzer test log (daily per driver)
- Near-miss incident reports
- Monthly safety drill records
- Speed violation log (from driving behavior system)

## External Integrations
- ATG system: real-time fuel data (currently mock)
- Driving behavior system: future integration with Bus + Safety modules
