export const FACTORIES = ['บางปะอิน', 'อยุธยา', 'ลพบุรี']

export const COMPANIES = [
  'ไทยพัฒนา ทรานสปอร์ต',
  'อยุธยาขนส่ง',
  'ลพบุรีบัส',
  'ปทุมวันทรานสปอร์ต',
  'เซนทรัล ทรานส์',
  'สยามขนส่ง',
  'อีสต์เวย์',
]

export const ROUTES = [
  'บางปะอิน — โรจนะ A',
  'บางปะอิน — โรจนะ B',
  'บางปะอิน — ไฮเทค',
  'อยุธยา — สหรัตนนคร',
  'อยุธยา — บางปะหัน',
  'ลพบุรี — สนามแจง',
  'ลพบุรี — เมือง',
  'นวนคร — โรจนะ',
]

export const SHIFTS = ['เช้า (06:00–14:00)', 'บ่าย (14:00–22:00)', 'ดึก (22:00–06:00)']

export const DRIVERS = [
  { id: 'D001', name: 'สมชาย ใจดี',        idCard: '1-1011-00231-12-3', phone: '081-234-5678', factory: 'บางปะอิน', route: 'บางปะอิน — โรจนะ A',  shift: 0, status: 'active',   joined: '2018-03-12', license: 'B2', licenseExp: '2026-08-15', trainings: 12, lastHealth: '2026-04-02' },
  { id: 'D002', name: 'ประยุทธ์ ศรีสุข',   idCard: '3-1099-00012-44-1', phone: '089-112-3344', factory: 'บางปะอิน', route: 'บางปะอิน — โรจนะ B',  shift: 1, status: 'active',   joined: '2017-06-22', license: 'B2', licenseExp: '2026-06-21', trainings: 14, lastHealth: '2026-03-18' },
  { id: 'D003', name: 'อนุชา ทองคำ',       idCard: '1-2204-00045-78-2', phone: '082-444-1290', factory: 'อยุธยา',   route: 'อยุธยา — สหรัตนนคร',  shift: 0, status: 'active',   joined: '2020-01-08', license: 'B1', licenseExp: '2026-12-04', trainings: 9,  lastHealth: '2026-02-25' },
  { id: 'D004', name: 'วิชัย พิมพ์ทอง',    idCard: '1-3308-00121-09-5', phone: '086-222-7755', factory: 'ลพบุรี',   route: 'ลพบุรี — เมือง',     shift: 2, status: 'active',   joined: '2019-09-14', license: 'B2', licenseExp: '2026-07-30', trainings: 11, lastHealth: '2026-05-01' },
  { id: 'D005', name: 'นิคม แก้วใส',       idCard: '5-1011-00089-33-7', phone: '084-998-1122', factory: 'บางปะอิน', route: 'บางปะอิน — ไฮเทค',   shift: 0, status: 'active',   joined: '2016-11-02', license: 'B2', licenseExp: '2027-01-20', trainings: 18, lastHealth: '2026-04-22' },
  { id: 'D006', name: 'สุชาติ บุญมา',      idCard: '3-1099-00200-11-4', phone: '081-555-3344', factory: 'บางปะอิน', route: 'บางปะอิน — โรจนะ A',  shift: 1, status: 'active',   joined: '2021-04-19', license: 'B2', licenseExp: '2026-09-12', trainings: 7,  lastHealth: '2026-01-30' },
  { id: 'D007', name: 'พิเชษฐ์ สุวรรณ',    idCard: '1-2204-00133-66-2', phone: '087-110-9988', factory: 'อยุธยา',   route: 'อยุธยา — บางปะหัน',  shift: 2, status: 'active',   joined: '2017-08-05', license: 'B2', licenseExp: '2026-05-30', trainings: 13, lastHealth: '2026-04-15' },
  { id: 'D008', name: 'กิตติ ศรีนวล',      idCard: '1-3308-00099-22-9', phone: '085-441-2200', factory: 'ลพบุรี',   route: 'ลพบุรี — สนามแจง',   shift: 0, status: 'inactive', joined: '2015-02-28', license: 'B2', licenseExp: '2026-04-10', trainings: 21, lastHealth: '2025-12-08' },
  { id: 'D009', name: 'ธนกร แสงทอง',       idCard: '1-1011-00310-88-1', phone: '088-271-4561', factory: 'บางปะอิน', route: 'นวนคร — โรจนะ',      shift: 0, status: 'active',   joined: '2022-07-11', license: 'B1', licenseExp: '2027-03-18', trainings: 5,  lastHealth: '2026-03-04' },
  { id: 'D010', name: 'สมบูรณ์ ไทยแลนด์',  idCard: '3-1099-00077-55-3', phone: '081-882-0011', factory: 'บางปะอิน', route: 'บางปะอิน — โรจนะ B',  shift: 1, status: 'active',   joined: '2018-10-23', license: 'B2', licenseExp: '2026-11-08', trainings: 10, lastHealth: '2026-04-18' },
  { id: 'D011', name: 'สุทธิพงษ์ พุ่มพวง', idCard: '1-2204-00250-12-6', phone: '086-665-3322', factory: 'อยุธยา',   route: 'อยุธยา — สหรัตนนคร',  shift: 0, status: 'active',   joined: '2019-03-05', license: 'B2', licenseExp: '2026-06-05', trainings: 12, lastHealth: '2026-05-10' },
  { id: 'D012', name: 'บุญเลิศ จันทร์เพ็ญ', idCard: '1-3308-00188-44-8', phone: '082-119-4477', factory: 'ลพบุรี',   route: 'ลพบุรี — เมือง',     shift: 1, status: 'active',   joined: '2014-12-17', license: 'B2', licenseExp: '2026-08-22', trainings: 24, lastHealth: '2026-03-29' },
  { id: 'D013', name: 'ชัยวัฒน์ มาลัย',    idCard: '5-1011-00220-77-2', phone: '087-553-2210', factory: 'บางปะอิน', route: 'บางปะอิน — ไฮเทค',   shift: 2, status: 'active',   joined: '2020-08-04', license: 'B2', licenseExp: '2026-12-31', trainings: 8,  lastHealth: '2026-02-14' },
  { id: 'D014', name: 'เอกชัย เจริญสุข',   idCard: '3-1099-00301-29-5', phone: '089-228-7733', factory: 'บางปะอิน', route: 'บางปะอิน — โรจนะ A',  shift: 2, status: 'active',   joined: '2017-01-19', license: 'B2', licenseExp: '2027-02-12', trainings: 15, lastHealth: '2026-04-30' },
  { id: 'D015', name: 'ปริญญา ภักดี',      idCard: '1-2204-00400-33-1', phone: '084-117-2244', factory: 'อยุธยา',   route: 'อยุธยา — บางปะหัน',  shift: 1, status: 'active',   joined: '2021-09-30', license: 'B1', licenseExp: '2026-10-25', trainings: 6,  lastHealth: '2026-04-08' },
  { id: 'D016', name: 'สมพร อินทร์ทอง',    idCard: '1-3308-00250-12-3', phone: '081-336-7798', factory: 'ลพบุรี',   route: 'ลพบุรี — สนามแจง',   shift: 2, status: 'active',   joined: '2018-06-11', license: 'B2', licenseExp: '2026-09-04', trainings: 11, lastHealth: '2026-03-20' },
  { id: 'D017', name: 'ธีรพงศ์ นพรัตน์',   idCard: '1-1011-00450-78-6', phone: '086-885-0091', factory: 'บางปะอิน', route: 'นวนคร — โรจนะ',      shift: 1, status: 'active',   joined: '2022-02-22', license: 'B2', licenseExp: '2027-04-19', trainings: 4,  lastHealth: '2026-04-12' },
  { id: 'D018', name: 'วุฒิชัย สมานมิตร',  idCard: '3-1099-00128-91-2', phone: '088-002-7711', factory: 'บางปะอิน', route: 'บางปะอิน — โรจนะ B',  shift: 0, status: 'inactive', joined: '2016-04-14', license: 'B2', licenseExp: '2026-05-12', trainings: 19, lastHealth: '2025-11-22' },
  { id: 'D019', name: 'ปกรณ์ จันทรา',      idCard: '1-2204-00611-44-8', phone: '087-441-3322', factory: 'อยุธยา',   route: 'อยุธยา — สหรัตนนคร',  shift: 2, status: 'active',   joined: '2019-12-01', license: 'B2', licenseExp: '2026-07-14', trainings: 9,  lastHealth: '2026-03-11' },
  { id: 'D020', name: 'พงษ์ศักดิ์ พงษ์เพชร', idCard: '1-3308-00377-66-0', phone: '082-558-1199', factory: 'ลพบุรี', route: 'ลพบุรี — เมือง',     shift: 0, status: 'active',   joined: '2015-09-08', license: 'B2', licenseExp: '2026-08-08', trainings: 22, lastHealth: '2026-04-25' },
  { id: 'D021', name: 'อาทิตย์ เพชรพราว',  idCard: '5-1011-00488-12-9', phone: '089-441-0088', factory: 'บางปะอิน', route: 'บางปะอิน — ไฮเทค',   shift: 1, status: 'active',   joined: '2020-05-26', license: 'B2', licenseExp: '2026-11-19', trainings: 8,  lastHealth: '2026-04-04' },
  { id: 'D022', name: 'ณัฐพล กิตติคุณ',    idCard: '3-1099-00540-23-4', phone: '081-997-1122', factory: 'บางปะอิน', route: 'บางปะอิน — โรจนะ A',  shift: 0, status: 'active',   joined: '2017-11-30', license: 'B2', licenseExp: '2027-01-05', trainings: 13, lastHealth: '2026-04-17' },
  { id: 'D023', name: 'ศุภชัย ดวงแก้ว',    idCard: '1-2204-00712-15-7', phone: '086-554-9988', factory: 'อยุธยา',   route: 'อยุธยา — บางปะหัน',  shift: 0, status: 'active',   joined: '2021-07-07', license: 'B1', licenseExp: '2026-06-15', trainings: 6,  lastHealth: '2026-02-28' },
  { id: 'D024', name: 'ภราดร แสนสุข',      idCard: '1-3308-00422-87-1', phone: '085-118-2233', factory: 'ลพบุรี',   route: 'ลพบุรี — สนามแจง',   shift: 1, status: 'active',   joined: '2018-08-21', license: 'B2', licenseExp: '2026-10-09', trainings: 10, lastHealth: '2026-03-25' },
  { id: 'D025', name: 'ไพศาล ทองสกุล',     idCard: '1-1011-00599-22-3', phone: '088-220-9911', factory: 'บางปะอิน', route: 'นวนคร — โรจนะ',      shift: 2, status: 'active',   joined: '2016-03-18', license: 'B2', licenseExp: '2026-12-12', trainings: 17, lastHealth: '2026-04-09' },
  { id: 'D026', name: 'เกียรติศักดิ์ สีดา', idCard: '3-1099-00622-91-5', phone: '081-440-2233', factory: 'บางปะอิน', route: 'บางปะอิน — โรจนะ B',  shift: 2, status: 'active',   joined: '2019-02-13', license: 'B2', licenseExp: '2027-03-30', trainings: 11, lastHealth: '2026-04-21' },
  { id: 'D027', name: 'ฤทธิเดช วิเศษ',     idCard: '1-2204-00855-44-2', phone: '087-330-0099', factory: 'อยุธยา',   route: 'อยุธยา — สหรัตนนคร',  shift: 1, status: 'active',   joined: '2022-10-04', license: 'B1', licenseExp: '2026-09-28', trainings: 3,  lastHealth: '2026-04-26' },
  { id: 'D028', name: 'วันชัย สุขใจ',      idCard: '1-3308-00514-77-8', phone: '082-227-4488', factory: 'ลพบุรี',   route: 'ลพบุรี — เมือง',     shift: 0, status: 'active',   joined: '2015-06-25', license: 'B2', licenseExp: '2026-06-30', trainings: 20, lastHealth: '2026-03-08' },
  { id: 'D029', name: 'ภานุพงศ์ ธีระวัฒน์', idCard: '5-1011-00710-12-6', phone: '089-885-1100', factory: 'บางปะอิน', route: 'บางปะอิน — ไฮเทค',  shift: 0, status: 'active',   joined: '2020-12-09', license: 'B2', licenseExp: '2027-02-22', trainings: 7,  lastHealth: '2026-04-13' },
  { id: 'D030', name: 'วรากร สุขเสมอ',     idCard: '3-1099-00777-33-9', phone: '086-119-5544', factory: 'บางปะอิน', route: 'บางปะอิน — โรจนะ A',  shift: 1, status: 'active',   joined: '2018-04-30', license: 'B2', licenseExp: '2026-07-22', trainings: 12, lastHealth: '2026-04-19' },
]

