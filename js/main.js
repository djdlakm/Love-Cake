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
