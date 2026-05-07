import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

export default function Login(){
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [error,setError] = useState('')
  const router = useRouter()

  const submit = async (e:any) =>{
    e.preventDefault()
    setError('')
    try{
      await axios.post('/api/auth/login',{ email, password })
      router.push('/admin')
    }catch(err:any){
      setError(err?.response?.data?.error || 'خطا در ورود')
    }
  }

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">ورود مدیر</h1>
      <form onSubmit={submit} className="space-y-4 bg-white p-6 rounded shadow">
        <div>
          <label className="block text-sm mb-1">ایمیل</label>
          <input className="w-full border rounded px-3 py-2" value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm mb-1">رمز</label>
          <input type="password" className="w-full border rounded px-3 py-2" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        {error && <div className="text-red-600">{error}</div>}
        <div className="flex items-center justify-between">
          <button className="bg-pink-600 text-white px-4 py-2 rounded">ورود</button>
          <a href="/">بازگشت به فروشگاه</a>
        </div>
      </form>
    </main>
  )
}
