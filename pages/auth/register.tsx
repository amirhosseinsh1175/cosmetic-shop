import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

export default function Register(){
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const submit = async (e:any) =>{
    e.preventDefault()
    setError('')
    if(password !== confirm) return setError('رمز و تکرار آن مطابقت ندارند')
    try{
      await axios.post('/api/auth/register',{ name, email, password })
      router.push('/account')
    }catch(err:any){
      setError(err?.response?.data?.error || 'خطا در ثبت‌نام')
    }
  }

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">ثبت‌نام</h1>
      <form onSubmit={submit} className="bg-white p-6 rounded shadow space-y-4">
        <div>
          <label className="block text-sm mb-1">نام</label>
          <input className="w-full border rounded px-3 py-2" value={name} onChange={e=>setName(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm mb-1">ایمیل</label>
          <input type="email" className="w-full border rounded px-3 py-2" value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm mb-1">رمز</label>
          <input type="password" className="w-full border rounded px-3 py-2" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm mb-1">تکرار رمز</label>
          <input type="password" className="w-full border rounded px-3 py-2" value={confirm} onChange={e=>setConfirm(e.target.value)} />
        </div>
        {error && <div className="text-red-600">{error}</div>}
        <div className="flex items-center justify-between">
          <button className="bg-pink-600 text-white px-4 py-2 rounded">ثبت‌نام</button>
          <a href="/auth/login" className="text-sm text-gray-600">قبلا ثبت‌نام کرده‌اید؟</a>
        </div>
      </form>
    </main>
  )
}
