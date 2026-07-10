// =====================================================================
//  Brevity Companion — Admin (testing) account provisioning  [ALTERNATIVE]
// ---------------------------------------------------------------------
//  Use this INSTEAD of admin_setup.sql if you prefer running a script
//  rather than pasting SQL. It uses the Supabase Admin API, which means
//  Supabase handles the password hashing for you.
//
//  PREREQUISITES
//    1. Get your SERVICE ROLE key (NOT the anon key):
//         Supabase dashboard -> Project Settings -> API -> service_role
//         (this key bypasses RLS — keep it secret, never ship it to the client).
//    2. Install the client:
//         npm i @supabase/supabase-js
//    3. Fill SUPABASE_URL + SERVICE_ROLE_KEY below (or set env vars).
//    4. Run:  node setup_admin.mjs
//
//  RESULT
//    Creates (or updates) brevitycompanion@gmail.com with password
//    "BrevityAdmin!2026" and is_admin = true, email already confirmed,
//    no expiry / no gating. Mirror of admin_setup.sql.
// =====================================================================

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || "https://zysltznpsldeuxqtsejc.supabase.co";
// WARNING: paste your SECRET service_role key here (or export it as env).
const SERVICE_ROLE_KEY = process.env.SERVICE_ROLE_KEY || "PASTE_SERVICE_ROLE_KEY_HERE";

const ADMIN_EMAIL = "brevitycompanion@gmail.com";
const ADMIN_PASSWORD = "BrevityAdmin!2026";

if (SERVICE_ROLE_KEY === "PASTE_SERVICE_ROLE_KEY_HERE") {
    console.error("✗ Set SERVICE_ROLE_KEY first (see header comment). Aborting.");
    process.exit(1);
}

const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
    // Does the user already exist?
    const { data: list } = await admin.auth.admin.listUsers();
    const existing = (list?.users || []).find(
        (u) => u.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()
    );

    if (existing) {
        const { error } = await admin.auth.admin.updateUserById(existing.id, {
            password: ADMIN_PASSWORD,
            email_confirm: true, // skip the email-verify step
            user_metadata: { is_admin: true, full_name: "Admin" },
        });
        if (error) throw error;
        console.log("✓ Admin user already existed -> updated (password + is_admin=true).");
    } else {
        const { error } = await admin.auth.admin.createUser({
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD,
            email_confirm: true, // confirmed -> login works immediately
            user_metadata: { is_admin: true, full_name: "Admin" },
        });
        if (error) throw error;
        console.log("✓ Admin user created.");
    }

    console.log("\nLogin with:");
    console.log("  email   :", ADMIN_EMAIL);
    console.log("  password:", ADMIN_PASSWORD);
    console.log("\nThe front-end reads `is_admin` from user metadata and grants");
    console.log("infinite Kimchi Points + no session gating. Change the password");
    console.log("after first login (Supabase -> Auth -> Users).");
}

main().catch((e) => {
    console.error("✗ Failed:", e.message);
    process.exit(1);
});
