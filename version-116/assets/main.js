(function () {
    function ready(callback) {
        if (document.readyState !== "loading") {
            callback();
            return;
        }
        document.addEventListener("DOMContentLoaded", callback);
    }

    function setupMenu() {
        var toggle = document.querySelector("[data-mobile-toggle]");
        var panel = document.querySelector("[data-mobile-panel]");
        if (!toggle || !panel) {
            return;
        }
        toggle.addEventListener("click", function () {
            var open = !panel.classList.contains("is-open");
            panel.classList.toggle("is-open", open);
            toggle.classList.toggle("is-open", open);
            document.body.classList.toggle("no-scroll", false);
        });
    }

    function setupHero() {
        var hero = document.querySelector("[data-hero]");
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        if (!slides.length) {
            return;
        }
        var current = 0;
        var timer = null;

        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle("is-active", i === current);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle("is-active", i === current);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot, i) {
            dot.addEventListener("click", function () {
                show(i);
                start();
            });
        });
        hero.addEventListener("mouseenter", stop);
        hero.addEventListener("mouseleave", start);
        show(0);
        start();
    }

    function setupGlobalSearch() {
        var forms = Array.prototype.slice.call(document.querySelectorAll("[data-global-search]"));
        forms.forEach(function (form) {
            var input = form.querySelector("input");
            if (!input) {
                return;
            }
            form.addEventListener("submit", function (event) {
                event.preventDefault();
                var keyword = input.value.trim();
                var target = "search.html";
                if (keyword) {
                    target += "?q=" + encodeURIComponent(keyword);
                }
                window.location.href = target;
            });
        });
    }

    function setupFilters() {
        var scopes = Array.prototype.slice.call(document.querySelectorAll("[data-filter-scope]"));
        scopes.forEach(function (scope) {
            var input = scope.querySelector("[data-search-input]");
            var year = scope.querySelector("[data-year-filter]");
            var region = scope.querySelector("[data-region-filter]");
            var empty = scope.querySelector("[data-empty]");
            var items = Array.prototype.slice.call(scope.querySelectorAll("[data-filter-item]"));
            var params = new URLSearchParams(window.location.search);
            var initialQuery = params.get("q");
            if (initialQuery && input && !input.value) {
                input.value = initialQuery;
            }

            function apply() {
                var q = input ? input.value.trim().toLowerCase() : "";
                var y = year ? year.value : "";
                var r = region ? region.value : "";
                var visible = 0;
                items.forEach(function (item) {
                    var haystack = item.getAttribute("data-search") || "";
                    var itemYear = item.getAttribute("data-year") || "";
                    var itemRegion = item.getAttribute("data-region") || "";
                    var match = true;
                    if (q && haystack.toLowerCase().indexOf(q) === -1) {
                        match = false;
                    }
                    if (y && itemYear !== y) {
                        match = false;
                    }
                    if (r && itemRegion !== r) {
                        match = false;
                    }
                    item.style.display = match ? "" : "none";
                    if (match) {
                        visible += 1;
                    }
                });
                if (empty) {
                    empty.classList.toggle("is-visible", visible === 0);
                }
            }

            [input, year, region].forEach(function (control) {
                if (control) {
                    control.addEventListener("input", apply);
                    control.addEventListener("change", apply);
                }
            });
            apply();
        });
    }

    ready(function () {
        setupMenu();
        setupHero();
        setupGlobalSearch();
        setupFilters();
    });
})();
