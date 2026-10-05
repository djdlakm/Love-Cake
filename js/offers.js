async function copyOfferCode(code) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(code);
    return;
  }

  const input = document.createElement('textarea');
  input.value = code;
  input.setAttribute('readonly', '');
  input.style.position = 'fixed';
  input.style.opacity = '0';
  document.body.appendChild(input);
  input.select();
  const copied = document.execCommand('copy');
  input.remove();

  if (!copied) {
    throw new Error('Không thể sao chép mã trên trình duyệt này.');
  }
}

document.addEventListener('click', async (event) => {
  const button = event.target.closest('.copy-code');
  if (!button) {
    return;
  }

  const code = button.dataset.code;

  try {
    await copyOfferCode(code);
    button.innerHTML = '<i class="fa-solid fa-check" aria-hidden="true"></i> Đã copy';
  } catch (error) {
    button.innerHTML = '<i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i> Thử lại';
    console.error(error);
  }
});