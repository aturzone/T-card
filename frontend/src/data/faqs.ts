import type { Faq } from './types';

export const FAQS: Faq[] = [
  {
    q: { en: 'How fast are the cards delivered?', fa: 'کارت‌ها چقدر سریع تحویل داده می‌شوند؟' },
    a: { en: 'Digital cards are delivered in under 90 seconds on average. You can schedule any card up to 12 months in advance.',
         fa: 'کارت‌های دیجیتال به‌طور میانگین در کمتر از ۹۰ ثانیه تحویل می‌شوند. می‌توانید هر کارت را تا ۱۲ ماه پیش‌از تحویل برنامه‌ریزی کنید.' },
  },
  {
    q: { en: 'Do cards expire?', fa: 'آیا کارت‌ها تاریخ انقضا دارند؟' },
    a: { en: 'No T-Card-issued credit ever expires. Brand-specific rules may apply at the merchant — clearly noted on each product page.',
         fa: 'هیچ اعتبار صادرشده توسط تی‌کارت تاریخ انقضا ندارد. قوانین خاص هر برند ممکن است در فروشگاه اعمال شود — به‌وضوح در صفحه هر محصول ذکر شده است.' },
  },
  {
    q: { en: 'Can I get a refund?', fa: 'آیا می‌توانم بازگشت وجه دریافت کنم؟' },
    a: { en: 'Unused cards can be refunded within 30 days. Partially used cards are credited back to your T-Card balance.',
         fa: 'کارت‌های استفاده‌نشده ظرف ۳۰ روز قابل بازگشت هستند. کارت‌های مصرف‌شده به‌صورت جزئی به موجودی تی‌کارت شما برگشت داده می‌شوند.' },
  },
  {
    q: { en: 'How do I redeem a card?', fa: 'چگونه از کارت استفاده کنم؟' },
    a: { en: 'Each card includes a 16-digit code. Enter it at checkout on the brand’s site, or show the card barcode in-store.',
         fa: 'هر کارت شامل یک کد ۱۶ رقمی است. آن را در صفحه پرداخت سایت برند وارد کنید یا بارکد کارت را در فروشگاه نشان دهید.' },
  },
  {
    q: { en: 'Is my payment information stored?', fa: 'آیا اطلاعات پرداخت من ذخیره می‌شود؟' },
    a: { en: 'No card details touch our servers. We use a PCI-DSS Level 1 processor; only a tokenized reference is stored.',
         fa: 'هیچ‌یک از جزئیات کارت روی سرورهای ما ذخیره نمی‌شود. ما از پردازشگر سطح‌۱ PCI-DSS استفاده می‌کنیم؛ تنها یک ارجاع توکن‌شده ذخیره می‌گردد.' },
  },
  {
    q: { en: 'Can I bulk-order for my company?', fa: 'آیا می‌توانم برای شرکت سفارش گروهی بدهم؟' },
    a: { en: 'Yes. Volume pricing starts at 25 cards. Our team will set up dedicated billing and bespoke card designs.',
         fa: 'بله. قیمت‌گذاری حجمی از ۲۵ کارت شروع می‌شود. تیم ما صورت‌حساب اختصاصی و طراحی سفارشی کارت را برای شما راه‌اندازی می‌کند.' },
  },
];
