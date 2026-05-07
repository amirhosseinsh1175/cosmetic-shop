import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

export default function OrderDetail(){
  const router = useRouter()
  const { id } = router.query
  const [order, setOrder] = useState<any>(null)

  useEffect(()=>{ if(!id) return; axios.get(`/api/admin/orders/${id}`).then(r=>setOrder(r.data)).catch(()=>{}) }, [id])

  if(!order) return <div className="p-6">در حال بارگذاری...</div>

  const items = JSON.parse(order.items || '[]')

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">جزئیات سفارش #{order.id}</h1>
      <div className="bg-white p-4 rounded shadow">
        <div className="mb-3">وضعیت: <strong>{order.status}</strong></div>
        <div className="mb-3">مقدار: {order.amount} تومان</div>
        <div className="mb-3">تاریخ: {new Date(order.createdAt).toLocaleString()}</div>

        <h3 className="mt-4 font-semibold">آیتم‌ها</h3>
        {items.length===0 ? <div>آیتمی یافت نشد.</div> : (
          <div className="space-y-2">
            {items.map((it:any,idx:number)=>(
              <div key={idx} className="p-2 border rounded flex items-center gap-3">
                <img src={it.image} className="w-16 h-16 object-cover rounded" />
                <div className="flex-1">
                  <div className="font-semibold">{it.title}</div>
                  <div className="text-sm text-gray-500">تعداد: {it.quantity}</div>
                </div>
                <div className="font-semibold">{it.price} تومان</div>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  )
}
