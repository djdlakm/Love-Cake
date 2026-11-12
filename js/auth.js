document.addEventListener('DOMContentLoaded', () => {
  const tabs = Array.from(document.querySelectorAll('[data-auth-tab]'));
  const panels = Array.from(document.querySelectorAll('[data-auth-panel]'));
  const title = document.getElementById('form-title');
  const description = document.getElementById('form-description');

  const selectTab = (name) => {
    tabs.forEach((tab) => {
      const selected = tab.dataset.authTab === name;
      tab.classList.toggle('is-active', selected);
      tab.setAttribute('aria-selected', String(selected));
    });

    panels.forEach((panel) => {
      panel.hidden = panel.dataset.authPanel !== name;
    });

    const isRegister = name === 'register';
    title.textContent = isRegister ? 'Tạo tài khoản mới' : 'Chào mừng trở lại!';
    description.textContent = isRegister
      ? 'Đăng ký để cùng Love Cake lưu giữ những khoảnh khắc ngọt ngào.'
      : 'Đăng nhập để tiếp tục hành trình ngọt ngào cùng Love Cake.';
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => selectTab(tab.dataset.authTab));
  });

  document.querySelectorAll('[data-password-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      const input = document.getElementById(button.dataset.passwordToggle);
      if (!input) return;
      const showPassword = input.type === 'password';
      input.type = showPassword ? 'text' : 'password';
      button.textContent = showPassword ? 'Ẩn' : 'Hiện';
      button.setAttribute(
        'aria-label',
        `${showPassword ? 'Ẩn' : 'Hiện'} mật khẩu`,
      );
    });
  });

  const registerPassword = document.getElementById('register-password');
  const confirmPassword = document.getElementById('confirm-password');
  const validatePasswordMatch = () => {
    confirmPassword.setCustomValidity(
      confirmPassword.value && confirmPassword.value !== registerPassword.value
        ? 'Mật khẩu nhập lại chưa khớp.'
        : '',
    );
  };

  registerPassword.addEventListener('input', validatePasswordMatch);
  confirmPassword.addEventListener('input', validatePasswordMatch);
});
