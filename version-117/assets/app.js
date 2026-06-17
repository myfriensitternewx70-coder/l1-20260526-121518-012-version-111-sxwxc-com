(function () {
  var toggle = document.querySelector('[data-nav-toggle]');
  var nav = document.querySelector('[data-main-nav]');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var activeIndex = 0;

    function setHero(index) {
      activeIndex = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === activeIndex);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === activeIndex);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        setHero(Number(dot.getAttribute('data-hero-dot')) || 0);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        setHero(activeIndex + 1);
      }, 5200);
    }
  }

  var filterWrap = document.querySelector('[data-page-filter]');

  if (filterWrap) {
    var input = filterWrap.querySelector('[data-filter-input]');
    var year = filterWrap.querySelector('[data-filter-year]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));

    function filterCards() {
      var keyword = input ? input.value.trim().toLowerCase() : '';
      var selectedYear = year ? year.value : '';

      cards.forEach(function (card) {
        var text = [
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-genre')
        ].join(' ').toLowerCase();
        var matchKeyword = !keyword || text.indexOf(keyword) !== -1;
        var matchYear = !selectedYear || card.getAttribute('data-year') === selectedYear;
        card.style.display = matchKeyword && matchYear ? '' : 'none';
      });
    }

    if (input) {
      input.addEventListener('input', filterCards);
    }
    if (year) {
      year.addEventListener('change', filterCards);
    }
  }

  var searchInput = document.getElementById('globalSearchInput');
  var searchButton = document.getElementById('globalSearchButton');
  var searchResults = document.getElementById('searchResults');
  var searchSummary = document.getElementById('searchSummary');

  if (searchInput && searchResults && window.MOVIES_DATA) {
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q') || '';
    searchInput.value = initialQuery;

    function renderSearch() {
      var keyword = searchInput.value.trim().toLowerCase();

      if (!keyword) {
        searchResults.innerHTML = '';
        searchSummary.textContent = '请输入关键词开始搜索。';
        return;
      }

      var results = window.MOVIES_DATA.filter(function (movie) {
        var text = [
          movie.title,
          movie.region,
          movie.type,
          movie.year,
          movie.genre,
          movie.tags,
          movie.one_line
        ].join(' ').toLowerCase();
        return text.indexOf(keyword) !== -1;
      }).slice(0, 120);

      searchSummary.textContent = '找到 ' + results.length + ' 条相关影片，最多显示前 120 条。';
      searchResults.innerHTML = results.map(function (movie) {
        return [
          '<article class="movie-card">',
          '  <a class="poster-link" href="movie/movie-' + movie.id + '.html">',
          '    <img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
          '    <span class="play-chip">立即点播</span>',
          '  </a>',
          '  <div class="card-body">',
          '    <h3><a href="movie/movie-' + movie.id + '.html">' + escapeHtml(movie.title) + '</a></h3>',
          '    <p>' + escapeHtml(movie.one_line) + '</p>',
          '    <div class="meta-row">',
          '      <span>' + movie.year + '</span>',
          '      <span>' + escapeHtml(movie.region) + '</span>',
          '      <span>' + escapeHtml(movie.type) + '</span>',
          '    </div>',
          '  </div>',
          '</article>'
        ].join('');
      }).join('');
    }

    function escapeHtml(value) {
      return String(value).replace(/[&<>"']/g, function (char) {
        return {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#039;'
        }[char];
      });
    }

    if (searchButton) {
      searchButton.addEventListener('click', renderSearch);
    }

    searchInput.addEventListener('input', renderSearch);
    renderSearch();
  }
})();
