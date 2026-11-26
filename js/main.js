document.addEventListener("DOMContentLoaded", function () {
  // 1. Lấy tên file hoặc đường dẫn hiện tại trên thanh địa chỉ 📍
  const currentPath = window.location.pathname;

  // 2. Chọn tất cả các thẻ <a> nằm trong menu navigation 🔗
  const navLinks = document.querySelectorAll(".navbar a");

  // 3. Duyệt qua từng liên kết để kiểm tra
  navLinks.forEach((link) => {
    const linkPath = link.getAttribute("href");

    // Nếu đường dẫn hiện tại trùng với href của thẻ a
    if (
      linkPath === currentPath ||
      (currentPath === "/" && linkPath === "/") ||
      (linkPath !== "/" && currentPath.endsWith(linkPath))
    ) {
      link.classList.add("active"); // 🌟 Thêm class active
    }
  });

  // Cập nhật trạng thái tài khoản trong header sau khi header/footer được tạo.
  const accountLink = document.querySelector(".header .account-link");
  if (accountLink) {
    const baseUrl = window.location.pathname.toLowerCase().includes("/policy/")
      ? "../"
      : "./";
    let currentUser = null;
    try {
      currentUser = JSON.parse(localStorage.getItem("LOVE_CAKE_CURRENT_USER") || "null");
    } catch (error) {
      console.error("Không thể đọc phiên đăng nhập:", error);
    }

    if (currentUser && typeof currentUser.name === "string") {
      const safeName = currentUser.name.replace(/[&<>"']/g, (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character]);
      const accountTarget = `${baseUrl}account.html`;
      accountLink.outerHTML = `
        <div class="account-menu">
          <button class="account-link is-authenticated" type="button" aria-expanded="false" aria-haspopup="true">
            <span class="header-account-avatar" aria-hidden="true">${safeName.charAt(0).toUpperCase()}</span>
            <span id="account-label">Chào, ${safeName}</span>
            <span class="account-menu__chevron" aria-hidden="true">⌄</span>
          </button>
          <div class="account-dropdown" hidden>
            ${currentUser.role === "admin"
              ? `<a href="${baseUrl}admin.html">Trang quản trị</a>`
              : `<a href="${accountTarget}">Trang cá nhân</a>
                 <a href="${accountTarget}#orders">Lịch sử đơn hàng</a>`}
            <button type="button" data-account-logout>Đăng xuất</button>
          </div>
        </div>`;
      const trigger = document.querySelector(".account-menu .account-link");
      const dropdown = document.querySelector(".account-dropdown");
      trigger.addEventListener("click", () => {
        const isOpen = trigger.getAttribute("aria-expanded") === "true";
        trigger.setAttribute("aria-expanded", String(!isOpen));
        dropdown.hidden = isOpen;
      });
      document.addEventListener("click", (event) => {
        if (!event.target.closest(".account-menu")) {
          dropdown.hidden = true;
          trigger.setAttribute("aria-expanded", "false");
        }
      });
      document.querySelector("[data-account-logout]").addEventListener("click", () => {
        localStorage.removeItem("LOVE_CAKE_CURRENT_USER");
        localStorage.removeItem("loveCakeUser");
        sessionStorage.removeItem("loveCakeUser");
        window.location.href = `${baseUrl}index.html`;
      });
    } else {
      accountLink.href = "auth.html";
      const accountLabel = accountLink.querySelector("#account-label");
      if (accountLabel) accountLabel.textContent = "Đăng nhập / Đăng ký";
    }
  }

    initializeHeroSlider();
  initAutoSlider('categorySlider', '.category-track');
  initializePromoPopup();

});

function initializeHeroSlider() {
  const slider = document.getElementById("heroSlider");
  if (!slider) return;

  const slides = Array.from(slider.querySelectorAll(".hero-slide"));
  const dots = Array.from(slider.querySelectorAll(".hero-dot"));
  const previousButton = slider.querySelector(".hero-prev");
  const nextButton = slider.querySelector(".hero-next");
  const autoplayInterval = Number(slider.dataset.autoplayInterval);
  const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  if (!slides.length) return;

  let activeIndex = slides.findIndex((slide) => slide.classList.contains("active"));
  if (activeIndex < 0) activeIndex = 0;
  let autoplayTimer;

  const showSlide = (index) => {
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === activeIndex;
      slide.classList.toggle("active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
    });
    dots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === activeIndex;
      dot.classList.toggle("active", isActive);
      if (isActive) {
        dot.setAttribute("aria-current", "true");
      } else {
        dot.removeAttribute("aria-current");
      }
    });
  };

  const restartAutoplay = () => {
    window.clearInterval(autoplayTimer);
    if (
      slides.length < 2 ||
      !Number.isFinite(autoplayInterval) ||
      autoplayInterval <= 0 ||
      prefersReducedMotion
    ) {
      return;
    }
    autoplayTimer = window.setInterval(
      () => showSlide(activeIndex + 1),
      autoplayInterval,
    );
  };
  const selectSlide = (index) => {
    showSlide(index);
    restartAutoplay();
  };

  previousButton?.addEventListener("click", () => selectSlide(activeIndex - 1));
  nextButton?.addEventListener("click", () => selectSlide(activeIndex + 1));
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => selectSlide(index));
  });
  showSlide(activeIndex);
  restartAutoplay();
}

