// Mock display data for Dashboard (ยังไม่ได้ connect กับ Supabase)

export const COST_TREND = [
  { m: 'มิ.ย.', air: 1820, fan: 540 },
  { m: 'ก.ค.', air: 1890, fan: 560 },
  { m: 'ส.ค.', air: 1950, fan: 590 },
  { m: 'ก.ย.', air: 2010, fan: 580 },
  { m: 'ต.ค.', air: 2080, fan: 610 },
  { m: 'พ.ย.', air: 2120, fan: 620 },
  { m: 'ธ.ค.', air: 2240, fan: 640 },
  { m: 'ม.ค.', air: 2180, fan: 600 },
  { m: 'ก.พ.', air: 1960, fan: 570 },
  { m: 'มี.ค.', air: 2090, fan: 605 },
  { m: 'เม.ย.', air: 2155, fan: 615 },
  { m: 'พ.ค.', air: 2280, fan: 650 },
]

export const FUEL_BY_COMPANY = [
  { name: 'ไทยพัฒนา ทรานสปอร์ต', liters: 1820 },
  { name: 'อยุธยาขนส่ง',         liters: 1450 },
  { name: 'ลพบุรีบัส',            liters: 1180 },
  { name: 'ปทุมวันทรานสปอร์ต',    liters: 970 },
  { name: 'เซนทรัล ทรานส์',      liters: 1310 },
  { name: 'สยามขนส่ง',           liters: 880 },
  { name: 'อีสต์เวย์',            liters: 740 },
]

export const EXPIRY_ALERTS = [
  { id: 1, type: 'insurance', who: '30-1471 อย',         days: 4,  exp: '2026-05-30', label: 'ประกันภัย หมดอายุ' },
  { id: 2, type: 'license',   who: 'ประยุทธ์ ศรีสุข',   days: 11, exp: '2026-06-06', label: 'ใบขับขี่ B2 หมดอายุ' },
  { id: 3, type: 'tax',       who: '40-1234 อย',         days: 16, exp: '2026-06-11', label: 'ภาษีรถ หมดอายุ' },
  { id: 4, type: 'training',  who: 'ศุภชัย ดวงแก้ว',    days: 22, exp: '2026-06-17', label: 'อบรมขับขี่ปลอดภัย หมดอายุ' },
  { id: 5, type: 'insurance', who: '31-1318 ลบ',         days: 27, exp: '2026-06-22', label: 'ประกันภัย หมดอายุ' },
]

export const ACTIVITY = [
  { id: 1, who: 'พรทิพย์ น.',  action: 'บันทึกค่าซ่อม',          target: '40-1234 อย',      when: '12 นาทีที่แล้ว',   kind: 'maintenance' },
  { id: 2, who: 'สมหญิง พ.',   action: 'เพิ่มพนักงานขับรถใหม่',   target: 'ปริญญา ภักดี',   when: '1 ชั่วโมงที่แล้ว', kind: 'driver' },
  { id: 3, who: 'ระบบ ATG',    action: 'บันทึกเติมน้ำมัน 78 ลิตร', target: '30-1471 อย',     when: '2 ชั่วโมงที่แล้ว', kind: 'fuel' },
  { id: 4, who: 'ธนพล ส.',     action: 'อัปเดตประกันภัย',         target: '41-1521 ปท',     when: '3 ชั่วโมงที่แล้ว', kind: 'license' },
  { id: 5, who: 'วราภรณ์ ก.',  action: 'บันทึกเรื่องร้องเรียน',   target: 'เส้นทาง โรจนะ B', when: 'เมื่อวานนี้',       kind: 'complaint' },
  { id: 6, who: 'พรทิพย์ น.',  action: 'ปิดงานบำรุงรักษา',        target: '31-1318 ลบ',     when: 'เมื่อวานนี้',       kind: 'maintenance' },
]

export const NOTIFS = [
  { id: 1, kind: 'maintenance', icon: 'wrench', msg: 'ครบกำหนดบำรุงรักษา 40-1234 อย',          when: '5 นาทีที่แล้ว',   unread: true  },
  { id: 2, kind: 'license',     icon: 'id',    msg: 'ใบขับขี่ ประยุทธ์ ศรีสุข ใกล้หมดอายุ',   when: '1 ชั่วโมงที่แล้ว', unread: true  },
  { id: 3, kind: 'training',    icon: 'cap',   msg: 'อบรม ศุภชัย ดวงแก้ว หมดอายุใน 22 วัน',  when: '3 ชั่วโมงที่แล้ว', unread: true  },
  { id: 4, kind: 'complaint',   icon: 'alert', msg: 'เรื่องร้องเรียนใหม่: คนขับขับเร็วเกิน',   when: 'เมื่อวานนี้',       unread: false },
  { id: 5, kind: 'license',     icon: 'id',    msg: 'ประกันภัย 30-1471 อย ใกล้หมดอายุ',       when: '2 วันที่แล้ว',     unread: false },
]

export const FACTORY_STATS = [
  { name: 'บางปะอิน', total: 47, active: 44, maintenance: 3 },
  { name: 'อยุธยา',   total: 4,  active: 4,  maintenance: 0 },
  { name: 'ลพบุรี',   total: 25, active: 23, maintenance: 2 },
]

export const COMPLAINTS_OPEN        = 7
export const LICENSES_EXPIRING_30D  = 9
export const MAINTENANCE_NOW        = 5
export const BUSES_ACTIVE           = 82
export const COST_THIS_MONTH        = 2_930_000
