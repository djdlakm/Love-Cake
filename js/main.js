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

// scroll to top button
document.querySelector("#scrollToTopBtn").addEventListener("click", function () {
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
