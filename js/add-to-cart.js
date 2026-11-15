/* ==========================================
   ADD-TO-CART.JS - Thêm vào giỏ + cập nhật số trên icon giỏ hàng
   Dùng chung cho trang chủ (.btn-add-cart) và trang sản phẩm (.btn-add-sm)
   ========================================== */
(function () {
  const CART_KEY = 'cart';

  /* ---------- Đọc / ghi giỏ hàng ---------- */
  function getCart() {
    try {
      const data = JSON.parse(localStorage.getItem(CART_KEY));
      return Array.isArray(data) ? data : [];
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (e) {
      /* bỏ qua nếu trình duyệt chặn localStorage */
    }
  }

  /* ---------- Cập nhật số trên icon giỏ ---------- */
  function refreshCartBadge() {
    const total = getCart().reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
    const badge = document.querySelector('.cart-badge');
    if (badge) badge.textContent = total;
  }

  // Cho các file khác (main.js, header&footer.js...) gọi lại được
  window.refreshCartBadge = refreshCartBadge;

  /* ---------- Thêm sản phẩm ---------- */
  function addToCart(product) {
    const cart = getCart();
    const existing = cart.find((item) => String(item.id) === String(product.id));

    if (existing) {
      existing.quantity = (Number(existing.quantity) || 0) + 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        image: product.image || '',
        quantity: 1,
      });
    }

    saveCart(cart);
    refreshCartBadge();
  }

  /* ---------- Hiệu ứng nhỏ trên nút ---------- */
  function flashButton(button) {
    if (button.dataset.busy) return;
    button.dataset.busy = '1';

    const original = button.innerHTML;
    button.innerHTML = '<i class="fa-solid fa-check"></i> Đã thêm';
    button.disabled = true;

    setTimeout(() => {
      button.innerHTML = original;
      button.disabled = false;
      delete button.dataset.busy;
    }, 1000);
  }

  /* ---------- Lắng nghe click (event delegation) ---------- */
  document.addEventListener('click', (e) => {
    const button = e.target.closest('.btn-add-cart, .btn-add-sm');
    if (!button) return;

    e.preventDefault();

    // Lấy ảnh sản phẩm từ thẻ chứa nút (nếu có)
    const card = button.closest('.product-card, .shop-card');
    const img = card ? card.querySelector('img') : null;

    addToCart({
      id: button.dataset.id,
      name: button.dataset.name,
      price: button.dataset.price,
      image: img ? img.getAttribute('src') : '',
    });

    flashButton(button);
  });

  /* ---------- Cập nhật badge khi trang tải xong ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    refreshCartBadge();

    // Header được nạp bằng JS nên có thể xuất hiện muộn:
    // theo dõi đến khi thấy .cart-badge thì cập nhật lại
    if (!document.querySelector('.cart-badge')) {
      const observer = new MutationObserver(() => {
        if (document.querySelector('.cart-badge')) {
          refreshCartBadge();
          observer.disconnect();
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }
  });

  // Đồng bộ khi mở nhiều tab
  window.addEventListener('storage', (e) => {
    if (e.key === CART_KEY) refreshCartBadge();
  });
})();