/**
 * ─────────────────────────────────────────────────────────────────────────
 *  PRODUCT DETAILS — single source of truth for this landing page
 * ─────────────────────────────────────────────────────────────────────────
 *  Everything that changes from product to product (or campaign to
 *  campaign) lives in this file: name, description, images, phone
 *  numbers, prices/packages and the customer testimonial images.
 *
 *  Edit the values below — main.js reads this object and fills in the
 *  page automatically, so you don't need to touch index.html or hunt
 *  through markup to update a price or swap a picture.
 *
 *  This file must be loaded (via <script>) BEFORE main.js.
 * ─────────────────────────────────────────────────────────────────────────
 */

const PRODUCT_DETAILS = {

  // Browser tab title + SEO meta description
  meta: {
    pageTitle: 'حبوب الجينسينغ الأصلية | لمستي My Touch',
    metaDescription: 'حبوب الجينسينغ الأصلية Ginseng Kianpi Pil، منتج أصلي 100٪ يمكن التحقق منه عبر رمز QR. اطلب الآن مع توصيل سريع لكل الولايات.',
  },

  // Product copy
  name: 'حبوب الجينسينغ الأصلية',
  // Shorter version of the name, used in tight spaces (e.g. the checkout form)
  shortName: 'حبوب الجينسينغ',
  badge: 'أصلي 100٪',
  description:
`Ginseng Kianpi Pil الأصلية ✅
منتج أصلي 100٪ يمكن التحقق من أصالته عبر رمز QR الموجود على العلبة 🔎
عبوة تحتوي 60 كبسولة، مغلفة بإحكام للحفاظ على جودتها من التعبئة حتى وصولها إليك 📦
مكونات مونوقة ومختارة بعناية فائقة قبل التعبئة 🌿
منتج لمستي My Touch — جودة تستحق ثقتك ✅`,

  // Currency shown next to every price
  currency: 'دج',

  // Star rating shown in the mobile sticky header
  rating: {
    value: 5.0,
    label: '(5.0)',
    ariaLabel: '5 من 5 نجوم',
  },

  // Phone numbers used around the site
  phones: {
    // Shown as text in the top announcement bar
    supportDisplay: '0664735713',
    // Used for the tel: link on the mobile "call us" button
    callLink: '0664735713',
  },

  // Image paths (relative to index.html)
  images: {
    main: 'assets/images/product-main.jpg',
    logo: 'assets/images/logo.svg',
    // لا توجد تعليقات زبائن حقيقية بعد لهذا المنتج — أضف صورك هنا لاحقًا.
    testimonials: [],
  },

  testimonialsHeading: '',

  // Quantity packages. `id` must stay unique and stable — it's used
  // internally to track which package is selected.
  packages: [
    {
      id: 1,
      qty: 1,
      price: 3700,
      freeDelivery: false,
      title: 'قطعة واحدة',
      active: true, // pre-selected on page load
    },
    {
      id: 2,
      qty: 2,
      price: 6900,
      freeDelivery: false,
      title: 'قطعتان',
    },
    {
      id: 3,
      qty: 3,
      price: 9900,
      freeDelivery: false,
      title: 'ثلاث قطع',
    },
  ],
};
