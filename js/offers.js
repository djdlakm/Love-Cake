document.addEventListener('click', (event) => {
  const button = event.target.closest('.copy-code[data-code]');
  if (!button) {
    return;
  }

  const code = button.dataset.code;

  try {
    localStorage.setItem('selectedOffer', code);
    window.location.href = 'checkout.html';
  } catch (error) {
    button.innerHTML = '<i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i> Thử lại';
    console.error('Không thể lưu mã ưu đãi đã chọn.', error);
  }
});