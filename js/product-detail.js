const sizeOptions = document.querySelectorAll('.size-option');
const qtyInput = document.getElementById('quantityInput');
const reviewTabs = document.querySelectorAll('.review-tab');
const reviewCards = [...document.querySelectorAll('.review-card')];
const reviewTotal = document.getElementById('reviewTotal');
const reviewSectionTotal = document.getElementById('reviewSectionTotal');
const loadMoreReviewsButton = document.querySelector('.load-more-btn');
const recommendationsTrack = document.getElementById('recommendationsTrack');
const recommendationsSection = document.querySelector('.recommendations-section');
const recommendationControls = document.querySelectorAll('[data-recommendations-step]');
const currentPriceEl = document.querySelector('.current-price');
const oldPriceEl = document.querySelector('.old-price');

let selectedPrice = 100000;

function formatCurrency(amount) {
  return `${amount.toLocaleString('vi-VN')}đ`;
}

function updateCurrentPrice() {
  currentPriceEl.textContent = formatCurrency(selectedPrice);
}

sizeOptions.forEach((button) => {
  button.addEventListener('click', () => {
    sizeOptions.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    selectedPrice = Number(button.dataset.price) || 100000;
    updateCurrentPrice();
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
  });
});

qtyInput.addEventListener('input', () => {
  let value = Number(qtyInput.value) || 1;
  if (value < 1) value = 1;
  qtyInput.value = value;
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
  const accessories = [];
  const accessoryKey = '';
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const existingItem = cart.find((item) => item.id === productId && (item.accessoryKey || '') === accessoryKey);

  if (existingItem) {
    existingItem.quantity = (Number(existingItem.quantity) || 0) + quantity;
  } else {
    cart.push({
      id: productId,
      name: 'Bánh Kem Bento Dâu Tây Tươi (Hộp Bento Sinh Nhật)',
      price: selectedPrice,
      accessories,
      accessoryKey,
      image: 'assets/banhdautay2.jpg',
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

if (recommendationsTrack && recommendationsSection && 'IntersectionObserver' in window) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let sectionIsVisible = false;
  let pointerIsOverSection = false;
  let sectionHasFocus = false;
  let direction = 1;
  let previousFrameTime = 0;
  let animationFrameId;

  const shouldAnimate = () => (
    sectionIsVisible
    && !pointerIsOverSection
    && !sectionHasFocus
    && !document.hidden
    && !reducedMotion.matches
  );

  const pauseAutoScroll = () => {
    if (animationFrameId !== undefined) {
      window.cancelAnimationFrame(animationFrameId);
      animationFrameId = undefined;
    }
    previousFrameTime = 0;
    recommendationsTrack.classList.remove('is-auto-scrolling');
  };

  const startAutoScroll = () => {
    if (!shouldAnimate() || animationFrameId) return;
    recommendationsTrack.classList.add('is-auto-scrolling');
    animationFrameId = window.requestAnimationFrame(animateRecommendations);
  };

  const visibilityObserver = new IntersectionObserver(([entry]) => {
    sectionIsVisible = entry.isIntersecting;
    if (sectionIsVisible) {
      startAutoScroll();
    } else {
      pauseAutoScroll();
    }
  });
  visibilityObserver.observe(recommendationsSection);

  recommendationsSection.addEventListener('pointerenter', () => {
    pointerIsOverSection = true;
    pauseAutoScroll();
  });
  recommendationsSection.addEventListener('pointerleave', () => {
    pointerIsOverSection = false;
    startAutoScroll();
  });
  recommendationsSection.addEventListener('focusin', () => {
    sectionHasFocus = true;
    pauseAutoScroll();
  });
  recommendationsSection.addEventListener('focusout', (event) => {
    sectionHasFocus = recommendationsSection.contains(event.relatedTarget);
    if (sectionHasFocus) {
      pauseAutoScroll();
    } else {
      startAutoScroll();
    }
  });

  const animateRecommendations = (time) => {
    animationFrameId = undefined;
    if (!shouldAnimate()) {
      pauseAutoScroll();
      return;
    }

    const elapsed = previousFrameTime ? Math.min(time - previousFrameTime, 50) : 0;
    previousFrameTime = time;
    const maxScroll = recommendationsTrack.scrollWidth - recommendationsTrack.clientWidth;
    if (maxScroll > 0) {
      const nextPosition = recommendationsTrack.scrollLeft + direction * elapsed * 0.035;
      if (nextPosition >= maxScroll) {
        recommendationsTrack.scrollLeft = maxScroll;
        direction = -1;
      } else if (nextPosition <= 0) {
        recommendationsTrack.scrollLeft = 0;
        direction = 1;
      } else {
        recommendationsTrack.scrollLeft = nextPosition;
      }
    }

    animationFrameId = window.requestAnimationFrame(animateRecommendations);
  };

  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) {
      pauseAutoScroll();
    } else {
      startAutoScroll();
    }
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      pauseAutoScroll();
    } else {
      startAutoScroll();
    }
  });
  window.addEventListener('pagehide', pauseAutoScroll);
  window.addEventListener('pageshow', startAutoScroll);
}

const initialReviewPageSize = 4;
let visibleReviewCount = initialReviewPageSize;
let activeReviewFilter = 'all';

function updateReviewList(resetVisibleCount = false) {
  if (resetVisibleCount) visibleReviewCount = initialReviewPageSize;

  const matchingReviews = reviewCards.filter((card) => {
    return activeReviewFilter === 'all' || card.dataset.reviewTags.split(' ').includes(activeReviewFilter);
  });

  reviewTotal.textContent = reviewCards.length;
  reviewSectionTotal.textContent = reviewCards.length;
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
updateCurrentPrice();