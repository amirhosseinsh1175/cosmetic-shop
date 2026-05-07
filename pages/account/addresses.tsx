import { useEffect, useState } from 'react'
import axios from 'axios'

export default function AccountAddresses(){
  const [addresses, setAddresses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ title: '', fullname: '', phone: '', postalCode: '', address: '' })

  useEffect(()=>{ load() }, [])
  async function load(){
    try{
      const r = await axios.get('/api/user/addresses')
      setAddresses(r.data)
    }catch(e){}
    setLoading(false)
  }

  async function add(){
    const { fullname, phone, address } = form
    if(!fullname || !phone || !address) return alert('پر کردن فیلدهای ضروری لازم است')
    await axios.post('/api/user/addresses', form)
    setForm({ title: '', fullname: '', phone: '', postalCode: '', address: '' })
    load()
  }

  async function remove(id:number){
    if(!confirm('آیا حذف شود؟')) return
    await axios.delete(`/api/user/addresses/${id}`)
    load()
  }

  if(loading) return <div className="p-6">در حال بارگذاری...</div>

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">آدرس‌ها</h1>
      <div className="bg-white p-4 rounded shadow space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <input placeholder="عنوان" className="border rounded px-2 py-1" value={form.title} onChange={e=>setForm({...form, title: e.target.value})} />
          <input placeholder="نام و نام خانوادگی" className="border rounded px-2 py-1" value={form.fullname} onChange={e=>setForm({...form, fullname: e.target.value})} />
          <input placeholder="تلفن" className="border rounded px-2 py-1" value={form.phone} onChange={e=>setForm({...form, phone: e.target.value})} />
          <input placeholder="کد پستی" className="border rounded px-2 py-1" value={form.postalCode} onChange={e=>setForm({...form, postalCode: e.target.value})} />
          <textarea placeholder="آدرس" className="col-span-2 border rounded px-2 py-1" value={form.address} onChange={e=>setForm({...form, address: e.target.value})} />
        </div>
        <div>
          <button className="bg-green-600 text-white px-3 py-2 rounded" onClick={add}>افزودن آدرس</button>
        </div>

        <div>
          {addresses.map(a=> (
            <div key={a.id} className="p-3 border rounded mb-2 flex items-center justify-between">
              <div>
                <div className="font-semibold">{a.title || 'بدون عنوان'}</div>
                <div className="text-sm text-gray-500">{a.fullname} — {a.phone}</div>
                <div className="text-sm">{a.address}</div>
              </div>
              <div>
                <button className="text-red-600 text-sm" onClick={()=>remove(a.id)}>حذف</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