function makeBuses() {
  const buses = []
  const brands = ['Hino', 'Isuzu', 'Mitsubishi Fuso', 'Volvo', 'Sunlong']
  const fanBrands = ['Hino', 'Isuzu', 'Mitsubishi Fuso']
  for (let i = 0; i < 68; i++) {
    const plateNum = (1000 + i * 7 + 234).toString().slice(0, 4)
    const prefix = ['40', '41', '30', '31'][i % 4]
    const suffix = ['อย', 'ปท', 'ลบ', 'นบ'][i % 4]
    const factory = FACTORIES[i % 3]
    const brand = brands[i % brands.length]
    const driver = DRIVERS[i % DRIVERS.length]
    const status = i % 17 === 0 ? 'maintenance' : i === 50 ? 'retired' : 'active'
    const currentKm = 80000 + ((i * 4133) % 220000)
    const nextServiceKm = currentKm + (10000 - ((i * 137) % 9800))
    const lastService = ['2026-04-15','2026-04-22','2026-05-02','2026-04-08','2026-05-10','2026-03-28','2026-05-15'][i % 7]
    buses.push({
      id: `B${(i + 1).toString().padStart(3, '0')}`,
      plate: `${prefix}-${plateNum} ${suffix}`,
      type: 'air',
      brand,
      model: `${brand} ${['RK1J','NPR','Rosa','9700','SLK6126'][i % 5]}`,
      year: 2014 + (i % 11),
      factory,
      driverId: driver.id,
      driver: driver.name,
      status,
      currentKm,
      lastService,
      nextServiceKm,
      seats: 45 + (i % 3) * 5,
      insuranceExp: ['2026-08-20','2027-01-15','2026-06-10','2026-11-05','2026-07-30'][i % 5],
      taxExp: ['2026-09-10','2027-02-22','2026-05-18','2026-12-30','2026-08-08'][i % 5],
    })
  }
  for (let i = 0; i < 20; i++) {
    const plateNum = (3000 + i * 11 + 119).toString().slice(0, 4)
    const prefix = ['10','11','20'][i % 3]
    const suffix = ['อย', 'ลบ', 'ปท'][i % 3]
    const factory = FACTORIES[i % 3]
    const brand = fanBrands[i % fanBrands.length]
    const driver = DRIVERS[(i + 5) % DRIVERS.length]
    const status = i % 9 === 0 ? 'maintenance' : 'active'
    const currentKm = 120000 + ((i * 3221) % 180000)
    const nextServiceKm = currentKm + (8000 - ((i * 97) % 7500))
    buses.push({
      id: `F${(i + 1).toString().padStart(3, '0')}`,
      plate: `${prefix}-${plateNum} ${suffix}`,
      type: 'fan',
      brand,
      model: `${brand} ${['FE','NQR','Rosa Standard'][i % 3]}`,
      year: 2010 + (i % 12),
      factory,
      driverId: driver.id,
      driver: driver.name,
      status,
      currentKm,
      lastService: ['2026-03-18','2026-04-10','2026-04-29','2026-05-08'][i % 4],
      nextServiceKm,
      seats: 32 + (i % 2) * 4,
      insuranceExp: ['2026-07-12','2026-10-04','2026-05-28','2026-09-19'][i % 4],
      taxExp: ['2026-08-22','2027-01-08','2026-06-04','2026-11-17'][i % 4],
    })
  }
  return buses
}

