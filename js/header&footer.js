// 1. Hàm cập nhật số lượng giỏ hàng 🛒
function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  const cartBadge = document.querySelector('.cart-badge');
  if (cartBadge) {
    cartBadge.textContent = totalQuantity;
  }
}

// 2. Hàm kích hoạt nút Scroll to Top 🚀
function initScrollToTop() {
  const scrollBtn = document.getElementById('scrollToTopBtn');
  if (scrollBtn) {
    scrollBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  }
}

// 3. Hàm kích hoạt Off-canvas Mobile Menu 🍔
function initMobileMenu() {
  const menuToggle = document.querySelector('#menuToggle');
  const menuClose = document.querySelector('#menuClose');
  const navbar = document.querySelector('.navbar');

  // Mở menu khi bấm nút 3 gạch 🚪
  if (menuToggle && navbar) {
    menuToggle.addEventListener('click', () => {
      navbar.classList.add('active');
    });
  }

  // Đóng menu khi bấm nút X ❌
  if (menuClose && navbar) {
    menuClose.addEventListener('click', () => {
      navbar.classList.remove('active');
    });
  }
}

// 4. Hàm tự động Highlight trang hiện tại 📍
function highlightCurrentPage() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.navbar a');

  navLinks.forEach((link) => {
    const linkPath = link.getAttribute('href');
    const parentLi = link.parentElement;

    // Xóa class active cũ
    parentLi.classList.remove('active');

    // Kiểm tra trùng khớp URL (xử lý cả trang chủ "/" hoặc "index.html")
    if (
      currentPath === linkPath ||
      (currentPath === '/' && linkPath === '/') ||
      (currentPath.endsWith('index.html') && linkPath === '/')
    ) {
      parentLi.classList.add('active');
    }
  });
}

// 5. Hàm tải Header & Footer tự động 📦
function loadComponents() {
  const headerHTML = `
    <header class="header">
      <div class="container">
        <!-- Nút 3 gạch (Trái) 🍔 -->
        <button class="menu-toggle" id="menuToggle" aria-label="Toggle Menu">
            <i class="fas fa-bars"></i>
        </button>

        <!-- Logo (Giữa) 🖼️ -->
        <a href="/" class="logo-wrapper">
          <img class="logo" src="/assets/img/logo.png" alt="logo" />
        </a>

        <!-- Off-canvas Menu Trượt từ Trái 🎨 -->
        <nav class="navbar">
          <!-- Phần đầu Menu có tiêu đề và nút X đóng -->
          <div class="menu-header">
            <span>Menu</span>
            <button class="menu-close" id="menuClose" aria-label="Close Menu">&times;</button>
          </div>
          <ul>
            <li><a href="/">Trang chủ</a></li>
            <li><a href="about.html">Giới thiệu</a></li>
            <li><a href="shop.html">Cửa hàng</a></li>
            <li><a href="builder.html">Tự thiết kế bánh</a></li>
            <li><a href="contact.html">Liên hệ</a></li>
          </ul>
        </nav>

        <!-- Giỏ hàng (Phải) 🛒 -->
        <div class="cart">
            <a href="/cart.html" class="cart-icon">
                <i class="fas fa-shopping-cart"></i>
                <span class="cart-badge">0</span>
            </a>
        </div>
      </div>
    </header>
  `;

  const footerHTML = `
    <footer class="footer">
      <button id="scrollToTopBtn">
        <i class="fa-solid fa-chevron-up"></i>
      </button>

      <div class="container">
        <div class="col1">
          <img class="logo" src="/assets/img/logo.png" alt="logo" />
          <ul>
            <li>
              <p>📍</p>
              <p>12 Chùa Bộc, Kim Liên, Hà Nội</p>
            </li>
            <li>
              <p>📞</p>
              <p>0987654321</p>
            </li>
            <li>
              <p>✉️</p>
              <p>info@lovecake.com</p>
            </li>
          </ul>
        </div>

        <div class="col2">
          <h3>Giờ mở cửa</h3>
          <ul>
            <li>
              <p>Thứ 2 - Thứ 6</p>
              <p>: 8:00 AM - 8:00 PM</p>
            </li>
            <li>
              <p>Thứ 7 - Chủ nhật</p>
              <p>: 9:00 AM - 6:00 PM</p>
            </li>
          </ul>
        </div>

        <div class="col3">
          <h3>Chính sách</h3>
          <ul>
            <li><a href="/policy/privacy.html">Chính sách bảo mật</a></li>
            <li><a href="/policy/payment.html">Chính sách thanh toán</a></li>
            <li><a href="/policy/shipping.html">Chính sách giao hàng</a></li>
          </ul>
        </div>
      </div>

      <div class="bottom">
        <p>© 2026 Love Cake. All rights reserved.</p>
      </div>
    </footer>
  `;

  const headerElement = document.getElementById('header-placeholder');
  const footerElement = document.getElementById('footer-placeholder');

  if (headerElement) headerElement.innerHTML = headerHTML;
  if (footerElement) footerElement.innerHTML = footerHTML;

  // Kích hoạt tính năng
  updateCartBadge();
  initScrollToTop();
  initMobileMenu();
  highlightCurrentPage(); // 🎯 Gọi hàm tự động active đúng trang
}

document.addEventListener('DOMContentLoaded', loadComponents);