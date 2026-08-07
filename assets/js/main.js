document.addEventListener('DOMContentLoaded', () => {

  // ── Compatibility layer expected by assets/js/libs/sheets-orders.js ──
  // That library (copied as-is from the charger project) expects a global
  // PRODUCT object + currentVariant + currentDelivery. We only have one
  // real product/SKU, so we model it as a single "variant", built from
  // the data in assets/js/product-details.js.
  window.PRODUCT = {
    site: { currency: PRODUCT_DETAILS.currency },
    variants: [
      {
        id: 'oil',
        prices: Object.fromEntries(
          PRODUCT_DETAILS.packages.map(p => [String(p.qty), p.price])
        ),
      },
    ],
  };
  window.currentVariant = 'oil';
  window.currentDelivery = 'home'; // 'home' | 'desk'

  // ── Fill in all the text/images/prices from product-details.js ────
  function applyProductDetails() {
    const d = PRODUCT_DETAILS;

    document.title = d.meta.pageTitle;
    document.querySelector('meta[name="description"]')
      ?.setAttribute('content', d.meta.metaDescription);

    // Top bar
    document.getElementById('support-phone').textContent = d.phones.supportDisplay;

    // Product images
    document.getElementById('product-image-desktop').src = d.images.main;
    document.getElementById('product-image-desktop').alt = d.name;
    document.getElementById('product-image-mobile').src = d.images.main;
    document.getElementById('product-image-mobile').alt = d.name;
    document.getElementById('summary-thumb').src = d.images.main;
    document.getElementById('buybar-logo').src = d.images.logo;

    // Product copy
    document.getElementById('product-name').textContent = d.name;
    document.getElementById('product-badge').textContent = d.badge;
    document.getElementById('product-description').textContent = d.description;
    document.getElementById('sticky-product-name').textContent = d.name;
    document.getElementById('sticky-product-badge').textContent = d.badge;
    document.getElementById('summary-name').textContent = d.name;
    document.getElementById('variant-label-full').textContent = d.name;
    document.getElementById('variant-label-short').textContent = d.shortName || d.name;

    // Rating (mobile sticky header)
    const stars = document.getElementById('sticky-rating-stars');
    stars.setAttribute('aria-label', d.rating.ariaLabel);
    document.getElementById('sticky-rating-value').textContent = d.rating.label;

    // Phone / call link
    document.getElementById('call-link').href = `tel:${d.phones.callLink}`;

    // Starting price (shown next to the title, before a package is picked)
    const basePackage = d.packages.find(p => p.active) || d.packages[0];
    document.getElementById('product-price').textContent = `${basePackage.price} ${d.currency}`;
    document.getElementById('sticky-product-price').textContent = `${basePackage.price}${d.currency}`;
    document.getElementById('mobile-buy-price').textContent = `${basePackage.price}${d.currency}`;
    document.getElementById('mobile-buy-label').textContent = `${basePackage.qty}x ${d.name}`;

    const priceOriginalEl = document.getElementById('product-price-original');
    const discountBadgeEl = document.getElementById('product-discount-badge');
    if (basePackage.originalPrice && basePackage.originalPrice > basePackage.price) {
      const pct = Math.round((1 - basePackage.price / basePackage.originalPrice) * 100);
      priceOriginalEl.textContent = `${basePackage.originalPrice} ${d.currency}`;
      discountBadgeEl.textContent = `خصم ${pct}%`;
    } else {
      priceOriginalEl.textContent = '';
      discountBadgeEl.textContent = '';
    }

    // Testimonials
    document.getElementById('testimonials-heading').textContent = d.testimonialsHeading;
    renderTestimonials();
  }

  function renderTestimonials() {
    const grid = document.getElementById('testimonials-grid');
    grid.innerHTML = PRODUCT_DETAILS.images.testimonials
      .map(src => `<img src="${src}" alt="تعليق زبون" loading="lazy">`)
      .join('');
  }

  // ── Build the quantity/package buttons from product-details.js ────
  function renderPackages() {
    const container = document.getElementById('packages');
    container.innerHTML = PRODUCT_DETAILS.packages.map(p => {
      const hasDiscount = p.originalPrice && p.originalPrice > p.price;
      const pct = hasDiscount ? Math.round((1 - p.price / p.originalPrice) * 100) : 0;
      return `
      <button type="button" class="package qty-card${p.active ? ' package--active active' : ''}"
              data-price="${p.price}" data-qty="${p.qty}" data-free-delivery="${!!p.freeDelivery}">
        ${p.freeDelivery ? '<span class="package__ribbon">توصيل مجاني</span>' : ''}
        <span class="package__title">${p.title}</span>
        <span class="package__price-group">
          ${hasDiscount ? `<span class="package__price-original">${p.originalPrice} ${PRODUCT_DETAILS.currency}</span>` : ''}
          <span class="package__price-line">
            <span class="package__price"><b>${p.price}</b> ${PRODUCT_DETAILS.currency}</span>
            ${hasDiscount ? `<span class="package__discount">-${pct}%</span>` : ''}
          </span>
        </span>
        <span class="qty-num" hidden>${p.qty}</span>
        <svg class="package__check" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
      </button>
    `;
    }).join('');
  }

  applyProductDetails();
  renderPackages();

  const wilayaSelect     = document.getElementById('wilaya');
  const citySelect       = document.getElementById('city');
  const qtyHiddenInput   = document.getElementById('qty');
  const qtyCards         = document.querySelectorAll('.qty-card');
  const buyBtnPrice      = document.getElementById('buy-btn-price');
  const mobileBuyPrice   = document.getElementById('mobile-buy-price');
  const mobileBuyBtn     = document.getElementById('mobile-buy-btn');
  const orderForm        = document.getElementById('order-form');
  const submitBtn        = document.querySelector('.submit-btn');
  const deliveryBadge    = document.getElementById('delivery-badge');

  const deliverySection = document.getElementById('delivery-section');
  const dcHome           = document.getElementById('dc-home');
  const dcDesk           = document.getElementById('dc-desk');
  const dcHomePrice      = document.getElementById('dc-home-price');
  const dcDeskPrice      = document.getElementById('dc-desk-price');

  const summaryToggle    = document.getElementById('summary-toggle');
  const summary          = document.getElementById('summary');
  const summaryQty       = document.getElementById('summary-qty');
  const summaryUnitPrice = document.getElementById('summary-unit-price');
  const summaryDelivery  = document.getElementById('summary-delivery');
  const summaryTotal     = document.getElementById('summary-total');
  const summaryCount     = document.getElementById('summary-count');

  let qty = (PRODUCT_DETAILS.packages.find(p => p.active) || PRODUCT_DETAILS.packages[0]).qty;

  function formatDzd(n) {
    return `${n} دج`;
  }

  function currentPackagePrice() {
    return PRODUCT.variants[0].prices[String(qty)];
  }

  // Look up the full package object (price, title, freeDelivery flag) for the
  // currently selected quantity.
  function currentPackage() {
    return PRODUCT_DETAILS.packages.find(p => p.qty === qty) || null;
  }

  // Look up the real per-wilaya delivery row from delivery.js.
  // (Uses findDeliveryRowForWilaya() from delivery.js — a name-based
  // lookup that fixes a mismatch in the original Code-based lookup;
  // see the comment above DELIVERY_NAME_ALIASES in delivery.js.)
  function currentDeliveryRow() {
    if (!wilayaSelect?.value || typeof findDeliveryRowForWilaya === 'undefined') return null;
    return findDeliveryRowForWilaya(wilayaSelect.value);
  }

  function currentDeliveryCost() {
    if (!deliverySection.classList.contains('visible')) return 0;
    if (currentPackage()?.freeDelivery) return 0;
    const row = currentDeliveryRow();
    if (!row) return 0;
    return currentDelivery === 'home' ? row.A_domicile : row.Stop_desk;
  }

  function render() {
    const price = currentPackagePrice();
    const delivery = currentDeliveryCost();
    const total = price + delivery;

    buyBtnPrice.textContent = price;
    mobileBuyPrice.textContent = formatDzd(price);

    summaryQty.textContent = `× ${qty}`;
    summaryUnitPrice.textContent = formatDzd(price);
    summaryCount.textContent = `${qty} منتج محدد`;

    if (!wilayaSelect.value) {
      summaryDelivery.textContent = 'اختر الولاية';
      deliveryBadge.textContent = 'اختر الولاية';
    } else if (!deliverySection.classList.contains('visible')) {
      summaryDelivery.textContent = 'غير متوفر لهذه الولاية';
      deliveryBadge.textContent = 'غير متوفر';
    } else if (currentPackage()?.freeDelivery) {
      summaryDelivery.textContent = 'توصيل مجاني';
      deliveryBadge.textContent = 'توصيل مجاني';
    } else {
      summaryDelivery.textContent = formatDzd(delivery);
      deliveryBadge.textContent = formatDzd(delivery);
    }

    summaryTotal.textContent = formatDzd(total);
  }

  // ── Quantity / package selection ──────────────────────────────────
  qtyCards.forEach(btn => {
    btn.addEventListener('click', () => {
      qtyCards.forEach(b => b.classList.remove('package--active', 'active'));
      btn.classList.add('package--active', 'active');
      qty = parseInt(btn.dataset.qty, 10);
      qtyHiddenInput.value = qty;
      render();
    });
  });

  // ── Populate wilayas from the library's real data (wilayas.js) ────
  if (typeof WILAYAS !== 'undefined') {
    const sorted = [...WILAYAS].sort((a, b) => Number(a.id) - Number(b.id));
    sorted.forEach(w => {
      const opt = document.createElement('option');
      opt.value = w.id;
      const code = String(w.code || w.id).padStart(2, '0');
      opt.textContent = `${code} - ${w.ar_name || w.name}`;
      wilayaSelect.appendChild(opt);
    });
  }

  // ── Wilaya → commune cascade + delivery lookup (communes.js / delivery.js) ──
  wilayaSelect.addEventListener('change', () => {
    citySelect.innerHTML = '<option value="">اختر البلدية</option>';
    const wilayaId = wilayaSelect.value;

    if (!wilayaId || typeof COMMUNES === 'undefined') {
      citySelect.disabled = true;
      deliverySection.classList.remove('visible');
      render();
      return;
    }

    const matches = COMMUNES
      .filter(c => String(c.wilaya_id) === String(wilayaId))
      .sort((a, b) => a.name.localeCompare(b.name, 'ar'));

    matches.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = c.ar_name || c.name;
      citySelect.appendChild(opt);
    });

    citySelect.disabled = matches.length === 0;

    const row = currentDeliveryRow();
    if (row) {
      dcHomePrice.textContent = formatDzd(row.A_domicile);
      dcDeskPrice.textContent = formatDzd(row.Stop_desk);
      deliverySection.classList.add('visible');
    } else {
      deliverySection.classList.remove('visible');
    }

    render();
  });

  // ── Delivery method (home / stop-desk) ─────────────────────────────
  function selectDelivery(type) {
    currentDelivery = type;
    dcHome.classList.toggle('delivery-card--active', type === 'home');
    dcDesk.classList.toggle('delivery-card--active', type === 'desk');
    render();
  }
  dcHome.addEventListener('click', () => selectDelivery('home'));
  dcDesk.addEventListener('click', () => selectDelivery('desk'));

  // ── Collapsible order summary ──────────────────────────────────────
  summaryToggle.addEventListener('click', () => {
    const isOpen = summaryToggle.getAttribute('aria-expanded') === 'true';
    summaryToggle.setAttribute('aria-expanded', String(!isOpen));
    summary.hidden = isOpen;
  });

  // ── Mobile sticky buy bar scrolls to the form ──────────────────────
  mobileBuyBtn.addEventListener('click', () => {
    orderForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
    document.getElementById('name')?.focus();
  });

  // ── Sticky compact header (mobile) ─────────────────────────────────
  const stickyHeader = document.getElementById('mobile-sticky-header');
  const sentinel = document.getElementById('sticky-sentinel');
  if (stickyHeader && sentinel && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      ([entry]) => stickyHeader.classList.toggle('is-visible', !entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(sentinel);
  }

  // ── Submit — hand off entirely to the charger library's submitOrder() ──
  // (validates fields/phone, posts to Google Sheets, fires Purchase pixel
  // events, and redirects to thank-you.html — all unmodified library logic)
  submitBtn.addEventListener('click', () => {
    if (typeof submitOrder === 'function') {
      submitOrder();
    } else {
      console.error('[main.js] submitOrder() not found — did assets/js/libs/sheets-orders.js load?');
    }
  });

  render();
});