export const BUSES = makeBuses()

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
  { id: 1, type: 'insurance', who: '30-1471 อย', days: 4,  exp: '2026-05-30', label: 'ประกันภัย หมดอายุ' },
  { id: 2, type: 'license',   who: 'ประยุทธ์ ศรีสุข', days: 11, exp: '2026-06-06', label: 'ใบขับขี่ B2 หมดอายุ' },
  { id: 3, type: 'tax',       who: '40-1234 อย', days: 16, exp: '2026-06-11', label: 'ภาษีรถ หมดอายุ' },
  { id: 4, type: 'training',  who: 'ศุภชัย ดวงแก้ว', days: 22, exp: '2026-06-17', label: 'อบรมขับขี่ปลอดภัย หมดอายุ' },
  { id: 5, type: 'insurance', who: '31-1318 ลบ', days: 27, exp: '2026-06-22', label: 'ประกันภัย หมดอายุ' },
]

export const ACTIVITY = [
  { id: 1, who: 'พรทิพย์ น.',     action: 'บันทึกค่าซ่อม',       target: '40-1234 อย',  when: '12 นาทีที่แล้ว', kind: 'maintenance' },
  { id: 2, who: 'สมหญิง พ.',     action: 'เพิ่มพนักงานขับรถใหม่', target: 'ปริญญา ภักดี', when: '1 ชั่วโมงที่แล้ว', kind: 'driver' },
  { id: 3, who: 'ระบบ ATG',        action: 'บันทึกเติมน้ำมัน 78 ลิตร', target: '30-1471 อย', when: '2 ชั่วโมงที่แล้ว', kind: 'fuel' },
  { id: 4, who: 'ธนพล ส.',       action: 'อัปเดตประกันภัย',    target: '41-1521 ปท',  when: '3 ชั่วโมงที่แล้ว', kind: 'license' },
  { id: 5, who: 'วราภรณ์ ก.',    action: 'บันทึกเรื่องร้องเรียน',  target: 'เส้นทาง โรจนะ B', when: 'เมื่อวานนี้', kind: 'complaint' },
  { id: 6, who: 'พรทิพย์ น.',     action: 'ปิดงานบำรุงรักษา',    target: '31-1318 ลบ',  when: 'เมื่อวานนี้', kind: 'maintenance' },
]

