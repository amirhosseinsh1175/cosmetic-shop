# Stripe (تست) setup

برای فعال‌سازی پرداخت تستی Stripe، مقادیر زیر را در فایل `.env` قرار دهید (هرگز کلیدها را در repo عمومی نگذارید):

STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

توضیح:
- برای تست لوکال می‌توانید از Stripe CLI برای ایجاد webhook و دریافت `STRIPE_WEBHOOK_SECRET` استفاده کنید:
  stripe listen --forward-to localhost:3000/api/checkout/webhook

نکته دربارهٔ ارزها:
- این پیاده‌سازی از USD برای پرداخت تست استفاده می‌کند و قیمت محصولات (تومان) برای Stripe به‌صورت تقریبی تبدیل شده است. برای محیط واقعی باید نرخ تبدیل و واحد پول را مناسب تنظیم کنید.
