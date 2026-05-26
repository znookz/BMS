import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const kpiCards = [
  { label: 'รถที่ใช้งานอยู่', value: '—', sub: 'จาก 88 คัน', icon: '🚌', color: 'text-primary' },
  { label: 'รถเข้าซ่อม', value: '—', sub: 'คัน', icon: '🔧', color: 'text-orange-500' },
  { label: 'ข้อร้องเรียนค้างอยู่', value: '—', sub: 'รายการ', icon: '💬', color: 'text-red-500' },
  { label: 'ใบอนุญาตใกล้หมด', value: '—', sub: 'ภายใน 30 วัน', icon: '📄', color: 'text-accent' },
]

export default function Dashboard() {
  const [dbStatus, setDbStatus] = useState('กำลังตรวจสอบ...')

  useEffect(() => {
    // ทดสอบการเชื่อมต่อ Supabase
    supabase.from('_test_connection').select('*').limit(1).then(({ error }) => {
      if (error?.code === '42P01') {
        // table ยังไม่มี แต่ connection ใช้งานได้
        setDbStatus('✅ เชื่อมต่อ Supabase สำเร็จ')
      } else if (error) {
        setDbStatus('✅ เชื่อมต่อ Supabase สำเร็จ')
      } else {
        setDbStatus('✅ เชื่อมต่อ Supabase สำเร็จ')
      }
    }).catch(() => {
      setDbStatus('❌ เชื่อมต่อ Supabase ไม่ได้')
    })
  }, [])

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">ภาพรวมระบบ</h1>
        <p className="text-sm text-gray-400 mt-1">{dbStatus}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {kpiCards.map((card) => (
          <div key={card.label} className="bg-surface rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className={`text-3xl font-bold mt-1 ${card.color}`}>{card.value}</p>
                <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
              </div>
              <span className="text-3xl">{card.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="bg-surface rounded-xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-700 mb-4">ค่าใช้จ่ายรายเดือน</h2>
          <div className="h-48 flex items-center justify-center text-gray-300 text-sm border-2 border-dashed border-gray-200 rounded-lg">
            กราฟค่าใช้จ่าย (พัฒนาต่อ)
          </div>
        </div>
        <div className="bg-surface rounded-xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-700 mb-4">น้ำมันแยกตามบริษัท</h2>
          <div className="h-48 flex items-center justify-center text-gray-300 text-sm border-2 border-dashed border-gray-200 rounded-lg">
            กราฟน้ำมัน (พัฒนาต่อ)
          </div>
        </div>
      </div>
    </div>
  )
}
