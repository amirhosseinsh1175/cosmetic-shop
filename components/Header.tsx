import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Header(){
  const [logoVisible, setLogoVisible] = useState(true)

  useEffect(()=>{
    // Try to load logo; if not found the img onError will hide it.
  }, [])

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* left: Login + Cart */}
        <div className="flex items-center gap-3">
          <Link href="/auth/login"><a className="text-sm text-gray-700">ورود</a></Link>
          <Link href="/cart"><a className="relative">
            <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4"></path></svg>
            <span className="absolute -left-2 -top-2 bg-pink-500 text-white text-xs rounded-full px-1">2</span>
          </a></Link>
        </div>

        {/* center: search */}
        <div className="flex-1 px-6">
          <form className="max-w-xl mx-auto">
            <input placeholder="جستجوی محصول، برند یا دسته..." className="w-full border rounded-full px-4 py-2 focus:outline-none" />
          </form>
        </div>

        {/* right: hamburger + logo placeholder */}
        <div className="flex items-center gap-4">
          <div className="ml-3">
            <button aria-label="menu" className="p-2 rounded hover:bg-gray-100">
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
          </div>

          <div className="flex items-center">
            {/* Logo - will be uploaded later via admin settings. If not present, hide the img and show text */}
            <img src="/uploads/logo.png" alt="لوگو" className="h-10 object-contain" onError={(e)=>{ (e.currentTarget as HTMLImageElement).style.display = 'none' }} />
            <span className="mr-2 font-bold text-lg text-pink-600">فروشگاه آرایشی</span>
          </div>
        </div>
      </div>
    </header>
  )
}
