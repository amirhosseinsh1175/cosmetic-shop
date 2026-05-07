# User accounts & profile

تغییرات جدید اضافه‌شده در این مرحله:

- ثبت‌نام کاربر: `POST /api/auth/register` و صفحه فرانت `pages/auth/register.tsx`
- پروفایل کاربر: `GET/PUT /api/user/profile`
- مدیریت آدرس‌ها: `GET/POST /api/user/addresses` و `PUT/DELETE /api/user/addresses/[id]`
- نمایش سفارشات کاربر: `GET /api/user/orders`
- صفحات فرانت برای کاربر: `/account`، `/account/addresses`، `/account/orders`

نکات اجرایی بعد از pull:

1) نَسخه جدید اسکیمای Prisma را اعمال کن:

  npx prisma generate
  npx prisma migrate dev --name add_user_order_address

2) سپس seed جدید را اجرا کن تا یک کاربر نمونه و آدرس ساخته شود:

  npx ts-node --transpile-only prisma/seed.ts

3) اجرا:

  npm run dev

ایمیلی که برای ورود ادمین قبلاً استفاده شده: admin@cosmetic.local / Admin123!

