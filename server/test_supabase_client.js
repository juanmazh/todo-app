const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Load client .env manually
const envPath = __dirname + '/../client/.env';
let env = {};
if (fs.existsSync(envPath)) {
  const contents = fs.readFileSync(envPath, 'utf8');
  contents.split(/\r?\n/).forEach(line => {
    const m = line.match(/^\s*([A-Za-z0-9_]+)=(.*)$/);
    if (m) env[m[1]] = m[2];
  });
}

const SUPABASE_URL = env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = env.VITE_SUPABASE_KEY || process.env.VITE_SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Supabase URL or KEY not found. Please set client/.env with VITE_SUPABASE_URL and VITE_SUPABASE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function run() {
  try {
    console.log('Using Supabase URL:', SUPABASE_URL);

  // Use a username without underscore in the local-part to avoid stricter validators
    // Allow an explicit test email via TEST_EMAIL env var (useful for projects that
    // restrict allowed email domains). If not provided, fall back to derived email.
    const explicitTestEmail = env.TEST_EMAIL || process.env.TEST_EMAIL;

    const username = `localtest${Date.now()}`;
    const password = 'Test123456!';

    let email;
    if (explicitTestEmail) {
      email = explicitTestEmail;
    } else {
      const domain = env.VITE_USERNAME_EMAIL_DOMAIN || process.env.VITE_USERNAME_EMAIL_DOMAIN || 'todo-app.local';
      email = `${username}@${domain}`;
    }

    console.log('Signing up user (or continuing if it already exists):', username);
    const { data: signData, error: signError } = await supabase.auth.signUp({ email, password });
    if (signError) {
      console.warn('Signup returned error (will attempt sign-in anyway):', signError);
    }

    // signData may be undefined if signUp failed; we'll attempt to sign in below
    const userFromSignUp = signData ? (signData.user || signData) : null;

    if (userFromSignUp && userFromSignUp.id) {
      console.log('Created auth user id (from signUp):', userFromSignUp.id);
    }

    // After signUp, try to sign in to obtain a session so RLS policies that
    // rely on auth.uid() will work when using the anon key.
    console.log('Signing in to obtain session (if possible)...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      console.warn('Sign-in error (post-signup):', signInError);
    } else {
      console.log('Signed in, session obtained.');
    }

    // determine user id: prefer signUp returned user, else session user from signIn
    const user = (userFromSignUp && userFromSignUp.id) ? userFromSignUp : (signInData && signInData.user ? signInData.user : null);
    if (!user || !user.id) {
      console.error('No auth user id available from signUp or signIn; cannot continue.');
      process.exit(1);
    }

    // Insert into users table
    console.log('Inserting row into users table...');
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([{ id: user.id, username }])
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting users row:', insertError);
      // continue even if insert fails
    } else {
      console.log('Inserted users row id:', newUser.id);
    }

    // Insert a todo (will be allowed if policies permit)
    console.log('Creating a todo for the user...');
    const { data: todo, error: todoError } = await supabase
      .from('todos')
      .insert([{ title: 'Test todo from local script', user_id: user.id }])
      .select()
      .single();

    if (todoError) {
      console.error('Error creating todo:', todoError);
      process.exit(1);
    }

    console.log('Created todo id:', todo.id);

    // Query todos for that user
    console.log('Querying todos for user...');
    const { data: todos, error: listError } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', user.id);

    if (listError) {
      console.error('Error listing todos:', listError);
      process.exit(1);
    }

    console.log('Found todos:', todos.length);
    console.log(JSON.stringify(todos, null, 2));

    console.log('Test completed successfully. Note: created auth user remains in your Supabase project (cannot be deleted with anon key).');
  } catch (err) {
    console.error('Unexpected error:', err);
    process.exit(1);
  }
}

run();