function initializePromoPopup() {
  const popup = document.getElementById("promoModal");
  if (!popup) return;

  let closeTimer;
  const closePopup = () => {
    if (popup.hidden || popup.classList.contains("is-closing")) return;
    popup.classList.remove("is-open");
    popup.classList.add("is-closing");
    window.clearTimeout(closeTimer);
    closeTimer = window.setTimeout(() => {
      popup.hidden = true;
      popup.classList.remove("is-closing");
      document.removeEventListener("keydown", handleEscape);
    }, 350);
  };
  const handleEscape = (event) => {
    if (event.key === "Escape") closePopup();
  };

  popup.querySelectorAll("[data-promo-close]").forEach((control) => {
    control.addEventListener("click", closePopup);
  });
  window.setTimeout(() => {
    popup.hidden = false;
    popup.classList.remove("is-closing");
    popup.classList.add("is-open");
    document.addEventListener("keydown", handleEscape);
    popup.querySelector(".promo-close")?.focus();
  }, 1200);
}

// scroll to top button
const scrollTopButton = document.querySelector("#scrollToTopBtn");
scrollTopButton?.addEventListener("click", function () {
  window.scrollTo({
    top: 0,
    behavior: "smooth" // Cuộn mượt mà
  });
})

// Hàm cập nhật số lượng hiển thị trên icon giỏ hàng 🎈
function updateCartBadge() {
  // 1. Lấy danh sách giỏ hàng từ localStorage (nếu chưa có thì trả về mảng rỗng)
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  // 2. Tính tổng số lượng tất cả các sản phẩm
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  // 3. Tìm thẻ span hiển thị số đếm và cập nhật giao diện
  const cartBadge = document.querySelector('.cart-badge');
  if (cartBadge) {
    cartBadge.textContent = totalQuantity;
  }
}
/* ==========================================
   SLIDER TỰ CHẠY + THANH CUỘN NGẮN (dùng chung)
   ========================================== */
function initAutoSlider(sliderId, trackSelector) {
  const slider = document.getElementById(sliderId);
  if (!slider) return;

  const track = slider.querySelector(trackSelector);
  const bar = slider.querySelector('.cat-scrollbar');
  const thumb = slider.querySelector('.cat-thumb');
  if (!track || !bar || !thumb) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SPEED = 0.6; // px mỗi khung hình, tăng lên để chạy nhanh hơn

  let pos = track.scrollLeft;
  let dir = 1;
  let paused = false;
  let resumeTimer = null;
  let dragging = false;

  /* ----- Thanh cuộn tự tạo ----- */
  function updateThumb() {
    const max = track.scrollWidth - track.clientWidth;
    bar.hidden = max <= 0;
    if (max <= 0) return;

    const barW = bar.clientWidth;
    const thumbW = Math.max(36, (track.clientWidth / track.scrollWidth) * barW);
    thumb.style.width = thumbW + 'px';
    thumb.style.left = (track.scrollLeft / max) * (barW - thumbW) + 'px';
  }

  function scrollFromBar(clientX) {
    const rect = bar.getBoundingClientRect();
    const thumbW = thumb.offsetWidth;
    const ratio = (clientX - rect.left - thumbW / 2) / (rect.width - thumbW);
    const max = track.scrollWidth - track.clientWidth;
    track.scrollLeft = Math.min(1, Math.max(0, ratio)) * max;
    pos = track.scrollLeft;
  }

  bar.addEventListener('pointerdown', (e) => {
    dragging = true;
    pause();
    bar.setPointerCapture(e.pointerId);
    scrollFromBar(e.clientX);
  });

  bar.addEventListener('pointermove', (e) => {
    if (dragging) scrollFromBar(e.clientX);
  });

  bar.addEventListener('pointerup', () => {
    dragging = false;
    resume(1500);
  });

  track.addEventListener('scroll', updateThumb);
  window.addEventListener('resize', updateThumb);

  /* ----- Tự chạy ----- */
  function tick() {
    if (!paused) {
      const max = track.scrollWidth - track.clientWidth;
      if (max > 0) {
        pos += SPEED * dir;
        if (pos >= max) { pos = max; dir = -1; }
        else if (pos <= 0) { pos = 0; dir = 1; }
        track.scrollLeft = pos;
      }
    }
    requestAnimationFrame(tick);
  }

  function pause() {
    paused = true;
    clearTimeout(resumeTimer);
  }

  function resume(delay) {
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(() => {
      pos = track.scrollLeft;
      paused = false;
    }, delay);
  }

  slider.addEventListener('mouseenter', pause);
  slider.addEventListener('mouseleave', () => { if (!dragging) resume(300); });
  slider.addEventListener('touchstart', pause, { passive: true });
  slider.addEventListener('touchend', () => resume(2000));
  slider.addEventListener('focusin', pause);
  slider.addEventListener('focusout', () => resume(300));

  updateThumb();
  if (!reduceMotion) requestAnimationFrame(tick);
}

