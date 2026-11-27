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
        scale: 0.72
      },
      small: {
        id: 'small',
        name: 'Size Nhỏ (15cm)',
        shortName: 'Size Nhỏ (15cm)',
        price: 260000,
        scale: 0.86,
        isPopular: true
      },
      medium: {
        id: 'medium',
        name: 'Size Vừa (18cm)',
        shortName: 'Size Vừa (18cm)',
        price: 360000,
        scale: 0.96
      },
      large: {
        id: 'large',
        name: 'Size Lớn (20cm)',
        shortName: 'Size Lớn (20cm)',
        price: 460000,
        scale: 1.05
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
    },

    // Bước 5: Topping trang trí bánh (6 loại theo A1)
    toppings: {
      sprinkles: {
        id: 'sprinkles',
        name: 'Cốm sắc màu',
        color: '#f43f5e'
      },
      pearls: {
        id: 'pearls',
        name: 'Kẹo bi đường ngọc trai',
        color: '#e2e8f0'
      },
      strawberry: {
        id: 'strawberry',
        name: 'Dâu tây tươi',
        color: '#dc2626'
      },
      choco_chips: {
        id: 'choco_chips',
        name: 'Socola chip',
        color: '#451a03'
      },
      oreo: {
        id: 'oreo',
        name: 'Vụn bánh Oreo',
        color: '#1e293b'
      },
      pocky: {
        id: 'pocky',
        name: 'Bánh que Pocky',
        color: '#d97706'
      }
    }
  };

  // ----------------- 2. Trạng Thái Hiện Tại Của Trình Thiết Kế -----------------
  const MAX_PHOTOS = 8;

  const state = {
    step: 1,
    size: 'small', // Mặc định 15cm
    sponge: 'vanilla', // Mặc định Vanilla Pháp
    filling: 'blueberry', // Mặc định Việt Quất
    frosting: 'whipping', // Mặc định Kem tươi
    toppings: [], // Mảng ID các topping được chọn (tối đa 3)
    photos: [], // Mảng chuỗi ảnh nén base64 (tối đa 8 ảnh, không bắt buộc)
    message: 'Happy Birthday Love', // Mặc định lời chúc
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

    // Bước 5: Topping trên bánh
    toppingOptions: document.getElementById('designerToppingOptions'),
    toppingCountInfo: document.getElementById('designerToppingCountInfo'),
    btnClearTopping: document.getElementById('designerBtnClearTopping'),

    // Bước 6: Cắm ảnh mặt bánh (Tối đa 8 ảnh)
    photoInput: document.getElementById('designerPhotoInput'),
    photoCountInfo: document.getElementById('designerPhotoCountInfo'),
    btnClearPhotos: document.getElementById('designerBtnClearPhotos'),
    photoThumbsGrid: document.getElementById('designerPhotoThumbsGrid'),

    // Bước 7: Lời chúc & Tóm tắt
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
    sumTopping: document.getElementById('designerSumTopping'),
    sumPhotos: document.getElementById('designerSumPhotos'),
    sumMessage: document.getElementById('designerSumMessage'),
    sumTotal: document.getElementById('designerSumTotal'),

    // Mô hình bánh xem trước SVG
    cakeAssembly: document.getElementById('designerCakeAssembly'),
    cakeScalable: document.getElementById('designerCakeScalable'),
    cakeTop: document.getElementById('designerCakeTop'),
    cakeSide: document.getElementById('designerCakeSide'),
    spongeBand: document.getElementById('designerSpongeBand'),
    fillingBand: document.getElementById('designerFillingBand'),
    spongeTooltip: document.getElementById('designerSpongeTooltip'),
    fillingTooltip: document.getElementById('designerFillingTooltip'),
    curvedTextPath: document.getElementById('designerCurvedTextPath'),

    // Các lớp SVG Topping trên mặt bánh
    toppingLayers: {
      sprinkles: document.getElementById('toppingLayer-sprinkles'),
      pearls: document.getElementById('toppingLayer-pearls'),
      strawberry: document.getElementById('toppingLayer-strawberry'),
      choco_chips: document.getElementById('toppingLayer-choco_chips'),
      oreo: document.getElementById('toppingLayer-oreo'),
      pocky: document.getElementById('toppingLayer-pocky')
    },

    // Pop-up giới thiệu bánh thực tế của shop
    introModal: document.getElementById('designerIntroModal'),
    introBackdrop: document.getElementById('designerIntroBackdrop'),
    introCloseBtn: document.getElementById('designerIntroCloseBtn'),

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

    // 5.5. Render Bước 5: Topping trên bánh
    renderToppingOptions();
  }

  // ----------------- 5.5. Tính Toán Phụ Phí Topping (A3) -----------------
  function calculateToppingSurcharge(count) {
    if (count <= 1) return 0;
    return (count - 1) * 15000;
  }

  // ----------------- 5.6. Render Danh Sách Topping (Bước 5) -----------------
  function renderToppingOptions() {
    if (!dom.toppingOptions) return;

    const selectedCount = state.toppings.length;
    const isMaxReached = selectedCount >= 3;

    dom.toppingOptions.innerHTML = Object.values(CAKE_CONFIG.toppings)
      .map(tp => {
        const isChecked = state.toppings.includes(tp.id);
        const isDisabled = isMaxReached && !isChecked;

        // Xác định nhãn giá hiển thị
        let priceLabel = 'Miễn phí';
        if (isChecked) {
          const idx = state.toppings.indexOf(tp.id);
          priceLabel = idx === 0 ? 'Miễn phí' : '+15.000đ';
        } else {
          priceLabel = selectedCount === 0 ? 'Miễn phí' : '+15.000đ';
        }

        return `
          <label class="designer-option-card ${isChecked ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}">
            <input
              type="checkbox"
              name="cake-topping-choice"
              value="${tp.id}"
              ${isChecked ? 'checked' : ''}
              ${isDisabled ? 'disabled' : ''}
            />
            <span class="designer-custom-checkbox"></span>
            <span class="designer-flavor-swatch" style="background-color: ${tp.color};"></span>
            <div class="designer-option-content">
              <div class="designer-option-name-row">
                <span class="designer-option-name">${tp.name}</span>
                <span class="designer-option-price">${priceLabel}</span>
              </div>
            </div>
          </label>
        `;
      })
      .join('');

    // Cập nhật thanh đếm topping
    if (dom.toppingCountInfo) {
      const surcharge = calculateToppingSurcharge(selectedCount);
      const surchargeText = surcharge > 0 ? ` (+${formatMoney(surcharge)})` : '';
      dom.toppingCountInfo.innerHTML = `Đã chọn: <strong>${selectedCount}/3</strong> loại${surchargeText}`;
    }
  }

  // ----------------- 6. Quản Lý Ảnh Cắm Mặt Bánh (Bước 6 - Tối đa 8 ảnh) -----------------
  function compressImageFile(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 280;
          let width = img.width || maxDim;
          let height = img.height || maxDim;
          if (width > maxDim || height > maxDim) {
            if (width >= height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.75));
          } else {
            resolve(ev.target.result);
          }
        };
        img.onerror = () => resolve(ev.target.result);
        img.src = ev.target.result;
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  }

  async function handlePhotoFiles(fileList) {
    if (!fileList || !fileList.length) return;
    const imageFiles = Array.from(fileList).filter((f) => f.type && f.type.startsWith('image/'));
    if (!imageFiles.length) {
      showAlert('Vui lòng chỉ chọn tệp hình ảnh (JPG, PNG, WEBP...) ✿');
      return;
    }

    const remaining = MAX_PHOTOS - state.photos.length;
    if (remaining <= 0) {
      showAlert(`Bạn đã tải đủ tối đa ${MAX_PHOTOS} ảnh cắm trên bánh ✿`);
      return;
    }

    if (imageFiles.length > remaining) {
      showAlert(`Chỉ có thể thêm tối đa ${remaining} ảnh nữa (giới hạn ${MAX_PHOTOS} ảnh) ✿`);
    } else {
      hideAlert();
    }

    const accepted = imageFiles.slice(0, remaining);
    const compressedList = await Promise.all(accepted.map(compressImageFile));
    compressedList.forEach((dataUrl) => {
      if (dataUrl && state.photos.length < MAX_PHOTOS) {
        state.photos.push(dataUrl);
      }
    });

    if (dom.photoInput) dom.photoInput.value = '';
    renderPhotoThumbnails();
    updateCakeVisuals();
  }

  function removePhotoAt(index) {
    if (index >= 0 && index < state.photos.length) {
      state.photos.splice(index, 1);
      renderPhotoThumbnails();
      updateCakeVisuals();
      hideAlert();
    }
  }

  function renderPhotoThumbnails() {
    const count = state.photos.length;
    if (dom.photoCountInfo) {
      dom.photoCountInfo.innerHTML = count > 0
        ? `Đã chọn: <strong>${count}/${MAX_PHOTOS}</strong> ảnh`
        : `Đã chọn: <strong>0/${MAX_PHOTOS}</strong> ảnh (Không cắm ảnh)`;
    }

    if (!dom.photoThumbsGrid) return;
    if (count === 0) {
      dom.photoThumbsGrid.innerHTML = '';
      return;
    }

    dom.photoThumbsGrid.innerHTML = state.photos
      .map((src, idx) => `
        <div class="designer-thumb-item">
          <div class="designer-thumb-box" title="Ảnh cắm số ${idx + 1}">
            <span class="designer-thumb-index">${idx + 1}</span>
            <img src="${src}" alt="Ảnh cắm bánh ${idx + 1}" class="designer-thumb-img" />
          </div>
          <button type="button" class="designer-btn-del-thumb" data-photo-idx="${idx}">XOÁ</button>
        </div>
      `)
      .join('');
  }

  // ----------------- 7. Hiệu Ứng Nảy Bánh -----------------
  function triggerPulse(el, className) {
    if (!el) return;
    el.classList.remove(className);
    void el.offsetWidth;
    el.classList.add(className);
  }

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
    const toppingSurcharge = calculateToppingSurcharge(state.toppings.length);

    state.totalPrice = basePrice + spSurcharge + flSurcharge + frSurcharge + toppingSurcharge;
    return state.totalPrice;
  }

  // ----------------- 9. Cập Nhật Hiển Thị Chiếc Bánh (Real-Time SVG) -----------------
  function updateCakeVisuals(changedSection) {
    const szObj = CAKE_CONFIG.sizes[state.size] || CAKE_CONFIG.sizes.small;
    const spObj = CAKE_CONFIG.sponges[state.sponge] || CAKE_CONFIG.sponges.vanilla;
    const flObj = CAKE_CONFIG.fillings[state.filling] || CAKE_CONFIG.fillings.blueberry;
    const frObj = CAKE_CONFIG.frostings[state.frosting] || CAKE_CONFIG.frostings.whipping;

    // 9.1. Kích thước bánh co giãn mượt trên đĩa trơn
    if (dom.cakeScalable) {
      dom.cakeScalable.style.setProperty('--designer-scale', szObj.scale);
    }

    // 9.2. Màu kem phủ toàn thân & mặt trên bánh
    if (dom.cakeSide) dom.cakeSide.setAttribute('fill', frObj.color);
    if (dom.cakeTop) dom.cakeTop.setAttribute('fill', frObj.color);

    // 9.3. Hai dải sọc trên thân bánh: Dải trên = Cốt bánh, Dải dưới = Nhân kem
    if (dom.spongeBand) dom.spongeBand.setAttribute('fill', spObj.color);
    if (dom.spongeTooltip) dom.spongeTooltip.textContent = `Cốt bánh: ${spObj.name}`;
    if (dom.fillingBand) dom.fillingBand.setAttribute('fill', flObj.color);
    if (dom.fillingTooltip) dom.fillingTooltip.textContent = `Nhân kem: ${flObj.name}`;

    // 9.4. Cập nhật 6 lớp SVG Topping trên mặt bánh
    Object.keys(dom.toppingLayers).forEach((key) => {
      const layer = dom.toppingLayers[key];
      if (layer) {
        layer.classList.toggle('active', state.toppings.includes(key));
      }
    });

    // 9.5. Cập nhật lời chúc viết tay màu #D94A73 giữa thân trước bánh
    if (dom.curvedTextPath) {
      const txt = (state.message || '').trim();
      dom.curvedTextPath.textContent = txt || 'Love Cake';
    }

    // 9.6. Hiệu ứng nảy bánh nhẹ khi thay đổi lựa chọn
    if (changedSection) {
      triggerPulse(dom.cakeAssembly, 'designer-bounce');
    }

    // 9.7. Cập nhật Thẻ Tóm Tắt Đơn Hàng (Bước 7)
    calculateTotal();
    if (dom.sumSize) dom.sumSize.textContent = szObj.name;
    if (dom.sumSponge) dom.sumSponge.textContent = spObj.name;
    if (dom.sumFilling) dom.sumFilling.textContent = flObj.name;
    if (dom.sumFrosting) dom.sumFrosting.textContent = frObj.name;

    if (dom.sumTopping) {
      if (state.toppings.length === 0) {
        dom.sumTopping.textContent = 'Không lấy topping (0đ)';
      } else {
        const toppingNames = state.toppings.map(id => CAKE_CONFIG.toppings[id]?.name || id).join(', ');
        const surcharge = calculateToppingSurcharge(state.toppings.length);
        dom.sumTopping.textContent = surcharge > 0
          ? `${toppingNames} (+${formatMoney(surcharge)})`
          : `${toppingNames} (Miễn phí)`;
      }
    }

    if (dom.sumPhotos) {
      dom.sumPhotos.textContent = state.photos.length > 0
        ? `${state.photos.length} ảnh (Miễn phí)`
        : 'Không cắm ảnh (0đ)';
    }

    if (dom.sumMessage) dom.sumMessage.textContent = state.message || '(Không lời chúc)';
    if (dom.sumTotal) dom.sumTotal.textContent = formatMoney(state.totalPrice);
  }

  // ----------------- 10. Điều Hướng Các Bước (Wizard 7 Bước) -----------------
  function goToStep(targetStep) {
    if (targetStep < 1 || targetStep > 7) return;
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
      if (state.step === 7) {
        dom.btnNext.innerHTML = '<i class="fa-solid fa-cart-shopping"></i> Thêm vào giỏ hàng';
      } else {
        dom.btnNext.innerHTML = 'Tiếp theo <span>▶</span>';
      }
    }
  }

  function nextStep() {
    if (state.step < 7) {
      goToStep(state.step + 1);
    } else {
      // Ở bước cuối (Bước 7), bấm nút sẽ thêm vào giỏ hàng
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

  // ----------------- 12. Thêm Vào Giỏ Hàng & Chuyển Trang Giỏ Hàng -----------------
  function addToCart() {
    let cart = [];
    try {
      cart = JSON.parse(localStorage.getItem('cart')) || [];
      if (!Array.isArray(cart)) cart = [];
    } catch (e) {
      cart = [];
    }

    const szObj = CAKE_CONFIG.sizes[state.size] || CAKE_CONFIG.sizes.small;
    const spObj = CAKE_CONFIG.sponges[state.sponge] || CAKE_CONFIG.sponges.vanilla;
    const flObj = CAKE_CONFIG.fillings[state.filling] || CAKE_CONFIG.fillings.blueberry;
    const frObj = CAKE_CONFIG.frostings[state.frosting] || CAKE_CONFIG.frostings.whipping;

    const toppingNames = state.toppings.map(id => CAKE_CONFIG.toppings[id]?.name || id);
    const toppingSurcharge = calculateToppingSurcharge(state.toppings.length);
    const toppingsText = toppingNames.length > 0
      ? (toppingSurcharge > 0 ? `${toppingNames.join(', ')} (+${formatMoney(toppingSurcharge)})` : `${toppingNames.join(', ')} (Miễn phí)`)
      : 'Không lấy topping';

    const photosCount = state.photos.length;
    const photosText = photosCount > 0 ? `${photosCount} ảnh (Miễn phí)` : 'Không cắm ảnh';

    const cakeItem = {
      id: 'custom-cake-' + Date.now(),
      name: `Bánh Thiết Kế Love Cake (${szObj.name})`,
      price: state.totalPrice,
      quantity: 1,
      image: 'assets/img/custom-cake-default.jpg',
      category: 'cake',
      customDetails: {
        size: szObj.name,
        sponge: spObj.name,
        filling: flObj.name,
        frosting: frObj.name,
        toppings: toppingNames,
        toppingsText: toppingsText,
        photosCount: photosCount,
        photosText: photosText,
        photos: state.photos.slice(),
        message: state.message || 'Không có'
      }
    };

    cart.push(cakeItem);
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (e) {
      // Dự phòng nếu dung lượng localStorage đầy: giữ lại số lượng & text, bỏ bớt dữ liệu ảnh nhị phân
      cakeItem.customDetails.photos = [];
      try {
        localStorage.setItem('cart', JSON.stringify(cart));
      } catch (innerErr) {
        console.warn('Không thể lưu giỏ hàng vào LocalStorage', innerErr);
      }
    }

    // Phát CustomEvent cart:updated theo chuẩn website
    window.dispatchEvent(new CustomEvent('cart:updated', { detail: cart }));

    if (typeof window.updateCartBadge === 'function') {
      window.updateCartBadge();
    } else {
      const headerCartBadge = document.querySelector('.cart-badge');
      if (headerCartBadge) {
        const totalQty = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        headerCartBadge.textContent = totalQty;
      }
    }

    // Chuyển trang sang giỏ hàng ngay lập tức
    window.location.href = 'cart.html';
  }

  function showToast() {
    if (!dom.toast) return;
    dom.toast.classList.add('active');
    setTimeout(() => {
      dom.toast.classList.remove('active');
    }, 3500);
  }

  // ----------------- 13. Làm Lại Từ Đầu (Reset theo A15) -----------------
  function resetDesigner() {
    state.step = 1;
    state.size = 'small';
    state.sponge = 'vanilla';
    state.filling = 'blueberry';
    state.frosting = 'whipping';
    state.toppings = [];
    state.photos = [];
    state.message = 'Happy Birthday Love';

    if (dom.photoInput) dom.photoInput.value = '';
    if (dom.messageInput) dom.messageInput.value = state.message;

    renderAllOptionCards();
    renderPhotoThumbnails();
    updateCakeVisuals();
    goToStep(1);
  }

  // ----------------- 14. Pop-up Giới Thiệu Ảnh Bánh Thực Tế (theo A2, A3, A4) -----------------
  function openIntroModal() {
    if (!dom.introModal) return;
    dom.introModal.classList.add('is-open');
    dom.introModal.setAttribute('aria-hidden', 'false');
  }

  function closeIntroModal() {
    if (!dom.introModal) return;
    dom.introModal.classList.remove('is-open');
    dom.introModal.setAttribute('aria-hidden', 'true');
  }

  function initIntroModal() {
    if (!dom.introModal) return;

    // Tự động hiển thị pop-up mỗi lần người dùng truy cập trang tự thiết kế
    openIntroModal();

    if (dom.introCloseBtn) dom.introCloseBtn.addEventListener('click', closeIntroModal);
    if (dom.introBackdrop) dom.introBackdrop.addEventListener('click', closeIntroModal);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && dom.introModal.classList.contains('is-open')) {
        closeIntroModal();
      }
    });
  }

  // ----------------- 15. Gắn Kết Sự Kiện (Bind Events) -----------------
  function bindEvents() {
    // 15.1. Điều hướng nút Trước & Tiếp theo
    if (dom.btnPrev) dom.btnPrev.addEventListener('click', prevStep);
    if (dom.btnNext) dom.btnNext.addEventListener('click', nextStep);
    if (dom.btnReset) dom.btnReset.addEventListener('click', resetDesigner);

    // 15.2. Stepper click
    dom.stepperItems.forEach((item) => {
      item.addEventListener('click', () => {
        const s = Number(item.getAttribute('data-step'));
        goToStep(s);
      });
    });

    // 15.3. Chọn Size Bánh (Bước 1)
    if (dom.sizeOptions) {
      dom.sizeOptions.addEventListener('change', (e) => {
        if (e.target.name === 'cake-size-choice') {
          state.size = e.target.value;
          renderAllOptionCards();
          updateCakeVisuals('size');
        }
      });
    }

    // 15.4. Chọn Cốt Bánh (Bước 2)
    if (dom.spongeOptions) {
      dom.spongeOptions.addEventListener('change', (e) => {
        if (e.target.name === 'cake-sponge-choice') {
          state.sponge = e.target.value;
          renderAllOptionCards();
          updateCakeVisuals('sponge');
        }
      });
    }

    // 15.5. Chọn Nhân Kem (Bước 3)
    if (dom.fillingOptions) {
      dom.fillingOptions.addEventListener('change', (e) => {
        if (e.target.name === 'cake-filling-choice') {
          state.filling = e.target.value;
          renderAllOptionCards();
          updateCakeVisuals('filling');
        }
      });
    }

    // 15.6. Chọn Kem Phủ (Bước 4)
    if (dom.frostingOptions) {
      dom.frostingOptions.addEventListener('change', (e) => {
        if (e.target.name === 'cake-frosting-choice') {
          state.frosting = e.target.value;
          renderAllOptionCards();
          updateCakeVisuals('frosting');
        }
      });
    }

    // 15.7. Chọn Topping Trên Bánh (Bước 5)
    if (dom.toppingOptions) {
      dom.toppingOptions.addEventListener('change', (e) => {
        if (e.target.name === 'cake-topping-choice') {
          const val = e.target.value;
          if (e.target.checked) {
            if (state.toppings.length < 3) {
              if (!state.toppings.includes(val)) {
                state.toppings.push(val);
              }
            } else {
              e.target.checked = false;
              showAlert('Bạn chỉ có thể chọn tối đa 3 loại topping ✿');
              return;
            }
          } else {
            state.toppings = state.toppings.filter(id => id !== val);
          }
          renderToppingOptions();
          updateCakeVisuals('toppings');
        }
      });
    }

    if (dom.btnClearTopping) {
      dom.btnClearTopping.addEventListener('click', () => {
        state.toppings = [];
        renderToppingOptions();
        updateCakeVisuals('toppings');
      });
    }

    // 15.8. Tải ảnh cắm mặt bánh (Bước 6 - Tối đa 8 ảnh)
    if (dom.photoInput) {
      dom.photoInput.addEventListener('change', (e) => {
        handlePhotoFiles(e.target.files);
      });
    }

    if (dom.photoThumbsGrid) {
      dom.photoThumbsGrid.addEventListener('click', (e) => {
        const delBtn = e.target.closest('.designer-btn-del-thumb');
        if (delBtn) {
          const idx = Number(delBtn.getAttribute('data-photo-idx'));
          removePhotoAt(idx);
        }
      });
    }

    if (dom.btnClearPhotos) {
      dom.btnClearPhotos.addEventListener('click', () => {
        state.photos = [];
        if (dom.photoInput) dom.photoInput.value = '';
        renderPhotoThumbnails();
        updateCakeVisuals();
        hideAlert();
      });
    }

    // 15.9. Nhập lời chúc (Bước 7)
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

  // ----------------- 16. Khởi Chạy Khi DOM Sẵn Sàng -----------------
  function init() {
    renderAllOptionCards();
    renderPhotoThumbnails();
    updateCakeVisuals();
    goToStep(1);
    bindEvents();
    initIntroModal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
