import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

export default function AdminIndex(){
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(()=>{
    axios.get('/api/auth/me').then(r=>{ setUser(r.data.user); setLoading(false) }).catch(()=>{ router.push('/auth/login') })
  }, [])

  if(loading) return <div className="p-8">در حال بررسی دسترسی...</div>

  return (
    <main className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">داشبورد مدیریت</h1>
        <div className="text-sm text-gray-600">خوش آمدید، {user?.user?.email}</div>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">محصولات</h3>
          <p>مشاهده، ویرایش و ایجاد محصولات (CRUD) — در حال حاضر لینک‌ها نمونه‌اند.</p>
          <a className="text-pink-600" href="/admin/products">مدیریت محصولات</a>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">سفارشات</h3>
          <p>مشاهده سفارشات ثبت‌شده و تغییر وضعیت آنها.</p>
          <a className="text-pink-600" href="/admin/orders">مشاهده سفارشات</a>
        </div>
      </section>
    </main>
  )
}
