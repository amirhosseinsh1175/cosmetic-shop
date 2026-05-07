import Header from '../../components/Header'
import ProductCard from '../../components/ProductCard'
import axios from 'axios'
import { useEffect, useState } from 'react'

export default function ProductsPage(){
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ q: '', brand: '', category: '', sort: 'newest' })
  const [page, setPage] = useState(1)

  useEffect(()=>{ load() }, [filters, page])

  async function load(){
    setLoading(true)
    const params: any = { page, limit: 12, ...filters }
    const r = await axios.get('/api/products',{ params })
    setProducts(r.data.data)
    setLoading(false)
  }

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <aside className="md:col-span-1">
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold mb-3">فیلترها</h3>
              <div className="space-y-2">
                <div>
                  <label className="block text-sm mb-1">برند</label>
                  <input className="w-full border rounded px-3 py-2" value={filters.brand} onChange={e=>setFilters({...filters, brand: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm mb-1">دسته</label>
                  <input className="w-full border rounded px-3 py-2" value={filters.category} onChange={e=>setFilters({...filters, category: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm mb-1">مرتب‌سازی</label>
                  <select className="w-full border rounded px-3 py-2" value={filters.sort} onChange={e=>setFilters({...filters, sort: e.target.value})}>
                    <option value="newest">جدیدترین</option>
                    <option value="price_asc">قیمت: کم به زیاد</option>
                    <option value="price_desc">قیمت: زیاد به کم</option>
                  </select>
                </div>
              </div>
            </div>
          </aside>

          <section className="md:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">محصولات</h2>
              <div className="text-sm text-gray-500">نمایش {products.length} محصول</div>
            </div>

            {loading ? <div>در حال بارگذاری...</div> : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(p=> (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}

            <div className="mt-6 flex justify-center gap-2">
              <button className="px-3 py-1 border rounded" onClick={()=>setPage(p=>Math.max(1,p-1))}>قبلی</button>
              <div className="px-3 py-1 border rounded">{page}</div>
              <button className="px-3 py-1 border rounded" onClick={()=>setPage(p=>p+1)}>بعدی</button>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
