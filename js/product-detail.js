const sizeOptions = document.querySelectorAll('.size-option');
const qtyInput = document.getElementById('quantityInput');
const totalPrice = document.getElementById('totalPrice');
const mainProductImage = document.getElementById('mainProductImage');
const thumbButtons = document.querySelectorAll('.thumb');
const imageCount = document.querySelector('.image-count');
const galleryControls = document.querySelectorAll('[data-gallery-step]');
const reviewTabs = document.querySelectorAll('.review-tab');
const reviewCards = [...document.querySelectorAll('.review-card')];
const reviewTotal = document.getElementById('reviewTotal');
const loadMoreReviewsButton = document.querySelector('.load-more-btn');
const recommendationsTrack = document.getElementById('recommendationsTrack');
const recommendationControls = document.querySelectorAll('[data-recommendations-step]');
const companionCollapseButton = document.querySelector('.companion-collapse');
const companionItems = document.querySelector('.companion-items');
const companionAddButtons = document.querySelectorAll('.companion-add');
const companionStatus = document.querySelector('.companion-status');
const ingredientPanel = document.querySelector('.ingredient-panel');
const ingredientToggle = document.querySelector('.ingredient-toggle');
const currentPriceEl = document.querySelector('.current-price');
const oldPriceEl = document.querySelector('.old-price');

let selectedPrice = 100000;

function formatCurrency(amount) {
  return `${amount.toLocaleString('vi-VN')}đ`;
}

function getSelectedCompanions() {
  return [...companionAddButtons]
    .filter((button) => button.getAttribute('aria-pressed') === 'true')
    .map((button) => ({
      id: button.dataset.accessory,
      name: button.closest('.companion-item').querySelector('.companion-copy strong').textContent,
      price: Number(button.dataset.price) || 0,
    }));
}

function getIncludedAccessories() {
  return [...document.querySelectorAll('.gift-item[data-accessory]')].map((item) => ({
    id: item.dataset.accessory,
    name: item.dataset.accessoryName,
    price: 0,
  }));
}

function updateTotal() {
  const qty = Number(qtyInput.value) || 1;
  const companionTotal = getSelectedCompanions().reduce((sum, item) => sum + item.price, 0);
  const total = (selectedPrice + companionTotal) * qty;
  totalPrice.textContent = formatCurrency(total);
  currentPriceEl.textContent = formatCurrency(selectedPrice);
}

sizeOptions.forEach((button) => {
  button.addEventListener('click', () => {
    sizeOptions.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    selectedPrice = Number(button.dataset.price) || 100000;
    updateTotal();
  });
});

document.querySelectorAll('.qty-btn').forEach((button) => {
  button.addEventListener('click', () => {
    let value = Number(qtyInput.value) || 1;
    const action = button.dataset.action;

    if (action === 'plus') {
      value += 1;
    } else {
      value = Math.max(1, value - 1);
    }

    qtyInput.value = value;
    updateTotal();
  });
});

qtyInput.addEventListener('input', () => {
  let value = Number(qtyInput.value) || 1;
  if (value < 1) value = 1;
  qtyInput.value = value;
  updateTotal();
});

