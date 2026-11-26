document.addEventListener("DOMContentLoaded", async () => {

  /* ==========================================
     CÁC PHẦN TỬ HTML
     ========================================== */

  const searchInput = document.getElementById("searchInput");
  const priceRange = document.getElementById("priceRange");
  const priceMaxLabel = document.getElementById("priceMaxLabel");

  const productGrid = document.getElementById("productGrid");

  function createProductCard(product) {
    const card = document.createElement("article");
    card.className = "shop-card";
    card.dataset.id = product.id;
    card.dataset.name = product.name;
    card.dataset.category = product.category;
    card.dataset.price = product.price;
    card.dataset.occasion = product.occasion || "Sinh nhật,Lễ";
    card.dataset.date = product.date || "";
    card.dataset.sales = product.sales || "0";

    const mediaLink = document.createElement("a");
    mediaLink.href = `product-detail.html?id=${encodeURIComponent(product.id)}`;
    mediaLink.className = "shop-media";

    const image = document.createElement("img");
    image.src = product.image;
    image.alt = product.name;
    image.loading = "lazy";
    mediaLink.append(image);

    const overlay = document.createElement("span");
    overlay.className = "shop-overlay";
    overlay.textContent = "Xem chi tiết";
    mediaLink.append(overlay);

    const body = document.createElement("div");
    body.className = "shop-body";

    const category = document.createElement("p");
    category.className = "shop-category";
    category.textContent = product.category;

    const name = document.createElement("h3");
    name.className = "shop-name";
    const nameLink = document.createElement("a");
    nameLink.href = mediaLink.href;
    nameLink.textContent = product.name;
    name.append(nameLink);

    const rating = document.createElement("div");
    rating.className = "shop-rating";
    const stars = document.createElement("span");
    stars.className = "stars";
    stars.setAttribute("aria-label", "5 sao");
    stars.textContent = "★★★★★";
    const ratingNumber = document.createElement("span");
    ratingNumber.className = "rating-num";
    ratingNumber.textContent = "5.0";
    rating.append(stars, ratingNumber);

    const footer = document.createElement("div");
    footer.className = "shop-footer";
    const price = document.createElement("span");
    price.className = "shop-price";
    price.textContent = Number(product.price).toLocaleString("vi-VN") + "đ";

    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.className = "btn-add-sm";
    addButton.dataset.id = product.id;
    addButton.dataset.name = product.name;
    addButton.dataset.price = product.price;
    addButton.textContent = "+ Thêm";

    footer.append(price, addButton);
    body.append(category, name, rating, footer);
    card.append(mediaLink, body);
    return card;
  }

  try {
    const response = await fetch("js/products-data.json");
    if (!response.ok) {
      throw new Error(`Không tải được dữ liệu sản phẩm: HTTP ${response.status}`);
    }

    const productData = await response.json();
    if (!Array.isArray(productData)) {
      throw new Error("Dữ liệu sản phẩm phải là một danh sách.");
    }

    const firstStaticProduct = productGrid.querySelector(".shop-card");
    productData.forEach(product => {
      productGrid.insertBefore(createProductCard(product), firstStaticProduct);
    });
  } catch (error) {
    console.error("Không thể tải sản phẩm từ products-data.json.", error);
  }

  const products = Array.from(productGrid.querySelectorAll(".shop-card"));

  const productCount = document.getElementById("productCount");
  const noResults = document.getElementById("noResults");

  const clearFilters = document.getElementById("clearFilters");
  const sortSelect = document.getElementById("sortSelect");

  const categoryButtons = document.querySelectorAll(".category-item");
  const occasionButtons = document.querySelectorAll(".occasion-item");


  /* ==========================================
     TRẠNG THÁI BỘ LỌC
     ========================================== */

  let selectedCategory = "all";
  let selectedOccasion = "all";


  /* ==========================================
     HÀM FORMAT GIÁ
     ========================================== */

  function formatPrice(price) {
    return Number(price).toLocaleString("vi-VN") + "đ";
  }

  function compareProductsByDefault(a, b) {
    const aIsFreshFruit = a.dataset.category === "Bánh hoa quả tươi";
    const bIsFreshFruit = b.dataset.category === "Bánh hoa quả tươi";
    if (aIsFreshFruit !== bIsFreshFruit) return aIsFreshFruit ? -1 : 1;
    return a.dataset.id.localeCompare(b.dataset.id, undefined, { numeric: true });
  }


  /* ==========================================
     CẬP NHẬT THANH GIÁ
     ========================================== */

  function updatePriceRange() {
    const min = Number(priceRange.min);
    const max = Number(priceRange.max);
    const value = Number(priceRange.value);

    const percent = ((value - min) / (max - min)) * 100;

    priceRange.style.setProperty("--fill", `${percent}%`);
    priceMaxLabel.textContent = formatPrice(value);
  }


  /* ==========================================
     KIỂM TRA DỊP
     ========================================== */

  function matchesOccasion(product) {
    if (selectedOccasion === "all") {
      return true;
    }

    const category = product.dataset.category || "";

    if (selectedOccasion === "Sinh nhật") {
      return category !== "Bánh lễ";
    }

    if (selectedOccasion === "Cưới") {
      return ["Bánh lễ", "Bánh hoa quả tươi", "Cheese Cake"].includes(category);
    }

    if (selectedOccasion === "Lễ") {
      return ["Bánh lễ", "Cheese Cake"].includes(category);
    }

    return false;
  }


  /* ==========================================
     LỌC SẢN PHẨM
     ========================================== */

  function applyFilters() {
    const keyword = searchInput.value.trim().toLowerCase();
    const maxPrice = Number(priceRange.value);

    let visibleProducts = [];

    products.forEach(product => {
      const name = (product.dataset.name || "").toLowerCase();
      const category = product.dataset.category || "";
      const price = Number(product.dataset.price || 0);

      const searchMatch = name.includes(keyword);
      const categoryMatch =
        selectedCategory === "all" || category === selectedCategory;
      const priceMatch = price <= maxPrice;
      const occasionMatch = matchesOccasion(product);

      const matches =
        searchMatch && categoryMatch && priceMatch && occasionMatch;

      product.hidden = !matches;

      if (matches) {
        visibleProducts.push(product);
      }
    });

    productCount.textContent = visibleProducts.length;
    noResults.hidden = visibleProducts.length !== 0;

    updatePriceRange();
  }


  /* ==========================================
     URL <-> DANH MỤC
     ========================================== */

  function updateURL(slug) {
    const url = new URL(window.location.href);

    if (!slug || slug === "all") {
      url.searchParams.delete("cat");
    } else {
      url.searchParams.set("cat", slug);
    }

    history.replaceState(null, "", url);
  }

  function applyCategoryFromURL() {
    const cat = new URLSearchParams(window.location.search).get("cat");
    if (!cat) return;

    const target = Array.from(categoryButtons).find(
      button => button.dataset.slug === cat
    );
    if (!target) return;

    categoryButtons.forEach(button => button.classList.remove("active"));
    target.classList.add("active");
    selectedCategory = target.dataset.category;
  }


  /* ==========================================
     CHỌN DANH MỤC
     ========================================== */

  categoryButtons.forEach(button => {
    button.addEventListener("click", () => {
      categoryButtons.forEach(item => item.classList.remove("active"));
      button.classList.add("active");

      selectedCategory = button.dataset.category;

      updateURL(button.dataset.slug);

      applyFilters();
    });
  });


  /* ==========================================
     CHỌN DỊP
     ========================================== */

  occasionButtons.forEach(button => {
    button.addEventListener("click", () => {
      occasionButtons.forEach(item => item.classList.remove("active"));
      button.classList.add("active");

      selectedOccasion = button.dataset.occasion;

      applyFilters();
    });
  });


  /* ==========================================
     TÌM KIẾM
     ========================================== */

  searchInput.addEventListener("input", applyFilters);


  /* ==========================================
     KHOẢNG GIÁ
     ========================================== */

  priceRange.addEventListener("input", applyFilters);


  /* ==========================================
     SẮP XẾP
     ========================================== */

  sortSelect.addEventListener("change", () => {
    const sortType = sortSelect.value;
    const sortedProducts = [...products];

    switch (sortType) {
      case "price-asc":
        sortedProducts.sort(
          (a, b) => Number(a.dataset.price) - Number(b.dataset.price)
        );
        break;

      case "price-desc":
        sortedProducts.sort(
          (a, b) => Number(b.dataset.price) - Number(a.dataset.price)
        );
        break;

      default:
        sortedProducts.sort(compareProductsByDefault);
        break;
    }

    sortedProducts.forEach(product => {
      productGrid.appendChild(product);
    });

    applyFilters();
  });


  /* ==========================================
     XÓA BỘ LỌC
     ========================================== */

  clearFilters.addEventListener("click", () => {

    /* Tìm kiếm */
    searchInput.value = "";

    /* Danh mục */
    selectedCategory = "all";
    categoryButtons.forEach(button => button.classList.remove("active"));

    const allCategory = document.querySelector(
      '.category-item[data-category="all"]'
    );
    if (allCategory) {
      allCategory.classList.add("active");
    }

    /* Dịp */
    selectedOccasion = "all";
    occasionButtons.forEach(button => button.classList.remove("active"));

    const allOccasion = document.querySelector(
      '.occasion-item[data-occasion="all"]'
    );
    if (allOccasion) {
      allOccasion.classList.add("active");
    }

    /* Giá */
    priceRange.value = priceRange.max;

    /* Sắp xếp */
    sortSelect.value = "default";

    /* Đưa sản phẩm về thứ tự ban đầu */
    products
      .sort(compareProductsByDefault)
      .forEach(product => {
        productGrid.appendChild(product);
      });

    /* Xoá ?cat= trên URL */
    updateURL("all");

    applyFilters();
  });


  /* ==========================================
     KHỞI TẠO
     ========================================== */

  applyCategoryFromURL();
  updatePriceRange();
  applyFilters();

});