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
  const productMenuToggle = document.querySelector('.nav-dropdown-toggle');
  const productMenu = productMenuToggle?.closest('.nav-dropdown');

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

  if (productMenuToggle && productMenu) {
    productMenuToggle.addEventListener('click', () => {
      const isExpanded = productMenuToggle.getAttribute('aria-expanded') === 'true';
      productMenuToggle.setAttribute('aria-expanded', String(!isExpanded));
      productMenu.classList.toggle('is-expanded', !isExpanded);
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
  const navLinks = document.querySelectorAll('.navbar > ul > li > a');

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
        <a href="${BASE_URL}index.html" class="logo-wrapper">
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
            <li><a href="${BASE_URL}index.html">Trang chủ</a></li>
            <li><a href="${BASE_URL}about.html">Giới thiệu</a></li>
            <li class="nav-dropdown">
              <a href="${BASE_URL}product.html">Sản phẩm</a>
              <button
                class="nav-dropdown-toggle"
                type="button"
                aria-label="Mở danh mục sản phẩm"
                aria-expanded="false"
                aria-controls="productCategoryMenu"
              >
                <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
              </button>
              <ul class="nav-dropdown-menu" id="productCategoryMenu" aria-label="Danh mục sản phẩm">
                <li><a href="${BASE_URL}product.html?cat=banh-hoa-qua-tuoi">Bánh hoa quả tươi</a></li>
                <li><a href="${BASE_URL}product.html?cat=banh-kem">Bánh Kem</a></li>
                <li><a href="${BASE_URL}product.html?cat=banh-bento">Bánh Bento</a></li>
                <li><a href="${BASE_URL}product.html?cat=cheese-cake">Cheese Cake</a></li>
                <li><a href="${BASE_URL}product.html?cat=mini-cake">Mini Cake</a></li>
                <li><a href="${BASE_URL}product.html?cat=banh-le">Bánh lễ</a></li>
              </ul>
            </li>
            <li><a href="${BASE_URL}builder.html">Tự thiết kế bánh</a></li>
            <li><a href="${BASE_URL}contact.html">Liên hệ</a></li>
            <li class="mobile-account-link"><a href="${BASE_URL}auth.html">Đăng nhập / Đăng ký</a></li>
          </ul>
        </nav>

        <!-- Tài khoản và giỏ hàng (Phải) -->
        <div class="header-actions">
            <a href="${BASE_URL}auth.html" class="account-link">
              <i class="fas fa-user" aria-hidden="true"></i>
              <span id="account-label">Đăng nhập / Đăng ký</span>
            </a>
            <a href="${BASE_URL}cart.html" class="cart-icon">
              <i class="fas fa-shopping-cart" aria-hidden="true"></i>
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
          <a href="${BASE_URL}index.html" class="logo-wrapper brand">
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
            <li><a href="${BASE_URL}index.html">Trang chủ</a></li>
            <li><a href="${BASE_URL}about.html">Giới thiệu</a></li>
            <li><a href="${BASE_URL}product.html">Sản phẩm</a></li>
            <li><a href="${BASE_URL}builder.html">Tự thiết kế bánh</a></li>
            <li><a href="${BASE_URL}contact.html">Liên hệ</a></li>
          </ul>
        </div>

        <div class="col3 footer-contact">
          <h3>Liên hệ</h3>
          <ul>
            <li><span class="contact-icon">📍</span><span>12 Chùa Bộc, Kim Liên, Hà Nội</span></li>
            <li><span class="contact-icon">📞</span><span>0969 082 471</span></li>
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
          <div class="footer-links footer-policy">
            <h3>Chính sách &amp; Điều khoản</h3>
            <ul>
              <li><a href="${BASE_URL}policy.html">Xem chính sách</a></li>
            </ul>
          </div>
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

  const accountLabel = document.getElementById('account-label');
  const accountLink = accountLabel?.closest('.account-link');
  let currentUser = null;
  try {
    currentUser = JSON.parse(localStorage.getItem('LOVE_CAKE_CURRENT_USER') || 'null');
  } catch (error) {
    console.error('Không thể đọc phiên đăng nhập trên header:', error);
  }

  if (currentUser && typeof currentUser.name === 'string' && accountLabel && accountLink) {
    accountLabel.textContent = currentUser.name;
    accountLink.classList.add('is-authenticated');
    accountLink.href =
      currentUser.role === 'admin'
        ? `${BASE_URL}admin.html`
        : `${BASE_URL}account.html`;
    accountLink.setAttribute('aria-label', `Tài khoản ${currentUser.name}`);
  } else if (accountLink) {
    accountLink.href = `${BASE_URL}auth.html`;
  }

  // Kích hoạt tính năng
  updateCartBadge();
  initScrollToTop();
  initMobileMenu();
  highlightCurrentPage();
}

document.addEventListener('DOMContentLoaded', loadComponents);
