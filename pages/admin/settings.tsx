import { useState } from 'react'
import axios from 'axios'

export default function AdminSettings(){
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  const onFile = (e:any) =>{
    const f = e.target.files?.[0]
    if(!f) return
    setFile(f)
    const reader = new FileReader()
    reader.onload = () => setPreview(reader.result as string)
    reader.readAsDataURL(f)
  }

  const submit = async (e:any) =>{
    e.preventDefault()
    if(!file || !preview) return setMessage('فایلی انتخاب نشده')
    setMessage('در حال آپلود...')
    try{
      await axios.post('/api/admin/upload-logo',{ image: preview })
      setMessage('لوگو با موفقیت آپلود شد')
      // reload to show new logo
      setTimeout(()=> location.reload(), 800)
    }catch(err:any){
      setMessage(err?.response?.data?.error || 'خطا در آپلود')
    }
  }

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">تنظیمات سایت</h1>
      <div className="bg-white p-6 rounded shadow space-y-4">
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="block text-sm mb-1">لوگو سایت (آپلود کنید)</label>
            <input type="file" accept="image/*" onChange={onFile} />
          </div>

          {preview && (
            <div>
              <div className="text-sm mb-1">پیشنمایش:</div>
              <img src={preview} className="h-24 object-contain border rounded" />
            </div>
          )}

          <div className="flex items-center gap-3">
            <button className="bg-pink-600 text-white px-4 py-2 rounded">آپلود لوگو</button>
            <span className="text-sm text-gray-600">{message}</span>
          </div>
        </form>

        <div className="text-sm text-gray-500">توجه: لوگو در مسیر <code>/public/uploads/logo.png</code> ذخیره می‌شود و بلافاصله در هدر نمایش داده می‌شود.</div>
      </div>
    </main>
  )
}