function animateCartFly(sourceButton) {
  const cartIcon = document.querySelector('.cart-icon');
  if (!cartIcon || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const source = sourceButton.getBoundingClientRect();
  const target = cartIcon.getBoundingClientRect();
  const startX = source.left + source.width / 2;
  const startY = source.top + source.height / 2;
  const endX = target.left + target.width / 2;
  const endY = target.top + target.height / 2;
  const flyer = document.createElement('span');

  flyer.className = 'cart-fly-icon';
  flyer.innerHTML = '<i class="fa-solid fa-cake-candles" aria-hidden="true"></i>';
  flyer.setAttribute('aria-hidden', 'true');
  flyer.style.left = `${startX - 20}px`;
  flyer.style.top = `${startY - 20}px`;
  document.body.append(flyer);

  const travelX = endX - startX;
  const travelY = endY - startY;
  const flightKeyframes = [0, 0.25, 0.5, 0.75, 1].map((progress) => ({
    offset: progress,
    transform: `translate3d(${travelX * progress}px, ${travelY * progress - Math.sin(Math.PI * progress) * 48}px, 0) scale(${1 - progress * 0.75})`,
    opacity: 1 - progress * 0.8,
  }));
  const flight = flyer.animate(flightKeyframes, {
    duration: 950,
    easing: 'cubic-bezier(0.3, 0.7, 0.2, 1)',
  });

  flight.addEventListener('finish', () => flyer.remove(), { once: true });
  cartIcon.classList.remove('cart-bounce');
  void cartIcon.offsetWidth;
  cartIcon.classList.add('cart-bounce');
  cartIcon.addEventListener('animationend', () => cartIcon.classList.remove('cart-bounce'), { once: true });
}

document.querySelector('.btn-secondary')?.addEventListener('click', (event) => {
  const productId = 'BLC-2026';
  const quantity = Math.max(1, Number(qtyInput.value) || 1);
  const selectedCompanions = getSelectedCompanions();
  const includedAccessories = getIncludedAccessories();
  const companionTotal = selectedCompanions.reduce((sum, item) => sum + item.price, 0);
  const accessories = [...includedAccessories, ...selectedCompanions];
  const accessoryKey = accessories.map((item) => item.id).join('|');
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const existingItem = cart.find((item) => item.id === productId && (item.accessoryKey || '') === accessoryKey);

  if (existingItem) {
    existingItem.quantity = (Number(existingItem.quantity) || 0) + quantity;
  } else {
    cart.push({
      id: productId,
      name: 'Bánh Kem Bento Dâu Tây Tươi (Hộp Bento Sinh Nhật)',
      price: selectedPrice + companionTotal,
      accessories,
      accessoryKey,
      image: 'assets/img/cart-cake.png',
      quantity,
    });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  const cartBadge = document.querySelector('.cart-badge');
  if (cartBadge) {
    cartBadge.textContent = cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
  }

  animateCartFly(event.currentTarget);
});

let activeImageIndex = 0;

function showProductImage(index) {
  activeImageIndex = (index + thumbButtons.length) % thumbButtons.length;
  const selectedThumb = thumbButtons[activeImageIndex];
  if (!selectedThumb) return;

  thumbButtons.forEach((thumb) => thumb.classList.remove('active'));
  selectedThumb.classList.add('active');
  mainProductImage.src = selectedThumb.dataset.image;
  imageCount.textContent = `${activeImageIndex + 1}/${thumbButtons.length}`;
}

thumbButtons.forEach((thumb, index) => {
  thumb.addEventListener('click', () => {
    showProductImage(index);
  });
});

galleryControls.forEach((control) => {
  control.addEventListener('click', () => {
    showProductImage(activeImageIndex + Number(control.dataset.galleryStep));
  });
});

function updateRecommendationControls() {
  if (!recommendationsTrack) return;

  const maxScroll = recommendationsTrack.scrollWidth - recommendationsTrack.clientWidth;
  recommendationControls.forEach((control) => {
    const direction = Number(control.dataset.recommendationsStep);
    control.disabled = direction < 0
      ? recommendationsTrack.scrollLeft <= 1
      : recommendationsTrack.scrollLeft >= maxScroll - 1;
  });
}

recommendationControls.forEach((control) => {
  control.addEventListener('click', () => {
    const card = recommendationsTrack.querySelector('.recommendation-card');
    if (!card) return;

    const gap = Number.parseFloat(getComputedStyle(recommendationsTrack).gap) || 0;
    const distance = card.getBoundingClientRect().width + gap;
    recommendationsTrack.scrollBy({
      left: Number(control.dataset.recommendationsStep) * distance,
      behavior: 'smooth',
    });
  });
});

recommendationsTrack?.addEventListener('scroll', updateRecommendationControls, { passive: true });
window.addEventListener('resize', updateRecommendationControls);
updateRecommendationControls();

companionCollapseButton?.addEventListener('click', () => {
  const collapsed = !companionItems.hidden;
  companionItems.hidden = collapsed;
  companionCollapseButton.setAttribute('aria-expanded', String(!collapsed));
  companionCollapseButton.setAttribute('aria-label', collapsed ? 'Mở gợi ý mua kèm' : 'Ẩn gợi ý mua kèm');
  companionCollapseButton.innerHTML = `<i class="fa-solid ${collapsed ? 'fa-plus' : 'fa-minus'}" aria-hidden="true"></i>`;
});

companionAddButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const selected = button.getAttribute('aria-pressed') !== 'true';
    const itemName = button.closest('.companion-item').querySelector('.companion-copy strong').textContent;
    button.setAttribute('aria-pressed', String(selected));
    button.setAttribute('aria-label', `${selected ? 'Bỏ chọn' : 'Chọn'} ${itemName.toLowerCase()}`);
    button.innerHTML = `<i class="fa-solid ${selected ? 'fa-check' : 'fa-plus'}" aria-hidden="true"></i>`;
    button.closest('.companion-item').classList.toggle('is-selected', selected);
    companionStatus.textContent = `${itemName} ${selected ? 'đã được chọn' : 'đã bỏ chọn'}`;
    updateTotal();
  });
});

ingredientToggle.addEventListener('click', () => {
  ingredientPanel.classList.toggle('open');
  const expanded = ingredientPanel.classList.contains('open');
  ingredientToggle.setAttribute('aria-expanded', expanded);
});

const initialReviewPageSize = 4;
let visibleReviewCount = initialReviewPageSize;
let activeReviewFilter = 'all';

function updateReviewList(resetVisibleCount = false) {
  if (resetVisibleCount) visibleReviewCount = initialReviewPageSize;

  const matchingReviews = reviewCards.filter((card) => {
    return activeReviewFilter === 'all' || card.dataset.reviewTags.split(' ').includes(activeReviewFilter);
  });

  reviewTotal.textContent = reviewCards.length;
  reviewTabs.forEach((tab) => {
    const filter = tab.dataset.reviewFilter;
    const count = filter === 'all'
      ? reviewCards.length
      : reviewCards.filter((card) => card.dataset.reviewTags.split(' ').includes(filter)).length;
    tab.querySelector('.review-tab-count').textContent = count;
  });

  let visibleIndex = 0;
  reviewCards.forEach((card) => {
    const matchesFilter = activeReviewFilter === 'all'
      || card.dataset.reviewTags.split(' ').includes(activeReviewFilter);
    card.hidden = !matchesFilter || visibleIndex >= visibleReviewCount;
    if (matchesFilter) visibleIndex += 1;
  });

  const remainingReviews = matchingReviews.length - visibleReviewCount;
  loadMoreReviewsButton.hidden = remainingReviews <= 0;
  if (remainingReviews > 0) {
    loadMoreReviewsButton.textContent = `Xem thêm ${Math.min(12, remainingReviews)} đánh giá`;
  }
}

reviewTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    reviewTabs.forEach((item) => {
      item.classList.remove('active');
      item.setAttribute('aria-pressed', 'false');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-pressed', 'true');
    activeReviewFilter = tab.dataset.reviewFilter;
    updateReviewList(true);
  });
});

loadMoreReviewsButton.addEventListener('click', () => {
  visibleReviewCount += 12;
  updateReviewList();
});

updateReviewList();
updateTotal();