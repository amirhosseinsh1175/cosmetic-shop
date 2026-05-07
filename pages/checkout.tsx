import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

export default function CheckoutPage(){
  const [cart, setCart] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [addressId, setAddressId] = useState<number | null>(null)
  const [addresses, setAddresses] = useState<any[]>([])
  const router = useRouter()

  useEffect(()=>{
    const c = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('cart') || '[]') : []
    setCart(c)
    if(c.length === 0){ setLoading(false); return }
    ;(async ()=>{
      const pArr = []
      for(const it of c){
        const r = await axios.get(`/api/products/${it.productId}`)
        pArr.push({ product: r.data, quantity: it.quantity || 1, variant: it.variant || null })
      }
      setProducts(pArr)
      setLoading(false)
    })()

    axios.get('/api/user/addresses').then(r=>setAddresses(r.data)).catch(()=>{})
  }, [])

  const pay = async ()=>{
    try{
      const items = cart.map(i=> ({ productId: i.productId, quantity: i.quantity || 1, variant: i.variant || null }))
      const r = await axios.post('/api/checkout/create-session', { items, addressId })
      if(r.data?.url) window.location.href = r.data.url
    }catch(err:any){
      alert(err?.response?.data?.error || 'خطا در ایجاد جلسه پرداخت')
    }
  }

  if(loading) return <div className="p-6">در حال بارگذاری...</div>
  if(products.length===0) return <div className="p-6">سبد خرید خالی است.</div>

  const total = products.reduce((s, it)=> s + (it.variant ? it.variant.price : it.product.price) * it.quantity, 0)

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">تسویه‌حساب</h1>
      <div className="bg-white p-4 rounded shadow">
        <div className="space-y-3">
          {products.map((p,idx)=> (
            <div key={idx} className="flex items-center gap-4">
              <img src={(p.product.images && p.product.images[0]) || '/uploads/logo.png'} className="w-24 h-24 object-cover rounded" />
              <div className="flex-1">
                <div className="font-semibold">{p.product.title}</div>
                <div className="text-sm text-gray-500">تعداد: {p.quantity}</div>
              </div>
              <div className="font-semibold">{p.variant ? p.variant.price : p.product.price} تومان</div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <label className="block text-sm mb-1">انتخاب آدرس</label>
          <select className="w-full border rounded px-3 py-2" value={addressId || ''} onChange={e=>setAddressId(Number(e.target.value))}>
            <option value="">انتخاب آدرس</option>
            {addresses.map((a:any)=> (<option key={a.id} value={a.id}>{a.title || 'بدون عنوان'} — {a.fullname}</option>))}
          </select>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="font-semibold">مجموع: {total} تومان</div>
          <button className="bg-pink-600 text-white px-4 py-2 rounded" onClick={pay}>پرداخت (حالت تست)</button>
        </div>
      </div>
    </main>
  )
}
