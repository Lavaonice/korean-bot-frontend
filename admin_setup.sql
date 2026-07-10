-- =====================================================================
--  Brevity Companion — Admin (testing) account provisioning
-- ---------------------------------------------------------------------
--  WHAT THIS DOES
--    Creates (or updates) the dedicated admin/testing account:
--      email : brevitycompanion@gmail.com
--      pass  : BrevityAdmin!2026          <-- change it after first login
--      role  : is_admin = true  (infinite Kimchi Points, no gating)
--    - email_confirmed_at is set so login works with NO email round-trip
--      and the account never requires "confirm your email" verification.
--    - There is NO expiry, NO cooldown, NO session limit. The admin flag
--      is the single source of truth the front-end reads (auth.js ->
--      user_metadata.is_admin -> localStorage.brevity_is_admin).
--
--  WHERE IT LIVES IN SUPABASE
--    Auth > Users  (auth.users). The "is_admin" flag is stored in the
--    user's raw_user_meta_data JSON.
--
--  HOW TO RUN
--    1. Open your Supabase project dashboard.
--    2. Go to  SQL Editor  ->  New query.
--    3. Paste this whole file and click  Run.
--    4. Log in at the app with the email + password above.
--
--  NOTES
--    - Safe to run more than once (idempotent: updates if the user exists).
--    - To change the password later: Auth > Users > pick the account >
--      "Reset password" or just re-run with a new password below.
--    - To revoke admin later: run the last optional block (commented out).
-- =====================================================================

-- 1) Create or update the admin user --------------------------------
do $$
declare
    v_user_id uuid;
begin
    -- Find the account (case-insensitive on email).
    select id into v_user_id
    from auth.users
    where lower(email) = lower('brevitycompanion@gmail.com');

    if v_user_id is null then
        -- Create fresh.
        insert into auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            confirmation_token,
            recovery_token,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at
        ) values (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'brevitycompanion@gmail.com',
            crypt('BrevityAdmin!2026', gen_salt('bf')),  -- password
            now(),                                        -- confirmed -> no email verify
            '',
            '',
            '{"provider":"email","providers":["email"]}'::jsonb,
            '{"is_admin": true, "full_name": "Admin"}'::jsonb,
            now(),
            now()
        );
        raise notice 'Admin user created.';
    else
        -- Already exists -> (re)set password, confirm email, mark admin.
        update auth.users set
            encrypted_password = crypt('BrevityAdmin!2026', gen_salt('bf')),
            email_confirmed_at = now(),
            raw_user_meta_data = '{"is_admin": true, "full_name": "Admin"}'::jsonb,
            updated_at = now()
        where id = v_user_id;
        raise notice 'Admin user already existed -> updated.';
    end if;
end $$;

-- 2) Verify the result -------------------------------------------------
select
    email,
    email_confirmed_at is not null as email_confirmed,
    raw_user_meta_data ->> 'is_admin'  as is_admin,
    raw_user_meta_data ->> 'full_name' as full_name
from auth.users
where lower(email) = lower('brevitycompanion@gmail.com');

-- =====================================================================
--  OPTIONAL — REVOKE ADMIN (run only when you want to disable it)
--  Uncomment to flip the account back to a normal user.
-- ---------------------------------------------------------------------
-- update auth.users
-- set raw_user_meta_data = raw_user_meta_data - 'is_admin'
-- where lower(email) = lower('brevitycompanion@gmail.com');
-- =====================================================================
