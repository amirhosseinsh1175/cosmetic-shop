import { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

export default function EditProduct(){
  const router = useRouter()
  const { id } = router.query
  const [product, setProduct] = useState<any>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)

  useEffect(()=>{
    if(!id) return
    axios.get(`/api/products/${id}`).then(r=>setProduct(r.data))
  }, [id])

  const onFile = (e:any)=>{
    const f = e.target.files?.[0]
    if(!f) return
    const reader = new FileReader()
    reader.onload = ()=>{
      setFilePreview(reader.result as string)
      setProduct({...product, images: [...(product.images||[]), reader.result]})
    }
    reader.readAsDataURL(f)
  }

  const submit = async (e:any)=>{
    e.preventDefault()
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
          <label className="block text-sm mb-1">افزودن تصویر جدید</label>
          <input type="file" accept="image/*" onChange={onFile} />
          {filePreview && <img src={filePreview} className="h-32 mt-3 object-contain" />}
        </div>

        <div className="flex items-center gap-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">ذخیره تغییرات</button>
          <a className="text-sm text-gray-600" href="/admin/products">انصراف</a>
        </div>
      </form>
    </main>
  )
}
