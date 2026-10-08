document.addEventListener("DOMContentLoaded", () => {

  /* ==========================================
     CÁC PHẦN TỬ HTML
     ========================================== */

  const searchInput = document.getElementById("searchInput");
  const priceRange = document.getElementById("priceRange");
  const priceMaxLabel = document.getElementById("priceMaxLabel");

  const productGrid = document.getElementById("productGrid");
  const products = Array.from(
    productGrid.querySelectorAll(".shop-card")
  );

  const productCount = document.getElementById("productCount");
  const noResults = document.getElementById("noResults");

  const clearFilters =
    document.getElementById("clearFilters");

  const sortSelect =
    document.getElementById("sortSelect");

  const categoryButtons =
    document.querySelectorAll(".category-item");

  const occasionButtons =
    document.querySelectorAll(".occasion-item");


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


  /* ==========================================
     CẬP NHẬT THANH GIÁ
     ========================================== */

  function updatePriceRange() {

    const min =
      Number(priceRange.min);

    const max =
      Number(priceRange.max);

    const value =
      Number(priceRange.value);

    const percent =
      ((value - min) / (max - min)) * 100;

    priceRange.style.setProperty(
      "--fill",
      `${percent}%`
    );

    priceMaxLabel.textContent =
      formatPrice(value);
  }


  /* ==========================================
     KIỂM TRA DỊP
     ========================================== */

  function matchesOccasion(product) {

    if (selectedOccasion === "all") {
      return true;
    }

    const occasions =
      (product.dataset.occasion || "")
        .split(",")
        .map(item => item.trim());

    return occasions.includes(selectedOccasion);
  }


  /* ==========================================
     LỌC SẢN PHẨM
     ========================================== */

  function applyFilters() {

    const keyword =
      searchInput.value
        .trim()
        .toLowerCase();

    const maxPrice =
      Number(priceRange.value);

    let visibleProducts = [];


    products.forEach(product => {

      const name =
        (product.dataset.name || "")
          .toLowerCase();

      const category =
        product.dataset.category || "";

      const price =
        Number(product.dataset.price || 0);


      /* Tìm kiếm */
      const searchMatch =
        name.includes(keyword);


      /* Danh mục */
      const categoryMatch =
        selectedCategory === "all" ||
        category === selectedCategory;


      /* Giá */
      const priceMatch =
        price <= maxPrice;


      /* Dịp */
      const occasionMatch =
        matchesOccasion(product);


      /* Tổng hợp */
      const matches =
        searchMatch &&
        categoryMatch &&
        priceMatch &&
        occasionMatch;


      product.hidden = !matches;


      if (matches) {
        visibleProducts.push(product);
      }

    });


    /* Cập nhật số lượng */
    productCount.textContent =
      visibleProducts.length;


    /* Hiện / ẩn thông báo */
    noResults.hidden =
      visibleProducts.length !== 0;


    updatePriceRange();
  }


  /* ==========================================
     CHỌN DANH MỤC
     ========================================== */

  categoryButtons.forEach(button => {

    button.addEventListener("click", () => {

      categoryButtons.forEach(item => {
        item.classList.remove("active");
      });

      button.classList.add("active");

      selectedCategory =
        button.dataset.category;

      applyFilters();

    });

  });


  /* ==========================================
     CHỌN DỊP
     ========================================== */

  occasionButtons.forEach(button => {

    button.addEventListener("click", () => {

      occasionButtons.forEach(item => {
        item.classList.remove("active");
      });

      button.classList.add("active");

      selectedOccasion =
        button.dataset.occasion;

      applyFilters();

    });

  });


  /* ==========================================
     TÌM KIẾM
     ========================================== */

  searchInput.addEventListener(
    "input",
    applyFilters
  );


  /* ==========================================
     KHOẢNG GIÁ
     ========================================== */

  priceRange.addEventListener(
    "input",
    applyFilters
  );


  /* ==========================================
     SẮP XẾP
     ========================================== */

  sortSelect.addEventListener(
    "change",
    () => {

      const sortType =
        sortSelect.value;


      const sortedProducts =
        [...products];


      switch (sortType) {

        /* -------------------------------
           Giá thấp → cao
           ------------------------------- */
        case "price-asc":

          sortedProducts.sort(
            (a, b) =>
              Number(a.dataset.price) -
              Number(b.dataset.price)
          );

          break;


        /* -------------------------------
           Giá cao → thấp
           ------------------------------- */
        case "price-desc":

          sortedProducts.sort(
            (a, b) =>
              Number(b.dataset.price) -
              Number(a.dataset.price)
          );

          break;


        /* -------------------------------
           Mới nhất
           ------------------------------- */
        case "newest":

          sortedProducts.sort(
            (a, b) =>
              new Date(b.dataset.date) -
              new Date(a.dataset.date)
          );

          break;


        /* -------------------------------
           Bán chạy
           ------------------------------- */
        case "bestseller":

          sortedProducts.sort(
            (a, b) =>
              Number(b.dataset.sales) -
              Number(a.dataset.sales)
          );

          break;


        /* -------------------------------
           Mặc định
           ------------------------------- */
        default:

          sortedProducts.sort(
            (a, b) =>
              Number(a.dataset.id) -
              Number(b.dataset.id)
          );

          break;
      }


      /* Đưa sản phẩm đã sắp xếp
         trở lại grid */

      sortedProducts.forEach(product => {
        productGrid.appendChild(product);
      });


      /* Giữ nguyên bộ lọc hiện tại */
      applyFilters();

    }
  );


  /* ==========================================
     XÓA BỘ LỌC
     ========================================== */

  clearFilters.addEventListener(
    "click",
    () => {

      /* Tìm kiếm */
      searchInput.value = "";


      /* Danh mục */
      selectedCategory = "all";

      categoryButtons.forEach(button => {
        button.classList.remove("active");
      });

      const allCategory =
        document.querySelector(
          '.category-item[data-category="all"]'
        );

      if (allCategory) {
        allCategory.classList.add("active");
      }


      /* Dịp */
      selectedOccasion = "all";

      occasionButtons.forEach(button => {
        button.classList.remove("active");
      });

      const allOccasion =
        document.querySelector(
          '.occasion-item[data-occasion="all"]'
        );

      if (allOccasion) {
        allOccasion.classList.add("active");
      }


      /* Giá */
      priceRange.value =
        priceRange.max;


      /* Sắp xếp */
      sortSelect.value =
        "default";


      /* Đưa sản phẩm về thứ tự ban đầu */
      products
        .sort(
          (a, b) =>
            Number(a.dataset.id) -
            Number(b.dataset.id)
        )
        .forEach(product => {
          productGrid.appendChild(product);
        });


      /* Áp dụng lại */
      applyFilters();

    }
  );


  /* ==========================================
     KHỞI TẠO
     ========================================== */

  updatePriceRange();
  applyFilters();

});