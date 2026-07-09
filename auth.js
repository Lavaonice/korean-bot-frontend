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
        RETRY_DELAY_MS: 1000
    };

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
        const { data: { session }, error: sessionErr } =
            await supabaseClient.auth.getSession();
        if (sessionErr) throw sessionErr; // transport failure -> retryable

        if (!session) return null; // no session at all -> redirect, no retry

        // Fresh cached session: trust it, skip the network round-trip.
        const expiresAt = (session.expires_at || 0) * 1000;
        if (expiresAt > Date.now()) {
            _authLog("session restored from cache (no network call)");
            return session.user || null;
        }

        // Expired or near-expiry: verify/refresh against the auth server.
        const { data: { user }, error: userErr } =
            await supabaseClient.auth.getUser();
        if (userErr) throw userErr; // transport or invalid -> caller decides
        _authLog("session verified with server");
        return user || null;
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

    /* -----------------------------------------------------------------
       requireAuth()
       WHAT : Gate for every protected page.
       WHEN : Called from each protected page right after auth.js loads.
       WHY  : Validates the Supabase session; redirects to LOGIN_PAGE if
              there isn't one, and hides the document until resolved so
              protected content never flashes.
       Returns the authenticated user, or null after redirecting.
       ----------------------------------------------------------------- */
    async function requireAuth({ hideUntilChecked = true } = {}) {
        if (hideUntilChecked) document.documentElement.style.visibility = "hidden";

        const user = await _authenticateWithRetry();

        if (!user) {
            _clearRetryState();
            window.location.replace(CONFIG.LOGIN_PAGE);
            return null;
        }

        _clearRetryState();
        if (hideUntilChecked) document.documentElement.style.visibility = "";
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
       TASK 2 — Global authentication state listener (registered once).
       WHAT : Reacts to Supabase auth changes for the whole browsing session.
       WHEN : Active from the moment auth.js loads, on every page.
       WHY  : If the user is signed out mid-session (e.g. token revoked or
              they log out in another tab), bounce them to login immediately.
              Token refreshes are silent; session/user updates keep them in.
       ----------------------------------------------------------------- */
    supabaseClient.auth.onAuthStateChange((event, session) => {
        _authLog("auth state", event, session ? "active" : "none");
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
    // reference these by bare name (supabaseClient / requireAuth / logout).
    window.supabaseClient = supabaseClient;
    window.requireAuth = requireAuth;
    window.logout = logout;
}
