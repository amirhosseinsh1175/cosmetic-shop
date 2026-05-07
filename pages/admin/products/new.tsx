import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

export default function NewProduct(){
  const [title,setTitle] = useState('')
  const [excerpt,setExcerpt] = useState('')
  const [description,setDescription] = useState('')
  const [price,setPrice] = useState(0)
  const [brand,setBrand] = useState('')
  const [category,setCategory] = useState('')
  const [stock,setStock] = useState(0)
  const [images,setImages] = useState<string[]>([])
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [variants, setVariants] = useState<{name:string,price:number,sku?:string}[]>([])
  const [variantName, setVariantName] = useState('')
  const [variantPrice, setVariantPrice] = useState<number | ''>('')
  const [variantSku, setVariantSku] = useState('')
  const router = useRouter()

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
          setImages([...images, data.url])
          setFilePreview(URL.createObjectURL(f))
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
    setVariants([...variants, { name: variantName, price: Number(variantPrice), sku: variantSku }])
    setVariantName('')
    setVariantPrice('')
    setVariantSku('')
  }

  const removeVariant = (idx:number)=>{
    const arr = [...variants]
    arr.splice(idx,1)
    setVariants(arr)
  }

  const submit = async (e:any)=>{
    e.preventDefault()
    if(title.trim().length < 3) return alert('عنوان باید حداقل ۳ کاراکتر باشد')
    if(!price || Number(price) <= 0) return alert('قیمت باید بزرگتر از صفر باشد')
    try{
      await axios.post('/api/admin/products/create',{ title, excerpt, description, price, brand, category, stock, images, variants })
      router.push('/admin/products')
    }catch(err:any){
      alert(err?.response?.data?.error || 'خطا')
    }
  }

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">ایجاد محصول جدید</h1>
      <form onSubmit={submit} className="bg-white p-6 rounded shadow space-y-4">
        <div>
          <label className="block text-sm mb-1">عنوان</label>
          <input className="w-full border rounded px-3 py-2" value={title} onChange={e=>setTitle(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm mb-1">خلاصه</label>
          <input className="w-full border rounded px-3 py-2" value={excerpt} onChange={e=>setExcerpt(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm mb-1">توضیحات</label>
          <textarea className="w-full border rounded px-3 py-2" value={description} onChange={e=>setDescription(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">قیمت</label>
            <input type="number" className="w-full border rounded px-3 py-2" value={price} onChange={e=>setPrice(Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-sm mb-1">موجودی</label>
            <input type="number" className="w-full border rounded px-3 py-2" value={stock} onChange={e=>setStock(Number(e.target.value))} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">برند</label>
            <input className="w-full border rounded px-3 py-2" value={brand} onChange={e=>setBrand(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">دسته</label>
            <input className="w-full border rounded px-3 py-2" value={category} onChange={e=>setCategory(e.target.value)} />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">تصویر محصول</label>
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
            {variants.map((v,idx)=> (
              <div key={idx} className="flex items-center gap-3 mb-1">
                <div className="flex-1">{v.name} — {v.price} تومان {v.sku && <span className="text-sm text-gray-500">({v.sku})</span>}</div>
                <button type="button" className="text-red-600 text-sm" onClick={()=>removeVariant(idx)}>حذف</button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="bg-green-600 text-white px-4 py-2 rounded">ذخیره محصول</button>
          <a className="text-sm text-gray-600" href="/admin/products">انصراف</a>
        </div>
      </form>
    </main>
  )
}
