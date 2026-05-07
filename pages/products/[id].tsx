import Head from 'next/head'
import Header from '../../components/Header'
import ProductGallery from '../../components/ProductGallery'
import RatingStars from '../../components/RatingStars'
import axios from 'axios'
import { useEffect, useState } from 'react'

export default function ProductPage(){
  const [product, setProduct] = useState<any>(null)
  const [tab, setTab] = useState<'desc'|'spec'|'reviews'>('desc')

  useEffect(()=>{
    const id = window.location.pathname.split('/').pop()
    if(!id) return
    axios.get(`/api/products/${id}`).then(r => setProduct(r.data))
  }, [])

  if(!product) return <div className="p-8">در حال بارگذاری...</div>

  return (
    <>
      <Head>
        <title>{product.title} — فروشگاه آرایشی</title>
      </Head>
      <Header />
      <main className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded shadow p-4">
            <ProductGallery images={product.images || []} />
            <div className="mt-4">
              <h1 className="text-2xl font-bold">{product.title}</h1>
              <div className="flex items-center gap-4 mt-2">
                <RatingStars value={product.rating || 0} count={product.ratingCount || 0} />
                <div className="text-sm text-gray-500">برند: {product.brand || '-'}</div>
              </div>

              <div className="mt-6 border-t pt-4">
                <div className="flex gap-3">
                  <button className={`px-4 py-2 ${tab==='desc' ? 'bg-pink-600 text-white' : 'bg-gray-100'}`} onClick={()=>setTab('desc')}>توضیحات</button>
                  <button className={`px-4 py-2 ${tab==='spec' ? 'bg-pink-600 text-white' : 'bg-gray-100'}`} onClick={()=>setTab('spec')}>مشخصات</button>
                  <button className={`px-4 py-2 ${tab==='reviews' ? 'bg-pink-600 text-white' : 'bg-gray-100'}`} onClick={()=>setTab('reviews')}>نظرات</button>
                </div>

                <div className="mt-4">
                  {tab==='desc' && <div className="text-gray-700">{product.description}</div>}
                  {tab==='spec' && <div className="text-gray-700">دسته: {product.category || '-'}<br/>موجودی: {product.stock}</div>}
                  {tab==='reviews' && <div className="text-gray-700">فعلاً نظری ثبت نشده است.</div>}
                </div>
              </div>
            </div>
          </div>

          <aside className="bg-white rounded shadow p-4">
            <div className="text-pink-600 text-2xl font-bold">{product.price} تومان</div>
            {product.oldPrice && <div className="text-sm text-gray-400 line-through">{product.oldPrice} تومان</div>}
            <div className="mt-4">
              <button className="w-full bg-pink-600 text-white px-4 py-2 rounded">افزودن به سبد</button>
            </div>
            <div className="mt-4 text-sm text-gray-500">وضعیت: {product.stock>0 ? 'موجود' : 'ناموجود'}</div>
          </aside>
        </div>
      </main>
    </>
  )
}
