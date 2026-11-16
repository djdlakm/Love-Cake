document.addEventListener('click', (event) => {
  const button = event.target.closest('.copy-code[data-code]');
  if (!button) {
    return;
  }

  window.location.href = 'checkout.html';
});