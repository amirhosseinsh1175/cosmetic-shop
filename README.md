# Phase A complete: UI/UX polish (product cards & gallery)

این کامیت شامل تغییرات مربوط به فاز A است:

- افزودن کتابخانه‌های جدید: Swiper و Framer Motion (برای carousel و انیمیشن‌ها)
- استفاده از next/image برای بهینه‌سازی تصویر
- کارت محصول حرفه‌ای‌تر (components/ProductCard.tsx)
- گالری محصول با Swiper (components/ProductGallery.tsx)
- نمایش رتبه‌بندی با RatingStars
- بهبود صفحه فهرست محصولات و صفحه محصول (تب‌ها، جزئیات، sidebar فیلتر)
- به‌روزرسانی next.config.js برای اجازه دادن به تصاویر از images.unsplash.com

نحوهٔ اجرای محلی (پس از pull از repo):

1) نصب پکیج‌ها:
   npm install

2) اجرای docker-compose و دیتابیس و seed (مثل قبل):
   docker-compose up -d
   npx prisma generate
   npx prisma migrate dev --name init
   npx ts-node --transpile-only prisma/seed.ts

3) اجرا:
   npm run dev

نکته: اگر با خطای مربوط به remote images برخورد کردی، مطمئن شو next.config.js را ری‌استارت کرده‌ای (سرور next)؛ next/image نیاز به restart برای بارگذاری تنظیمات جدید دارد.
