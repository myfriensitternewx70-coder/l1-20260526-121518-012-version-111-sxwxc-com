(function () {
    window.initMoviePlayer = function initMoviePlayer(videoUrl) {
        var frame = document.querySelector("[data-player-frame]");
        var video = document.querySelector("[data-player-video]");
        var button = document.querySelector("[data-player-button]");
        var started = false;
        var hls = null;

        if (!frame || !video || !button || !videoUrl) {
            return;
        }

        function hideButton() {
            button.classList.add("is-hidden");
        }

        function playVideo() {
            var result = video.play();

            if (result && typeof result.catch === "function") {
                result.catch(function () {});
            }
        }

        function loadVideo() {
            if (started) {
                hideButton();
                playVideo();
                return;
            }

            started = true;
            hideButton();

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = videoUrl;
                playVideo();
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 90
                });

                hls.loadSource(videoUrl);
                hls.attachMedia(video);
                hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                    playVideo();
                });
                return;
            }

            video.src = videoUrl;
            playVideo();
        }

        button.addEventListener("click", loadVideo);
        frame.addEventListener("click", function (event) {
            if (event.target === frame) {
                loadVideo();
            }
        });
        video.addEventListener("click", function () {
            if (video.paused) {
                playVideo();
            }
        });
        window.addEventListener("beforeunload", function () {
            if (hls) {
                hls.destroy();
            }
        });
    };
})();
