document.addEventListener('DOMContentLoaded', () => {
  const USERS_KEY = 'LOVE_CAKE_USERS';
  const LEGACY_USERS_KEY = 'loveCakeUsers';
  const CURRENT_USER_KEY = 'LOVE_CAKE_CURRENT_USER';
  const LEGACY_USER_KEY = 'loveCakeUser';
  const PASSWORD_ITERATIONS = 120000;
  const encoder = new TextEncoder();
  const tabs = Array.from(document.querySelectorAll('[data-auth-tab]'));
  const panels = Array.from(document.querySelectorAll('[data-auth-panel]'));
  const title = document.getElementById('form-title');
  const description = document.getElementById('form-description');
  const loginForm = document.getElementById('login-panel');
  const registerForm = document.getElementById('register-panel');
  const forgotForm = document.getElementById('forgot-panel');
  const registerPassword = document.getElementById('register-password');
  const confirmPassword = document.getElementById('confirm-password');
  const toast = document.getElementById('auth-toast');

  const showToast = (message) => {
    if (!toast) {
      window.alert(message);
      return;
    }
    toast.textContent = message;
    toast.hidden = false;
    window.setTimeout(() => {
      toast.hidden = true;
    }, 3500);
  };

  const setMessage = (element, text, isError = true) => {
    if (!element) return;
    element.textContent = text;
    element.hidden = !text;
    element.classList.toggle('is-error', isError);
    element.classList.toggle('is-success', Boolean(text) && !isError);
  };

  const setFieldError = (field, message) => {
    if (!field) return;
    const error = document.querySelector(`[data-error-for="${field.id}"]`);
    if (error) error.textContent = message;
    field.setAttribute('aria-invalid', String(Boolean(message)));
  };

  const clearFormErrors = (form) => {
    form?.querySelectorAll('[data-error-for]').forEach((error) => {
      error.textContent = '';
    });
    form?.querySelectorAll('[aria-invalid]').forEach((field) => {
      field.removeAttribute('aria-invalid');
    });
  };

  const selectTab = (name) => {
    tabs.forEach((tab) => {
      const selected = tab.dataset.authTab === name;
      tab.classList.toggle('is-active', selected);
      tab.setAttribute('aria-selected', String(selected));
    });
    panels.forEach((panel) => {
      const selected = panel.dataset.authPanel === name;
      panel.hidden = !selected;
      panel.classList.remove('is-visible');
      if (selected) {
        window.requestAnimationFrame(() => panel.classList.add('is-visible'));
      }
    });
    if (title) {
      title.textContent =
        name === 'register'
          ? 'Tạo tài khoản mới'
          : name === 'forgot'
            ? 'Đặt lại mật khẩu'
            : 'Chào mừng trở lại!';
    }
    if (description) {
      description.textContent =
        name === 'register'
          ? 'Đăng ký để cùng Love Cake lưu giữ những khoảnh khắc ngọt ngào.'
          : name === 'forgot'
            ? 'Nhập email và mật khẩu mới để khôi phục tài khoản.'
            : 'Đăng nhập để tiếp tục hành trình ngọt ngào cùng Love Cake.';
    }
  };

  const parseUserList = (key) => {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const users = JSON.parse(raw);
    if (
      !Array.isArray(users) ||
      users.some(
        (user) =>
          !user ||
          typeof user.email !== 'string' ||
          typeof user.salt !== 'string' ||
          typeof user.passwordHash !== 'string',
      )
    ) {
      throw new Error(`Danh sách tài khoản (${key}) không hợp lệ.`);
    }
    return users;
  };

  const readUsers = () => {
    const users = [...parseUserList(LEGACY_USERS_KEY), ...parseUserList(USERS_KEY)];
    const uniqueUsers = new Map();
    users.forEach((user) => {
      uniqueUsers.set(user.email.trim().toLowerCase(), {
        ...user,
        email: user.email.trim().toLowerCase(),
        phone: user.phone || '',
        role: user.role === 'admin' ? 'admin' : 'user',
      });
    });
    return Array.from(uniqueUsers.values());
  };

  const writeUsers = (users) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    localStorage.setItem(LEGACY_USERS_KEY, JSON.stringify(users));
  };

  const bytesToHex = (bytes) =>
    Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');

  const hexToBytes = (hex) => {
    if (!/^(?:[0-9a-f]{2})+$/i.test(hex)) {
      throw new Error('Dữ liệu mật khẩu trong trình duyệt không hợp lệ.');
    }
    return new Uint8Array(hex.match(/.{2}/g).map((byte) => parseInt(byte, 16)));
  };

  const hashPassword = async (password, salt) => {
    const key = await window.crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveBits'],
    );
    const bits = await window.crypto.subtle.deriveBits(
      { name: 'PBKDF2', salt, iterations: PASSWORD_ITERATIONS, hash: 'SHA-256' },
      key,
      256,
    );
    return bytesToHex(new Uint8Array(bits));
  };

  const makePassword = async (password) => {
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    return {
      salt: bytesToHex(salt),
      passwordHash: await hashPassword(password, salt),
    };
  };

  const ensureAdmin = async () => {
    const users = readUsers();
    const email = 'admin@lovecake.vn';
    const existing = users.find((user) => user.email === email);
    if (existing) {
      existing.role = 'admin';
      writeUsers(users);
      return true;
    }
    const credentials = await makePassword('admin123');
    users.push({
      id: 'lovecake-admin',
      name: 'Quản trị viên Love Cake',
      email,
      phone: '',
      role: 'admin',
      ...credentials,
    });
    writeUsers(users);
    return true;
  };
  const adminReady = ensureAdmin().catch((error) => {
    console.error('Không thể khởi tạo tài khoản quản trị:', error);
    setMessage(
      document.getElementById('login-message'),
      'Không thể khởi tạo dữ liệu tài khoản. Vui lòng tải lại trang.',
    );
    return false;
  });

  const emailIsValid = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  const phoneIsValid = (phone) => /^(03|05|07|08|09)\d{8}$/.test(phone);
  const passwordIsValid = (password) =>
    password.length >= 6 && /[a-z]/i.test(password) && /\d/.test(password);

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.form-notice').forEach((notice) => {
        setMessage(notice, '');
      });
      clearFormErrors(registerForm);
      clearFormErrors(forgotForm);
      selectTab(tab.dataset.authTab);
    });
  });

  document.querySelectorAll('[data-open-auth-tab]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      selectTab(link.dataset.openAuthTab);
    });
  });

  document.querySelectorAll('[data-password-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      const input = document.getElementById(button.dataset.passwordToggle);
      if (!input) return;
      const visible = input.type === 'password';
      input.type = visible ? 'text' : 'password';
      button.textContent = visible ? 'Ẩn' : 'Hiện';
      button.setAttribute('aria-label', `${visible ? 'Ẩn' : 'Hiện'} mật khẩu`);
    });
  });

  const validateRegistrationField = (field) => {
    const value = field.value.trim();
    let message = '';
    if (!value) {
      message = 'Vui lòng nhập thông tin này.';
    } else if (field.id === 'register-phone' && !phoneIsValid(value)) {
      message = 'Số điện thoại phải gồm 10 số và bắt đầu bằng 03, 05, 07, 08 hoặc 09.';
    } else if (field.id === 'register-email' && !emailIsValid(value)) {
      message = 'Vui lòng nhập email hợp lệ.';
    } else if (field.id === 'register-email' || field.id === 'register-phone') {
      try {
        const users = readUsers();
        if (
          field.id === 'register-email' &&
          users.some((user) => user.email === value.toLowerCase())
        ) {
          message = 'Email này đã được đăng ký.';
        } else if (
          field.id === 'register-phone' &&
          users.some((user) => user.phone === value)
        ) {
          message = 'Số điện thoại này đã được đăng ký.';
        }
      } catch (error) {
        console.error('Không thể kiểm tra tài khoản đã lưu:', error);
        message = 'Không thể xác thực thông tin lúc này. Vui lòng tải lại trang.';
      }
    } else if (field.id === 'register-password' && !passwordIsValid(value)) {
      message = 'Mật khẩu cần ít nhất 6 ký tự, gồm chữ cái và chữ số.';
    } else if (
      field.id === 'confirm-password' &&
      value !== registerPassword?.value
    ) {
      message = 'Mật khẩu nhập lại chưa khớp.';
    }
    setFieldError(field, message);
    return !message;
  };

  registerForm?.querySelectorAll('[data-validate]').forEach((field) => {
    field.addEventListener('input', () => {
      validateRegistrationField(field);
      if (field.id === 'register-password' && confirmPassword?.value) {
        validateRegistrationField(confirmPassword);
      }
    });
    field.addEventListener('blur', () => validateRegistrationField(field));
  });

  loginForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const message = document.getElementById('login-message');
    setMessage(message, '');
    if (!window.crypto?.subtle) {
      setMessage(message, 'Trình duyệt cần HTTPS hoặc localhost để xác thực an toàn.');
      return;
    }
    try {
      if (!(await adminReady)) return;
      const identity = document
        .getElementById('login-email')
        .value.trim()
        .toLowerCase();
      const password = document.getElementById('login-password').value;
      const user = readUsers().find(
        (account) =>
          account.email === identity ||
          (account.phone && account.phone.replace(/\s/g, '') === identity.replace(/\s/g, '')),
      );
      if (!user || (user.id === 'lovecake-admin' && password !== 'admin123')) {
        if (!user) {
          setMessage(message, 'Email/SĐT hoặc mật khẩu không chính xác.');
          return;
        }
      }
      const passwordHash = await hashPassword(password, hexToBytes(user.salt));
      if (passwordHash !== user.passwordHash) {
        setMessage(message, 'Email/SĐT hoặc mật khẩu không chính xác.');
        return;
      }
      const currentUser = {
        id: user.id || `user-${user.email}`,
        name: user.name || user.fullName || user.email,
        email: user.email,
        phone: user.phone || '',
        role: user.role === 'admin' ? 'admin' : 'user',
        birthDate: user.birthDate || '',
        gender: user.gender || '',
        city: 'Hà Nội',
        ward: user.ward || '',
        address: user.address || '',
      };
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
      sessionStorage.removeItem(LEGACY_USER_KEY);
      localStorage.removeItem(LEGACY_USER_KEY);
      if (document.getElementById('remember-me')?.checked) {
        localStorage.setItem(LEGACY_USER_KEY, currentUser.name);
      } else {
        sessionStorage.setItem(LEGACY_USER_KEY, currentUser.name);
      }
      window.location.href = currentUser.role === 'admin' ? 'admin.html' : 'index.html';
    } catch (error) {
      console.error('Đăng nhập thất bại:', error);
      setMessage(message, 'Không thể đăng nhập lúc này. Vui lòng kiểm tra dữ liệu và thử lại.');
    }
  });

  registerForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const message = document.getElementById('register-message');
    setMessage(message, '');
    const fields = [
      document.getElementById('register-name'),
      document.getElementById('register-phone'),
      document.getElementById('register-email'),
      registerPassword,
      confirmPassword,
    ].filter(Boolean);
    const valid = fields.reduce(
      (allValid, field) => validateRegistrationField(field) && allValid,
      true,
    );
    if (!valid) return;
    if (!window.crypto?.subtle) {
      setMessage(message, 'Trình duyệt cần HTTPS hoặc localhost để tạo tài khoản an toàn.');
      return;
    }
    try {
      if (!(await adminReady)) return;
      const name = document.getElementById('register-name').value.trim();
      const phoneField = document.getElementById('register-phone');
      const phone = phoneField?.value.trim() || '';
      const email = document.getElementById('register-email').value.trim().toLowerCase();
      const users = readUsers();
      if (users.some((user) => user.email === email)) {
        setFieldError(document.getElementById('register-email'), 'Email này đã được đăng ký.');
        return;
      }
      if (phone && users.some((user) => user.phone === phone)) {
        setFieldError(phoneField, 'Số điện thoại này đã được đăng ký.');
        return;
      }
      const credentials = await makePassword(registerPassword.value);
      users.push({
        id: `user-${window.crypto.randomUUID?.() || Date.now().toString(36)}`,
        name,
        email,
        phone,
        role: 'user',
        birthDate: '',
        gender: '',
        address: '',
        ...credentials,
      });
      writeUsers(users);
      setMessage(message, 'Đăng ký thành công!', false);
      showToast('Đăng ký thành công! Mời bạn đăng nhập.');
      registerForm.reset();
      clearFormErrors(registerForm);
      selectTab('login');
      const loginIdentity = document.getElementById('login-email');
      if (loginIdentity) loginIdentity.value = email;
      setMessage(document.getElementById('login-message'), 'Đăng ký thành công! Hãy đăng nhập.', false);
    } catch (error) {
      console.error('Đăng ký thất bại:', error);
      setMessage(message, 'Không thể tạo tài khoản lúc này. Vui lòng thử lại.');
    }
  });

  forgotForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const message = document.getElementById('forgot-message');
    setMessage(message, '');
    const emailField = document.getElementById('forgot-email');
    const passwordField = document.getElementById('forgot-password');
    const confirmField = document.getElementById('forgot-confirm-password');
    const email = emailField.value.trim().toLowerCase();
    const password = passwordField.value;
    let valid = true;
    setFieldError(emailField, emailIsValid(email) ? '' : 'Vui lòng nhập email hợp lệ.');
    setFieldError(passwordField, passwordIsValid(password) ? '' : 'Mật khẩu cần ít nhất 6 ký tự, gồm chữ cái và chữ số.');
    setFieldError(confirmField, password === confirmField.value ? '' : 'Mật khẩu nhập lại chưa khớp.');
    valid = emailIsValid(email) && passwordIsValid(password) && password === confirmField.value;
    if (!valid) return;
    try {
      const users = readUsers();
      const user = users.find((account) => account.email === email);
      if (!user) {
        setFieldError(emailField, 'Email chưa được đăng ký.');
        return;
      }
      Object.assign(user, await makePassword(password));
      writeUsers(users);
      forgotForm.reset();
      setMessage(message, 'Đổi mật khẩu thành công. Bạn có thể đăng nhập ngay.', false);
      showToast('Đổi mật khẩu thành công!');
      selectTab('login');
      document.getElementById('login-email').value = email;
    } catch (error) {
      console.error('Đổi mật khẩu thất bại:', error);
      setMessage(message, 'Không thể đổi mật khẩu lúc này. Vui lòng thử lại.');
    }
  });

  if (new URLSearchParams(window.location.search).get('registered') === '1') {
    setMessage(document.getElementById('login-message'), 'Tạo tài khoản thành công. Hãy đăng nhập.', false);
  }
  selectTab('login');
});
