import { useEffect, useState } from 'react'
import axios from 'axios'

export default function AccountOrders(){
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{ load() }, [])
  async function load(){
    try{
      const r = await axios.get('/api/user/orders')
      setOrders(r.data)
    }catch(e){}
    setLoading(false)
  }

  if(loading) return <div className="p-6">در حال بارگذاری...</div>

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">تاریخچه سفارش‌ها</h1>
      <div className="bg-white p-4 rounded shadow">
        {orders.length===0 ? <div>سفارشی یافت نشد.</div> : (
          <div className="space-y-3">
            {orders.map(o=> (
              <div key={o.id} className="p-3 border rounded flex items-center justify-between">
                <div>
                  <div className="font-semibold">سفارش #{o.id}</div>
                  <div className="text-sm text-gray-500">مقدار: {o.amount} — تاریخ: {new Date(o.createdAt).toLocaleString()}</div>
                </div>
                <div className="flex items-center gap-2">
                  <a className="text-pink-600" href={`/admin/orders/${o.id}`}>جزئیات</a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
