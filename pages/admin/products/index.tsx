import Link from 'next/link'
import axios from 'axios'
import { useEffect, useState } from 'react'

export default function AdminProducts(){
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    axios.get('/api/admin/products').then(r=>{ setItems(r.data); setLoading(false) }).catch(()=>{ setLoading(false) })
  }, [])

  return (
    <main className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">مدیریت محصولات</h1>
        <Link href="/admin/products/new"><a className="bg-green-600 text-white px-3 py-2 rounded">محصول جدید</a></Link>
      </div>

      {loading ? <div>در حال بارگذاری...</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map(it=> (
            <div key={it.id} className="bg-white p-4 rounded shadow flex items-center gap-4">
              <img src={(it.images && it.images[0]) || '/uploads/logo.png'} className="w-24 h-24 object-cover rounded" />
              <div className="flex-1">
                <div className="font-semibold">{it.title}</div>
                <div className="text-sm text-gray-500">{it.brand} — {it.category}</div>
                <div className="text-pink-600 font-bold">{it.price} تومان</div>
              </div>
              <div className="flex flex-col gap-2">
                <Link href={`/admin/products/${it.id}`}><a className="text-sm text-blue-600">ویرایش</a></Link>
                <button className="text-sm text-red-600" onClick={async ()=>{
                  if(!confirm('آیا می‌خواهید حذف کنید؟')) return
                  await axios.delete(`/api/products/${it.id}`)
                  setItems(items.filter(i=>i.id!==it.id))
                }}>حذف</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
