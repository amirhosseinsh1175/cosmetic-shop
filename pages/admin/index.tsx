export default function AdminIndex(){
  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">داشبورد مدیریت</h1>
      <p className="mb-4">این پنل نمونه است. پس از راه‌اندازی پایگاه داده و اجرا کردن prisma:seed، محصولات و سفارشات قابل مشاهده خواهند بود.</p>
      <a href="/admin/products" className="text-pink-600">مدیریت محصولات</a>
    </main>
  )
}
