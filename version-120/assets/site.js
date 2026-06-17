(function () {
    var menuButton = document.querySelector("[data-menu-button]");
    var mobileNav = document.querySelector("[data-mobile-nav]");

    if (menuButton && mobileNav) {
        menuButton.addEventListener("click", function () {
            mobileNav.classList.toggle("is-open");
        });
    }

    var hero = document.querySelector("[data-hero]");

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        var nextButton = hero.querySelector("[data-hero-next]");
        var prevButton = hero.querySelector("[data-hero-prev]");
        var index = 0;
        var timer = null;

        function showSlide(nextIndex) {
            if (!slides.length) {
                return;
            }

            index = (nextIndex + slides.length) % slides.length;

            slides.forEach(function (slide, position) {
                slide.classList.toggle("is-active", position === index);
            });

            dots.forEach(function (dot, position) {
                dot.classList.toggle("is-active", position === index);
            });
        }

        function startTimer() {
            clearInterval(timer);
            timer = setInterval(function () {
                showSlide(index + 1);
            }, 5200);
        }

        dots.forEach(function (dot, position) {
            dot.addEventListener("click", function () {
                showSlide(position);
                startTimer();
            });
        });

        if (nextButton) {
            nextButton.addEventListener("click", function () {
                showSlide(index + 1);
                startTimer();
            });
        }

        if (prevButton) {
            prevButton.addEventListener("click", function () {
                showSlide(index - 1);
                startTimer();
            });
        }

        startTimer();
    }

    var filterInput = document.querySelector("[data-filter-input]");
    var filterList = document.querySelector("[data-filter-list]");
    var filterCards = filterList ? Array.prototype.slice.call(filterList.querySelectorAll(".filter-card")) : [];
    var chips = Array.prototype.slice.call(document.querySelectorAll("[data-filter-chip]"));

    function applyFilter(value) {
        var keyword = (value || "").toLowerCase().trim();

        filterCards.forEach(function (card) {
            var haystack = (card.getAttribute("data-search") || "").toLowerCase();
            card.classList.toggle("is-hidden", keyword !== "" && haystack.indexOf(keyword) === -1);
        });
    }

    if (filterInput && filterCards.length) {
        var params = new URLSearchParams(window.location.search);
        var query = params.get("q") || "";

        if (query) {
            filterInput.value = query;
            applyFilter(query);
        }

        filterInput.addEventListener("input", function () {
            applyFilter(filterInput.value);
        });
    }

    chips.forEach(function (chip) {
        chip.addEventListener("click", function () {
            if (!filterInput) {
                return;
            }

            filterInput.value = chip.getAttribute("data-filter-chip") || "";
            applyFilter(filterInput.value);
            filterInput.focus();
        });
    });
})();