export const NOTIFS = [
  { id: 1, kind: 'maintenance', icon: 'wrench', msg: 'ครบกำหนดบำรุงรักษา 40-1234 อย',   when: '5 นาทีที่แล้ว', unread: true },
  { id: 2, kind: 'license',     icon: 'id',    msg: 'ใบขับขี่ ประยุทธ์ ศรีสุข ใกล้หมดอายุ', when: '1 ชั่วโมงที่แล้ว', unread: true },
  { id: 3, kind: 'training',    icon: 'cap',   msg: 'อบรม ศุภชัย ดวงแก้ว หมดอายุใน 22 วัน', when: '3 ชั่วโมงที่แล้ว', unread: true },
  { id: 4, kind: 'complaint',   icon: 'alert', msg: 'เรื่องร้องเรียนใหม่: คนขับขับเร็วเกิน',  when: 'เมื่อวานนี้', unread: false },
  { id: 5, kind: 'license',     icon: 'id',    msg: 'ประกันภัย 30-1471 อย ใกล้หมดอายุ',  when: '2 วันที่แล้ว', unread: false },
]

export const COMPLAINTS_OPEN = 7
export const LICENSES_EXPIRING_30D = 9
export const MAINTENANCE_NOW = BUSES.filter(b => b.status === 'maintenance').length
export const BUSES_ACTIVE = BUSES.filter(b => b.status === 'active').length
export const COST_THIS_MONTH = 2_930_000

