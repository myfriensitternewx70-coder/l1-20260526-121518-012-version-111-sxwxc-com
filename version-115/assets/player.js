import { H as Hls } from './video-vendor-dru42stk.js';

function setupPlayer(container) {
    const video = container.querySelector('video');
    const button = container.querySelector('[data-play-button]');
    const source = container.getAttribute('data-src');

    if (!video || !button || !source) {
        return;
    }

    function attachSource() {
        if (video.dataset.ready === 'true') {
            return;
        }

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
        } else if (Hls && Hls.isSupported()) {
            const hls = new Hls({
                enableWorker: true,
                lowLatencyMode: false,
            });
            hls.loadSource(source);
            hls.attachMedia(video);
            video.hlsInstance = hls;
        } else {
            video.src = source;
        }

        video.dataset.ready = 'true';
    }

    button.addEventListener('click', function () {
        attachSource();
        button.classList.add('is-hidden');
        const playPromise = video.play();

        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(function () {
                button.classList.remove('is-hidden');
            });
        }
    });

    video.addEventListener('play', function () {
        button.classList.add('is-hidden');
    });
}

const players = document.querySelectorAll('[data-player]');
players.forEach(setupPlayer);
