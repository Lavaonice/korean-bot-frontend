/* =====================================================================
   Hanja Grimoire — Mobile Event & Video Playback Enhancements
   ===================================================================== */
(function () {
    const isMobile = () => window.innerWidth <= 760 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    function initMobileFixes() {
        // 1. Single Tap / Click Candle to open Settings Modal
        document.addEventListener("click", function (e) {
            const candle = e.target.closest("#candle");
            if (candle) {
                const settingsBtn = document.querySelector("#settings-overlay, .settings-title");
                const candleCb = window.__grimoireOpenSettings || window.openSettings;
                if (typeof candleCb === "function") {
                    candleCb();
                } else {
                    const settingsOverlay = document.getElementById("settings-overlay");
                    if (settingsOverlay) settingsOverlay.classList.add("active");
                }
            }
        }, { capture: true, passive: true });

        // 2. Inject explicit 1-Tap Mobile Settings Button at top-right
        function setupMobileSettingsBtn() {
            if (!isMobile() || document.getElementById("mobile-settings-btn")) return;
            const btn = document.createElement("button");
            btn.id = "mobile-settings-btn";
            btn.innerHTML = "⚙️ Settings";
            btn.addEventListener("click", function () {
                const settingsOverlay = document.getElementById("settings-overlay");
                if (settingsOverlay) {
                    settingsOverlay.classList.toggle("active");
                }
            });
            document.body.appendChild(btn);
        }

        // 3. Intro Video Autoplay Safeguard & Fast Fallback (Fixes video getting stuck)
        function setupVideoSafeguard() {
            const video = document.getElementById("intro-video");
            const skipBtn = document.getElementById("skip-intro-btn");

            if (video) {
                video.muted = true;
                video.setAttribute("playsinline", "");
                video.setAttribute("webkit-playsinline", "");
                video.setAttribute("autoplay", "");

                // Force play
                const playPromise = video.play();
                if (playPromise !== undefined) {
                    playPromise.catch(function () {
                        // Autoplay blocked/failed -> trigger skip button immediately
                        if (skipBtn) skipBtn.click();
                    });
                }

                // If video freezes or takes longer than 2.5s on mobile, auto-skip
                const fallbackTimer = setTimeout(function () {
                    if (video && !video.ended && skipBtn) {
                        skipBtn.click();
                    }
                }, 2500);

                video.addEventListener("ended", function () {
                    clearTimeout(fallbackTimer);
                });
            }
        }

        setupMobileSettingsBtn();
        setupVideoSafeguard();
        window.addEventListener("resize", setupMobileSettingsBtn);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initMobileFixes);
    } else {
        initMobileFixes();
    }
})();
