(function () {
  var video = document.getElementById('moviePlayer');
  var startButton = document.querySelector('[data-player-start]');
  var status = document.getElementById('playerStatus');
  var source = document.body.getAttribute('data-video-url');
  var playerReady = false;

  if (!video || !startButton || !source) {
    return;
  }

  function setStatus(message) {
    if (status) {
      status.textContent = message;
    }
  }

  function initializePlayer() {
    if (playerReady) {
      return Promise.resolve();
    }

    playerReady = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      setStatus('影片正在加载，请稍候。');
      return Promise.resolve();
    }

    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: false
      });
      hls.loadSource(source);
      hls.attachMedia(video);
      setStatus('影片正在加载，请稍候。');
      return Promise.resolve();
    }

    video.src = source;
    setStatus('当前浏览器可能无法播放，请尝试更换浏览器。');
    return Promise.resolve();
  }

  startButton.addEventListener('click', function () {
    initializePlayer().then(function () {
      startButton.classList.add('is-hidden');
      var playPromise = video.play();

      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {
          startButton.classList.remove('is-hidden');
          setStatus('浏览器阻止了自动播放，请再次点击播放按钮。');
        });
      }
    });
  });

  video.addEventListener('play', function () {
    startButton.classList.add('is-hidden');
  });

  video.addEventListener('pause', function () {
    if (video.currentTime === 0 || video.ended) {
      startButton.classList.remove('is-hidden');
    }
  });
})();
