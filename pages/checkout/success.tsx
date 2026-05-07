import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

export default function SuccessPage(){
  const router = useRouter()
  const { session_id } = router.query
  const [message, setMessage] = useState('در حال بررسی پرداخت...')

  useEffect(()=>{
    if(!session_id) return
    // Optionally we could call our backend to confirm and show order id
    setMessage('پرداخت با موفقیت انجام شد. سفارش شما ثبت شد.')
  }, [session_id])

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">پرداخت موفق</h1>
      <div className="bg-white p-4 rounded shadow">{message}</div>
    </main>
  )
}