/* ==========================================
   SẢN PHẨM TỪ FILE JSON
   ========================================== */
const PRODUCTS_URL = 'js\\products-data.json';

const escapeHTML = (value) =>
  String(value ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));

const formatVND = (n) => Number(n || 0).toLocaleString('vi-VN') + 'đ';

/* Chuẩn hóa tên trường: sửa ở đây nếu JSON của bạn dùng tên khác */
function normalizeProduct(p) {
  return {
    id: p.id,
    name: p.name ?? p.title ?? '',
    price: p.price ?? 0,
    category: p.category ?? '',
    image: p.image ?? p.img ?? p.thumbnail ?? '',
    rating: Number(p.rating ?? 5),
    count: p.reviews ?? p.sales ?? p.reviewCount ?? null,
  };
}

function renderProductCard(raw) {
  const p = normalizeProduct(raw);
  const stars = '★'.repeat(Math.round(p.rating)) + '☆'.repeat(5 - Math.round(p.rating));
  const link = `product-detail.html?id=${encodeURIComponent(p.id)}`;

  return `
    <article class="product-card">
      <a href="${link}" class="product-media">
        <img src="${escapeHTML(p.image)}" alt="${escapeHTML(p.name)}" loading="lazy" />
      </a>
      <div class="product-body">
        <p class="product-category">${escapeHTML(p.category)}</p>
        <h3 class="product-name">
          <a href="${link}">${escapeHTML(p.name)}</a>
        </h3>
        <div class="product-rating">
          <span class="stars" aria-label="${p.rating} sao">${stars}</span>
          ${p.count !== null ? `<span class="rating-count">(${escapeHTML(p.count)})</span>` : ''}
        </div>
        <div class="product-footer">
          <span class="product-price">${formatVND(p.price)}</span>
          <button type="button" class="btn-add-cart"
            data-id="${escapeHTML(p.id)}"
            data-name="${escapeHTML(p.name)}"
            data-price="${escapeHTML(p.price)}">
            <i class="fa-solid fa-plus"></i> Thêm vào giỏ
          </button>
        </div>
      </div>
    </article>`;
}

async function loadHomeProducts() {
  const track = document.getElementById('productTrack');
  if (!track) return;

  try {
    const res = await fetch(PRODUCTS_URL);
    if (!res.ok) throw new Error('HTTP ' + res.status);

    const data = await res.json();
    // Chấp nhận cả dạng [ ... ] lẫn { "products": [ ... ] }
    const list = Array.isArray(data) ? data : (data.products || data.items || []);

    track.innerHTML = list.map(renderProductCard).join('');
  } catch (err) {
    console.error('Không tải được sản phẩm:', err);
    track.innerHTML = '<p>Không tải được sản phẩm. Vui lòng thử lại sau.</p>';
  }
}

// Chạy hàm này ngay khi trang web tải xong 
document.addEventListener('DOMContentLoaded', updateCartBadge);
// Tải sản phẩm từ JSON rồi mới khởi tạo slider (chạy độc lập, không phụ thuộc khối ở trên)
document.addEventListener('DOMContentLoaded', async () => {
  await loadHomeProducts();
  initAutoSlider('productSlider', '.product-track');
});