(function () {
    const navToggle = document.querySelector('[data-nav-toggle]');
    const siteNav = document.querySelector('[data-site-nav]');

    if (navToggle && siteNav) {
        navToggle.addEventListener('click', function () {
            siteNav.classList.toggle('is-open');
        });
    }

    const hero = document.querySelector('[data-hero]');
    if (hero) {
        const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
        const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
        let activeIndex = 0;
        let timer = null;

        function activate(index) {
            activeIndex = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === activeIndex);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === activeIndex);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                activate(activeIndex + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                const index = Number(dot.getAttribute('data-hero-dot')) || 0;
                activate(index);
                start();
            });
        });

        hero.addEventListener('mouseenter', stop);
        hero.addEventListener('mouseleave', start);
        start();
    }

    const searchInput = document.querySelector('[data-list-search]');
    const cardList = document.querySelector('[data-card-list]');

    if (searchInput && cardList) {
        const cards = Array.from(cardList.querySelectorAll('.movie-card'));
        const params = new URLSearchParams(window.location.search);
        const keyword = params.get('q');

        function filterCards(value) {
            const query = value.trim().toLowerCase();
            cards.forEach(function (card) {
                const text = card.innerText.toLowerCase();
                const matched = !query || text.includes(query);
                card.style.display = matched ? '' : 'none';
            });
        }

        if (keyword) {
            searchInput.value = keyword;
            filterCards(keyword);
        }

        searchInput.addEventListener('input', function () {
            filterCards(searchInput.value);
        });
    }
})();
