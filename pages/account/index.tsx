import { useEffect, useState } from 'react'
import axios from 'axios'

export default function AccountIndex(){
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')

  useEffect(()=>{
    axios.get('/api/auth/me').then(r=>{ setUser(r.data.user); setName(r.data.user.name || ''); setLoading(false) }).catch(()=>{ setLoading(false) })
  }, [])

  const save = async ()=>{
    try{
      await axios.put('/api/user/profile',{ name, password })
      alert('ذخیره شد')
    }catch(err:any){ alert(err?.response?.data?.error || 'خطا') }
  }

  if(loading) return <div className="p-6">در حال بارگذاری...</div>
  if(!user) return <div className="p-6">ابتدا وارد شوید.</div>

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">حساب کاربری</h1>
      <div className="bg-white p-4 rounded shadow space-y-4">
        <div>
          <label className="block text-sm mb-1">ایمیل</label>
          <div className="p-2 bg-gray-50 rounded">{user.email}</div>
        </div>
        <div>
          <label className="block text-sm mb-1">نام</label>
          <input className="w-full border rounded px-3 py-2" value={name} onChange={e=>setName(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm mb-1">تغییر رمز (اختیاری)</label>
          <input type="password" className="w-full border rounded px-3 py-2" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        <div>
          <button className="bg-pink-600 text-white px-4 py-2 rounded" onClick={save}>ذخیره تغییرات</button>
        </div>
        <div>
          <a href="/account/addresses" className="text-pink-600">مدیریت آدرس‌ها</a>
        </div>
        <div>
          <a href="/account/orders" className="text-pink-600">تاریخچه سفارش‌ها</a>
        </div>
      </div>
    </main>
  )
}
