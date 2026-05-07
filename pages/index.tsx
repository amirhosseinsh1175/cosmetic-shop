import Head from 'next/head'
import Header from '../components/Header'
import Loading from '../components/Loading'
import axios from 'axios'
import { useEffect, useState } from 'react'

export default function Home() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/products').then(r => { setProducts(r.data); setLoading(false) })
  }, [])

  return (
    <>
      <Head>
        <title>فروشگاه لوازم آرایشی</title>
      </Head>
      <Header />
      {loading ? <Loading /> : (
        <main className="max-w-6xl mx-auto px-4 py-8">
          <section className="mb-8">
            <h1 className="text-3xl font-bold mb-4">فروشگاه لوازم آرایشی</h1>
            <p className="text-gray-600">محصولات منتخب و پیشنهادی ما را ببینید.</p>
          </section>

          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map(p => (
              <a key={p.id} href={`/products/${p.id}`} className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
                <img src={p.image} alt={p.title} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="font-semibold">{p.title}</h3>
                  <p className="text-sm text-gray-500 mt-2">{p.excerpt}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-lg font-bold text-pink-600">{p.price} تومان</span>
                    <button className="bg-pink-500 text-white px-3 py-1 rounded">افزودن به سبد</button>
                  </div>
                </div>
              </a>
            ))}
          </section>
        </main>
      )}
    </>
  )
}
