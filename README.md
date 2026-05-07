# Cosmetic Shop - پروژه نمونه دانشگاهی (حرفه‌ای)

این ریپو نسخه ارتقا یافته‌ای از فروشگاه لوازم آرایشی بهداشتی است که شامل:
- Next.js + TypeScript
- Tailwind CSS (RTL)
- Prisma (MySQL)
- Auth ساده با کوکی و JWT
- docker-compose برای راه‌اندازی MySQL و Adminer

پیش‌نیازها
- Node.js 18+
- Docker (برای اجرای MySQL سریع)

اجرای سریع (لوکال با Docker)

1) کپی .env.example به .env و ویرایش مقادیر در صورت نیاز

2) اجرا docker-compose:

  docker-compose up -d

3) نصب پکیج‌ها:

  npm install

4) تولید Prisma client و مایگریت و seed:

  npx prisma generate
  npx prisma migrate dev --name init
  npx ts-node --transpile-only prisma/seed.ts

5) اجرای برنامه:

  npm run dev

حساب ادمین اولیه (از .env.example):
- ایمیل: admin@cosmetic.local
- رمز: Admin123!

نکات
- پرداخت در حالت تست / شبیه‌سازی است. برای فعال‌سازی Stripe تست یا واقعی باید کلیدها را اضافه کنیم.
- دستیار هوش مصنوعی فعلاً با پاسخ‌های پیش‌فرض کار می‌کند — می‌توانیم OpenAI اضافه کنیم بعداً.

