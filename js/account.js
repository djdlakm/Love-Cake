document.addEventListener('DOMContentLoaded', () => {
  const CURRENT_USER_KEY = 'LOVE_CAKE_CURRENT_USER';
  const USERS_KEY = 'LOVE_CAKE_USERS';
  const LEGACY_USERS_KEY = 'loveCakeUsers';
  const LEGACY_USER_KEY = 'loveCakeUser';
  const ORDERS_KEY = 'LOVE_CAKE_ORDERS';

  let currentUser;
  try {
    currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || 'null');
  } catch (error) {
    console.error('Không thể đọc phiên đăng nhập:', error);
    currentUser = null;
  }
  if (!currentUser || currentUser.role === 'admin') {
    window.location.replace(currentUser?.role === 'admin' ? 'admin.html' : 'auth.html');
    return;
  }

  const escapeHTML = (value) =>
    String(value ?? '').replace(/[&<>"']/g, (character) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    })[character]);
  const formatMoney = (value) =>
    value !== null && value !== undefined && String(value).trim() !== '' && Number.isFinite(Number(value))
      ? `${new Intl.NumberFormat('vi-VN').format(Number(value))}đ`
      : 'Chưa có thông tin giá';
  const formatDate = (value) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? 'Không rõ ngày' : date.toLocaleDateString('vi-VN');
  };
  const parseOrders = () => {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (!raw) return [];
    const orders = JSON.parse(raw);
    if (!Array.isArray(orders)) throw new Error('Dữ liệu đơn hàng không hợp lệ.');
    return orders;
  };

  const nameInput = document.getElementById('profile-name');
  const phoneInput = document.getElementById('profile-phone');
  const emailInput = document.getElementById('profile-email');
  const birthInput = document.getElementById('profile-birth-date');
  const genderInput = document.getElementById('profile-gender');
  const cityInput = document.getElementById('profile-city');
  const wardInput = document.getElementById('profile-ward');
  const addressInput = document.getElementById('profile-address');

  const accountName = String(currentUser.name || 'Khách hàng').trim() || 'Khách hàng';
  const accountInitial = Array.from(accountName)[0].toLocaleUpperCase('vi-VN');
  document.getElementById('account-sidebar-name').textContent = accountName;
  document.getElementById('account-avatar-initial').textContent = accountInitial;
  document.getElementById('account-sidebar-email').textContent = currentUser.email || '';
  nameInput.value = currentUser.name || '';
  phoneInput.value = currentUser.phone || '';
  emailInput.value = currentUser.email || '';
  birthInput.value = currentUser.birthDate || '';
  genderInput.value = currentUser.gender || '';
  cityInput.value = 'Hà Nội';
  wardInput.value = currentUser.ward || '';
  addressInput.value = currentUser.address || '';

  const selectAccountTab = (name) => {
    document.querySelectorAll('[data-account-tab]').forEach((item) => {
      item.classList.toggle('is-active', item.dataset.accountTab === name);
    });
    document.querySelectorAll('[data-account-panel]').forEach((panel) => {
      panel.hidden = panel.dataset.accountPanel !== name;
    });
  };
  document.querySelectorAll('[data-account-tab]').forEach((tab) => {
    tab.addEventListener('click', () => {
      const name = tab.dataset.accountTab;
      selectAccountTab(name);
      if (name === 'orders' && window.location.hash !== '#orders') {
        window.location.hash = 'orders';
      } else if (name === 'profile' && window.location.hash) {
        window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
      }
    });
  });
  const selectAccountTabFromHash = () => {
    const hash = window.location.hash.toLowerCase();
    selectAccountTab(hash === '#order' || hash === '#orders' ? 'orders' : 'profile');
  };
  window.addEventListener('hashchange', selectAccountTabFromHash);
  selectAccountTabFromHash();

  document.getElementById('account-profile-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const message = document.getElementById('profile-message');
    message.hidden = false;
    message.classList.remove('is-error');
    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    if (!name || !/^(03|05|07|08|09)\d{8}$/.test(phone)) {
      message.textContent = 'Vui lòng nhập họ tên và số điện thoại Việt Nam hợp lệ (10 số).';
      message.classList.add('is-error');
      return;
    }

    try {
      const users = [
        ...JSON.parse(localStorage.getItem(LEGACY_USERS_KEY) || '[]'),
        ...JSON.parse(localStorage.getItem(USERS_KEY) || '[]'),
      ];
      const normalizedUsers = new Map();
      users.forEach((user) => {
        if (user?.email) normalizedUsers.set(String(user.email).trim().toLowerCase(), user);
      });
      const emailKey = String(currentUser.email || '').trim().toLowerCase();
      const savedUser = normalizedUsers.get(emailKey);
      if (!savedUser) {
        throw new Error('Không tìm thấy tài khoản để lưu hồ sơ khách hàng.');
      }
      const updatedProfile = {
        ...currentUser,
        name,
        phone,
        birthDate: birthInput.value,
        gender: genderInput.value,
        city: cityInput.value,
        ward: wardInput.value,
        address: addressInput.value.trim(),
      };
      delete updatedProfile.district;
      Object.assign(savedUser, updatedProfile);
      delete savedUser.district;
      const updatedUsers = Array.from(normalizedUsers.values());
      localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
      localStorage.setItem(LEGACY_USERS_KEY, JSON.stringify(updatedUsers));
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedProfile));
      currentUser = updatedProfile;
      document.getElementById('account-sidebar-name').textContent = name;
      document.getElementById('account-avatar-initial').textContent =
        Array.from(name.trim())[0].toLocaleUpperCase('vi-VN');
      message.textContent = 'Đã lưu thông tin tài khoản thành công.';
    } catch (error) {
      console.error('Không thể lưu hồ sơ khách hàng:', error);
      message.textContent = 'Không thể lưu thay đổi. Vui lòng kiểm tra dung lượng lưu trữ và thử lại.';
      message.classList.add('is-error');
    }
  });

  const statusClass = (status) => {
    if (status === 'Hoàn thành') return 'is-completed';
    if (status === 'Đang giao') return 'is-shipping';
    if (status === 'Đã hủy') return 'is-cancelled';
    return 'is-processing';
  };

  const getOrderItemView = (item) => {
    const product = item && typeof item === 'object' ? item : {};
    const quantity = Number(product.quantity);
    const hasQuantity = Number.isInteger(quantity) && quantity > 0;
    const price = Number(product.price);
    const hasPrice =
      product.price !== null &&
      product.price !== undefined &&
      String(product.price).trim() !== '' &&
      Number.isFinite(price);
    const custom =
      product.customDetails && typeof product.customDetails === 'object'
        ? product.customDetails
        : {};
    const details = [
      custom.size || product.size ? `Size: ${custom.size || product.size}` : '',
      custom.sponge ? `Cốt: ${custom.sponge}` : '',
      custom.filling ? `Nhân: ${custom.filling}` : '',
      custom.frosting ? `Kem: ${custom.frosting}` : '',
      custom.toppingsText && custom.toppingsText !== 'Không lấy topping'
        ? `Topping: ${custom.toppingsText}`
        : '',
      custom.message && custom.message !== 'Không có'
        ? `Lời chúc: ${custom.message}`
        : '',
      custom.note ? `Ghi chú: ${custom.note}` : '',
      Array.isArray(product.accessories) && product.accessories.length
        ? `Phụ kiện: ${product.accessories.join(', ')}`
        : '',
      hasQuantity ? `SL: ${quantity}` : 'Chưa có số lượng',
    ]
      .filter(Boolean)
      .join(' · ');

    return {
      name: product.name || product.title || 'Chưa có tên sản phẩm',
      details,
      unitPrice: hasPrice ? formatMoney(price) : 'Chưa có thông tin giá',
      lineTotal:
        hasPrice && hasQuantity
          ? formatMoney(price * quantity)
          : 'Chưa có thông tin thành tiền',
    };
  };

  const orderDialog = document.getElementById('account-order-dialog');
  const orderDialogContent = document.getElementById('account-order-dialog-content');
  const orderContainer = document.getElementById('account-orders');
  const cancelDialog = document.getElementById('account-cancel-dialog');
  const cancelMessage = document.getElementById('account-cancel-message');
  const cancelToast = document.getElementById('account-toast');
  let displayedOrders = [];
  let pendingCancellationId = '';
  let toastTimer;

  const showToast = (message, isError = false) => {
    window.clearTimeout(toastTimer);
    cancelToast.textContent = message;
    cancelToast.classList.toggle('is-error', isError);
    cancelToast.hidden = false;
    toastTimer = window.setTimeout(() => {
      cancelToast.hidden = true;
    }, 4200);
  };

  const showOrderDetails = (order) => {
    const displayValue = (value) =>
      value !== null && value !== undefined && String(value).trim()
        ? escapeHTML(value)
        : '—';
    const displayAmount = (value) =>
      value !== null &&
      value !== undefined &&
      String(value).trim() !== '' &&
      Number.isFinite(Number(value))
        ? formatMoney(value)
        : '—';
    const items = Array.isArray(order.items) ? order.items : [];
    const itemMarkup = items
      .map((item) => {
        const view = getOrderItemView(item);
        const quantity = Number(item?.quantity);
        return `<div class="account-order-invoice__row">
          <span>${escapeHTML(view.name)}</span>
          <span>${Number.isInteger(quantity) && quantity > 0 ? quantity : '—'}</span>
          <span>${escapeHTML(view.lineTotal)}</span>
        </div>`;
      })
      .join('');
    const discount = Number(order.discount);
    const discountAmount =
      Number.isFinite(discount) && discount > 0
        ? `-${formatMoney(discount)}`
        : displayAmount(order.discount);

    orderDialogContent.innerHTML = `
      <section class="account-order-invoice">
        <header class="account-order-invoice__head">
          <div class="account-order-invoice__brand">
            <img class="account-order-invoice__logo" src="assets/img/logo.png" alt="Love Cake">
          </div>
          <h2 id="account-order-dialog-title">HÓA ĐƠN LOVE CAKE</h2>
        </header>
        <div class="account-order-invoice__meta">
          <span>Mã đơn: <b>${displayValue(order.id || order.code)}</b></span>
          <span>Ngày đặt: <b>${escapeHTML(formatDate(order.createdAt || order.date))}</b></span>
        </div>
        <div class="account-order-invoice__customer">
          <p><b>Khách hàng:</b> <span>${displayValue(order.customerName || order.name)}</span></p>
          <p><b>Điện thoại:</b> <span>${displayValue(order.phone)}</span></p>
          <p><b>Thời gian nhận:</b> <span>${displayValue(order.receiveTime)}</span></p>
          <p><b>Địa chỉ:</b> <span>${displayValue(order.address)}</span></p>
        </div>
        <div class="account-order-invoice__items">
          <div class="account-order-invoice__row is-heading">
            <span>Sản phẩm</span>
            <span>SL</span>
            <span>Thành tiền</span>
          </div>
          ${itemMarkup || '<p class="account-order-invoice__empty">Đơn hàng chưa lưu thông tin sản phẩm.</p>'}
        </div>
        <div class="account-order-invoice__totals">
          <div><span>Tạm tính</span><b>${displayAmount(order.subtotal)}</b></div>
          <div><span>Phí giao hàng</span><b>${displayAmount(order.shipping)}</b></div>
          <div><span>Giảm giá</span><b>${discountAmount}</b></div>
          <div class="is-final"><span>Tổng cộng</span><strong>${displayAmount(order.total)}</strong></div>
        </div>
        <div class="account-order-invoice__payment">
          <b>Thanh toán:</b> <span>${displayValue(order.paymentMethod)}</span><br>
          <b>Trạng thái:</b> <span>${displayValue(order.paymentStatus)}</span><br>
          <b>Người nhận:</b> <span>${displayValue(order.receiverName || order.customerName || order.name)}</span>
        </div>
        <div class="account-order-invoice__actions">
          <button type="button" data-print-order>Lưu hóa đơn PDF</button>
          <a href="product.html">Tiếp tục mua hàng</a>
        </div>
      </section>`;
    orderDialog.showModal();
  };

  document
    .getElementById('account-order-dialog-close')
    .addEventListener('click', () => orderDialog.close());
  orderDialog.addEventListener('click', (event) => {
    if (event.target === orderDialog) orderDialog.close();
    if (event.target.closest('[data-print-order]')) window.print();
  });
  orderContainer.addEventListener('click', (event) => {
    const card = event.target.closest('.account-order-card');
    if (!card) return;
    const cancelButton = event.target.closest('[data-cancel-order-index]');
    if (cancelButton) {
      event.stopPropagation();
      const order = displayedOrders[Number(cancelButton.dataset.cancelOrderIndex)];
      const orderId = String(order?.id || order?.code || '');
      if (!order || !orderId) {
        showToast('Không tìm thấy mã đơn để hủy. Vui lòng tải lại trang.', true);
        return;
      }
      if (order.status !== 'Đang xử lý') {
        showToast('Chỉ có thể hủy đơn hàng đang xử lý.', true);
        return;
      }
      pendingCancellationId = orderId;
      cancelMessage.textContent = `Bạn có chắc muốn hủy đơn ${orderId}? Thao tác này không thể hoàn tác.`;
      cancelDialog.showModal();
      return;
    }
    const order = displayedOrders[Number(card.dataset.orderIndex)];
    if (!order) {
      window.alert('Không tìm thấy đơn hàng. Vui lòng tải lại trang.');
      return;
    }
    showOrderDetails(order);
  });

  document.getElementById('account-cancel-keep').addEventListener('click', () => {
    pendingCancellationId = '';
    cancelDialog.close();
  });
  cancelDialog.addEventListener('cancel', () => {
    pendingCancellationId = '';
  });
  cancelDialog.addEventListener('click', (event) => {
    if (event.target === cancelDialog) {
      pendingCancellationId = '';
      cancelDialog.close();
    }
  });
  document.getElementById('account-cancel-confirm').addEventListener('click', () => {
    if (!pendingCancellationId) {
      cancelDialog.close();
      showToast('Không tìm thấy đơn hàng cần hủy. Vui lòng tải lại trang.', true);
      return;
    }
    try {
      const orders = parseOrders();
      const order = orders.find(
        (item) => String(item.id || item.code || '') === pendingCancellationId,
      );
      if (!order) throw new Error('Không tìm thấy đơn hàng cần hủy.');
      if (order.status !== 'Đang xử lý') {
        throw new Error('Đơn hàng không còn ở trạng thái có thể hủy.');
      }
      order.status = 'Đã hủy';
      order.cancelledAt = new Date().toISOString();
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
      const orderId = pendingCancellationId;
      pendingCancellationId = '';
      cancelDialog.close();
      renderOrders();
      showToast(`Đơn hàng ${orderId} đã được hủy.`);
    } catch (error) {
      console.error('Không thể hủy đơn hàng:', error);
      pendingCancellationId = '';
      cancelDialog.close();
      showToast(error instanceof Error ? error.message : 'Không thể hủy đơn hàng. Vui lòng thử lại.', true);
    }
  });

  const renderOrders = () => {
    try {
      const savedOrders = parseOrders();
      const realOrders = savedOrders.filter(
        (order) => !String(order?.id || order?.code || '').startsWith('LC-DEMO-'),
      );
      if (realOrders.length !== savedOrders.length) {
        localStorage.setItem(ORDERS_KEY, JSON.stringify(realOrders));
      }

      const currentUserId = currentUser.id;
      const currentEmail = String(currentUser.email || '').trim().toLowerCase();
      const orders = realOrders.filter(
        (order) =>
          (currentUserId && order.userId === currentUserId) ||
          (currentEmail &&
            String(order.email || '').trim().toLowerCase() === currentEmail),
      );
      if (!orders.length) {
        displayedOrders = [];
        orderContainer.innerHTML = '<p class="account-orders__empty">Bạn chưa có đơn hàng nào.</p>';
        return;
      }
      displayedOrders = [...orders]
        .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));
      orderContainer.innerHTML = displayedOrders
        .map((order) => {
          const items = Array.isArray(order.items) ? order.items : [];
          const status = ['Đang giao', 'Hoàn thành', 'Đã hủy'].includes(order.status)
            ? order.status
            : order.status === 'Đang xử lý'
              ? order.status
              : 'Chưa rõ trạng thái';
          const itemMarkup = items
            .map((item) => {
              const view = getOrderItemView(item);
              return `<div class="account-order-card__item"><span>${escapeHTML(view.name)}${view.details ? ` <small>(${escapeHTML(view.details)})</small>` : ''}</span><strong>${escapeHTML(view.lineTotal)}</strong></div>`;
            })
            .join('');
          const orderIndex = displayedOrders.indexOf(order);
          const cancelAction = status === 'Đang xử lý'
            ? `<button class="account-order-card__cancel" type="button" data-cancel-order-index="${orderIndex}">Hủy đơn hàng</button>`
            : '';
          return `<article class="account-order-card" data-order-index="${orderIndex}">
            <header class="account-order-card__head"><div><strong>Mã đơn: ${escapeHTML(order.id || order.code || 'Chưa lưu mã đơn')}</strong><span class="account-order-card__date">Ngày đặt: ${formatDate(order.createdAt || order.date)}</span></div><span class="account-order-status ${statusClass(status)}">${escapeHTML(status)}</span></header>
            <div class="account-order-card__items">${itemMarkup || '<span>Đơn hàng chưa lưu thông tin sản phẩm.</span>'}</div>
            <footer class="account-order-card__foot"><span>Tổng tiền</span><strong class="account-order-card__total">${formatMoney(order.total)}</strong><button class="account-order-card__details" type="button">Xem chi tiết</button>${cancelAction}</footer>
          </article>`;
        })
        .join('');
    } catch (error) {
      console.error('Không thể hiển thị lịch sử đơn hàng:', error);
      orderContainer.innerHTML = '<p class="account-orders__empty">Không thể đọc lịch sử đơn hàng. Vui lòng tải lại trang.</p>';
    }
  };
  renderOrders();

  document.getElementById('account-logout').addEventListener('click', () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(LEGACY_USER_KEY);
    sessionStorage.removeItem(LEGACY_USER_KEY);
    window.location.href = 'index.html';
  });
});
