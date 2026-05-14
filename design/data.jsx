// ============================================
// T-Card — Data layer: brands, products, i18n
// ============================================

const CATEGORIES = [
  { id: 'all',       en: 'All',           fa: 'همه' },
  { id: 'gaming',    en: 'Gaming',        fa: 'گیمینگ' },
  { id: 'streaming', en: 'Streaming',     fa: 'استریم' },
  { id: 'shopping',  en: 'Shopping',      fa: 'خرید آنلاین' },
  { id: 'apps',      en: 'Apps & Mobile', fa: 'اپ و موبایل' },
  { id: 'food',      en: 'Food & Drink',  fa: 'غذا و نوشیدنی' },
  { id: 'prepaid',   en: 'Prepaid',       fa: 'پیش‌پرداخت' }
];

// Real-world gift card products. Card art uses our own typography + abstract
// patterns; brand-distinctive logos and visuals are intentionally NOT recreated.
const BRANDS = [
  {
    id: 'amazon', cat: 'shopping',
    name: { en: 'Amazon', fa: 'آمازون' },
    initial: 'a',
    tagline: { en: 'Everything store, in your inbox.', fa: 'فروشگاه همه‌چیز، در صندوق ورودی شما.' },
    description: {
      en: 'Use toward millions of items on Amazon — books, electronics, household goods, and Prime services. Codes deliver instantly.',
      fa: 'برای میلیون‌ها کالا در آمازون قابل استفاده — کتاب، الکترونیک، لوازم منزل، و خدمات Prime. کدها به‌صورت آنی ارسال می‌شوند.'
    },
    palette: { a: '#1a2533', b: '#0a1018', accent: '#ff9900' },
    amounts: [10, 25, 50, 100, 200],
    rating: 4.9, reviews: 18420
  },
  {
    id: 'google-play', cat: 'apps',
    name: { en: 'Google Play', fa: 'گوگل پلی' },
    initial: 'G',
    tagline: { en: 'Apps, games, books, films.', fa: 'اپ، بازی، کتاب، فیلم.' },
    description: {
      en: 'Redeem for Android apps, in-app purchases, Google Play games, books, movies, and YouTube Premium subscriptions.',
      fa: 'قابل استفاده برای اپ‌های اندروید، خریدهای درون‌برنامه‌ای، بازی‌های Google Play، کتاب، فیلم، و اشتراک YouTube Premium.'
    },
    palette: { a: '#1f6b3a', b: '#0c2a17', accent: '#fbc02d' },
    amounts: [10, 25, 50, 100, 200],
    rating: 4.8, reviews: 12950
  },
  {
    id: 'app-store', cat: 'apps',
    name: { en: 'App Store & iTunes', fa: 'اپ استور و آی‌تیونز' },
    initial: 'A',
    tagline: { en: 'For Apple devices.', fa: 'برای دستگاه‌های اپل.' },
    description: {
      en: 'Spend on iPhone & iPad apps, in-app purchases, iCloud+ storage, Apple Music, Apple TV+, Apple Arcade, and the App Store.',
      fa: 'قابل استفاده برای اپ‌های آیفون و آیپد، خریدهای درون‌برنامه‌ای، فضای iCloud+، Apple Music، Apple TV+، Apple Arcade و اپ استور.'
    },
    palette: { a: '#2c2c2e', b: '#0f0f10', accent: '#f5f5f7' },
    amounts: [15, 25, 50, 100, 200],
    rating: 4.8, reviews: 9810
  },
  {
    id: 'steam', cat: 'gaming',
    name: { en: 'Steam', fa: 'استیم' },
    initial: 's',
    tagline: { en: 'The PC game library.', fa: 'کتابخانه بازی PC.' },
    description: {
      en: 'Add funds to your Steam Wallet — usable for games, DLC, in-game items, software, and hardware on the Steam Store.',
      fa: 'افزودن اعتبار به کیف پول استیم — قابل استفاده برای بازی، DLC، آیتم درون‌بازی، نرم‌افزار، و سخت‌افزار در فروشگاه Steam.'
    },
    palette: { a: '#1b3a5c', b: '#06121f', accent: '#66c0f4' },
    amounts: [5, 10, 25, 50, 100],
    rating: 4.9, reviews: 24180
  },
  {
    id: 'playstation', cat: 'gaming',
    name: { en: 'PlayStation Store', fa: 'پلی‌استیشن استور' },
    initial: 'P',
    tagline: { en: 'PSN wallet credit.', fa: 'اعتبار کیف پول PSN.' },
    description: {
      en: 'Top up your PlayStation Network wallet for games, DLC, PS Plus memberships, and other PS Store content.',
      fa: 'شارژ کیف پول PSN برای بازی، DLC، اشتراک PS Plus، و سایر محتوای PlayStation Store.'
    },
    palette: { a: '#0a3b8c', b: '#020f2a', accent: '#9bbefb' },
    amounts: [10, 25, 50, 100, 200],
    rating: 4.8, reviews: 14380
  },
  {
    id: 'xbox', cat: 'gaming',
    name: { en: 'Xbox / Microsoft', fa: 'ایکس‌باکس / مایکروسافت' },
    initial: 'x',
    tagline: { en: 'Game Pass, games, more.', fa: 'گیم‌پس، بازی، و بیشتر.' },
    description: {
      en: 'Use for Xbox games, Game Pass subscriptions, in-game add-ons, films from Microsoft Store, and Windows apps.',
      fa: 'قابل استفاده برای بازی‌های Xbox، اشتراک Game Pass، افزونه‌های درون‌بازی، فیلم از Microsoft Store، و اپ‌های ویندوز.'
    },
    palette: { a: '#0e6b1e', b: '#04220a', accent: '#9bf2a0' },
    amounts: [10, 25, 50, 100, 200],
    rating: 4.7, reviews: 8902
  },
  {
    id: 'nintendo', cat: 'gaming',
    name: { en: 'Nintendo eShop', fa: 'نینتندو ای‌شاپ' },
    initial: 'N',
    tagline: { en: 'Switch wallet credit.', fa: 'اعتبار کیف پول Switch.' },
    description: {
      en: 'Add funds to your Nintendo Account for digital Switch games, DLC, Nintendo Switch Online memberships, and pre-orders.',
      fa: 'افزودن اعتبار به حساب Nintendo برای بازی‌های دیجیتال Switch، DLC، اشتراک Nintendo Switch Online، و پیش‌سفارش.'
    },
    palette: { a: '#a31b1b', b: '#330707', accent: '#ffd8d0' },
    amounts: [10, 20, 35, 50, 100],
    rating: 4.8, reviews: 6740
  },
  {
    id: 'roblox', cat: 'gaming',
    name: { en: 'Roblox', fa: 'راباکس' },
    initial: 'r',
    tagline: { en: 'Robux for any game.', fa: 'رابوکس برای هر بازی.' },
    description: {
      en: 'Redeem for Robux — Roblox\'s in-platform currency — usable on millions of user-made experiences and avatar items.',
      fa: 'قابل تبدیل به Robux — ارز داخل پلتفرم Roblox — قابل استفاده در میلیون‌ها تجربه ساخته‌شده توسط کاربران و آیتم‌های آواتار.'
    },
    palette: { a: '#1f2226', b: '#0a0c0e', accent: '#ff5252' },
    amounts: [10, 25, 50, 80, 100],
    rating: 4.7, reviews: 11220
  },
  {
    id: 'netflix', cat: 'streaming',
    name: { en: 'Netflix', fa: 'نتفلیکس' },
    initial: 'N',
    tagline: { en: 'Series, films, animation.', fa: 'سریال، فیلم، انیمیشن.' },
    description: {
      en: 'Apply to your Netflix subscription. Works across Standard with ads, Standard, and Premium plans on any compatible device.',
      fa: 'قابل اعمال بر اشتراک Netflix شما. روی پلن‌های Standard with ads، Standard، و Premium در همه دستگاه‌های سازگار کار می‌کند.'
    },
    palette: { a: '#3a0606', b: '#120000', accent: '#e50914' },
    amounts: [15, 25, 50, 75, 100],
    rating: 4.7, reviews: 21560
  },
  {
    id: 'spotify', cat: 'streaming',
    name: { en: 'Spotify Premium', fa: 'اسپاتیفای پریمیوم' },
    initial: 's',
    tagline: { en: 'Music & podcasts, ad-free.', fa: 'موسیقی و پادکست، بدون تبلیغ.' },
    description: {
      en: 'Redeem against any Spotify Premium plan — Individual, Duo, Family, or Student. Listen offline, skip freely, no ads.',
      fa: 'قابل اعمال بر هر پلن Spotify Premium — Individual، Duo، Family، یا Student. گوش‌دادن آفلاین، اسکیپ آزاد، بدون تبلیغ.'
    },
    palette: { a: '#0e3a23', b: '#04140c', accent: '#1ed760' },
    amounts: [10, 30, 60, 99, 120],
    rating: 4.8, reviews: 9430
  },
  {
    id: 'disney-plus', cat: 'streaming',
    name: { en: 'Disney+', fa: 'دیزنی پلاس' },
    initial: 'D',
    tagline: { en: 'Disney, Marvel, Star Wars.', fa: 'دیزنی، مارول، استار وارز.' },
    description: {
      en: 'Apply to Disney+ subscriptions. Stream Disney, Pixar, Marvel, Star Wars, and National Geographic on up to four screens.',
      fa: 'قابل اعمال بر اشتراک Disney+. تماشای محتوای Disney، Pixar، Marvel، Star Wars، و National Geographic در حداکثر چهار صفحه.'
    },
    palette: { a: '#0a1e6b', b: '#020722', accent: '#cfe4ff' },
    amounts: [15, 30, 60, 100, 150],
    rating: 4.6, reviews: 5210
  },
  {
    id: 'youtube-premium', cat: 'streaming',
    name: { en: 'YouTube Premium', fa: 'یوتیوب پریمیوم' },
    initial: 'y',
    tagline: { en: 'Ad-free YouTube + Music.', fa: 'یوتیوب بدون تبلیغ + موزیک.' },
    description: {
      en: 'Apply to YouTube Premium or YouTube Music. Ad-free watching, background play, downloads, and full music access.',
      fa: 'قابل اعمال بر اشتراک YouTube Premium یا YouTube Music. تماشای بدون تبلیغ، پخش در پس‌زمینه، دانلود، و دسترسی کامل موسیقی.'
    },
    palette: { a: '#2a0808', b: '#0a0202', accent: '#ff0033' },
    amounts: [12, 25, 50, 100, 150],
    rating: 4.7, reviews: 4860
  },
  {
    id: 'razer-gold', cat: 'gaming',
    name: { en: 'Razer Gold', fa: 'ریزر گلد' },
    initial: 'r',
    tagline: { en: 'Universal gamer wallet.', fa: 'کیف پول جهانی گیمر.' },
    description: {
      en: 'Top-up for 42,000+ games and entertainment titles — works across PUBG, Free Fire, Genshin, Valorant, and more.',
      fa: 'شارژ برای بیش از ۴۲٬۰۰۰ بازی و سرویس سرگرمی — قابل استفاده برای PUBG، Free Fire، Genshin، Valorant و بسیاری دیگر.'
    },
    palette: { a: '#0d0d0d', b: '#000000', accent: '#c8a64d' },
    amounts: [10, 25, 50, 100, 200],
    rating: 4.8, reviews: 7340
  },
  {
    id: 'uber-eats', cat: 'food',
    name: { en: 'Uber & Uber Eats', fa: 'اوبر و اوبر ایتس' },
    initial: 'u',
    tagline: { en: 'Rides and dinner.', fa: 'سفر و شام.' },
    description: {
      en: 'Use across Uber rides and Uber Eats food delivery in 70+ countries. Card credit applies automatically at checkout.',
      fa: 'قابل استفاده برای سفرهای Uber و سفارش غذای Uber Eats در بیش از ۷۰ کشور. اعتبار کارت به‌صورت خودکار در پرداخت اعمال می‌شود.'
    },
    palette: { a: '#0a0a0a', b: '#000000', accent: '#6ee7b7' },
    amounts: [15, 25, 50, 100, 200],
    rating: 4.7, reviews: 6920
  },
  {
    id: 'starbucks', cat: 'food',
    name: { en: 'Starbucks', fa: 'استارباکس' },
    initial: 's',
    tagline: { en: 'Coffee & more, daily.', fa: 'قهوه و بیشتر، هر روز.' },
    description: {
      en: 'Load your Starbucks card. Use in-store, in-app, and at the drive-through across 30,000+ locations worldwide.',
      fa: 'شارژ کارت Starbucks شما. قابل استفاده در فروشگاه، اپ، و درایو-ترو در بیش از ۳۰٬۰۰۰ شعبه در سراسر جهان.'
    },
    palette: { a: '#0b3a2b', b: '#03110c', accent: '#cbb582' },
    amounts: [10, 20, 35, 50, 100],
    rating: 4.8, reviews: 5240
  },
  {
    id: 'visa-prepaid', cat: 'prepaid',
    name: { en: 'Visa Prepaid', fa: 'ویزا پیش‌پرداخت' },
    initial: 'V',
    tagline: { en: 'Spend anywhere Visa works.', fa: 'هرجا که ویزا کار می‌کند.' },
    description: {
      en: 'A prepaid Visa card usable for online and in-store purchases anywhere Visa debit is accepted. Activate in seconds.',
      fa: 'کارت پیش‌پرداخت Visa برای خریدهای آنلاین و حضوری در هرکجا که Visa Debit پذیرفته می‌شود. فعال‌سازی در چند ثانیه.'
    },
    palette: { a: '#0f2547', b: '#040c19', accent: '#f7b733' },
    amounts: [25, 50, 100, 200, 500],
    rating: 4.7, reviews: 3820
  }
];

