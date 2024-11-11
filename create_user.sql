-- Insert into auth.users
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    invited_at,
    confirmation_token,
    confirmation_sent_at,
    recovery_token,
    recovery_sent_at,
    email_change_token_new,
    email_change_token_current,
    email_change_confirm_status,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    created_at,
    updated_at,
    phone,
    phone_confirmed_at,
    phone_change_token,
    phone_change,
    email_change,
    banned_until,
    reauthentication_token,
    reauthentication_sent_at,
    is_sso_user,
    deleted_at
) VALUES (
    '00000000-0000-0000-0000-000000000000',  -- instance_id
    uuid_generate_v4(),                       -- id
    'authenticated',                          -- aud
    'authenticated',                          -- role
    'welysongomes15@gmail.com',              -- email
    crypt('wgs@9898', gen_salt('bf')),       -- encrypted_password
    NOW(),                                   -- email_confirmed_at
    NULL,                                    -- invited_at
    '',                                      -- confirmation_token
    NULL,                                    -- confirmation_sent_at
    '',                                      -- recovery_token
    NULL,                                    -- recovery_sent_at
    '',                                      -- email_change_token_new
    '',                                      -- email_change_token_current
    0,                                       -- email_change_confirm_status
    '{"provider": "email", "providers": ["email"]}'::jsonb,  -- raw_app_meta_data
    '{"full_name": "Welison Gomes"}'::jsonb, -- raw_user_meta_data
    FALSE,                                   -- is_super_admin
    NOW(),                                   -- created_at
    NOW(),                                   -- updated_at
    NULL,                                    -- phone
    NULL,                                    -- phone_confirmed_at
    '',                                      -- phone_change_token
    '',                                      -- phone_change
    '',                                      -- email_change
    NULL,                                    -- banned_until
    '',                                      -- reauthentication_token
    NULL,                                    -- reauthentication_sent_at
    FALSE,                                   -- is_sso_user
    NULL                                     -- deleted_at
);