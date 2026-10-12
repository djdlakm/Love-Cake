document.addEventListener("DOMContentLoaded", () => {
  const qtyValue = document.querySelector(".qty-value");
  const minusBtn = document.querySelector(".qty-btn.minus");
  const plusBtn = document.querySelector(".qty-btn.plus");
  const totalCell = document.querySelector(".total-cell");
  const priceCell = document.querySelector(".price-cell");
  const summaryValue = document.querySelector(".summary-row .value");
  const summaryTotal = document.querySelector(".summary-total strong");
  const checkoutBtn = document.querySelector(".checkout-btn");
  const cartLayout = document.querySelector(".cart-layout");
  const cartTable = document.querySelector(".cart-table");
  const emptyCartState = document.querySelector(".empty-cart-state");
  const cartCount = document.querySelector(".cart-count");
  const removeItemButtons = document.querySelectorAll(".remove-item, .trash-btn");
  const continueBtn = document.querySelector(".continue-btn");

  const unitPrice = 100000;

  function formatMoney(value) {
    return new Intl.NumberFormat("vi-VN").format(value) + "đ";
  }

  function setEmptyCartState(isEmpty) {
    const cartSummary = document.querySelector(".cart-summary");

    if (cartTable) cartTable.style.display = isEmpty ? "none" : "block";
    if (emptyCartState) emptyCartState.classList.toggle("hidden", !isEmpty);
    if (cartSummary) cartSummary.style.display = isEmpty ? "none" : "block";
    if (cartLayout) cartLayout.classList.toggle("is-empty", isEmpty);
    if (cartCount) cartCount.textContent = isEmpty ? "0 sản phẩm" : "1 sản phẩm";

    const summaryAmount = document.querySelector(".summary-row .value");
    const summaryTotalValue = document.querySelector(".summary-total strong");
    if (summaryAmount) summaryAmount.textContent = isEmpty ? "0đ" : "100.000đ";
    if (summaryTotalValue) summaryTotalValue.textContent = isEmpty ? "0đ" : "100.000đ";
  }

  function saveCart(qty) {
    try {
      localStorage.setItem(
        "cart",
        JSON.stringify([{
          name: "Bánh Bento kem dâu tây",
          price: unitPrice,
          quantity: qty,
          image: "assets/img/cart-cake.png",
          category: "cake",
        }]),
      );
      return true;
    } catch (error) {
      console.error("Không thể lưu giỏ hàng.", error);
      return false;
    }
  }

  function updateCart() {
    const qty = Number(qtyValue.textContent.trim());
    const total = unitPrice * qty;

    totalCell.textContent = formatMoney(total);
    summaryValue.textContent = formatMoney(total);
    summaryTotal.textContent = formatMoney(total);
    saveCart(qty);
  }

  minusBtn?.addEventListener("click", () => {
    let qty = Number(qtyValue.textContent.trim());
    if (qty > 1) {
      qty -= 1;
      qtyValue.textContent = qty;
      updateCart();
    }
  });

  plusBtn?.addEventListener("click", () => {
    let qty = Number(qtyValue.textContent.trim());
    qty += 1;
    qtyValue.textContent = qty;
    updateCart();
  });

  removeItemButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setEmptyCartState(true);
      try {
        localStorage.setItem("cart", JSON.stringify([]));
      } catch (error) {
        console.error("Không thể xóa giỏ hàng.", error);
      }
    });
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

  if (priceCell) {
    priceCell.textContent = formatMoney(unitPrice);
  }

  checkoutBtn?.addEventListener("click", () => {
    const qty = Number(qtyValue.textContent.trim());
    if (!saveCart(qty)) {
      window.alert("Không thể lưu giỏ hàng. Vui lòng thử lại nhé.");
      return;
    }
    window.location.href = "checkout.html";
  });

  updateCart();
});
