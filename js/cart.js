document.addEventListener("DOMContentLoaded", () => {
  const qtyValue = document.querySelector(".qty-value");
  const minusBtn = document.querySelector(".qty-btn.minus");
  const plusBtn = document.querySelector(".qty-btn.plus");
  const totalCell = document.querySelector(".total-cell");
  const priceCell = document.querySelector(".price-cell");
  const summaryValue = document.querySelector(".summary-row .value");
  const summaryTotal = document.querySelector(".summary-total strong");
  const checkoutBtn = document.querySelector(".checkout-btn");

  const unitPrice = 100000;

  function formatMoney(value) {
    return new Intl.NumberFormat("vi-VN").format(value) + "đ";
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
