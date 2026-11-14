/**
 * Love Cake Studio - Cake Designer Component Logic
 * Đóng gói hoàn toàn trong IIFE để tránh xung đột biến toàn cục
 */

(function () {
  'use strict';

  // ----------------- 1. Dữ Liệu Cấu Hình Sản Phẩm (Options, Giá, Màu) -----------------
  const CAKE_CONFIG = {
    // Bước 1: Kích thước bánh (Bỏ tầng bánh theo câu trả lời A1)
    sizes: {
      bento: {
        id: 'bento',
        name: 'Bento Mini (10cm)',
        shortName: 'Bento (10cm)',
        price: 160000,
        scale: 0.84
      },
      small: {
        id: 'small',
        name: 'Size Nhỏ (15cm)',
        shortName: 'Size Nhỏ (15cm)',
        price: 260000,
        scale: 1.0,
        isPopular: true
      },
      medium: {
        id: 'medium',
        name: 'Size Vừa (18cm)',
        shortName: 'Size Vừa (18cm)',
        price: 360000,
        scale: 1.12
      },
      large: {
        id: 'large',
        name: 'Size Lớn (20cm)',
        shortName: 'Size Lớn (20cm)',
        price: 460000,
        scale: 1.22
      }
    },

    // Bước 2: Cốt bánh (Vanilla, Socola, Red Velvet, Trà xanh)
    sponges: {
      vanilla: {
        id: 'vanilla',
        name: 'Vanilla Pháp',
        surcharge: 0,
        color: '#fce7a2', // Vàng kem nhạt
      },
      chocolate: {
        id: 'chocolate',
        name: 'Socola Bỉ',
        surcharge: 0,
        color: '#5c2d16', // Nâu cacao đậm
      },
      red_velvet: {
        id: 'red_velvet',
        name: 'Red Velvet',
        surcharge: 30000,
        color: '#9b1b30', // Đỏ nhung ruby
      },
      matcha: {
        id: 'matcha',
        name: 'Trà Xanh Matcha',
        surcharge: 0,
        color: '#7ca982', // Xanh matcha
      }
    },

    // Bước 3: Nhân kem (Việt quất, Mâm xôi đen, Sô cô la, Caramel muối, Cà phê)
    fillings: {
      blueberry: {
        id: 'blueberry',
        name: 'Việt Quất',
        surcharge: 0,
        color: '#4f46e5', // Tím việt quất
      },
      blackberry: {
        id: 'blackberry',
        name: 'Mâm Xôi Đen',
        surcharge: 25000,
        color: '#831843', // Đỏ tím thẫm mâm xôi
      },
      chocolate: {
        id: 'chocolate',
        name: 'Sô Cô La',
        surcharge: 0,
        color: '#3b1a0e', // Nâu sô cô la
      },
      caramel: {
        id: 'caramel',
        name: 'Caramel Muối',
        surcharge: 25000,
        color: '#d97706', // Vàng óng caramel
      },
      coffee: {
        id: 'coffee',
        name: 'Cà Phê Mocha',
        surcharge: 0,
        color: '#78350f', // Nâu mocha
      }
    },

    // Bước 4: Kem phủ (Kem phô mai, Kem tươi, Kem bơ, Ganache socola)
    frostings: {
      whipping: {
        id: 'whipping',
        name: 'Kem Tươi',
        surcharge: 0,
        color: '#ffffff', // Trắng tinh khiết
        swirlColor: '#ffffff',
      },
      cheese: {
        id: 'cheese',
        name: 'Kem Phô Mai',
        surcharge: 0,
        color: '#fffdf0', // Trắng ngà phô mai
        swirlColor: '#fff9e6',
      },
      butter: {
        id: 'butter',
        name: 'Kem Bơ',
        surcharge: 0,
        color: '#fef9e7', // Vàng bơ nhẹ
        swirlColor: '#fef3c7',
      },
      ganache: {
        id: 'ganache',
        name: 'Ganache Socola',
        surcharge: 35000,
        color: '#4a2818', // Nâu bóng ganache
        swirlColor: '#3d1f11',
      }
    }
  };

  // ----------------- 2. Trạng Thái Hiện Tại Của Trình Thiết Kế -----------------
  const state = {
    step: 1,
    size: 'small', // Mặc định 15cm theo A9
    sponge: 'vanilla', // Mặc định Vanilla theo A9
    filling: 'blueberry', // Mặc định Việt quất theo A9
    frosting: 'whipping', // Mặc định Kem tươi theo A9
    note: '', // Ghi chú dặn dò riêng cho tiệm bánh theo yêu cầu
    photoCount: 1, // (Code cũ: ảnh in tạm tắt)
    photos: ['assets/img/cart-cake.png'],
    message: 'Happy Birthday Love', // Mặc định lời chúc theo A9
    totalPrice: 260000
  };

  // ----------------- 3. Khởi Tạo DOM Elements -----------------
  const dom = {
    designer: document.getElementById('cake-designer'),
    stepperItems: document.querySelectorAll('.designer-step-item'),
    stepperLines: document.querySelectorAll('.designer-step-line'),
    wizardSteps: document.querySelectorAll('.designer-wizard-step'),
    alertMsg: document.getElementById('designerAlertMsg'),

    // Tùy chọn container
    sizeOptions: document.getElementById('designerSizeOptions'),
    spongeOptions: document.getElementById('designerSpongeOptions'),
    fillingOptions: document.getElementById('designerFillingOptions'),
    frostingOptions: document.getElementById('designerFrostingOptions'),

    // Bước 5: Ghi chú cho tiệm bánh
    noteInput: document.getElementById('designerNoteInput'),
    noteCharCount: document.getElementById('designerNoteCharCount'),

    // Bước 6: Lời chúc & Tóm tắt
    messageInput: document.getElementById('designerMessageInput'),

    // Nút điều hướng
    btnPrev: document.getElementById('designerBtnPrev'),
    btnNext: document.getElementById('designerBtnNext'),
    btnReset: document.getElementById('designerBtnReset'),

    // Tóm tắt đơn hàng
    sumSize: document.getElementById('designerSumSize'),
    sumSponge: document.getElementById('designerSumSponge'),
    sumFilling: document.getElementById('designerSumFilling'),
    sumFrosting: document.getElementById('designerSumFrosting'),
    sumMessage: document.getElementById('designerSumMessage'),
    sumNoteRow: document.getElementById('designerSumNoteRow'),
    sumNote: document.getElementById('designerSumNote'),
    sumTotal: document.getElementById('designerSumTotal'),

    // Mô hình bánh xem trước
    cake3D: document.getElementById('designerCake3D'),
    cakeTop: document.getElementById('designerCakeTop'),
    cakeFront: document.getElementById('designerCakeFront'),
    spongeRibbon: document.getElementById('designerSpongeRibbon'),
    fillingRibbon: document.getElementById('designerFillingRibbon'),
    pipingGroup: document.getElementById('designerPipingGroup'),
    singlePhotoBox: document.getElementById('designerSinglePhotoBox'),
    gridPhotoBox: document.getElementById('designerGridPhotoBox'),
    mainPhoto: document.getElementById('designerMainPhoto'),
    slotImg1: document.getElementById('designerSlotImg1'),
    slotImg2: document.getElementById('designerSlotImg2'),
    slotImg3: document.getElementById('designerSlotImg3'),
    slotImg4: document.getElementById('designerSlotImg4'),
    curvedTextPath: document.getElementById('designerCurvedTextPath'),

    // Flavor Legend
    legendSpongeDot: document.getElementById('legendSpongeDot'),
    legendSpongeName: document.getElementById('legendSpongeName'),
    legendFillingDot: document.getElementById('legendFillingDot'),
    legendFillingName: document.getElementById('legendFillingName'),
    legendFrostingDot: document.getElementById('legendFrostingDot'),
    legendFrostingName: document.getElementById('legendFrostingName'),

    // Toast
    toast: document.getElementById('designerToast')
  };

  // ----------------- 4. Format Tiền Tệ VNĐ -----------------
  function formatMoney(amount) {
    return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
  }

  // ----------------- 5. Render Danh Sách Các Lựa Chọn -----------------
  function renderAllOptionCards() {
    // 5.1. Render Bước 1: Kích thước bánh
    if (dom.sizeOptions) {
      dom.sizeOptions.innerHTML = Object.values(CAKE_CONFIG.sizes)
        .map(sz => `
          <label class="designer-option-card ${state.size === sz.id ? 'checked' : ''}">
            <input type="radio" name="cake-size-choice" value="${sz.id}" ${state.size === sz.id ? 'checked' : ''} />
            <span class="designer-custom-radio"></span>
            <div class="designer-option-content">
              <div class="designer-option-name-row">
                <span class="designer-option-name">${sz.name}</span>
                <span class="designer-option-price">${formatMoney(sz.price)}</span>
              </div>
            </div>
          </label>
        `)
        .join('');
    }

    // 5.2. Render Bước 2: Cốt bánh
    if (dom.spongeOptions) {
      dom.spongeOptions.innerHTML = Object.values(CAKE_CONFIG.sponges)
        .map(sp => `
          <label class="designer-option-card ${state.sponge === sp.id ? 'checked' : ''}">
            <input type="radio" name="cake-sponge-choice" value="${sp.id}" ${state.sponge === sp.id ? 'checked' : ''} />
            <span class="designer-custom-radio"></span>
            <span class="designer-flavor-swatch" style="background-color: ${sp.color};"></span>
            <div class="designer-option-content">
              <div class="designer-option-name-row">
                <span class="designer-option-name">${sp.name}</span>
                <span class="designer-option-price">${sp.surcharge > 0 ? `+${formatMoney(sp.surcharge)}` : 'Miễn phí'}</span>
              </div>
            </div>
          </label>
        `)
        .join('');
    }

    // 5.3. Render Bước 3: Nhân kem
    if (dom.fillingOptions) {
      dom.fillingOptions.innerHTML = Object.values(CAKE_CONFIG.fillings)
        .map(fl => `
          <label class="designer-option-card ${state.filling === fl.id ? 'checked' : ''}">
            <input type="radio" name="cake-filling-choice" value="${fl.id}" ${state.filling === fl.id ? 'checked' : ''} />
            <span class="designer-custom-radio"></span>
            <span class="designer-flavor-swatch" style="background-color: ${fl.color};"></span>
            <div class="designer-option-content">
              <div class="designer-option-name-row">
                <span class="designer-option-name">${fl.name}</span>
                <span class="designer-option-price">${fl.surcharge > 0 ? `+${formatMoney(fl.surcharge)}` : 'Miễn phí'}</span>
              </div>
            </div>
          </label>
        `)
        .join('');
    }

    // 5.4. Render Bước 4: Kem phủ
    if (dom.frostingOptions) {
      dom.frostingOptions.innerHTML = Object.values(CAKE_CONFIG.frostings)
        .map(fr => `
          <label class="designer-option-card ${state.frosting === fr.id ? 'checked' : ''}">
            <input type="radio" name="cake-frosting-choice" value="${fr.id}" ${state.frosting === fr.id ? 'checked' : ''} />
            <span class="designer-custom-radio"></span>
            <span class="designer-flavor-swatch" style="background-color: ${fr.color};"></span>
            <div class="designer-option-content">
              <div class="designer-option-name-row">
                <span class="designer-option-name">${fr.name}</span>
                <span class="designer-option-price">${fr.surcharge > 0 ? `+${formatMoney(fr.surcharge)}` : 'Miễn phí'}</span>
              </div>
            </div>
          </label>
        `)
        .join('');
    }
  }

  /* =========================================================================
     [GHI CHÚ]: TẠM TẮT CODE LOGIC ẢNH IN (BƯỚC 5 CŨ)
     =========================================================================
  function renderThumbnails() {
    if (!dom.thumbsGrid) return;
    const maxSlots = state.photoCount;
    let html = '';
    for (let i = 0; i < maxSlots; i++) {
      const hasPhoto = Boolean(state.photos[i]);
      const imgSrc = state.photos[i] || 'assets/img/cart-cake.png';
      html += `
        <div class="designer-thumb-item">
          <div class="designer-thumb-box" title="Ảnh vị trí ${i + 1}">
            <img src="${imgSrc}" alt="Ảnh ${i + 1}" class="designer-thumb-img" />
          </div>
          ${hasPhoto ? `<button type="button" class="designer-btn-del-thumb" data-thumb-idx="${i}">XOÁ</button>` : ''}
        </div>
      `;
    }
    dom.thumbsGrid.innerHTML = html;
  }

  function removePhotoAt(index) {
    if (state.photos.length > 1) {
      state.photos.splice(index, 1);
    } else {
      state.photos[0] = 'assets/img/cart-cake.png';
    }
    renderThumbnails();
    updateCakeVisuals();
  }
  ========================================================================= */

  /* =========================================================================
     [GHI CHÚ]: TẠM TẮT RENDER VÒNG BÔNG KEM PIPING SVG (MODEL BÁNH ĐÃ TẮT)
     =========================================================================
  function renderPipingDollops(frostingColor) {
    if (!dom.pipingGroup) return;
    dom.pipingGroup.innerHTML = '';
    const totalDollops = 18;
    const cx = 160;
    const cy = 44;
    const rx = 150;
    const ry = 36;
    const dollopR = 9;

    for (let i = 0; i < totalDollops; i++) {
      const angle = (i * 2 * Math.PI) / totalDollops;
      const x = cx + rx * Math.cos(angle);
      const y = cy + ry * Math.sin(angle);
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('filter', 'url(#dollopShadow)');
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', x.toFixed(1));
      circle.setAttribute('cy', y.toFixed(1));
      circle.setAttribute('r', dollopR.toString());
      circle.setAttribute('fill', frostingColor);
      circle.setAttribute('stroke', '#D94A73');
      circle.setAttribute('stroke-width', '0.9');
      const innerDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      innerDot.setAttribute('cx', x.toFixed(1));
      innerDot.setAttribute('cy', (y - 1).toFixed(1));
      innerDot.setAttribute('r', '2.5');
      innerDot.setAttribute('fill', '#D94A73');
      innerDot.setAttribute('opacity', '0.45');
      g.appendChild(circle);
      g.appendChild(innerDot);
      dom.pipingGroup.appendChild(g);
    }
  }
  ========================================================================= */

  // ----------------- 8. Tính Toán Tổng Giá Đơn Hàng -----------------
  function calculateTotal() {
    const szObj = CAKE_CONFIG.sizes[state.size] || CAKE_CONFIG.sizes.small;
    const spObj = CAKE_CONFIG.sponges[state.sponge] || CAKE_CONFIG.sponges.vanilla;
    const flObj = CAKE_CONFIG.fillings[state.filling] || CAKE_CONFIG.fillings.blueberry;
    const frObj = CAKE_CONFIG.frostings[state.frosting] || CAKE_CONFIG.frostings.whipping;

    const basePrice = szObj.price;
    const spSurcharge = spObj.surcharge || 0;
    const flSurcharge = flObj.surcharge || 0;
    const frSurcharge = frObj.surcharge || 0;

    state.totalPrice = basePrice + spSurcharge + flSurcharge + frSurcharge;
    return state.totalPrice;
  }

  // ----------------- 9. Cập Nhật Hiển Thị Chiếc Bánh (Real-Time SVG/CSS) -----------------
  function updateCakeVisuals() {
    const szObj = CAKE_CONFIG.sizes[state.size] || CAKE_CONFIG.sizes.small;
    const spObj = CAKE_CONFIG.sponges[state.sponge] || CAKE_CONFIG.sponges.vanilla;
    const flObj = CAKE_CONFIG.fillings[state.filling] || CAKE_CONFIG.fillings.blueberry;
    const frObj = CAKE_CONFIG.frostings[state.frosting] || CAKE_CONFIG.frostings.whipping;

    /* =========================================================================
       [GHI CHÚ]: TẠM TẮT LOGIC CẬP NHẬT MODEL BÁNH SVG/CSS VÌ MODEL ĐÃ ĐƯỢC CHUYỂN THÀNH GHI CHÚ
       =========================================================================
    if (dom.cake3D) {
      dom.cake3D.style.setProperty('--designer-scale', szObj.scale);
      dom.cake3D.style.transform = `scale(${szObj.scale})`;
      dom.cake3D.classList.remove('designer-bounce');
      void dom.cake3D.offsetWidth;
      dom.cake3D.classList.add('designer-bounce');
    }
    if (dom.cakeTop) dom.cakeTop.style.backgroundColor = frObj.color;
    if (dom.cakeFront) dom.cakeFront.style.backgroundColor = frObj.color;
    renderPipingDollops(frObj.color);
    if (dom.spongeRibbon) dom.spongeRibbon.style.backgroundColor = spObj.color;
    if (dom.fillingRibbon) dom.fillingRibbon.style.backgroundColor = flObj.color;
    if (dom.curvedTextPath) {
      const msg = (state.message || '').trim();
      dom.curvedTextPath.textContent = msg || 'Love Cake';
    }
    if (dom.legendSpongeDot) dom.legendSpongeDot.style.backgroundColor = spObj.color;
    if (dom.legendSpongeName) dom.legendSpongeName.textContent = spObj.name;
    if (dom.legendFillingDot) dom.legendFillingDot.style.backgroundColor = flObj.color;
    if (dom.legendFillingName) dom.legendFillingName.textContent = flObj.name;
    if (dom.legendFrostingDot) dom.legendFrostingDot.style.backgroundColor = frObj.color;
    if (dom.legendFrostingName) dom.legendFrostingName.textContent = frObj.name;
    ========================================================================= */

    // 9.8. Cập nhật Thẻ Tóm Tắt Đơn Hàng (Sau Bước 6)
    calculateTotal();
    if (dom.sumSize) dom.sumSize.textContent = szObj.name;
    if (dom.sumSponge) dom.sumSponge.textContent = spObj.name;
    if (dom.sumFilling) dom.sumFilling.textContent = flObj.name;
    if (dom.sumFrosting) dom.sumFrosting.textContent = frObj.name;
    if (dom.sumMessage) dom.sumMessage.textContent = state.message || '(Không lời chúc)';
    if (dom.sumNoteRow && dom.sumNote) {
      const noteTrimmed = (state.note || '').trim();
      if (noteTrimmed) {
        dom.sumNoteRow.style.display = 'flex';
        dom.sumNote.textContent = noteTrimmed;
      } else {
        dom.sumNoteRow.style.display = 'none';
      }
    }
    if (dom.sumTotal) dom.sumTotal.textContent = formatMoney(state.totalPrice);
  }

  // ----------------- 10. Điều Hướng Các Bước (Wizard) -----------------
  function goToStep(targetStep) {
    if (targetStep < 1 || targetStep > 6) return;
    state.step = targetStep;

    // Cập nhật Stepper
    dom.stepperItems.forEach((item) => {
      const stepIdx = Number(item.getAttribute('data-step'));
      item.classList.toggle('active', stepIdx === state.step);
      item.classList.toggle('completed', stepIdx < state.step);
    });

    dom.stepperLines.forEach((line, idx) => {
      line.classList.toggle('active', idx + 1 < state.step);
    });

    // Ẩn/Hiện bước tương ứng
    dom.wizardSteps.forEach((stepEl) => {
      const sNum = Number(stepEl.getAttribute('data-step-num'));
      stepEl.classList.toggle('active', sNum === state.step);
    });

    // Ẩn thông báo cảnh báo
    hideAlert();

    // Cập nhật trạng thái nút
    if (dom.btnPrev) {
      dom.btnPrev.disabled = state.step === 1;
    }

    if (dom.btnNext) {
      if (state.step === 6) {
        dom.btnNext.innerHTML = '<i class="fa-solid fa-cart-shopping"></i> Thêm vào giỏ hàng 💗';
      } else {
        dom.btnNext.innerHTML = 'Tiếp theo <span>▶</span>';
      }
    }
  }

  function nextStep() {
    if (state.step < 6) {
      goToStep(state.step + 1);
    } else {
      // Ở bước cuối, bấm nút sẽ thêm vào giỏ hàng
      addToCart();
    }
  }

  function prevStep() {
    if (state.step > 1) {
      goToStep(state.step - 1);
    }
  }

  function showAlert(msg) {
    if (!dom.alertMsg) return;
    dom.alertMsg.querySelector('span').textContent = msg || 'Vui lòng chọn một tùy chọn trước khi tiếp tục ✿';
    dom.alertMsg.classList.add('visible');

    // Hiệu ứng rung (shake animation)
    const currentStepEl = document.querySelector(`.designer-wizard-step[data-step-num="${state.step}"]`);
    if (currentStepEl) {
      currentStepEl.classList.remove('designer-shake');
      void currentStepEl.offsetWidth;
      currentStepEl.classList.add('designer-shake');
    }
  }

  function hideAlert() {
    if (dom.alertMsg) {
      dom.alertMsg.classList.remove('visible');
    }
  }

  /* =========================================================================
     [GHI CHÚ]: TẠM TẮT XỬ LÝ UPLOAD ẢNH (BƯỚC 5 CŨ)
     =========================================================================
  function handleFiles(files) {
    if (!files || !files.length) return;
    const fileList = Array.from(files).slice(0, state.photoCount);
    let loadedCount = 0;
    const newPhotos = [];
    fileList.forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        newPhotos.push(e.target.result);
        loadedCount++;
        if (loadedCount === fileList.length) {
          state.photos = newPhotos;
          updateCakeVisuals();
        }
      };
      reader.readAsDataURL(file);
    });
  }
  ========================================================================= */

  // ----------------- 12. Thêm Vào Giỏ Hàng & LocalStorage -----------------
  function addToCart() {
    let cart = [];
    try {
      cart = JSON.parse(localStorage.getItem('cart')) || [];
    } catch (e) {
      cart = [];
    }

    const szObj = CAKE_CONFIG.sizes[state.size];
    const spObj = CAKE_CONFIG.sponges[state.sponge];
    const flObj = CAKE_CONFIG.fillings[state.filling];
    const frObj = CAKE_CONFIG.frostings[state.frosting];

    const cakeItem = {
      id: 'custom-cake-' + Date.now(),
      name: `Bánh Thiết Kế Love Cake (${szObj.name})`,
      price: state.totalPrice,
      quantity: 1,
      image: 'assets/img/cart-cake.png',
      category: 'custom-cake',
      customDetails: {
        size: szObj.name,
        sponge: spObj.name,
        filling: flObj.name,
        frosting: frObj.name,
        note: state.note || 'Không có',
        message: state.message || 'Không có'
      }
    };

    cart.push(cakeItem);
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('Không thể lưu giỏ hàng vào LocalStorage', e);
    }

    // Phát CustomEvent cart:updated theo đúng yêu cầu mục 5
    window.dispatchEvent(new CustomEvent('cart:updated', { detail: cart }));

    // Cập nhật số lượng giỏ hàng trên header nếu có hàm updateCartBadge
    if (typeof window.updateCartBadge === 'function') {
      window.updateCartBadge();
    } else {
      const headerCartBadge = document.querySelector('.cart-badge');
      if (headerCartBadge) {
        const totalQty = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        headerCartBadge.textContent = totalQty;
      }
    }

    // Hiển thị Toast thông báo thành công
    showToast();
  }

  function showToast() {
    if (!dom.toast) return;
    dom.toast.classList.add('active');
    setTimeout(() => {
      dom.toast.classList.remove('active');
    }, 3500);
  }

  // ----------------- 13. Làm Lại Từ Đầu (Reset) -----------------
  function resetDesigner() {
    state.step = 1;
    state.size = 'small';
    state.sponge = 'vanilla';
    state.filling = 'blueberry';
    state.frosting = 'whipping';
    state.note = '';
    state.message = 'Happy Birthday Love';

    if (dom.noteInput) dom.noteInput.value = '';
    if (dom.noteCharCount) dom.noteCharCount.textContent = '0';
    if (dom.messageInput) dom.messageInput.value = state.message;

    renderAllOptionCards();
    updateCakeVisuals();
    goToStep(1);
  }

  // ----------------- 14. Gắn Kết Sự Kiện (Bind Events) -----------------
  function bindEvents() {
    // 14.1. Điều hướng nút Trước & Tiếp theo
    if (dom.btnPrev) dom.btnPrev.addEventListener('click', prevStep);
    if (dom.btnNext) dom.btnNext.addEventListener('click', nextStep);
    if (dom.btnReset) dom.btnReset.addEventListener('click', resetDesigner);

    // 14.2. Stepper click
    dom.stepperItems.forEach((item) => {
      item.addEventListener('click', () => {
        const s = Number(item.getAttribute('data-step'));
        goToStep(s);
      });
    });

    // 14.3. Chọn Size Bánh (Bước 1)
    if (dom.sizeOptions) {
      dom.sizeOptions.addEventListener('change', (e) => {
        if (e.target.name === 'cake-size-choice') {
          state.size = e.target.value;
          renderAllOptionCards();
          updateCakeVisuals();
        }
      });
    }

    // 14.4. Chọn Cốt Bánh (Bước 2)
    if (dom.spongeOptions) {
      dom.spongeOptions.addEventListener('change', (e) => {
        if (e.target.name === 'cake-sponge-choice') {
          state.sponge = e.target.value;
          renderAllOptionCards();
          updateCakeVisuals();
        }
      });
    }

    // 14.5. Chọn Nhân Kem (Bước 3)
    if (dom.fillingOptions) {
      dom.fillingOptions.addEventListener('change', (e) => {
        if (e.target.name === 'cake-filling-choice') {
          state.filling = e.target.value;
          renderAllOptionCards();
          updateCakeVisuals();
        }
      });
    }

    // 14.6. Chọn Kem Phủ (Bước 4)
    if (dom.frostingOptions) {
      dom.frostingOptions.addEventListener('change', (e) => {
        if (e.target.name === 'cake-frosting-choice') {
          state.frosting = e.target.value;
          renderAllOptionCards();
          updateCakeVisuals();
        }
      });
    }

    // 14.7. Nhập Ghi Chú Đơn Hàng (Bước 5)
    if (dom.noteInput) {
      dom.noteInput.addEventListener('input', (e) => {
        state.note = e.target.value;
        if (dom.noteCharCount) {
          dom.noteCharCount.textContent = state.note.length;
        }
        if (dom.sumNoteRow && dom.sumNote) {
          const noteTrimmed = (state.note || '').trim();
          if (noteTrimmed) {
            dom.sumNoteRow.style.display = 'flex';
            dom.sumNote.textContent = noteTrimmed;
          } else {
            dom.sumNoteRow.style.display = 'none';
          }
        }
      });
    }

    // 14.8. Nhập lời chúc (Bước 6)
    if (dom.messageInput) {
      dom.messageInput.addEventListener('input', (e) => {
        state.message = e.target.value;
        if (dom.curvedTextPath) {
          const txt = state.message.trim();
          dom.curvedTextPath.textContent = txt || 'Love Cake';
        }
        if (dom.sumMessage) {
          dom.sumMessage.textContent = state.message || '(Không lời chúc)';
        }
      });
    }
  }

  // ----------------- 15. Khởi Chạy Khi DOM Sẵn Sàng -----------------
  function init() {
    renderAllOptionCards();
    updateCakeVisuals();
    goToStep(1);
    bindEvents();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
