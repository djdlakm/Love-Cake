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

// Chạy hàm này ngay khi trang web tải xong 🚀
document.addEventListener('DOMContentLoaded', updateCartBadge);
