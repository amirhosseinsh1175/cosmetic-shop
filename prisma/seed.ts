import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
const prisma = new PrismaClient()

async function main(){
  await prisma.product.deleteMany()
  await prisma.user.deleteMany()

  const products = [
    {
      title: 'کرم مرطوب‌کننده ابریشم',
      excerpt: 'کرم مرطوب‌کننده سبک و تغذیه‌کننده',
      description: 'این کرم با فرمولاسیون سبک، پوست را آبرسانی و شاداب می‌کند. مناسب روزانه.',
      image: 'https://images.unsplash.com/photo-1542831371-d531d36971e6?w=1200&q=80',
      price: 120000
    },
    {
      title: 'رژ لب مات لوکس',
      excerpt: 'رنگدانه بالا با ماندگاری طولانی',
      description: 'رژ لب با بافت مات، مناسب تمام روز و چندین رنگ جذاب.',
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&q=80',
      price: 89000
    },
    {
      title: 'سرم ضدچروک',
      excerpt: 'حاوی ویتامین C و پپتید',
      description: 'سرم تخصصی برای کاهش خطوط ریز و بهبود بافت پوست.',
      image: 'https://images.unsplash.com/photo-1549989479-8a8d4b2c6f3a?w=1200&q=80',
      price: 210000
    }
  ]

  for(const p of products){
    await prisma.product.create({ data: p })
  }

  // create admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@cosmetic.local'
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!'
  const hashed = bcrypt.hashSync(adminPassword, 10)
  await prisma.user.create({ data: { email: adminEmail, password: hashed, name: 'ادمین', admin: true } })

  console.log('seeded')
}

main().catch(e => { console.error(e); process.exit(1) }).finally(()=>{ prisma.$disconnect() })
