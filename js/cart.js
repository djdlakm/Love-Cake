document.addEventListener("DOMContentLoaded", () => {
  const checkoutBtn = document.querySelector(".checkout-btn");
  const cartLayout = document.querySelector(".cart-layout");
  const cartTable = document.querySelector(".cart-table");
  const emptyCartState = document.querySelector(".empty-cart-state");
  const cartCount = document.querySelector(".cart-count");
  const continueBtn = document.querySelector(".continue-btn");
  const trashBtn = document.querySelector(".trash-btn");

  function formatMoney(value) {
    return new Intl.NumberFormat("vi-VN").format(value) + "đ";
  }

  function getCart() {
    try {
      const raw = localStorage.getItem("cart");
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
      if (typeof window.updateCartBadge === "function") {
        window.updateCartBadge();
      }
      return true;
    } catch (error) {
      console.error("Không thể lưu giỏ hàng.", error);
      return false;
    }
  }

  function getTotalQty() {
    const cart = getCart();
    return cart.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
  }

  function getTotalPrice() {
    const cart = getCart();
    return cart.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);
  }

  function setEmptyCartState(isEmpty) {
    const cartSummary = document.querySelector(".cart-summary");

    if (cartTable) cartTable.style.display = isEmpty ? "none" : "block";
    if (emptyCartState) emptyCartState.classList.toggle("hidden", !isEmpty);
    if (cartSummary) cartSummary.style.display = isEmpty ? "none" : "block";
    if (cartLayout) cartLayout.classList.toggle("is-empty", isEmpty);
    if (cartCount) cartCount.textContent = isEmpty ? "0 sản phẩm" : `${getTotalQty()} sản phẩm`;

    const summaryAmount = document.querySelector(".summary-row .value");
    const summaryTotalValue = document.querySelector(".summary-total strong");
    if (summaryAmount) summaryAmount.textContent = isEmpty ? "0đ" : formatMoney(getTotalPrice());
    if (summaryTotalValue) summaryTotalValue.textContent = isEmpty ? "0đ" : formatMoney(getTotalPrice());
  }

  function renderCart() {
    const cart = getCart();
    if (cart.length === 0) {
      setEmptyCartState(true);
      return;
    }
    setEmptyCartState(false);

    // Xóa các cart-item cũ đang có
    const existingItems = cartTable.querySelectorAll(".cart-item");
    existingItems.forEach((el) => el.remove());

    const footer = cartTable.querySelector(".cart-item-footer");

    cart.forEach((item, index) => {
      const itemEl = document.createElement("div");
      itemEl.className = "cart-item";
      itemEl.dataset.index = index;

      const detailsHtml = item.customDetails ? `
        <div style="font-size: 11.5px; color: #6b7280; margin-top: 4px; line-height: 1.4;">
          ${item.customDetails.size ? `Size: <strong>${item.customDetails.size}</strong> • ` : ''}
          ${item.customDetails.sponge ? `Cốt: ${item.customDetails.sponge} • ` : ''}
          ${item.customDetails.filling ? `Nhân: ${item.customDetails.filling}` : ''}
          ${item.customDetails.frosting ? `<br>Kem: ${item.customDetails.frosting}` : ''}
          ${item.customDetails.toppingsText && item.customDetails.toppingsText !== 'Không lấy topping' ? `<br>Topping: <strong>${item.customDetails.toppingsText}</strong>` : ''}
          ${item.customDetails.photosText ? `<br>Cắm ảnh mặt bánh: <strong>${item.customDetails.photosText}</strong>` : ''}
          ${item.customDetails.message && item.customDetails.message !== 'Không có' ? `<br>Lời chúc: "<em>${item.customDetails.message}</em>"` : ''}
          ${item.customDetails.note && item.customDetails.note !== 'Không có' ? `<br>Ghi chú: ${item.customDetails.note}` : ''}
        </div>
      ` : (item.accessories && item.accessories.length ? `
        <div style="font-size: 11.5px; color: #6b7280; margin-top: 4px;">
          Phụ kiện: ${item.accessories.join(', ')}
        </div>
      ` : '');

      itemEl.innerHTML = `
        <button class="remove-item" data-index="${index}" aria-label="Xóa sản phẩm">
          <i class="fa-solid fa-xmark"></i>
        </button>

        <div class="product-cell">
          <div class="product-thumb">
            <img src="${item.image || (item.customDetails ? 'assets/img/custom-cake-default.jpg' : 'assets/img/cart-cake.png')}" alt="${item.name}" />
          </div>

          <div class="product-info">
            <div class="product-badge">${(item.category || 'CAKE').toUpperCase()}</div>
            <h3>${item.name}</h3>
            ${detailsHtml}
          </div>
        </div>

        <div class="price-cell">${formatMoney(item.price)}</div>

        <div class="qty-cell">
          <div class="quantity-box">
            <button class="qty-btn minus" data-index="${index}" aria-label="Giảm số lượng">−</button>
            <span class="qty-value">${item.quantity || 1}</span>
            <button class="qty-btn plus" data-index="${index}" aria-label="Tăng số lượng">+</button>
          </div>
        </div>

        <div class="total-cell">${formatMoney((Number(item.price) || 0) * (Number(item.quantity) || 1))}</div>
      `;

      if (footer) {
        cartTable.insertBefore(itemEl, footer);
      } else {
        cartTable.appendChild(itemEl);
      }
    });

    const totalPrice = getTotalPrice();
    const totalQty = getTotalQty();

    if (cartCount) cartCount.textContent = `${totalQty} sản phẩm`;
    const summaryAmount = document.querySelector(".summary-row .value");
    const summaryTotalValue = document.querySelector(".summary-total strong");
    if (summaryAmount) summaryAmount.textContent = formatMoney(totalPrice);
    if (summaryTotalValue) summaryTotalValue.textContent = formatMoney(totalPrice);
  }

  // Sự kiện ủy quyền trên cartTable
  cartTable?.addEventListener("click", (e) => {
    const target = e.target;

    // Nút xóa từng item
    const removeBtn = target.closest(".remove-item");
    if (removeBtn) {
      const idx = Number(removeBtn.dataset.index);
      const cart = getCart();
      if (idx >= 0 && idx < cart.length) {
        cart.splice(idx, 1);
        saveCart(cart);
        renderCart();
      }
      return;
    }

    // Nút giảm số lượng
    const minusBtn = target.closest(".qty-btn.minus");
    if (minusBtn) {
      const idx = Number(minusBtn.dataset.index);
      const cart = getCart();
      if (idx >= 0 && idx < cart.length) {
        if (cart[idx].quantity > 1) {
          cart[idx].quantity -= 1;
        } else {
          cart.splice(idx, 1);
        }
        saveCart(cart);
        renderCart();
      }
      return;
    }

    // Nút tăng số lượng
    const plusBtn = target.closest(".qty-btn.plus");
    if (plusBtn) {
      const idx = Number(plusBtn.dataset.index);
      const cart = getCart();
      if (idx >= 0 && idx < cart.length) {
        cart[idx].quantity = (Number(cart[idx].quantity) || 1) + 1;
        saveCart(cart);
        renderCart();
      }
      return;
    }
  });

  // Nút xóa toàn bộ giỏ hàng
  trashBtn?.addEventListener("click", () => {
    saveCart([]);
    renderCart();
  });

  continueBtn?.addEventListener("click", () => {
    window.location.href = "product.html";
  });

  document.querySelector(".empty-primary-btn")?.addEventListener("click", () => {
    window.location.href = "product.html";
  });

  document.querySelector(".empty-secondary-btn")?.addEventListener("click", () => {
    window.location.href = "builder.html";
  });

  checkoutBtn?.addEventListener("click", () => {
    const cart = getCart();
    if (cart.length === 0) {
      window.alert("Giỏ hàng đang trống. Vui lòng chọn bánh nhé.");
      return;
    }
    window.location.href = "checkout.html";
  });

  renderCart();
});
