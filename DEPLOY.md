Deployment checklist and steps for client-only app

1) Environment variables

- Set the following variables in your static host (Render/Netlify/Vercel):

  VITE_SUPABASE_URL=https://<your-project>.supabase.co
  VITE_SUPABASE_KEY=<PUBLIC_ANON_KEY>

    Optional (username -> derived email):
    VITE_USERNAME_EMAIL_DOMAIN=todo-app.local

  Important: do NOT use the service_role key in the client.

2) Build & publish

- Build locally:

  npm run build

- Deploy the `client/dist` folder to your static host. Example settings:

- Render (static): build command `npm run build`, publish directory `client/dist`.
- Netlify: drag-and-drop `client/dist` or set build command `npm run build` and publish dir `client/dist`.
- Vercel: point to repo, set framework to 'Other', build: `npm run build`, output: `client/dist`.

3) Supabase: apply RLS policies

- Execute `database/setup.sql` in the Supabase SQL editor to create the todos table and enable Row Level Security with policies that scope rows to `auth.uid()`.

4) Supabase: authentication / username mapping (if using username login)

- If your app uses "username + password" instead of an email field, we derive an email internally before calling Supabase Auth (for example: `username@todo-app.local`).
- Make sure in the Supabase Dashboard → Authentication → Settings:
  - "Enable signups" is ON.
  - "Allowed email domains" is either empty (allow all) or contains the derived domain you choose (e.g. `todo-app.local`).

  If you change the allowed domains, retry registering from the client.

4) Testing

- In an incognito window, register two different users and verify that each user only sees their own todos.
- Try unauthorized API calls (without anon key or with missing session) to confirm access is denied.

5) Database setup

- The application uses Supabase Auth for authentication and Supabase database for storage.
- Run the SQL script in `database/setup.sql` in your Supabase SQL Editor to set up the database schema and RLS policies.

6) Security reminders

- Never commit service_role keys to the repo.
- For any privileged operations (backups, admin tasks, webhooks), run them from a secure server using the service_role key.

If you want, I can also set the real anon key in `render.yaml` for you (paste the anon key here) or guide you through setting environment variables on your hosting provider.
