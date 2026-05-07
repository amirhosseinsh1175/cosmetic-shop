import axios from 'axios'
import { useEffect, useState } from 'react'

export default function Cart(){
  const [items, setItems] = useState<any[]>([])

  useEffect(()=>{
    const cart = localStorage.getItem('cart')
    setItems(cart ? JSON.parse(cart) : [])
  }, [])

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">سبد خرید</h1>
      {items.length===0 ? <p>سبد خرید شما خالی است.</p> : (
        <div className="space-y-4">
          {items.map((it,idx)=>(
            <div key={idx} className="flex items-center gap-4 bg-white p-4 rounded shadow">
              <img src={it.image} className="w-20 h-20 object-cover rounded" />
              <div className="flex-1">
                <div className="font-semibold">{it.title}</div>
                <div className="text-pink-600">{it.price} تومان</div>
              </div>
              <div>{it.quantity} عدد</div>
            </div>
          ))}
          <button className="bg-green-600 text-white px-4 py-2 rounded">ادامه به پرداخت (شبیه‌سازی)</button>
        </div>
      )}
    </main>
  )
}
