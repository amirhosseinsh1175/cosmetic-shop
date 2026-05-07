import axios from 'axios'
import { useEffect, useState } from 'react'

export default function AdminOrders(){
  const [orders, setOrders] = useState<any[]>([])

  useEffect(()=>{ load() }, [])
  async function load(){
    const r = await axios.get('/api/admin/orders')
    setOrders(r.data)
  }

  async function updateStatus(id:number, status:string){
    await axios.put('/api/admin/orders',{ id, status })
    load()
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">سفارشات</h1>
      <div className="bg-white p-4 rounded shadow">
        {orders.length===0 ? <div>سفارشی موجود نیست.</div> : (
          <div className="space-y-3">
            {orders.map(o=> (
              <div key={o.id} className="p-3 border rounded flex items-center justify-between">
                <div>
                  <div className="font-semibold">سفارش #{o.id}</div>
                  <div className="text-sm text-gray-500">مقدار: {o.amount} — تاریخ: {new Date(o.createdAt).toLocaleString()}</div>
                </div>
                <div className="flex items-center gap-2">
                  <select value={o.status} onChange={e=>updateStatus(o.id, e.target.value)} className="border rounded px-2 py-1">
                    <option value="pending">در انتظار</option>
                    <option value="processing">در حال پردازش</option>
                    <option value="shipped">ارسال شده</option>
                    <option value="delivered">تحویل شده</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4">
        <a className="text-sm text-pink-600" href="/api/admin/export/orders">صادر کردن CSV سفارشات</a>
      </div>
    </main>
  )
}
