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
  const normalizePath = (path) => {
    const withoutIndex = path.toLowerCase().replace(/\/index\.html$/, '/');
    return withoutIndex.replace(/\/+$/, '') || '/';
  };
  const currentPath = normalizePath(window.location.pathname);
  const navLinks = document.querySelectorAll('.navbar a');

  navLinks.forEach((link) => {
    const linkPath = normalizePath(
      new URL(link.href, window.location.href).pathname,
    );
    const parentLi = link.parentElement;

    if (parentLi) {
      parentLi.classList.remove('active');
    }

    if (currentPath === linkPath) {
      if (parentLi) {
        parentLi.classList.add('active');
      }
    }
  });
}

// 5. Hàm tải Header & Footer tự động 📦
function loadComponents() {
  // 🎯 TỰ ĐỘNG XÁC ĐỊNH BASE_URL:
  // Nếu URL chứa /Policy/ hoặc /policy/ thì lùi ra 1 cấp '../', ngược lại dùng './'
  const isSubFolder = window.location.pathname
    .toLowerCase()
    .includes('/policy/');
  const BASE_URL = isSubFolder ? '../' : './';

  const headerHTML = `
    <header class="header">
      <div class="container">
        <!-- Nút 3 gạch (Trái) 🍔 -->
        <button class="menu-toggle" id="menuToggle" aria-label="Toggle Menu">
            <i class="fas fa-bars"></i>
        </button>

        <!-- Logo (Giữa) 🖼️ -->
        <a href="${BASE_URL}" class="logo-wrapper">
          <img class="logo" src="${BASE_URL}assets/img/logo.png" alt="logo" />
        </a>

        <!-- Off-canvas Menu Trượt từ Trái 🎨 -->
        <nav class="navbar">
          <!-- Phần đầu Menu có tiêu đề và nút X đóng -->
          <div class="menu-header">
            <span>Menu</span>
            <button class="menu-close" id="menuClose" aria-label="Close Menu">&times;</button>
          </div>
          <ul>
            <li><a href="${BASE_URL}">Trang chủ</a></li>
            <li><a href="${BASE_URL}about.html">Giới thiệu</a></li>
            <li><a href="${BASE_URL}product.html">Sản phẩm</a></li>
            <li><a href="${BASE_URL}builder.html">Tự thiết kế bánh</a></li>
            <li><a href="${BASE_URL}contact.html">Liên hệ</a></li>
          </ul>
        </nav>

        <!-- Giỏ hàng (Phải) 🛒 -->
        <div class="cart">
            <a href="${BASE_URL}cart.html" class="cart-icon">
                <i class="fas fa-shopping-cart"></i>
                <span class="cart-badge">0</span>
            </a>
        </div>
      </div>
    </header>
  `;

  const footerHTML = `
    <footer class="footer">
      <button id="scrollToTopBtn" aria-label="Lên đầu trang">
        <i class="fa-solid fa-chevron-up"></i>
      </button>

      <div class="container footer-content">
        <div class="col1 footer-brand">
          <a href="${BASE_URL}" class="logo-wrapper brand">
            <img src="${BASE_URL}assets/img/logo.png" alt="Love Cake" class="logo" />
          </a>
          <p class="footer-about">
            Tiệm bánh handmade với nguyên liệu hữu cơ, mang đến những
            chiếc bánh ngọt ngào và đầy yêu thương.
          </p>
        </div>

        <div class="col2 footer-links">
          <h3>Liên kết nhanh</h3>
          <ul>
            <li><a href="${BASE_URL}">Trang chủ</a></li>
            <li><a href="${BASE_URL}about.html">Giới thiệu</a></li>
            <li><a href="${BASE_URL}product.html">Sản phẩm</a></li>
            <li><a href="${BASE_URL}builder.html">Tự thiết kế bánh</a></li>
            <li><a href="${BASE_URL}contact.html">Liên hệ</a></li>
          </ul>
        </div>

        <div class="col3 footer-contact">
          <h3>Liên hệ</h3>
          <ul>
            <li><span class="contact-icon">📍</span><span>123 Cầu Giấy, Hà Nội</span></li>
            <li><span class="contact-icon">📞</span><span>0901 234 567</span></li>
            <li><span class="contact-icon">✉️</span><a href="mailto:info@lovecake.vn" class="contact-mail">info@lovecake.vn</a></li>
          </ul>
          <div class="footer-social">
            <a href="#" class="social-btn" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
            <a href="#" class="social-btn" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
            <a href="#" class="social-btn" aria-label="TikTok"><i class="fa-brands fa-tiktok"></i></a>
          </div>
        </div>

        <div class="col4 footer-hours">
          <h3>Giờ mở cửa</h3>
          <ul>
            <li><span>Thứ 2 – Thứ 6</span><span class="hours">7:00 – 21:00</span></li>
            <li><span>Thứ 7 - Chủ Nhật</span><span class="hours">7:00 – 22:00</span></li>
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
  highlightCurrentPage();
}

document.addEventListener('DOMContentLoaded', loadComponents);
