document.addEventListener('DOMContentLoaded', () => {
  const CURRENT_USER_KEY = 'LOVE_CAKE_CURRENT_USER';
  const USERS_KEY = 'LOVE_CAKE_USERS';
  const LEGACY_USERS_KEY = 'loveCakeUsers';
  const ORDERS_KEY = 'LOVE_CAKE_ORDERS';
  const STATUSES = ['Đang xử lý', 'Đang giao', 'Hoàn thành', 'Đã hủy'];

  let currentUser;
  try {
    currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || 'null');
  } catch (error) {
    console.error('Không thể đọc phiên đăng nhập:', error);
    currentUser = null;
  }
  if (!currentUser || currentUser.role !== 'admin') {
    window.location.replace('index.html');
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
    `${new Intl.NumberFormat('vi-VN').format(Number(value) || 0)}đ`;
  const formatDate = (value) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? 'Không rõ' : date.toLocaleDateString('vi-VN');
  };
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
  const orderDialog = document.getElementById('admin-order-dialog');
  const orderDialogContent = document.getElementById('admin-order-dialog-content');
  const ordersBody = document.getElementById('admin-orders-body');
  let displayedOrders = [];

  const showOrderDetails = (order) => {
    const items = Array.isArray(order.items) ? order.items : [];
    const itemMarkup = items
      .map((item) => {
        const quantity = Number(item?.quantity);
        const hasQuantity = Number.isInteger(quantity) && quantity > 0;
        const hasPrice =
          item?.price !== null &&
          item?.price !== undefined &&
          String(item.price).trim() !== '' &&
          Number.isFinite(Number(item.price));
        const lineTotal =
          hasPrice && hasQuantity
            ? formatMoney(Number(item.price) * quantity)
            : 'Chưa có thông tin thành tiền';
        return `<div class="account-order-invoice__row">
          <span>${escapeHTML(item?.name || item?.title || 'Chưa có tên sản phẩm')}</span>
          <span>${hasQuantity ? quantity : '—'}</span>
          <span>${escapeHTML(lineTotal)}</span>
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
          <h2 id="admin-order-dialog-title">HÓA ĐƠN LOVE CAKE</h2>
        </header>
        <div class="account-order-invoice__meta">
          <span>Mã đơn: <b>${displayValue(order.id || order.code)}</b></span>
          <span>Ngày đặt: <b>${displayValue(formatDate(order.createdAt || order.date))}</b></span>
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
    .getElementById('admin-order-dialog-close')
    .addEventListener('click', () => orderDialog.close());
  orderDialog.addEventListener('click', (event) => {
    if (event.target === orderDialog) {
      orderDialog.close();
      return;
    }
    if (event.target instanceof Element && event.target.closest('[data-print-order]')) {
      window.print();
    }
  });
  ordersBody.addEventListener('click', (event) => {
    const button =
      event.target instanceof Element
        ? event.target.closest('[data-order-detail-index]')
        : null;
    if (!button) return;
    const order = displayedOrders[Number(button.dataset.orderDetailIndex)];
    if (!order) {
      window.alert('Không tìm thấy đơn hàng. Vui lòng làm mới trang.');
      return;
    }
    showOrderDetails(order);
  });
  const readArray = (key) => {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error(`Dữ liệu ${key} không hợp lệ.`);
    return parsed;
  };
  const getUsers = () => {
    const users = [...readArray(LEGACY_USERS_KEY), ...readArray(USERS_KEY)];
    const unique = new Map();
    users.forEach((user) => {
      if (user?.email) unique.set(user.email.toLowerCase(), user);
    });
    return Array.from(unique.values()).filter((user) => user.role !== 'admin');
  };

  const getProducts = async () => {
    const response = await fetch('js/products-data.json');
    if (!response.ok) throw new Error(`Không thể tải danh mục bánh (HTTP ${response.status}).`);
    const products = await response.json();
    if (!Array.isArray(products)) throw new Error('Danh mục bánh trong products-data.json không hợp lệ.');
    return products;
  };

  const drawMonthlyRevenue = (orders) => {
    const now = new Date();
    const periods = Array.from({ length: 6 }, (_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
      return {
        year: date.getFullYear(),
        month: date.getMonth(),
        label: date.toLocaleDateString('vi-VN', { month: 'short' }).replace('.', ''),
        total: 0,
      };
    });
    orders
      .filter((order) => order.status === 'Hoàn thành')
      .forEach((order) => {
        const date = new Date(order.createdAt || order.date);
        if (Number.isNaN(date.getTime())) return;
        const period = periods.find(
          (item) => item.year === date.getFullYear() && item.month === date.getMonth(),
        );
        if (period) period.total += Number(order.total) || 0;
      });
    const highest = Math.max(...periods.map((period) => period.total), 1);
    document.getElementById('admin-revenue-chart').innerHTML = periods
      .map((period) => {
        const height = period.total ? Math.max((period.total / highest) * 100, 4) : 0;
        return `<div class="admin-chart__column" title="${escapeHTML(formatMoney(period.total))}">
          <div class="admin-chart__bar-area"><span class="admin-chart__bar" style="height:${height}%"></span></div>
          <span class="admin-chart__month">${escapeHTML(period.label)}</span>
        </div>`;
      })
      .join('');
  };

  const render = async () => {
    try {
      const orders = readArray(ORDERS_KEY);
      const users = getUsers();
      const products = await getProducts();
      const revenue = orders.reduce(
        (sum, order) => sum + (order.status === 'Hoàn thành' ? Number(order.total) || 0 : 0),
        0,
      );
      document.getElementById('admin-revenue').textContent = formatMoney(revenue);
      document.getElementById('admin-order-count').textContent = String(orders.length);
      document.getElementById('admin-customer-count').textContent = String(users.length);
      const productCount = products.filter(
        (product) => product && product.active !== false,
      ).length;
      document.getElementById('admin-product-count').textContent = String(productCount);
      document.getElementById('admin-processing-count').textContent = String(
        orders.filter((order) => !STATUSES.includes(order.status) || order.status === STATUSES[0]).length,
      );
      document.getElementById('admin-shipping-count').textContent = String(
        orders.filter((order) => order.status === STATUSES[1]).length,
      );
      document.getElementById('admin-completed-count').textContent = String(
        orders.filter((order) => order.status === STATUSES[2]).length,
      );
      drawMonthlyRevenue(orders);

      const sorted = [...orders].sort(
        (left, right) =>
          new Date(right.createdAt || right.date) - new Date(left.createdAt || left.date),
      );
      displayedOrders = sorted;
      document.getElementById('admin-orders-empty').hidden = Boolean(sorted.length);
      ordersBody.innerHTML = sorted
        .map((order, index) => {
          const items = Array.isArray(order.items) ? order.items : [];
          const products = items
            .map((item) => `${item.name || item.title || 'Sản phẩm'} × ${Number(item.quantity) || 1}`)
            .join(', ');
          const customer = order.customerName || order.name || 'Khách hàng';
          const status = STATUSES.includes(order.status) ? order.status : STATUSES[0];
          return `<tr>
            <td class="admin-orders-table__id">${escapeHTML(order.id || order.code || '—')}</td>
            <td class="admin-orders-table__customer"><strong>${escapeHTML(customer)}</strong><small>${escapeHTML(order.email || order.phone || 'Khách vãng lai')}</small></td>
            <td class="admin-orders-table__products" title="${escapeHTML(products)}">${escapeHTML(products || 'Chưa có sản phẩm')}</td>
            <td>${formatDate(order.createdAt || order.date)}</td>
            <td><strong>${formatMoney(order.total)}</strong></td>
            <td><button class="admin-order-detail-button" type="button" data-order-detail-index="${index}" aria-label="Xem chi tiết đơn ${escapeHTML(order.id || order.code || '')}">Xem chi tiết</button></td>
            <td><select class="admin-orders-table__status" data-order-id="${escapeHTML(order.id || order.code || '')}" aria-label="Cập nhật trạng thái đơn hàng">${STATUSES.map((option) => `<option value="${option}"${option === status ? ' selected' : ''}>${option}</option>`).join('')}</select></td>
          </tr>`;
        })
        .join('');

      ordersBody.querySelectorAll('[data-order-id]').forEach((select) => {
        select.addEventListener('change', () => {
          const currentOrders = readArray(ORDERS_KEY);
          const order = currentOrders.find(
            (item) => String(item.id || item.code || '') === select.dataset.orderId,
          );
          if (!order) {
            window.alert('Không tìm thấy đơn hàng cần cập nhật. Vui lòng làm mới trang.');
            render();
            return;
          }
          order.status = select.value;
          try {
            localStorage.setItem(ORDERS_KEY, JSON.stringify(currentOrders));
            render();
          } catch (error) {
            console.error('Không thể cập nhật trạng thái đơn hàng:', error);
            window.alert('Không thể lưu trạng thái đơn hàng. Vui lòng thử lại.');
            render();
          }
        });
      });
    } catch (error) {
      console.error('Không thể tải dữ liệu quản trị:', error);
      document.getElementById('admin-orders-body').innerHTML =
        '<tr><td colspan="7">Không thể đọc dữ liệu cửa hàng. Vui lòng kiểm tra dữ liệu sản phẩm/đơn hàng và tải lại trang.</td></tr>';
      document.getElementById('admin-orders-empty').hidden = true;
    }
  };

  document.getElementById('admin-refresh').addEventListener('click', render);
  render();
});
