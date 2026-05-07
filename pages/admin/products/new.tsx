// add basic validation to new product page
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
  const router = useRouter()

  const onFile = (e:any)=>{
    const f = e.target.files?.[0]
    if(!f) return
    const reader = new FileReader()
    reader.onload = ()=>{
      setFilePreview(reader.result as string)
      setImages([...images, reader.result as string])
    }
    reader.readAsDataURL(f)
  }

  const submit = async (e:any)=>{
    e.preventDefault()
    if(title.trim().length < 3) return alert('عنوان باید حداقل ۳ کاراکتر باشد')
    if(!price || Number(price) <= 0) return alert('قیمت باید بزرگتر از صفر باشد')
    try{
      await axios.post('/api/admin/products/create',{ title, excerpt, description, price, brand, category, stock, images })
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

        <div className="flex items-center gap-3">
          <button className="bg-green-600 text-white px-4 py-2 rounded">ذخیره محصول</button>
          <a className="text-sm text-gray-600" href="/admin/products">انصراف</a>
        </div>
      </form>
    </main>
  )
}
