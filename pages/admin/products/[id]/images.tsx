import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

export default function ProductImages(){
  const router = useRouter()
  const { id } = router.query
  const [images, setImages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    if(!id) return
    axios.get(`/api/products/${id}`).then(r=>{ setImages(r.data.images || []); setLoading(false) }).catch(()=>setLoading(false))
  }, [id])

  const remove = async (url:string)=>{
    if(!confirm('آیا از حذف تصویر مطمئن هستید؟')) return
    await axios.delete(`/api/admin/products/${id}/images`, { data: { url } })
    setImages(images.filter(i=>i!==url))
  }

  const move = (index:number, dir:number)=>{
    const arr = [...images]
    const to = index + dir
    if(to <0 || to >= arr.length) return
    const tmp = arr[to]
    arr[to] = arr[index]
    arr[index] = tmp
    setImages(arr)
  }

  const saveOrder = async ()=>{
    await axios.put(`/api/admin/products/${id}/images`, { images })
    alert('ترتیب تصاویر ذخیره شد')
  }

  if(loading) return <div className="p-6">در حال بارگذاری...</div>

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">مدیریت تصاویر محصول</h1>
      <div className="bg-white p-4 rounded shadow space-y-3">
        {images.length===0 ? <div>تصویری وجود ندارد.</div> : (
          <div className="grid grid-cols-2 gap-3">
            {images.map((im, idx)=> (
              <div key={im} className="border p-2 rounded relative">
                <img src={im} className="w-full h-40 object-contain" />
                <div className="flex items-center gap-2 mt-2">
                  <button className="px-2 py-1 bg-gray-100 rounded" onClick={()=>move(idx, -1)}>بالا</button>
                  <button className="px-2 py-1 bg-gray-100 rounded" onClick={()=>move(idx, 1)}>پایین</button>
                  <button className="px-2 py-1 bg-red-600 text-white rounded" onClick={()=>remove(im)}>حذف</button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 flex gap-2">
          <a className="text-sm text-gray-600" href={`/admin/products/${id}`}>بازگشت به ویرایش محصول</a>
          <button className="bg-pink-600 text-white px-3 py-2 rounded" onClick={saveOrder}>ذخیره ترتیب</button>
        </div>
      </div>
    </main>
  )
}
