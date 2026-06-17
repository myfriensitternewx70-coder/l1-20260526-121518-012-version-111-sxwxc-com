(function () {
    function ready(callback) {
        if (document.readyState !== "loading") {
            callback();
            return;
        }
        document.addEventListener("DOMContentLoaded", callback);
    }

    function setupPlayer(root) {
        var video = root.querySelector("video");
        var button = root.querySelector(".play-overlay");
        var stream = root.getAttribute("data-stream");
        var loaded = false;
        var hls = null;

        if (!video || !button || !stream) {
            return;
        }

        function load() {
            if (loaded) {
                return;
            }
            loaded = true;
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = stream;
                return;
            }
            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(stream);
                hls.attachMedia(video);
                return;
            }
            video.src = stream;
        }

        function start() {
            load();
            root.classList.add("is-playing");
            video.setAttribute("controls", "controls");
            var promise = video.play();
            if (promise && promise.catch) {
                promise.catch(function () {
                    root.classList.remove("is-playing");
                });
            }
        }

        button.addEventListener("click", start);
        video.addEventListener("click", function () {
            if (video.paused) {
                start();
            }
        });
        video.addEventListener("playing", function () {
            root.classList.add("is-playing");
        });
        video.addEventListener("ended", function () {
            root.classList.remove("is-playing");
        });
        window.addEventListener("beforeunload", function () {
            if (hls) {
                hls.destroy();
            }
        });
    }

    ready(function () {
        Array.prototype.slice.call(document.querySelectorAll(".movie-player")).forEach(setupPlayer);
    });
})();
