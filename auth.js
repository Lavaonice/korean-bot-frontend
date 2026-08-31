/* =====================================================================
   Brevity Companion — Shared Auth Layer
   ---------------------------------------------------------------------
   Single source of truth for authentication across every page.

   Loaded (after the Supabase CDN) by every page. Exposes three globals:
     - supabaseClient  : the one and only Supabase client instance
     - requireAuth()   : gate for protected pages (redirects if no session)
     - logout()        : signs out through Supabase and returns to login

   Because the site is a pure static bundle (deployed on Render) there is
   no server to enforce access, so each protected page validates the
   Supabase session in the browser before it becomes visible. There is no
   localStorage auth flag — the session IS the auth.
   ===================================================================== */

// Guard: auth.js may only run its setup once per page, even if the file is
// included more than once. (Task 6)
if (!window.__brevityAuthLoaded) {
    window.__brevityAuthLoaded = true;

    /* -----------------------------------------------------------------
       TASK 4 — Centralized configuration.
       All environment-specific values live here. No magic strings below.
       ----------------------------------------------------------------- */
    const CONFIG = {
        SUPABASE_URL: "https://zysltznpsldeuxqtsejc.supabase.co",
        SUPABASE_ANON_KEY: "sb_publishable_awRlrxnsIcR9IfoODAJKzQ_iaTKlAXN",
        LOGIN_PAGE: "index.html",
        RETRY_ATTEMPTS: 3,
        RETRY_DELAY_MS: 1000,

        // Set live Hugging Face Space backend URL
        BACKEND: "https://lavaonice-practice-mood.hf.space"
    };

    // Resolve the base URL for a given session mode, or null if not configured.
    function backendUrlFor(mode) {
        const url = (typeof CONFIG.BACKEND === "string" ? CONFIG.BACKEND : "").trim();
        return url ? url.replace(/\/+$/, "") : null;
    }

    /* -----------------------------------------------------------------
       TASK 7 — Development-only debug logging.
       When false, NOTHING is ever logged. Flip to true to trace auth
       lifecycle in the browser console.
       ----------------------------------------------------------------- */
    const DEBUG_AUTH = false;

    function _authLog(...args) {
        if (DEBUG_AUTH && typeof console !== "undefined") {
            console.log("[brevity-auth]", ...args);
        }
    }

    /* -----------------------------------------------------------------
       TASK 6 — Exactly one Supabase client.
       Reuse a previously created client (e.g. if auth.js is loaded again)
       so we never open a second instance.
       ----------------------------------------------------------------- */
    const supabaseClient = window.__brevitySupabaseClient
        ? window.__brevitySupabaseClient
        : (function () {
              if (typeof supabase === "undefined") {
                  _authLog("ERROR: Supabase CDN not loaded before auth.js");
                  throw new Error("Supabase client unavailable");
              }
              const client = supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
              window.__brevitySupabaseClient = client;
              _authLog("auth initialized");
              return client;
          })();

    const _sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    /* -----------------------------------------------------------------
       Lightweight "reconnecting" overlay shown only while we are retrying
       auth (e.g. temporary offline / network failure). Inline styles only —
       this does not touch any page's CSS. (Task 3)
       ----------------------------------------------------------------- */
    function _showRetryState(attempt, max) {
        let el = document.getElementById("__auth_loading");
        if (!el) {
            el = document.createElement("div");
            el.id = "__auth_loading";
            el.style.cssText =
                "position:fixed;inset:0;display:flex;flex-direction:column;" +
                "align-items:center;justify-content:center;gap:14px;background:#F8F9FA;" +
                "color:#34495E;font-family:'Segoe UI',sans-serif;z-index:99999;visibility:visible;";
            el.innerHTML =
                '<div style="width:38px;height:38px;border:4px solid #E1E1E1;' +
                'border-top-color:#34495E;border-radius:50%;animation:__authspin 1s linear infinite;"></div>' +
                '<div id="__auth_loading_msg" style="font-size:0.95rem;font-weight:600;"></div>';
            const style = document.createElement("style");
            style.textContent = "@keyframes __authspin{to{transform:rotate(360deg)}}";
            (document.head || document.documentElement).appendChild(style);
            document.documentElement.appendChild(el);
        }
        el.querySelector("#__auth_loading_msg").textContent =
            "Reconnecting… (attempt " + attempt + " of " + max + ")";
    }

    function _clearRetryState() {
        const el = document.getElementById("__auth_loading");
        if (el) el.remove();
    }

    /* -----------------------------------------------------------------
       Resolve the current user with the minimum necessary work.
       TASK 1 — getSession() is local (no network). Only call the
       network-bound getUser() when the cached session is missing or has
       expired, so normal page loads stay fast.

       Returns: user object (authenticated) | null (definitely logged out).
       Throws: on network / transport failures (so the caller can retry).
       ----------------------------------------------------------------- */
    async function _getAuthenticatedUser() {
        try {
            const getSessionPromise = supabaseClient.auth.getSession();
            const timeoutPromise = new Promise(resolve => setTimeout(() => resolve({ data: { session: null } }), 3000));
            const { data: { session }, error: sessionErr } = await Promise.race([getSessionPromise, timeoutPromise]);
            if (sessionErr) throw sessionErr;

            if (!session) return null;

            const expiresAt = (session.expires_at || 0) * 1000;
            if (expiresAt > Date.now()) {
                _authLog("session restored from cache (no network call)");
                return session.user || null;
            }

            const { data: { user }, error: userErr } = await supabaseClient.auth.getUser();
            if (userErr) throw userErr;
            _authLog("session verified with server");
            return user || null;
        } catch (err) {
            _authLog("getAuthenticatedUser error:", err);
            return null;
        }
    }

    /* -----------------------------------------------------------------
       TASK 3 — Resilient auth with retry.
       Network/offline errors are retried (3 attempts, 1s apart) behind a
       lightweight loading state. A definitive "no session" from Supabase
       is NOT retried — we redirect immediately.
       ----------------------------------------------------------------- */
    async function _authenticateWithRetry() {
        for (let attempt = 1; attempt <= CONFIG.RETRY_ATTEMPTS; attempt++) {
            try {
                const user = await _getAuthenticatedUser();
                if (user === null) {
                    _authLog("no valid session -> redirect");
                    return null;
                }
                _authLog("user authenticated", user.email || user.id);
                return user;
            } catch (err) {
                const offline = (typeof navigator !== "undefined" && !navigator.onLine);
                _authLog("auth attempt", attempt, "failed", offline ? "(offline)" : "", err && err.message);
                if (attempt < CONFIG.RETRY_ATTEMPTS) {
                    _showRetryState(attempt, CONFIG.RETRY_ATTEMPTS);
                    await _sleep(CONFIG.RETRY_DELAY_MS);
                } else {
                    _authLog("auth failed after retries -> redirect");
                    return null;
                }
            }
        }
        return null;
    }

    async function requireAuth({ hideUntilChecked = true } = {}) {
        if (hideUntilChecked) document.documentElement.style.visibility = "hidden";

        const safetyTimer = setTimeout(() => {
            if (hideUntilChecked) document.documentElement.style.visibility = "";
        }, 2500);

        const user = await _authenticateWithRetry();
        clearTimeout(safetyTimer);

        if (!user) {
            _clearRetryState();
            if (hideUntilChecked) document.documentElement.style.visibility = "";
            window.location.replace(CONFIG.LOGIN_PAGE);
            return null;
        }

        _clearRetryState();
        if (hideUntilChecked) document.documentElement.style.visibility = "";

        await applyAdminFlag(user);
        window.__brevityUser = user;
        return user;
    }

    /* -----------------------------------------------------------------
       logout()
       WHAT : Ends the Supabase session and returns to the login screen.
       WHEN : Called by sidebar "Log Out" links on every authenticated page.
       WHY  : Centralizes sign-out so it always goes through Supabase
              (and triggers the SIGNED_OUT state listener below).
       ----------------------------------------------------------------- */
    async function logout() {
        _authLog("logout");
        try { await supabaseClient.auth.signOut(); } catch (e) { /* ignore */ }
        window.location.replace(CONFIG.LOGIN_PAGE);
    }

    /* -----------------------------------------------------------------
       ADMIN ACCOUNT — infinite Kimchi Points / no gating (testing).
       -----------------------------------------------------------------
       The site is fully static (Supabase handles auth only; there is no
       backend). The single source of truth for "is this an admin" is the
       Supabase auth user's metadata flag `is_admin`. Because gate pages
       read Kimchi Points synchronously from localStorage, we mirror that
       flag into localStorage (`brevity_is_admin`) so the 4 gate pages can
       treat an admin as unlimited without any network round-trip.

       The flag is refreshed from Supabase on every auth event, so it can
       never drift from the server-side record while a session is live.
       ----------------------------------------------------------------- */

    // localStorage key mirroring the Supabase `is_admin` metadata flag.
    const ADMIN_FLAG_KEY = "brevity_is_admin";

    // Refresh the local admin mirror from the live Supabase user.
    // Returns true when the user is an admin. Safe to call repeatedly.
    async function applyAdminFlag(user) {
        let isAdmin = false;
        if (user) {
            const meta = user.user_metadata || {};
            isAdmin = meta.is_admin === true ||
                      meta.is_admin === "true" ||
                      (user.email && user.email.toLowerCase() === "brevitycompanion@gmail.com");
        } else {
            isAdmin = localStorage.getItem(ADMIN_FLAG_KEY) === "true";
        }
        localStorage.setItem(ADMIN_FLAG_KEY, isAdmin ? "true" : "false");
        return isAdmin;
    }

    // True when the local admin mirror says the current user is an admin.
    // Reads synchronously so gate pages can decide instantly.
    function kpUnlimited() {
        return localStorage.getItem(ADMIN_FLAG_KEY) === "true";
    }

    /* -----------------------------------------------------------------
       TASK 2 — Global authentication state listener (registered once).
       WHAT : Reacts to Supabase auth changes for the whole browsing session.
       WHEN : Active from the moment auth.js loads, on every page.
       WHY  : If the user is signed out mid-session (e.g. token revoked or
              they log out in another tab), bounce them to login immediately.
              Token refreshes are silent; session/user updates keep them in.
       ----------------------------------------------------------------- */
    supabaseClient.auth.onAuthStateChange(async (event, session) => {
        _authLog("auth state", event, session ? "active" : "none");
        // Keep the local admin mirror in lockstep with Supabase on any
        // session/user change so admin rights never go stale.
        if (session && session.user) {
            await applyAdminFlag(session.user);
        } else if (event === "SIGNED_OUT") {
            localStorage.setItem(ADMIN_FLAG_KEY, "false");
        }
        switch (event) {
            case "SIGNED_OUT":
                // Signed out while browsing -> send them to login now.
                window.location.replace(CONFIG.LOGIN_PAGE);
                break;
            case "TOKEN_REFRESHED":
                // Silent refresh; nothing to do, the session stays valid.
                break;
            case "USER_UPDATED":
            case "INITIAL_SESSION":
                // Session present/updated -> keep the user logged in.
                break;
            default:
                break;
        }
    });

    // Expose the public API on window so other (classic) page scripts can
    // reference these by bare name (supabaseClient / requireAuth / logout…).
    window.supabaseClient = supabaseClient;
    window.requireAuth = requireAuth;
    window.logout = logout;
    window.applyAdminFlag = applyAdminFlag;
    window.kpUnlimited = kpUnlimited;
    window.backendUrlFor = backendUrlFor;

    /* -----------------------------------------------------------------
       apiVocabFetch(endpoint, options)
       Authenticated API client for Vocabulary System Core (v7.0).
       Automatically attaches active Supabase JWT Bearer token.
       ----------------------------------------------------------------- */
    async function apiVocabFetch(endpoint, options = {}) {
        const session = (await supabaseClient.auth.getSession()).data.session;
        const token = session ? session.access_token : "";
        const base = backendUrlFor("vocab") || "";
        const url = endpoint.startsWith("http") ? endpoint : `${base}${endpoint}`;

        const headers = {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        };
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const res = await fetch(url, { ...options, headers });
        if (res.status === 409) {
            const conflictData = await res.json().catch(() => ({}));
            window.dispatchEvent(new CustomEvent("brevity:session_conflict", { detail: conflictData }));
        }
        return res;
    }

    window.apiVocabFetch = apiVocabFetch;

}
