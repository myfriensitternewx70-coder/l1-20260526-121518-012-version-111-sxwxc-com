(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function setupMobileMenu() {
    var toggle = document.querySelector('[data-menu-toggle]');
    var nav = document.querySelector('[data-mobile-nav]');
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  function setupBackTop() {
    var button = document.querySelector('[data-back-top]');
    if (!button) {
      return;
    }
    button.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function setupHero() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    if (slides.length <= 1) {
      return;
    }
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
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

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
        start();
      });
    });

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    start();
  }

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function setupCardFilters() {
    var panels = Array.prototype.slice.call(document.querySelectorAll('[data-card-filter]'));
    panels.forEach(function (panel) {
      var input = panel.querySelector('[data-filter-input]');
      var yearSelect = panel.querySelector('[data-filter-year]');
      var regionSelect = panel.querySelector('[data-filter-region]');
      var count = panel.querySelector('[data-filter-count]');
      var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));

      function applyFilter() {
        var keyword = normalize(input ? input.value : '');
        var year = normalize(yearSelect ? yearSelect.value : '');
        var region = normalize(regionSelect ? regionSelect.value : '');
        var visible = 0;

        cards.forEach(function (card) {
          var haystack = normalize([
            card.dataset.title,
            card.dataset.category,
            card.dataset.year,
            card.dataset.region,
            card.dataset.genre,
            card.textContent
          ].join(' '));
          var matchKeyword = !keyword || haystack.indexOf(keyword) !== -1;
          var matchYear = !year || normalize(card.dataset.year) === year;
          var matchRegion = !region || normalize(card.dataset.region) === region;
          var matched = matchKeyword && matchYear && matchRegion;
          card.classList.toggle('is-hidden', !matched);
          if (matched) {
            visible += 1;
          }
        });

        if (count) {
          count.textContent = visible + ' 部';
        }
      }

      [input, yearSelect, regionSelect].forEach(function (control) {
        if (control) {
          control.addEventListener('input', applyFilter);
          control.addEventListener('change', applyFilter);
        }
      });
    });
  }

  function movieImagePath(movie) {
    var pathParts = window.location.pathname.split('/').filter(Boolean);
    var inMoviesFolder = pathParts.indexOf('movies') !== -1;
    var prefix = inMoviesFolder ? '../' : './';
    return prefix + movie.cover + '.jpg';
  }

  function setupSearch() {
    var panel = document.querySelector('[data-search-panel]');
    var results = document.querySelector('[data-search-results]');
    if (!panel || !results || !window.SITE_MOVIES) {
      return;
    }
    var input = panel.querySelector('[data-search-input]');
    var category = panel.querySelector('[data-search-category]');
    var clear = panel.querySelector('[data-search-clear]');

    function render() {
      var keyword = normalize(input ? input.value : '');
      var selectedCategory = normalize(category ? category.value : '');
      if (!keyword && !selectedCategory) {
        results.classList.remove('is-visible');
        results.innerHTML = '';
        return;
      }

      var matches = window.SITE_MOVIES.filter(function (movie) {
        var haystack = normalize([
          movie.title,
          movie.category,
          movie.region,
          movie.genre,
          movie.year,
          movie.tags,
          movie.summary
        ].join(' '));
        var matchKeyword = !keyword || haystack.indexOf(keyword) !== -1;
        var matchCategory = !selectedCategory || normalize(movie.category) === selectedCategory;
        return matchKeyword && matchCategory;
      }).slice(0, 24);

      if (!matches.length) {
        results.classList.add('is-visible');
        results.innerHTML = '<p class="empty-result">没有找到匹配影片。</p>';
        return;
      }

      results.classList.add('is-visible');
      results.innerHTML = matches.map(function (movie) {
        return [
          '<a class="search-result-item" href="' + movie.url + '">',
          '  <img src="' + movieImagePath(movie) + '" alt="' + escapeHtml(movie.title) + '">',
          '  <span>',
          '    <strong>' + escapeHtml(movie.title) + '</strong>',
          '    <p>' + escapeHtml(movie.year + ' · ' + movie.region + ' · ' + movie.summary) + '</p>',
          '  </span>',
          '</a>'
        ].join('');
      }).join('');
    }

    function escapeHtml(value) {
      return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    if (input) {
      input.addEventListener('input', render);
    }
    if (category) {
      category.addEventListener('change', render);
    }
    if (clear) {
      clear.addEventListener('click', function () {
        if (input) {
          input.value = '';
        }
        if (category) {
          category.value = '';
        }
        render();
      });
    }
  }

  function setupPlayers() {
    var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));
    players.forEach(function (player) {
      var video = player.querySelector('video');
      var button = player.querySelector('[data-play-button]');
      var source = player.getAttribute('data-video-src');
      var hlsInstance = null;
      var initialized = false;

      if (!video || !button || !source) {
        return;
      }

      function initializeVideo() {
        if (initialized) {
          return;
        }
        initialized = true;

        if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({
            enableWorker: true,
            lowLatencyMode: false
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
        initializeVideo();
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(function () {
            video.controls = true;
          });
        }
        player.classList.add('is-playing');
      }

      button.addEventListener('click', playVideo);
      video.addEventListener('play', function () {
        player.classList.add('is-playing');
      });
      video.addEventListener('pause', function () {
        if (!video.ended) {
          player.classList.remove('is-playing');
        }
      });
      window.addEventListener('beforeunload', function () {
        if (hlsInstance) {
          hlsInstance.destroy();
        }
      });
    });
  }

  ready(function () {
    setupMobileMenu();
    setupBackTop();
    setupHero();
    setupCardFilters();
    setupSearch();
    setupPlayers();
  });
})();
