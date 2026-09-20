/* =========================================================
   اسکریپت منوی دیجیتال کافه
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       1) اسلایدر بنر اصلی (Hero Slider)
       هر ۴ ثانیه اسلاید عوض می‌شود؛ کلیک روی دات‌ها هم کار می‌کند
    ===================================================== */

    const slides = document.querySelectorAll(".hero-slide");
    const dots = document.querySelectorAll("#heroDots .dot");
    let currentSlide = 0;
    let sliderTimer;

    function goToSlide(index) {
        slides[currentSlide].classList.remove("active");
        dots[currentSlide].classList.remove("active");

        currentSlide = (index + slides.length) % slides.length;

        slides[currentSlide].classList.add("active");
        dots[currentSlide].classList.add("active");
    }

    function startSlider() {
        sliderTimer = setInterval(() => goToSlide(currentSlide + 1), 4000);
    }

    function resetSliderTimer() {
        clearInterval(sliderTimer);
        startSlider();
    }

    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            goToSlide(index);
            resetSliderTimer();
        });
    });

    if (slides.length > 0) startSlider();


    /* =====================================================
       2) جستجوی زنده محصولات
       با تایپ در نوار جستجو، کارت‌های محصولات فیلتر می‌شوند
    ===================================================== */

    const searchInput = document.getElementById("searchInput");

    if (searchInput) {
        searchInput.addEventListener("input", () => {
            const query = searchInput.value.trim().toLowerCase();

            document.querySelectorAll(".drink-card, .best-card").forEach((card) => {
                const name = card.querySelector("h3").textContent.toLowerCase();
                card.style.display = name.includes(query) ? "" : "none";
            });
        });
    }


    /* =====================================================
       3) دکمه افزودن به سبد (Best Selling)
       کلیک روی + → آیکون تیک می‌شود و شمارنده Orders آپدیت می‌شود
    ===================================================== */

    let cartCount = 0;
    const ordersNav = document.querySelector(".bottom-nav-item:nth-child(3) span");

    function updateOrdersBadge() {
        if (ordersNav) ordersNav.textContent = cartCount > 0 ? `Orders (${cartCount})` : "Orders";
    }

    document.querySelectorAll(".add-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();

            cartCount++;
            updateOrdersBadge();

            // فیدبک بصری: آیکون به تیک تغییر می‌کند
            const icon = btn.querySelector("i");
            icon.classList.replace("fa-plus", "fa-check");
            btn.disabled = true;

            setTimeout(() => {
                icon.classList.replace("fa-check", "fa-plus");
                btn.disabled = false;
            }, 1200);
        });
    });


    /* =====================================================
       4) کپی کد تخفیف با کلیک
    ===================================================== */

    const promoCode = document.getElementById("promoCode");

    if (promoCode) {
        promoCode.addEventListener("click", async () => {
            const code = promoCode.textContent.trim();
            try {
                await navigator.clipboard.writeText(code);
                const original = promoCode.textContent;
                promoCode.textContent = "Copied!";
                setTimeout(() => (promoCode.textContent = original), 1200);
            } catch {
                // در مرورگرهای قدیمی fallback ساده
                const range = document.createRange();
                range.selectNodeContents(promoCode);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            }
        });
    }


    /* =====================================================
       5) تغییر آیتم فعال منوی پایین
    ===================================================== */

    const navItems = document.querySelectorAll(".bottom-nav-item");

    navItems.forEach((item) => {
        item.addEventListener("click", (e) => {
            // چون هنوز صفحات جدا نداریم، جلوگیری از رفتار پیش‌فرض
            e.preventDefault();
            navItems.forEach((i) => i.classList.remove("active"));
            item.classList.add("active");
        });
    });
});