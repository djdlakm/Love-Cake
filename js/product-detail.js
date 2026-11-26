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
const mainProductImage = document.getElementById('mainProductImage');
const galleryThumbnails = document.getElementById('galleryThumbnails');
const galleryPrevious = document.getElementById('galleryPrevious');
const galleryNext = document.getElementById('galleryNext');

let selectedPrice = 100000;
let galleryImages = [];
let currentGalleryIndex = 0;
let galleryAutoplayTimer;
let selectedProduct = {
  id: 'BLC-2026',
  name: 'Bánh Kem Bento Dâu Tây Tươi (Hộp Bento Sinh Nhật)',
  price: selectedPrice,
  category: 'Bánh Bento',
  image: 'assets/banhdautay2.jpg',
};

function formatCurrency(amount) {
  return `${amount.toLocaleString('vi-VN')}đ`;
}

function updateCurrentPrice() {
  currentPriceEl.textContent = formatCurrency(selectedPrice);
}

function showGalleryImage(index) {
  if (galleryImages.length === 0) return;

  currentGalleryIndex = (index + galleryImages.length) % galleryImages.length;
  mainProductImage.src = galleryImages[currentGalleryIndex];
  mainProductImage.alt = selectedProduct.name;

  galleryThumbnails.querySelectorAll('.gallery-thumbnail').forEach((button, buttonIndex) => {
    const isActive = buttonIndex === currentGalleryIndex;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
}

function updateGalleryAutoplay() {
  window.clearInterval(galleryAutoplayTimer);
  if (galleryImages.length < 2 || document.hidden) return;

  galleryAutoplayTimer = window.setInterval(() => {
    showGalleryImage(currentGalleryIndex + 1);
  }, 3000);
}

function renderProductGallery(product) {
  galleryImages = product.images.length > 0 ? product.images : [product.image];
  currentGalleryIndex = 0;
  galleryThumbnails.replaceChildren(...galleryImages.map((src, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'gallery-thumbnail';
    button.dataset.galleryIndex = index;
    button.setAttribute('aria-label', `Xem ảnh ${index + 1} của ${product.name}`);
    button.setAttribute('aria-pressed', String(index === 0));

    const image = document.createElement('img');
    image.src = src;
    image.alt = '';
    image.loading = 'lazy';
    button.append(image);
    return button;
  }));
  galleryThumbnails.hidden = galleryImages.length < 2;
  galleryPrevious.hidden = galleryImages.length < 2;
  galleryNext.hidden = galleryImages.length < 2;
  showGalleryImage(0);
  updateGalleryAutoplay();
}

function displayProduct(product) {
  const images = Array.isArray(product.images) ? product.images.filter(Boolean) : [];
  const productImage = images[0] || product.image || 'assets/img/cart-cake.png';
  selectedProduct = { ...product, image: productImage, images: images.length ? images : [productImage] };
  selectedPrice = Number(product.price);

  document.querySelector('.product-title').textContent = product.name;
  renderProductGallery(selectedProduct);
  document.querySelector('.product-description').textContent = product.description;
  document.title = `${product.name} | Love Cake`;
  updateCurrentPrice();

  if (product.originalPrice) {
    oldPriceEl.textContent = formatCurrency(Number(product.originalPrice));
    const discount = Math.round((1 - product.price / product.originalPrice) * 100);
    document.querySelector('.save-tag').textContent = `Tiết kiệm -${discount}%`;
  } else {
    oldPriceEl.hidden = true;
    document.querySelector('.save-tag').hidden = true;
  }

  const ingredients = document.querySelector('.ingredient-grid');
  ingredients.replaceChildren(...product.ingredients.map((ingredient) => {
    const item = document.createElement('li');
    item.className = 'ingredient-item';
    const text = document.createElement('strong');
    text.textContent = ingredient;
    item.append(text);
    return item;
  }));

  const usage = document.querySelector('.usage-list');
  usage.replaceChildren(...product.usage.map((instruction) => {
    const item = document.createElement('li');
    item.textContent = instruction;
    return item;
  }));
}

const requestedProductId = new URLSearchParams(window.location.search).get('id');
const productDataPromise = fetch('js/products-data.json')
  .then((response) => {
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  })
  .then((products) => {
    if (!Array.isArray(products)) throw new Error('Dữ liệu sản phẩm không hợp lệ.');
    return products;
  })
  .catch((error) => {
    console.error('Không thể tải dữ liệu sản phẩm.', error);
    return [];
  });

function renderRecommendations(products) {
  const cards = products
    .filter((product) => product.id !== requestedProductId)
    .map((product) => {
      const card = document.createElement('article');
      card.className = 'recommendation-card';

      const image = document.createElement('img');
      image.src = product.image || product.images[0] || 'assets/img/cart-cake.png';
      image.alt = product.name;
      image.loading = 'lazy';

      const copy = document.createElement('div');
      copy.className = 'recommendation-copy';
      const label = document.createElement('span');
      label.className = 'recommendation-label';
      label.textContent = product.category;
      const name = document.createElement('h3');
      name.textContent = product.name;
      copy.append(label, name);
      card.append(image, copy);
      return card;
    });

  recommendationsTrack.replaceChildren(...cards);
  updateRecommendationControls();
}
productDataPromise.then((products) => {
  const product = products.find((item) => item.id === requestedProductId);
  if (product) displayProduct(product);
  renderRecommendations(products);
});

galleryPrevious.addEventListener('click', () => {
  showGalleryImage(currentGalleryIndex - 1);
  updateGalleryAutoplay();
});
galleryNext.addEventListener('click', () => {
  showGalleryImage(currentGalleryIndex + 1);
  updateGalleryAutoplay();
});
galleryThumbnails.addEventListener('click', (event) => {
  const thumbnail = event.target.closest('.gallery-thumbnail');
  if (!thumbnail) return;
  showGalleryImage(Number(thumbnail.dataset.galleryIndex));
  updateGalleryAutoplay();
});

document.addEventListener('visibilitychange', updateGalleryAutoplay);

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
  const flyer = document.createElement('img');

  flyer.className = 'cart-fly-icon';
  flyer.setAttribute('aria-hidden', 'true');
  flyer.src = selectedProduct.image;
  flyer.alt = '';
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

document.querySelector('.btn-secondary')?.addEventListener('click', async (event) => {
  if (requestedProductId && requestedProductId.startsWith('BT-')) {
    const products = await productDataPromise;
    const product = products.find((item) => item.id === requestedProductId);
    if (!product) return;
    displayProduct(product);
  }

  const quantity = Math.max(1, Number(qtyInput.value) || 1);
  const accessories = [];
  const accessoryKey = '';
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const existingItem = cart.find((item) => item.id === selectedProduct.id && (item.accessoryKey || '') === accessoryKey);

  if (existingItem) {
    existingItem.quantity = (Number(existingItem.quantity) || 0) + quantity;
    existingItem.image = selectedProduct.image;
    existingItem.name = selectedProduct.name;
    existingItem.category = selectedProduct.category;
  } else {
    cart.push({
      id: selectedProduct.id,
      name: selectedProduct.name,
      price: selectedPrice,
      category: selectedProduct.category,
      accessories,
      accessoryKey,
      image: selectedProduct.image,
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