// SVG patterns rendered into each card face — keyed by brand id.
function CardPattern({ brandId }) {
  // A few abstract pattern families, deterministically chosen.
  const idx = BRANDS.findIndex(b => b.id === brandId) % 4;
  if (idx === 0) {
    return (
      <svg viewBox="0 0 400 250" preserveAspectRatio="none" style={{width:'100%', height:'100%'}}>
        <defs>
          <pattern id={`p-${brandId}`} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="1.5" fill="white" opacity="0.5"/>
          </pattern>
        </defs>
        <rect width="400" height="250" fill={`url(#p-${brandId})`}/>
        <circle cx="320" cy="60" r="120" fill="white" opacity="0.08"/>
        <circle cx="340" cy="40" r="60" fill="white" opacity="0.06"/>
      </svg>
    );
  }
  if (idx === 1) {
    return (
      <svg viewBox="0 0 400 250" preserveAspectRatio="none" style={{width:'100%', height:'100%'}}>
        {Array.from({length: 12}).map((_, i) => (
          <line key={i} x1={-50 + i*40} y1="0" x2={50 + i*40} y2="250" stroke="white" strokeWidth="0.6" opacity="0.25"/>
        ))}
      </svg>
    );
  }
  if (idx === 2) {
    return (
      <svg viewBox="0 0 400 250" preserveAspectRatio="none" style={{width:'100%', height:'100%'}}>
        {Array.from({length: 6}).map((_, i) => (
          <circle key={i} cx="380" cy="40" r={30 + i*30} fill="none" stroke="white" strokeWidth="0.8" opacity="0.18"/>
        ))}
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 400 250" preserveAspectRatio="none" style={{width:'100%', height:'100%'}}>
      <path d="M0,200 Q100,160 200,180 T400,150 L400,250 L0,250 Z" fill="white" opacity="0.08"/>
      <path d="M0,180 Q100,140 200,160 T400,130" stroke="white" strokeWidth="0.6" fill="none" opacity="0.3"/>
      <path d="M0,210 Q100,170 200,190 T400,160" stroke="white" strokeWidth="0.6" fill="none" opacity="0.2"/>
    </svg>
  );
}

// Translations
const I18N = {
  nav_shop:     { en: 'Shop',      fa: 'فروشگاه' },
  nav_how:      { en: 'How it works', fa: 'چگونه کار می‌کند' },
  nav_about:    { en: 'About',     fa: 'درباره ما' },
  nav_faq:      { en: 'FAQ',       fa: 'سوالات' },
  nav_account:  { en: 'Account',   fa: 'حساب کاربری' },
  cart:         { en: 'Cart',      fa: 'سبد خرید' },
  search:       { en: 'Search',    fa: 'جستجو' },
  search_ph:    { en: 'Search brands…', fa: 'جستجوی برندها…' },

  hero_eyebrow: { en: 'Gift cards, beautifully delivered', fa: 'کارت‌های هدیه، با ظرافت تحویل داده شده' },
  hero_title_a: { en: 'A small token,',  fa: 'یک هدیه کوچک،' },
  hero_title_b: { en: 'wrapped just so.', fa: 'با ظرافت بسته‌بندی شده.' },
  hero_sub:     { en: 'Instant digital gift card codes for Amazon, Steam, Google Play, PlayStation, Netflix and 80+ more. Delivered to your inbox in seconds, redeemable anywhere in the world.',
                  fa: 'کدهای دیجیتال گیفت‌کارت آمازون، استیم، گوگل پلی، پلی‌استیشن، نتفلیکس و بیش از ۸۰ برند دیگر. ظرف چند ثانیه به ایمیل شما می‌رسد و در هرکجای جهان قابل استفاده است.' },
  shop_now:     { en: 'Shop gift cards', fa: 'مشاهده کارت‌ها' },
  learn:        { en: 'How it works', fa: 'نحوه کار' },

  stat_brands:  { en: 'Partner brands', fa: 'برند همکار' },
  stat_delivery:{ en: 'Avg. delivery',  fa: 'میانگین تحویل' },
  stat_rating:  { en: 'Customer rating',fa: 'امتیاز مشتری' },

  featured_eye: { en: 'Featured',     fa: 'برگزیده‌ها' },
  featured_h:   { en: 'Editor’s picks this season',  fa: 'انتخاب‌های ویراستار این فصل' },
  featured_d:   { en: 'The most-redeemed digital gift cards this month — gaming, streaming, shopping and apps.',
                  fa: 'پرفروش‌ترین گیفت‌کارت‌های دیجیتال این ماه — گیمینگ، استریم، خرید و اپ.' },
  view_all:     { en: 'View all',     fa: 'مشاهده همه' },

  how_eye:      { en: 'How it works', fa: 'نحوه کار' },
  how_h:        { en: 'Three steps. Done in a minute.', fa: 'سه قدم. در یک دقیقه تمام.' },
  how_1_t:      { en: 'Pick a brand', fa: 'برند را انتخاب کنید' },
  how_1_d:      { en: 'Browse 400+ partners — from neighborhood favorites to global names.', fa: 'بیش از ۴۰۰ برند را مرور کنید — از کافه‌های محلی تا برندهای جهانی.' },
  how_2_t:      { en: 'Personalise', fa: 'سفارشی کنید' },
  how_2_d:      { en: 'Choose an amount, a delivery date, and write a private message.', fa: 'مبلغ، تاریخ تحویل را انتخاب کنید و پیامی خصوصی بنویسید.' },
  how_3_t:      { en: 'Send instantly', fa: 'فوری ارسال کنید' },
  how_3_d:      { en: 'Email or SMS to the recipient — or print and gift in person.', fa: 'به ایمیل یا پیامک گیرنده ارسال کنید — یا پرینت و دستی هدیه دهید.' },

  cats_eye:     { en: 'Categories',   fa: 'دسته‌بندی‌ها' },
  cats_h:       { en: 'Browse by mood', fa: 'بر اساس حال‌وهوا' },

  testi_eye:    { en: 'Loved by senders', fa: 'محبوب فرستندگان' },

  cta_h:        { en: 'A better way to give.', fa: 'راهی بهتر برای هدیه دادن.' },
  cta_sub:      { en: 'Set up an account in 30 seconds. Schedule a year of gifts in 5 minutes.', fa: 'حساب کاربری را در ۳۰ ثانیه بسازید. یک سال هدیه را در ۵ دقیقه برنامه‌ریزی کنید.' },
  cta_btn:      { en: 'Get started', fa: 'شروع کنید' },

  /* Shop */
  shop_h:       { en: 'All gift cards', fa: 'همه کارت‌های هدیه' },
  shop_d:       { en: 'Digital codes from Amazon, Steam, Google Play, PlayStation, Netflix and more — delivered instantly to your inbox.',
                  fa: 'کدهای دیجیتال از آمازون، استیم، گوگل پلی، پلی‌استیشن، نتفلیکس و دیگر برندها — به‌صورت آنی به ایمیل شما ارسال می‌شود.' },
  sort_by:      { en: 'Sort by', fa: 'مرتب‌سازی' },
  sort_pop:     { en: 'Popular', fa: 'محبوب' },
  sort_price_a: { en: 'Price: low→high', fa: 'قیمت: کم→زیاد' },
  sort_price_d: { en: 'Price: high→low', fa: 'قیمت: زیاد→کم' },
  sort_rating:  { en: 'Top rated', fa: 'بالاترین امتیاز' },
  no_results:   { en: 'No brands match that.', fa: 'برندی با این مشخصات یافت نشد.' },

  /* Product */
  pdp_amount:   { en: 'Select amount', fa: 'انتخاب مبلغ' },
  pdp_custom:   { en: 'Custom', fa: 'سفارشی' },
  pdp_qty:      { en: 'Quantity', fa: 'تعداد' },
  pdp_for:      { en: 'Send to', fa: 'ارسال به' },
  pdp_self:     { en: 'Myself', fa: 'خودم' },
  pdp_someone:  { en: 'Someone else', fa: 'شخص دیگر' },
  pdp_delivery: { en: 'Delivery', fa: 'تحویل' },
  pdp_now:      { en: 'Right away', fa: 'فوری' },
  pdp_later:    { en: 'Schedule', fa: 'برنامه‌ریزی' },
  pdp_to_cart:  { en: 'Add to cart', fa: 'افزودن به سبد' },
  pdp_buy_now:  { en: 'Buy now', fa: 'خرید سریع' },
  pdp_about:    { en: 'About', fa: 'درباره' },
  pdp_redeem:   { en: 'Redemption', fa: 'استفاده' },
  pdp_reviews:  { en: 'Reviews', fa: 'نظرات' },
  pdp_terms_t:  { en: 'How it’s used', fa: 'نحوه استفاده' },
  pdp_terms:    { en: 'Cards are delivered as a unique 16-digit code via email or SMS. No expiration. Combine multiple cards at checkout. Cannot be exchanged for cash where prohibited by law.',
                  fa: 'کارت‌ها به‌صورت یک کد منحصر‌به‌فرد ۱۶ رقمی از طریق ایمیل یا پیامک ارسال می‌شوند. بدون تاریخ انقضا. در پرداخت قابل ترکیب با چند کارت هستند. در مواردی که قانون منع کرده باشد، قابل تبدیل به پول نقد نیستند.' },

  /* Cart & Checkout */
  cart_empty:   { en: 'Your cart is quiet.', fa: 'سبد خرید شما خالی است.' },
  cart_empty_d: { en: 'Add a card to begin.', fa: 'برای شروع، یک کارت اضافه کنید.' },
  subtotal:     { en: 'Subtotal',   fa: 'جمع جزء' },
  fee:          { en: 'Service fee',fa: 'هزینه خدمات' },
  total:        { en: 'Total',      fa: 'مجموع' },
  checkout:     { en: 'Checkout',   fa: 'تسویه‌حساب' },
  continue:     { en: 'Continue',   fa: 'ادامه' },
  back:         { en: 'Back',       fa: 'بازگشت' },
  step_details: { en: 'Details',    fa: 'مشخصات' },
  step_delivery:{ en: 'Delivery',   fa: 'تحویل' },
  step_payment: { en: 'Payment',    fa: 'پرداخت' },
  step_review:  { en: 'Review',     fa: 'بررسی' },
  pay_card:     { en: 'Credit card',fa: 'کارت اعتباری' },
  pay_wallet:   { en: 'Digital wallet', fa: 'کیف پول دیجیتال' },
  pay_crypto:   { en: 'Crypto',     fa: 'رمزارز' },
  pay_card_d:   { en: 'Visa, Mastercard, Amex', fa: 'ویزا، مسترکارت، امکس' },
  pay_wallet_d: { en: 'Apple Pay, Google Pay',  fa: 'اپل‌پی، گوگل‌پی' },
  pay_crypto_d: { en: 'BTC, ETH, USDC',         fa: 'بیت‌کوین، اتر، یواس‌دی‌سی' },
  pay_now:      { en: 'Pay now',    fa: 'پرداخت' },
  order_placed: { en: 'Order placed', fa: 'سفارش ثبت شد' },
  order_thanks: { en: 'Thank you. A confirmation has been sent to your inbox.', fa: 'سپاسگزاریم. تأییدیه به ایمیل شما ارسال شد.' },
  order_num:    { en: 'Order number', fa: 'شماره سفارش' },
  back_home:    { en: 'Back to home', fa: 'بازگشت به خانه' },

  /* Form labels */
  f_name:       { en: 'Full name',  fa: 'نام و نام خانوادگی' },
  f_email:      { en: 'Email',      fa: 'ایمیل' },
  f_phone:      { en: 'Phone',      fa: 'تلفن' },
  f_rec_name:   { en: 'Recipient name', fa: 'نام گیرنده' },
  f_rec_email:  { en: 'Recipient email',fa: 'ایمیل گیرنده' },
  f_message:    { en: 'Private message (optional)', fa: 'پیام خصوصی (اختیاری)' },
  f_date:       { en: 'Delivery date', fa: 'تاریخ تحویل' },
  f_card_num:   { en: 'Card number', fa: 'شماره کارت' },
  f_exp:        { en: 'Expiration',  fa: 'انقضا' },
  f_cvc:        { en: 'CVC',         fa: 'CVC' },

  /* About */
  about_h:      { en: 'A quiet gift company.', fa: 'یک شرکت هدیه‌دهی آرام.' },
  about_p1:     { en: 'T-Card began as a side project among three friends who found buying gift cards genuinely unpleasant. We rebuilt the experience from the recipient back to the giver.',
                  fa: 'تی‌کارت ابتدا به‌عنوان یک پروژه جانبی توسط سه دوست شکل گرفت که خرید کارت هدیه را تجربه‌ای ناخوشایند می‌دانستند. ما این تجربه را از سمت گیرنده به فرستنده بازطراحی کردیم.' },
  about_p2:     { en: 'We design every brand card by hand, schedule deliveries to the minute, and never sell your data.',
                  fa: 'هر کارت برند را با دست طراحی می‌کنیم، تحویل را تا دقیقه دقیق برنامه‌ریزی می‌کنیم و هرگز داده‌های شما را نمی‌فروشیم.' },

  /* Contact */
  contact_h:    { en: 'Talk to us.', fa: 'با ما گفتگو کنید.' },
  contact_d:    { en: 'Reach the team — usually back within 2 hours.', fa: 'با تیم در تماس باشید — معمولاً ظرف ۲ ساعت پاسخ می‌دهیم.' },
  contact_send: { en: 'Send message', fa: 'ارسال پیام' },

  /* Account */
  acc_orders:   { en: 'Orders',     fa: 'سفارش‌ها' },
  acc_saved:    { en: 'Saved cards', fa: 'کارت‌های ذخیره‌شده' },
  acc_profile:  { en: 'Profile',    fa: 'پروفایل' },
  acc_settings: { en: 'Settings',   fa: 'تنظیمات' },
  acc_signout:  { en: 'Sign out',   fa: 'خروج' },
  acc_welcome:  { en: 'Welcome back', fa: 'خوش برگشتید' },

  /* Footer */
  ft_company:   { en: 'Company',    fa: 'شرکت' },
  ft_support:   { en: 'Support',    fa: 'پشتیبانی' },
  ft_legal:     { en: 'Legal',      fa: 'حقوقی' },
  ft_tagline:   { en: 'Gift cards, beautifully delivered. Since 2019.', fa: 'کارت‌های هدیه، با ظرافت تحویل داده شده. از سال ۱۳۹۸.' },
  ft_rights:    { en: '© 2026 T-Card. All rights reserved.', fa: '© ۲۰۲۶ تی‌کارت. تمام حقوق محفوظ است.' }
};

function t(key, lang) {
  const e = I18N[key];
  if (!e) return key;
  return e[lang] || e.en;
}

// Currency helpers — EN uses USD, FA uses Toman (~ 50,000 IRR/USD as illustrative).
function fmtPrice(amountUSD, lang) {
  if (lang === 'fa') {
    const tmn = amountUSD * 50;
    return `${tmn.toLocaleString('fa-IR')} هزار تومان`;
  }
  return `$${amountUSD.toLocaleString('en-US')}`;
}

function fmtNumber(n, lang) {
  return n.toLocaleString(lang === 'fa' ? 'fa-IR' : 'en-US');
}

const TESTIMONIALS = [
  {
    quote: { en: 'Felt more thoughtful than a wrapped present. The note timing was perfect.', fa: 'بیشتر از یک هدیه بسته‌بندی‌شده باملاحظه به‌نظر می‌رسید. زمان‌بندی یادداشت عالی بود.' },
    name: { en: 'Maya R.', fa: 'مایا ر.' }, role: { en: 'Sender, 23 gifts', fa: 'فرستنده، ۲۳ هدیه' }
  },
  {
    quote: { en: 'I scheduled a year of birthdays in one evening. Saved my marriage, probably.', fa: 'تمام تولدهای یک سال را در یک شب برنامه‌ریزی کردم. احتمالاً ازدواجم را نجات داد.' },
    name: { en: 'Daniel K.', fa: 'دنیل ک.' }, role: { en: 'Sender, 41 gifts', fa: 'فرستنده، ۴۱ هدیه' }
  },
  {
    quote: { en: 'The card design alone made me want to send more. The redemption was painless.', fa: 'فقط طراحی کارت من را ترغیب کرد بیشتر بفرستم. استفاده از آن بسیار راحت بود.' },
    name: { en: 'Sara P.', fa: 'سارا پ.' }, role: { en: 'Recipient', fa: 'گیرنده' }
  }
];

const FAQS = [
  {
    q: { en: 'How fast are the cards delivered?', fa: 'کارت‌ها چقدر سریع تحویل داده می‌شوند؟' },
    a: { en: 'Digital cards are delivered in under 90 seconds on average. You can schedule any card up to 12 months in advance.',
         fa: 'کارت‌های دیجیتال به‌طور میانگین در کمتر از ۹۰ ثانیه تحویل می‌شوند. می‌توانید هر کارت را تا ۱۲ ماه پیش‌از تحویل برنامه‌ریزی کنید.' }
  },
  {
    q: { en: 'Do cards expire?', fa: 'آیا کارت‌ها تاریخ انقضا دارند؟' },
    a: { en: 'No T-Card-issued credit ever expires. Brand-specific rules may apply at the merchant — clearly noted on each product page.',
         fa: 'هیچ اعتبار صادرشده توسط تی‌کارت تاریخ انقضا ندارد. قوانین خاص هر برند ممکن است در فروشگاه اعمال شود — به‌وضوح در صفحه هر محصول ذکر شده است.' }
  },
  {
    q: { en: 'Can I get a refund?', fa: 'آیا می‌توانم بازگشت وجه دریافت کنم؟' },
    a: { en: 'Unused cards can be refunded within 30 days. Partially used cards are credited back to your T-Card balance.',
         fa: 'کارت‌های استفاده‌نشده ظرف ۳۰ روز قابل بازگشت هستند. کارت‌های مصرف‌شده به‌صورت جزئی به موجودی تی‌کارت شما برگشت داده می‌شوند.' }
  },
  {
    q: { en: 'How do I redeem a card?', fa: 'چگونه از کارت استفاده کنم؟' },
    a: { en: 'Each card includes a 16-digit code. Enter it at checkout on the brand’s site, or show the card barcode in-store.',
         fa: 'هر کارت شامل یک کد ۱۶ رقمی است. آن را در صفحه پرداخت سایت برند وارد کنید یا بارکد کارت را در فروشگاه نشان دهید.' }
  },
  {
    q: { en: 'Is my payment information stored?', fa: 'آیا اطلاعات پرداخت من ذخیره می‌شود؟' },
    a: { en: 'No card details touch our servers. We use a PCI-DSS Level 1 processor; only a tokenized reference is stored.',
         fa: 'هیچ‌یک از جزئیات کارت روی سرورهای ما ذخیره نمی‌شود. ما از پردازشگر سطح‌۱ PCI-DSS استفاده می‌کنیم؛ تنها یک ارجاع توکن‌شده ذخیره می‌گردد.' }
  },
  {
    q: { en: 'Can I bulk-order for my company?', fa: 'آیا می‌توانم برای شرکت سفارش گروهی بدهم؟' },
    a: { en: 'Yes. Volume pricing starts at 25 cards. Our team will set up dedicated billing and bespoke card designs.',
         fa: 'بله. قیمت‌گذاری حجمی از ۲۵ کارت شروع می‌شود. تیم ما صورت‌حساب اختصاصی و طراحی سفارشی کارت را برای شما راه‌اندازی می‌کند.' }
  }
];

window.TCARD_DATA = { CATEGORIES, BRANDS, I18N, TESTIMONIALS, FAQS, t, fmtPrice, fmtNumber };
window.CardPattern = CardPattern;
