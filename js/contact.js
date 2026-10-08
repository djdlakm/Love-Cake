const contactForm = document.getElementById('contactForm');
const contactFormStatus = document.getElementById('contactFormStatus');

contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!contactForm.reportValidity()) return;

  const formData = new FormData(contactForm);
  const name = String(formData.get('name') || '').trim();
  const phone = String(formData.get('phone') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const message = String(formData.get('message') || '').trim();
  const subject = `Liên hệ từ ${name}`;
  const body = [
    `Họ và tên: ${name}`,
    `Số điện thoại: ${phone || 'Chưa cung cấp'}`,
    `Email: ${email}`,
    '',
    'Nội dung:',
    message,
  ].join('\n');

  contactFormStatus.textContent = 'Đang mở ứng dụng email để bạn gửi tin nhắn...';
  window.location.href = `mailto:info@lovecake.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});