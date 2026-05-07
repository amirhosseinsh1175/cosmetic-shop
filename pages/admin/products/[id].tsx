import { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

export default function EditProduct(){
  const router = useRouter()
  const { id } = router.query
  const [product, setProduct] = useState<any>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [variantName, setVariantName] = useState('')
  const [variantPrice, setVariantPrice] = useState<number | ''>('')
  const [variantSku, setVariantSku] = useState('')

  useEffect(()=>{
    if(!id) return
    axios.get(`/api/products/${id}`).then(r=>setProduct(r.data))
  }, [id])

  const onFile = (e:any)=>{
    const f = e.target.files?.[0]
    if(!f) return
    (async ()=>{
      try{
        const fd = new FormData()
        fd.append('file', f)
        const r = await fetch('/api/admin/products/upload', { method: 'POST', body: fd })
        const data = await r.json()
        if(data?.url){
          setFilePreview(URL.createObjectURL(f))
          setProduct({...product, images: [...(product.images||[]), data.url]})
        } else {
          alert('خطا در آپلود تصویر')
        }
      }catch(e){
        alert('خطا در آپلود')
      }
    })()
  }

  const addVariant = ()=>{
    if(!variantName || !variantPrice) return alert('نام و قیمت variant لازم است')
    const arr = [...(product.variants||[]), { name: variantName, price: Number(variantPrice), sku: variantSku }]
    setProduct({...product, variants: arr})
    setVariantName('')
    setVariantPrice('')
    setVariantSku('')
  }

  const removeVariant = (idx:number)=>{
    const arr = [...(product.variants||[])]
    arr.splice(idx,1)
    setProduct({...product, variants: arr})
  }

  const submit = async (e:any)=>{
    e.preventDefault()
    if(!product.title || product.title.trim().length < 3) return alert('عنوان باید حداقل ۳ کاراکتر باشد')
    if(!product.price || Number(product.price) <= 0) return alert('قیمت باید بزرگتر از صفر باشد')
    try{
      await axios.put(`/api/products/${id}`, product)
      router.push('/admin/products')
    }catch(err:any){
      alert(err?.response?.data?.error || 'خطا')
    }
  }

  if(!product) return <div className="p-8">در حال بارگذاری...</div>

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">ویرایش محصول</h1>
      <form onSubmit={submit} className="bg-white p-6 rounded shadow space-y-4">
        <div>
          <label className="block text-sm mb-1">عنوان</label>
          <input className="w-full border rounded px-3 py-2" value={product.title} onChange={e=>setProduct({...product, title: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm mb-1">خلاصه</label>
          <input className="w-full border rounded px-3 py-2" value={product.excerpt} onChange={e=>setProduct({...product, excerpt: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm mb-1">توضیحات</label>
          <textarea className="w-full border rounded px-3 py-2" value={product.description} onChange={e=>setProduct({...product, description: e.target.value})} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">قیمت</label>
            <input type="number" className="w-full border rounded px-3 py-2" value={product.price} onChange={e=>setProduct({...product, price: Number(e.target.value)})} />
          </div>
          <div>
            <label className="block text-sm mb-1">موجودی</label>
            <input type="number" className="w-full border rounded px-3 py-2" value={product.stock} onChange={e=>setProduct({...product, stock: Number(e.target.value)})} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">برند</label>
            <input className="w-full border rounded px-3 py-2" value={product.brand} onChange={e=>setProduct({...product, brand: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm mb-1">دسته</label>
            <input className="w-full border rounded px-3 py-2" value={product.category} onChange={e=>setProduct({...product, category: e.target.value})} />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">تصاویر فعلی</label>
          <div className="grid grid-cols-3 gap-2">
            {(product.images || []).map((im:string, idx:number)=> (
              <div key={idx} className="border p-1 rounded relative">
                <img src={im} className="w-full h-24 object-contain" />
                <a className="text-xs text-blue-600 mt-1 block" href={`/admin/products/${id}/images`}>مدیریت تصاویر</a>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">افزودن تصویر جدید</label>
          <input type="file" accept="image/*" onChange={onFile} />
          {filePreview && <img src={filePreview} className="h-32 mt-3 object-contain" />}
        </div>

        <div className="bg-gray-50 p-3 rounded">
          <h3 className="font-semibold mb-2">تنوع‌های محصول (Variants)</h3>
          <div className="grid grid-cols-3 gap-2 mb-2">
            <input placeholder="نام (مثلا: رنگ قرمز)" className="border rounded px-2 py-1" value={variantName} onChange={e=>setVariantName(e.target.value)} />
            <input placeholder="قیمت" type="number" className="border rounded px-2 py-1" value={variantPrice as any} onChange={e=>setVariantPrice(e.target.value)} />
            <input placeholder="SKU (اختیاری)" className="border rounded px-2 py-1" value={variantSku} onChange={e=>setVariantSku(e.target.value)} />
          </div>
          <div className="flex gap-2 mb-2">
            <button type="button" className="bg-blue-600 text-white px-3 py-1 rounded" onClick={addVariant}>افزودن تنوع</button>
          </div>
          <div>
            {(product.variants || []).map((v:any,idx:number)=> (
              <div key={idx} className="flex items-center gap-3 mb-1">
                <div className="flex-1">{v.name} — {v.price} تومان {v.sku && <span className="text-sm text-gray-500">({v.sku})</span>}</div>
                <button type="button" className="text-red-600 text-sm" onClick={()=>removeVariant(idx)}>حذف</button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">ذخیره تغییرات</button>
          <a className="text-sm text-gray-600" href="/admin/products">انصراف</a>
        </div>
      </form>
    </main>
  )
}