export function formatBaht(n) {
  return '฿' + n.toLocaleString('en-US')
}
export function formatNumber(n) {
  return n.toLocaleString('en-US')
}
export function bahtCompact(n) {
  if (n >= 1_000_000) return '฿' + (n / 1_000_000).toFixed(2) + 'M'
  if (n >= 1_000) return '฿' + (n / 1_000).toFixed(1) + 'K'
  return '฿' + n
}
export function initials(name) {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

export const MOCK_USERS = [
  { id: 1, name: 'พรทิพย์ นิลสมัย',   email: 'admin@bms.co.th',      role: 'admin',     lastLogin: '2026-05-26 14:31', status: 'active' },
  { id: 2, name: 'สมหญิง พรวิไล',    email: 'ops@bms.co.th',        role: 'operation', lastLogin: '2026-05-26 08:12', status: 'active' },
  { id: 3, name: 'ธนพล สุขประเสริฐ', email: 'thanapol@bms.co.th',   role: 'operation', lastLogin: '2026-05-25 17:44', status: 'active' },
  { id: 4, name: 'วราภรณ์ กิตติพงษ์', email: 'waraporn@bms.co.th',   role: 'operation', lastLogin: '2026-05-24 09:05', status: 'active' },
  { id: 5, name: 'อรอุมา ทองดี',      email: 'orauma@bms.co.th',     role: 'operation', lastLogin: '2026-05-20 11:30', status: 'inactive' },
]
