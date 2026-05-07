import { useRouter } from 'next/router'
import axios from 'axios'
import { useEffect, useState } from 'react'

export default function ProductPage(){
  const router = useRouter()
  const { id } = router.query
  const [product, setProduct] = useState<any>(null)

  useEffect(() => {
    if(!id) return
    axios.get(`/api/products/${id}`).then(r => setProduct(r.data))
  }, [id])

  if(!product) return <div className="p-8">در حال بارگذاری...</div>

  return (
    <main className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-lg shadow-md overflow-hidden">
        <img src={product.image} className="w-full h-96 object-cover" />
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold text-pink-600">{product.price} تومان</span>
            <button className="bg-pink-500 text-white px-4 py-2 rounded">افزودن به سبد خرید</button>
          </div>

          <section className="mt-6">
            <h3 className="font-semibold mb-2">دستیار هوش مصنوعی</h3>
            <div className="p-4 bg-gray-50 rounded">
              <p>برای توضیحات بیشتر یا پیشنهاد، از دکمه زیر استفاده کنید.</p>
              <button className="mt-3 bg-indigo-600 text-white px-3 py-1 rounded" onClick={async ()=>{
                const r = await axios.post('/api/ai',{prompt: `معرفی و پیشنهاد برای ${product.title}`})
                alert(r.data.reply)
              }}>پرسش از دستیار</button>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
