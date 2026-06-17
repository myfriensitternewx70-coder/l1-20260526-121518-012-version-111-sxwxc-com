(function () {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var mobileMenu = document.querySelector('[data-mobile-menu]');

    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', function () {
            mobileMenu.classList.toggle('is-open');
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    var currentSlide = 0;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }

        currentSlide = (index + slides.length) % slides.length;

        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle('is-active', slideIndex === currentSlide);
        });

        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle('is-active', dotIndex === currentSlide);
        });
    }

    dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
            var index = Number(dot.getAttribute('data-hero-dot')) || 0;
            showSlide(index);
        });
    });

    if (slides.length > 1) {
        window.setInterval(function () {
            showSlide(currentSlide + 1);
        }, 5200);
    }

    var searchInput = document.querySelector('[data-card-search]');
    var clearButton = document.querySelector('[data-clear-search]');
    var searchableCards = Array.prototype.slice.call(document.querySelectorAll('.searchable-card'));

    function normalize(value) {
        return String(value || '').toLowerCase().trim();
    }

    function cardText(card) {
        return [
            card.getAttribute('data-title'),
            card.getAttribute('data-year'),
            card.getAttribute('data-region'),
            card.getAttribute('data-genre'),
            card.getAttribute('data-type'),
            card.textContent
        ].join(' ').toLowerCase();
    }

    function applySearch() {
        var keyword = normalize(searchInput ? searchInput.value : '');

        searchableCards.forEach(function (card) {
            var matched = !keyword || cardText(card).indexOf(keyword) !== -1;
            card.classList.toggle('search-hidden', !matched);
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', applySearch);
    }

    if (clearButton && searchInput) {
        clearButton.addEventListener('click', function () {
            searchInput.value = '';
            applySearch();
            searchInput.focus();
        });
    }

    var video = document.getElementById('movie-player');

    if (video) {
        var source = video.getAttribute('data-src');
        var overlayButton = document.querySelector('[data-play-button]');
        var playToggle = document.querySelector('[data-play-toggle]');
        var muteToggle = document.querySelector('[data-mute-toggle]');
        var fullscreenButton = document.querySelector('[data-fullscreen]');
        var hlsInstance = null;

        function attachSource() {
            if (!source || video.getAttribute('data-source-attached') === '1') {
                return;
            }

            video.setAttribute('data-source-attached', '1');

            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(source);
                hlsInstance.attachMedia(video);
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
            } else {
                video.src = source;
            }
        }

        function playVideo() {
            attachSource();
            var promise = video.play();

            if (promise && typeof promise.catch === 'function') {
                promise.catch(function () {});
            }
        }

        function togglePlay() {
            if (video.paused) {
                playVideo();
            } else {
                video.pause();
            }
        }

        video.addEventListener('play', function () {
            if (overlayButton) {
                overlayButton.classList.add('is-hidden');
            }
        });

        video.addEventListener('pause', function () {
            if (overlayButton) {
                overlayButton.classList.remove('is-hidden');
            }
        });

        video.addEventListener('click', togglePlay);

        if (overlayButton) {
            overlayButton.addEventListener('click', playVideo);
        }

        if (playToggle) {
            playToggle.addEventListener('click', togglePlay);
        }

        if (muteToggle) {
            muteToggle.addEventListener('click', function () {
                video.muted = !video.muted;
                muteToggle.textContent = video.muted ? '取消静音' : '静音';
            });
        }

        if (fullscreenButton) {
            fullscreenButton.addEventListener('click', function () {
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                } else if (video.requestFullscreen) {
                    video.requestFullscreen();
                }
            });
        }

        window.addEventListener('beforeunload', function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    }
})();
