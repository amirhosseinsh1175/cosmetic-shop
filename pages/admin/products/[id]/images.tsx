import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

export default function ProductImages(){
  const router = useRouter()
  const { id } = router.query
  const [images, setImages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [dragIndex, setDragIndex] = useState<number | null>(null)

  useEffect(()=>{
    if(!id) return
    axios.get(`/api/products/${id}`).then(r=>{ setImages(r.data.images || []); setLoading(false) }).catch(()=>setLoading(false))
  }, [id])

  const remove = async (url:string)=>{
    if(!confirm('آیا از حذف تصویر مطمئن هستید؟')) return
    await axios.delete(`/api/admin/products/${id}/images`, { data: { url } })
    setImages(images.filter(i=>i!==url))
  }

  const onDragStart = (e: React.DragEvent, index:number) =>{
    setDragIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const onDragOver = (e: React.DragEvent) =>{
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const onDrop = (e: React.DragEvent, index:number) =>{
    e.preventDefault()
    if(dragIndex === null) return
    const arr = [...images]
    const [moved] = arr.splice(dragIndex, 1)
    arr.splice(index, 0, moved)
    setImages(arr)
    setDragIndex(null)
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
              <div key={im} className="border p-2 rounded relative" draggable onDragStart={(e)=>onDragStart(e, idx)} onDragOver={onDragOver} onDrop={(e)=>onDrop(e, idx)}>
                <img src={im} className="w-full h-40 object-contain" />
                <div className="flex items-center gap-2 mt-2">
                  <button className="px-2 py-1 bg-gray-100 rounded" onClick={()=>{
                    const arr = [...images]
                    if(idx>0){ arr.splice(idx-1,0,arr.splice(idx,1)[0]); setImages(arr) }
                  }}>بالا</button>
                  <button className="px-2 py-1 bg-gray-100 rounded" onClick={()=>{
                    const arr = [...images]
                    if(idx < arr.length-1){ arr.splice(idx+1,0,arr.splice(idx,1)[0]); setImages(arr) }
                  }}>پایین</button>
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
