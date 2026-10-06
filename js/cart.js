document.addEventListener("DOMContentLoaded", () => {
  const qtyValue = document.querySelector(".qty-value");
  const minusBtn = document.querySelector(".qty-btn.minus");
  const plusBtn = document.querySelector(".qty-btn.plus");
  const totalCell = document.querySelector(".total-cell");
  const priceCell = document.querySelector(".price-cell");
  const summaryValue = document.querySelector(".summary-row .value");
  const summaryTotal = document.querySelector(".summary-total strong");

  const unitPrice = 100000;

  function formatMoney(value) {
    return new Intl.NumberFormat("vi-VN").format(value) + "đ";
  }

  function updateCart() {
    const qty = Number(qtyValue.textContent.trim());
    const total = unitPrice * qty;

    totalCell.textContent = formatMoney(total);
    summaryValue.textContent = formatMoney(total);
    summaryTotal.textContent = formatMoney(total);
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

  updateCart();
});
