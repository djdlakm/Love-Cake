document.addEventListener("DOMContentLoaded", function () {
  const normalizePath = (path) => {
    const withoutIndex = path.toLowerCase().replace(/\/index\.html$/, "/");
    return withoutIndex.replace(/\/+$/, "") || "/";
  };
  const currentPath = normalizePath(window.location.pathname);
  const navLinks = document.querySelectorAll(".navbar a");

  navLinks.forEach((link) => {
    const linkPath = normalizePath(
      new URL(link.href, window.location.href).pathname
    );
    if (linkPath === currentPath) {
      link.classList.add("active");
    }
  });
});

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

/* ==========================================
   HOME.JS - Trang chủ Love Cake
   1. Popup quảng cáo Flash Sale
   ========================================== */
document.addEventListener('DOMContentLoaded', () => {
  initPromoPopup();
});

function initPromoPopup() {
  const modal = document.getElementById('promoModal');
  if (!modal) return;

  // Đổi thành true nếu chỉ muốn hiện 1 lần cho mỗi phiên (đóng tab là hiện lại)
  const SHOW_ONCE_PER_SESSION = false;
  const STORAGE_KEY = 'lovecake_promo_seen';
  const OPEN_DELAY = 400; // ms - chờ trang chủ hiện ra một chút rồi mới bật popup

  if (SHOW_ONCE_PER_SESSION && readSession(STORAGE_KEY)) return;

  const image = modal.querySelector('.promo-image');
  const closeBtn = modal.querySelector('.promo-close');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let lastFocused = null;

  function openPopup() {
    lastFocused = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = 'hidden'; // khoá cuộn trang chính
    // đợi 1 frame để trình duyệt áp dụng trạng thái ban đầu rồi mới chạy hiệu ứng
    requestAnimationFrame(() => {
      requestAnimationFrame(() => modal.classList.add('is-open'));
    });
    closeBtn.focus({ preventScroll: true });
    document.addEventListener('keydown', onKeydown);
    if (SHOW_ONCE_PER_SESSION) writeSession(STORAGE_KEY, '1');
  }

  function closePopup() {
    document.removeEventListener('keydown', onKeydown);
    const finish = () => {
      modal.hidden = true;
      modal.classList.remove('is-open', 'is-closing');
      document.body.style.overflow = '';
      if (lastFocused && lastFocused.focus) lastFocused.focus({ preventScroll: true });
    };
    if (reduceMotion) return finish();
    modal.classList.add('is-closing');
    setTimeout(finish, 280);
  }

  function onKeydown(e) {
    if (e.key === 'Escape') {
      closePopup();
      return;
    }
    // Giữ phím Tab chỉ xoay vòng trong popup
    if (e.key === 'Tab') {
      const items = [...modal.querySelectorAll('button, a[href]')];
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  // Bấm nút X hoặc bấm ra vùng nền mờ đều đóng popup
  modal.querySelectorAll('[data-promo-close]').forEach((el) => {
    el.addEventListener('click', closePopup);
  });

  // Chỉ hiện popup khi ảnh đã tải xong (tránh khung trống); ảnh lỗi thì bỏ qua luôn
  const start = () => setTimeout(openPopup, OPEN_DELAY);
  if (image.complete && image.naturalWidth > 0) start();
  else image.addEventListener('load', start, { once: true });
}

/* sessionStorage có thể bị chặn (chế độ riêng tư) nên luôn bọc try/catch */
function readSession(key) {
  try {
    return sessionStorage.getItem(key);
  } catch (e) {
    return null;
  }
}

function writeSession(key, value) {
  try {
    sessionStorage.setItem(key, value);
  } catch (e) {
    /* bỏ qua */
  }
}