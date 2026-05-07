import Link from 'next/link'
import axios from 'axios'
import { useEffect, useState } from 'react'

export default function AdminBrands(){
  const [items, setItems] = useState<any[]>([])
  const [name, setName] = useState('')

  useEffect(()=>{ load() }, [])
  async function load(){
    const r = await axios.get('/api/admin/brands')
    setItems(r.data)
  }

  async function add(){
    if(!name) return
    const r = await axios.post('/api/admin/brands',{ name })
    setItems([...items, r.data])
    setName('')
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">مدیریت برندها</h1>
      <div className="bg-white p-4 rounded shadow space-y-4">
        <div className="flex gap-3">
          <input placeholder="نام برند" className="flex-1 border rounded px-3 py-2" value={name} onChange={e=>setName(e.target.value)} />
          <button className="bg-green-600 text-white px-3 py-2 rounded" onClick={add}>افزودن</button>
        </div>

        <div>
          {items.map(it=> (
            <div key={it.id} className="py-2 border-b last:border-b-0">{it.name}</div>
          ))}
        </div>
      </div>
    </main>
  )
}
