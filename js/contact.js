const contactForm = document.getElementById('contactForm');
const contactSuccessDialog = document.getElementById('contactSuccessDialog');
const contactSuccessClose = document.getElementById('contactSuccessClose');
const contactSuccessConfirm = document.getElementById('contactSuccessConfirm');
const contactSubmitButton = contactForm?.querySelector('.contact-submit');

function closeContactSuccessDialog() {
  contactSuccessDialog.hidden = true;
  contactSubmitButton?.focus();
}

contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!contactForm.reportValidity()) return;

  contactForm.reset();
  contactSuccessDialog.hidden = false;
  contactSuccessClose.focus();
});

contactSuccessClose?.addEventListener('click', closeContactSuccessDialog);
contactSuccessConfirm?.addEventListener('click', closeContactSuccessDialog);

contactSuccessDialog?.addEventListener('click', (event) => {
  if (event.target === contactSuccessDialog) closeContactSuccessDialog();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && contactSuccessDialog && !contactSuccessDialog.hidden) {
    closeContactSuccessDialog();
  }
});