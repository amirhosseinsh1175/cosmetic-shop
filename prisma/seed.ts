import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
const prisma = new PrismaClient()

async function main(){
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()
  await prisma.user.deleteMany()
  await prisma.brand.deleteMany()
  await prisma.category.deleteMany()
  await prisma.address.deleteMany()

  const brands = ['Vivi','Luxe','Dermacare']
  for(const b of brands) await prisma.brand.create({ data: { name: b } })

  const categories = ['مرطوب‌کننده','آرایش لب','سرم']
  for(const c of categories) await prisma.category.create({ data: { name: c } })

  const products = [
    {
      title: 'کرم مرطوب‌کننده ابریشم',
      excerpt: 'کرم مرطوب‌کننده سبک و تغذیه‌کننده',
      description: 'این کرم با فرمولاسیون سبک، پوست را آبرسانی و شاداب می‌کند. مناسب روزانه.',
      images: [
        'https://images.unsplash.com/photo-1542831371-d531d36971e6?w=1200&q=80',
        'https://images.unsplash.com/photo-1508182312256-9b0c6a3b6f6e?w=1200&q=80'
      ],
      price: 120000,
      oldPrice: 150000,
      brand: 'Vivi',
      category: 'مرطوب‌کننده',
      stock: 25,
      variants: [{ name: 'حجم 50ml', price: 120000, sku: 'CR-50' }]
    },
    {
      title: 'رژ لب مات لوکس',
      excerpt: 'رنگدانه بالا با ماندگاری طولانی',
      description: 'رژ لب با بافت مات، مناسب تمام روز و چندین رنگ جذاب.',
      images: [
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&q=80'
      ],
      price: 89000,
      brand: 'Luxe',
      category: 'آرایش لب',
      stock: 50,
      variants: [{ name: 'رنگ قرمز', price: 89000, sku: 'LB-RED' }]
    },
    {
      title: 'سرم ضدچروک',
      excerpt: 'حاوی ویتامین C و پپتید',
      description: 'سرم تخصصی برای کاهش خطوط ریز و بهبود بافت پوست.',
      images: [
        'https://images.unsplash.com/photo-1549989479-8a8d4b2c6f3a?w=1200&q=80'
      ],
      price: 210000,
      brand: 'Dermacare',
      category: 'سرم',
      stock: 10,
      variants: [{ name: 'حجم 30ml', price: 210000, sku: 'SR-30' }]
    }
  ]

  for(const p of products){
    await prisma.product.create({ data: p as any })
  }

  // create admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@cosmetic.local'
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!'
  const hashed = bcrypt.hashSync(adminPassword, 10)
  await prisma.user.create({ data: { email: adminEmail, password: hashed, name: 'ادمین', admin: true } })

  // create a sample customer user
  const custEmail = 'user1@cosmetic.local'
  const custPass = bcrypt.hashSync('User123!', 10)
  const user = await prisma.user.create({ data: { email: custEmail, password: custPass, name: 'کاربر نمونه' } })

  // sample address
  await prisma.address.create({ data: { userId: user.id, title: 'خانه', fullname: 'علی آزمایشی', phone: '09120000000', postalCode: '1234567890', address: 'تهران، خیابان نمونه، پلاک ۱' } })

  console.log('seeded')
}

main().catch(e => { console.error(e); process.exit(1) }).finally(()=>{ prisma.$disconnect() })
