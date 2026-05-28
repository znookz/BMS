import Icon from '../components/Icon'

const stubs = {
  cost: {
    title: 'การควบคุมค่าใช้จ่าย',
    icon: 'coin',
    items: ['ตาราง date range picker เลือกช่วงเดือน/ปี', 'กราฟ stacked bar/donut แยกประเภทค่าใช้จ่าย', 'ตารางรายการค่าใช้จ่ายรายวัน', 'ยอดรวมค่าใช้จ่ายแยก air/fan', 'Export Excel / PDF'],
  },
  fuel: {
    title: 'การเติมน้ำมัน (ATG)',
    icon: 'fuel',
    items: ['การ์ด KPI วันนี้: ลิตรรวม, ค่าใช้จ่ายรวม', 'ตารางรายวันแยกบริษัท (7 บริษัท)', 'กราฟ bar แยกบริษัท', 'ตัวบ่งชี้ LIVE auto-refresh ทุก 5 นาที', 'เชื่อมต่อระบบ ATG จริงในอนาคต'],
  },
  training: {
    title: 'การอบรม',
    icon: 'cap',
    items: ['ทะเบียนหลักสูตรอบรม', 'ประวัติการอบรมรายบุคคล', 'การแจ้งเตือนหมดอายุใบรับรอง 30 วัน', 'รายงานสถิติการอบรม', 'Export รายงาน'],
  },
  license: {
    title: 'ใบขับขี่ & ประกันภัย',
    icon: 'id',
    items: ['ตารางใบขับขี่/ประกัน/ภาษีรถ พร้อม badge สีตามสถานะ', 'คอลัมน์วันคงเหลือ: เขียว(>30วัน) / ส้ม(≤30วัน) / แดง(หมดอายุ)', 'บันทึกการเคลมประกัน', 'แนบไฟล์/รูปภาพ', 'Export รายงาน'],
  },
  complaint: {
    title: 'เรื่องร้องเรียน',
    icon: 'chat',
    items: ['ตารางเรื่องร้องเรียนพร้อมวันที่', 'ติดตามสถานะ: เปิด / กำลังดำเนินการ / ปิด', 'แจ้งเตือนอัตโนมัติเมื่อค้างเกิน 7 วัน', 'บันทึกการแก้ไขและผลลัพธ์', 'กราฟแนวโน้มรายเดือน'],
  },
  safety: {
    title: 'มาตรการความปลอดภัย',
    icon: 'shield',
    items: ['รายการตรวจสภาพรถก่อนออกเดินทาง (Pre-trip checklist)', 'บันทึกการวัดแอลกอฮอล์ (Breathalyzer log)', 'รายงาน Near-miss', 'การละเมิดความเร็ว (ข้อมูล Mock)', 'สถิติความปลอดภัยประจำเดือน'],
  },
  purchase: {
    title: 'การจัดซื้อ',
    icon: 'cart',
    items: ['คำสั่งซื้ออุปกรณ์สำหรับรถปรับอากาศ', 'คำสั่งซื้ออุปกรณ์สถานีเติมน้ำมัน', 'สถานะการสั่งซื้อ: รอดำเนินการ / ได้รับแล้ว', 'ประวัติการจัดซื้อ', 'Export รายงาน'],
  },
}

export default function StubPage({ page }) {
  const info = stubs[page] || { title: 'หน้านี้', icon: 'settings', items: [] }
  return (
    <div>
      <div className="page-header">
        <div>
          <h2>{info.title}</h2>
          <div className="sub">โมดูลนี้อยู่ระหว่างการพัฒนา</div>
        </div>
        <div className="flex gap-8">
          <button className="btn"><Icon name="download" size={15} /> Export</button>
          <button className="btn btn-primary"><Icon name="plus" size={15} /> เพิ่มรายการ</button>
        </div>
      </div>

      <div className="placeholder-page">
        <Icon name={info.icon} size={32} style={{ color: 'var(--text-faint)', marginBottom: 12 }} />
        <h3>{info.title}</h3>
        <p>โมดูลนี้กำลังพัฒนา — โครงสร้างและองค์ประกอบหลักของระบบ</p>
        {info.items.length > 0 && (
          <div className="placeholder-list">
            {info.items.map((item, i) => <div className="pl-item" key={i}>• {item}</div>)}
          </div>
        )}
      </div>
    </div>
  )
}
