/* =====================================================================
   Brevity Companion — Shared Theme Layer (Light / Dark)
   ---------------------------------------------------------------------
   Loaded on every page (in <head>, before paint). Provides a single,
   persistent dark mode for the whole app:

     - getTheme()    -> "light" | "dark"   (read current)
     - setTheme(t)   -> applies + persists  ("light" | "dark")
     - toggleTheme() -> flips and applies

   The dark palette is injected as one stylesheet scoped to
   html[data-theme="dark"], so every page (login, dashboard, store,
   profile, about, connect chat, legal docs, …) repaints to a stylish
   near-black scheme while keeping the exact same layout and the
   brand red / gold / green accents.

   We deliberately do NOT flip --accent-main to a light colour, because
   that variable drives BOTH heading text AND button backgrounds.
   Instead headings are overridden to light explicitly, and buttons get
   their own dark surface, so nothing becomes invisible.
   ===================================================================== */
(function () {
    "use strict";

    var THEME_KEY = "brevity_theme";
    var STYLE_ID = "brevity-dark-theme";

    function currentTheme() {
        try {
            var t = localStorage.getItem(THEME_KEY);
            return t === "dark" || t === "light" ? t : "light";
        } catch (e) {
            return "light";
        }
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute("data-theme", theme);
        try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
        // Let any page-level toggle stay in sync.
        document.dispatchEvent(new CustomEvent("brevity:themechange", { detail: theme }));
    }

    /* ---- The dark palette (injected once) ---- */
    var DARK_CSS = [
        /* Palette variables. Note: --accent-main is KEPT dark so buttons
           that use it as a background stay visible; headings are forced
           light via explicit selectors below. */
        "html[data-theme=\"dark\"] {",
        "  color-scheme: dark;",
        "  --primary-bg: #16161a;",
        "  --secondary-bg: #0e0e10;",
        "  --text-primary: #e8e8ea;",
        "  --text-secondary: #a6a6ad;",
        "  --border-color: #2a2a2e;",
        "  --border: #2a2a2e;",
        "}",

        /* Base canvas */
        "html[data-theme=\"dark\"] body { background: #0e0e10; color: #e8e8ea; }",

        /* Headings / primary text -> light (explicit, since --accent-main
           stays dark for buttons). */
        "html[data-theme=\"dark\"] .section-heading,",
        "html[data-theme=\"dark\"] .plan-info h2,",
        "html[data-theme=\"dark\"] .site-name,",
        "html[data-theme=\"dark\"] .site-name-small,",
        "html[data-theme=\"dark\"] .hero-title,",
        "html[data-theme=\"dark\"] .mode-badge,",
        "html[data-theme=\"dark\"] .chapter-title,",
        "html[data-theme=\"dark\"] .title-text h1,",
        "html[data-theme=\"dark\"] .legal-section-title,",
        "html[data-theme=\"dark\"] .legal-subsection-title,",
        "html[data-theme=\"dark\"] .card-title,",
        "html[data-theme=\"dark\"] .plan-price,",
        "html[data-theme=\"dark\"] .logo,",
        "html[data-theme=\"dark\"] .loader-logo,",
        "html[data-theme=\"dark\"] h1,",
        "html[data-theme=\"dark\"] h2,",
        "html[data-theme=\"dark\"] .mode-info h3,",
        "html[data-theme=\"dark\"] .queue-title {",
        "  color: #f0f0f2 !important;",
        "}",

        /* Secondary / muted text -> light enough to read on black */
        "html[data-theme=\"dark\"] .subtitle,",
        "html[data-theme=\"dark\"] .field-label,",
        "html[data-theme=\"dark\"] .hero-meta,",
        "html[data-theme=\"dark\"] .hero-email,",
        "html[data-theme=\"dark\"] .consent-label,",
        "html[data-theme=\"dark\"] .modal-sub,",
        "html[data-theme=\"dark\"] .modal-note,",
        "html[data-theme=\"dark\"] .modal-close,",
        "html[data-theme=\"dark\"] .inr-value,",
        "html[data-theme=\"dark\"] .plan-period,",
        "html[data-theme=\"dark\"] .legal-text-block,",
        "html[data-theme=\"dark\"] .back-btn,",
        "html[data-theme=\"dark\"] .queue-subtitle,",
        "html[data-theme=\"dark\"] .pipeline-steps,",
        "html[data-theme=\"dark\"] .status-text,",
        "html[data-theme=\"dark\"] .instruction,",
        "html[data-theme=\"dark\"] .card-desc,",
        "html[data-theme=\"dark\"] .plan-info p,",
        "html[data-theme=\"dark\"] .mode-info p,",
        "html[data-theme=\"dark\"] .tech-card p,",
        "html[data-theme=\"dark\"] .tech-card h3,",
        "html[data-theme=\"dark\"] .feature-item,",
        "html[data-theme=\"dark\"] .legal-footer,",
        "html[data-theme=\"dark\"] .switch-link,",
        "html[data-theme=\"dark\"] .plan-tag,",
        "html[data-theme=\"dark\"] .plan-name {",
        "  color: #a6a6ad !important;",
        "}",
        "html[data-theme=\"dark\"] .field-label small,",
        "html[data-theme=\"dark\"] .hero-meta,",
        "html[data-theme=\"dark\"] .modal-note,",
        "html[data-theme=\"dark\"] .inr-value,",
        "html[data-theme=\"dark\"] .plan-period { color: #8a8a92 !important; }",

        /* Profile right-aligned values + stat boxes (were black on black) */
        "html[data-theme=\"dark\"] .field-value { color: #e8e8ea !important; }",
        "html[data-theme=\"dark\"] .stat-box .num { color: #f0f0f2 !important; }",
        "html[data-theme=\"dark\"] .stat-box .lbl { color: #a6a6ad !important; }",
        "html[data-theme=\"dark\"] .plan-price { color: #FFB74D !important; }",
        "html[data-theme=\"dark\"] .plan-card .btn-kp { background: var(--kp-color) !important; color: #fff !important; }",

        /* Surfaces (cards / containers) */
        "html[data-theme=\"dark\"] .container,",
        "html[data-theme=\"dark\"] .legal-container,",
        "html[data-theme=\"dark\"] .card,",
        "html[data-theme=\"dark\"] .nav-card,",
        "html[data-theme=\"dark\"] .nav-card:hover,",
        "html[data-theme=\"dark\"] .mode-card,",
        "html[data-theme=\"dark\"] .stat-box,",
        "html[data-theme=\"dark\"] .field-row,",
        "html[data-theme=\"dark\"] .notice-panel,",
        "html[data-theme=\"dark\"] .modal-box,",
        "html[data-theme=\"dark\"] .tech-card,",
        "html[data-theme=\"dark\"] .chat-bubble,",
        "html[data-theme=\"dark\"] .ai-bubble,",
        "html[data-theme=\"dark\"] .auth-container,",
        "html[data-theme=\"dark\"] .plan-card:not(.plan-premium-wrap),",
        "html[data-theme=\"dark\"] .compliance-wrapper,",
        "html[data-theme=\"dark\"] .section-divider span {",
        "  background: #16161a !important;",
        "  border-color: #2a2a2e !important;",
        "  color: #e8e8ea !important;",
        "}",
        "html[data-theme=\"dark\"] .stat-box { background: #1c1c20 !important; }",
        "html[data-theme=\"dark\"] .mode-card:hover { box-shadow: 0 4px 8px rgba(0,0,0,0.5) !important; }",
        "html[data-theme=\"dark\"] .notice-item.read { opacity: 0.5; }",
        "html[data-theme=\"dark\"] .notice-item.unread h4 { color: #FF7A85 !important; }",
        "html[data-theme=\"dark\"] .notice-unread-dot { background: #FF7A85 !important; }",

        /* Inputs / selects / textareas */
        "html[data-theme=\"dark\"] input,",
        "html[data-theme=\"dark\"] select,",
        "html[data-theme=\"dark\"] textarea,",
        "html[data-theme=\"dark\"] .topic-input,",
        "html[data-theme=\"dark\"] .chapter-select,",
        "html[data-theme=\"dark\"] .field input,",
        "html[data-theme=\"dark\"] .field select,",
        "html[data-theme=\"dark\"] .kp-input,",
        "html[data-theme=\"dark\"] .name-input,",
        "html[data-theme=\"dark\"] .city-input,",
        "html[data-theme=\"dark\"] .institute-input,",
        "html[data-theme=\"dark\"] .chapter-select {",
        "  background: #1c1c20 !important;",
        "  color: #e8e8ea !important;",
        "  border-color: #3a3a40 !important;",
        "}",
        "html[data-theme=\"dark\"] input::placeholder,",
        "html[data-theme=\"dark\"] textarea::placeholder { color: #7a7a82 !important; }",
        "html[data-theme=\"dark\"] .chapter-select { background-image: none !important; }",
        "html[data-theme=\"dark\"] .field-value input { color: #e8e8ea !important; }",

        /* Auth pages (login / signup): labels and links were black on black */
        "html[data-theme=\"dark\"] label.field > span { color: #e8e8ea !important; }",
        "html[data-theme=\"dark\"] .field .req { color: #FF7A85 !important; }",
        "html[data-theme=\"dark\"] .consent-checkbox { accent-color: var(--kp-color) !important; }",
        "html[data-theme=\"dark\"] .switch-link a { color: #e8e8ea !important; }",
        "html[data-theme=\"dark\"] .switch-link { color: #a6a6ad !important; }",
        "html[data-theme=\"dark\"] .legal-footer a { color: #c9a0a3 !important; }",
        "html[data-theme=\"dark\"] .subtitle { color: #a6a6ad !important; }",

        /* Buttons — give them a visible dark surface (--accent-main stays
           dark, so we override backgrounds explicitly where used). */
        "html[data-theme=\"dark\"] .btn,",
        "html[data-theme=\"dark\"] .btn-primary,",
        "html[data-theme=\"dark\"] .btn-play,",
        "html[data-theme=\"dark\"] .btn-outline,",
        "html[data-theme=\"dark\"] .btn-sm {",
        "  background: #26262b !important;",
        "  color: #ffffff !important;",
        "  border-color: #3a3a40 !important;",
        "}",
        "html[data-theme=\"dark\"] .btn:hover,",
        "html[data-theme=\"dark\"] .btn-primary:hover,",
        "html[data-theme=\"dark\"] .btn-play:hover,",
        "html[data-theme=\"dark\"] .btn-outline:hover { background: #323238 !important; }",
        "html[data-theme=\"dark\"] .btn:disabled,",
        "html[data-theme=\"dark\"] .btn-primary:disabled,",
        "html[data-theme=\"dark\"] .btn-play:disabled { background: #3a3a40 !important; color: #9a9a9a !important; }",
        "html[data-theme=\"dark\"] .btn-outline { background: transparent !important; }",

        /* Toggles (profile) */
        "html[data-theme=\"dark\"] .toggle .track { background: #3a3a40 !important; }",
        "html[data-theme=\"dark\"] .toggle input:checked + .track { background: var(--success) !important; }",

        /* Connect chat bubbles */
        "html[data-theme=\"dark\"] .ai-bubble { background: #16161a !important; border-color: #2a2a2e !important; color: #e8e8ea !important; }",
        "html[data-theme=\"dark\"] .user-bubble { background: #2a2a30 !important; color: #ffffff !important; }",
        "html[data-theme=\"dark\"] .scenario-tag { color: #f0f0f2 !important; }",
        "html[data-theme=\"dark\"] .mic-button { background: #2a2a30 !important; }",
        "html[data-theme=\"dark\"] .mic-button:hover { background: #34343c !important; }",
        "html[data-theme=\"dark\"] .timer { background: #1c1c20 !important; color: #e8e8ea !important; border-color: #3a3a40 !important; }",

        /* Modal overlay slightly darker */
        "html[data-theme=\"dark\"] .modal-overlay { background: rgba(0,0,0,0.72) !important; }",
        "html[data-theme=\"dark\"] .order-row { border-color: #2a2a2e !important; }",

        /* Legal highlight boxes -> dark tinted */
        "html[data-theme=\"dark\"] .notice-box { background: #241f14 !important; border-color: #4a3d1f !important; color: #d8c9a6 !important; }",
        "html[data-theme=\"dark\"] .notice-box strong { color: #e2c277 !important; }",
        "html[data-theme=\"dark\"] .refund-highlight-box { background: #241a1c !important; border-left-color: var(--kp-color) !important; color: #e0c4c7 !important; }",

        /* Profile plan badges */
        "html[data-theme=\"dark\"] .plan-free { background: #1b2530 !important; color: #cfe0ee !important; border-color: #2c3e4f !important; }",
        "html[data-theme=\"dark\"] .plan-premium { background: #241f14 !important; color: #e2c277 !important; border-color: #4a3d1f !important; }",

        /* Plan & Subscription card — give it a distinct surface so it never
           blends into the page container in dark mode. */
        "html[data-theme=\"dark\"] .plan-card { background: #20232a !important; color: #e8e8ea !important; border: 1px solid #363a42 !important; }",
        "html[data-theme=\"dark\"] .plan-card .plan-desc { color: #b9bcc4 !important; }",

        /* Store: the already-dark sections stay dark but get a subtle
           border so they're distinguishable from the near-black page. */
        "html[data-theme=\"dark\"] .premium-hero,",
        "html[data-theme=\"dark\"] .interactive-section,",
        "html[data-theme=\"dark\"] .price-box,",
        "html[data-theme=\"dark\"] .store-darker { border: 1px solid #333 !important; }",
        "html[data-theme=\"dark\"] .premium-hero h1 { color: #ffffff !important; }",
        "html[data-theme=\"dark\"] .highlight-underline { color: #ffffff !important; }",

        /* Sidebar is already dark — keep it, just ensure links stay readable */
        "html[data-theme=\"dark\"] .sidebar { background: #0b0b0d !important; }",
        "html[data-theme=\"dark\"] .sidebar-link { color: #cfcfd4 !important; }",
        "html[data-theme=\"dark\"] .sidebar-tab { background: #0b0b0d !important; }",

        /* Misc borders / dividers */
        "html[data-theme=\"dark\"] .dashboard-header,",
        "html[data-theme=\"dark\"] .header,",
        "html[data-theme=\"dark\"] .top-bar,",
        "html[data-theme=\"dark\"] .alert-box { border-color: #2a2a2e !important; }",
        "html[data-theme=\"dark\"] .section-title { color: #f0f0f2 !important; }",
        "html[data-theme=\"dark\"] .section-title::before { background: var(--kp-color) !important; }",
        "html[data-theme=\"dark\"] .alert-box { background: #2a1a1c !important; color: #f0a9ae !important; }",
        "html[data-theme=\"dark\"] .alert-box a { color: #f0a9ae !important; }"
    ].join("\n");

    function injectStyle() {
        if (document.getElementById(STYLE_ID)) return;
        var el = document.createElement("style");
        el.id = STYLE_ID;
        el.textContent = DARK_CSS;
        (document.head || document.documentElement).appendChild(el);
    }

    // Public API
    window.getTheme = currentTheme;
    window.setTheme = function (t) { applyTheme(t === "dark" ? "dark" : "light"); };
    window.toggleTheme = function () { applyTheme(currentTheme() === "dark" ? "light" : "dark"); };

    // Apply immediately (runs in <head> before body paint -> no flash).
    injectStyle();
    applyTheme(currentTheme());
})();
