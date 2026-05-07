import Link from 'next/link'

export default function Header(){
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

        {/* right: hamburger */}
        <div>
          <button aria-label="menu" className="p-2 rounded hover:bg-gray-100">
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
        </div>
      </div>
    </header>
  )
}
