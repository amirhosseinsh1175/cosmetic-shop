# Cosmetic Shop - پروژه نمونه دانشگاهی

نسخه اولیه یک فروشگاه لوازم آرایشی بهداشتی با:
- Next.js + TypeScript
- Tailwind CSS (RTL)
- Prisma (Postgres)

دستورالعمل اجرا لوکال

1) نمونه‌سازی ریپو و نصب پکیج‌ها:

  npm install

2) راه‌اندازی پایگاه داده (با docker-compose پیشنهاد می‌شود) یا نصب Postgres محلی و تنظیم DATABASE_URL در فایل .env بر اساس .env.example

برای اجرای Postgres سریع با docker-compose (در آینده می‌توان فایل docker-compose.yml اضافه کرد):

3) اجرای مایگریت و seed:

  npx prisma generate
  npx prisma migrate dev --name init
  npx ts-node --transpile-only prisma/seed.ts

4) اجرای پروژه:

  npm run dev

ویژگی‌ها:
- صفحه اصلی، فهرست محصولات، صفحه محصول، سبد خرید نمونه و پنل مدیریت نمونه.
- API ساده برای محصولات و یک endpoint دستیار AI با پاسخ‌های پیش‌فرض.

توضیح فنی:
- برای ثبت سفارش و مدیریت حرفه‌ای، endpointها و صفحات ادمین آماده را می‌توانید پس از اتصال به DB توسعه دهید.

