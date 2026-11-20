# FAWAKIH

Fresh fruit price board with a secure admin panel.

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS · Supabase (Postgres + Auth + Storage)

---

## What you need

- A computer or Android phone with a browser
- Free accounts on: **Supabase**, **GitHub**, and a host (**Netlify** recommended)
- Node.js **20 or newer** (only needed to run locally)

---

## Step 1 — Supabase setup

1. Go to **https://supabase.com** → **Sign up** → create a **New project**.
2. Choose a region close to Malaysia (**Singapore**). Save the database password somewhere safe.
3. Wait ~2 minutes for the project to finish setting up.
4. In the left sidebar, click **SQL Editor** → **New query**.
5. Open `supabase/migrations/001_initial_schema.sql` from this repo, copy its **entire contents**, paste into the editor, and click **Run**.
6. You should see "Success. No rows returned". The products, categories, storage bucket, RLS policies and sample data are now live.
7. Go to **Project Settings → API** and copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

> **Never** copy the `service_role` key into this project. It is not needed.

---

## Step 2 — Environment variables

Copy `.env.example` to `.env.local` (locally) or paste the same names into your host's dashboard.

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_BUSINESS_PHONE=+60 12-345 6789
NEXT_PUBLIC_BUSINESS_EMAIL=hello@fawakih.example
NEXT_PUBLIC_BUSINESS_ADDRESS=Your shop address, Malaysia
NEXT_PUBLIC_BUSINESS_HOURS=Daily · 8:00 AM – 8:00 PM
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Update the business fields with your real contact info — they appear in the footer and contact section.

---

## Step 3 — Create the first administrator

Email/password auth is used (no Google, no magic links).

1. In Supabase → **Authentication** → **Users** → **Add user** → **Create new user**.
2. Enter the admin email and a **strong password** (12+ characters). Leave "Auto Confirm User" checked.
3. Copy the new user's **User UID** (or its email) from the users list.
4. Go back to **SQL Editor** → **New query** → paste this, replacing the email:

   ```sql
   update auth.users
   set raw_app_meta_data =
     coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
   where email = 'YOUR_ADMIN_EMAIL@example.com';
   ```

5. Click **Run**. It should say `1 row affected`.

**Why this works:** `raw_app_meta_data` can only be written by the Supabase dashboard or the service-role key — a normal user cannot promote themselves. This is what `is_admin()` in the RLS policies checks.

> If you change the role after the admin is already signed in, they must **sign out and sign back in** — the JWT is only refreshed on new login.

---

## Step 4 — Run locally

```bash
npm install
npm run dev
```

Open **http://localhost:3000** for the public site, and **http://localhost:3000/admin** for the admin panel. Sign in with the email + password from Step 3.

To verify the production build works before deploying:

```bash
npm run build
npm run start
```

If `npm run build` finishes without errors, your deploy will succeed.

---

## Step 5 — Upload to GitHub

On a computer:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/fawakih.git
git push -u origin main
```

On an Android phone:

1. Open **github.com** in Chrome → sign in.
2. Create a **New repository** called `fawakih` (Public or Private both work).
3. Tap **Add file → Upload files** → select all project files from your phone's Files app.
4. Tap **Commit changes**.

The `.gitignore` file already excludes `.env.local` and `node_modules`, so **never commit your real keys**.

---

## Step 6 — Hosting (commercial-safe)

⚠️ **Vercel's Hobby (free) plan is for personal, non-commercial projects only.** A shop taking money is commercial use — you would need Vercel Pro at **$20/month per user**.

**Recommended for a beginner shop:**

| Host | Free? | Commercial use allowed? | Notes |
|---|---|---|---|
| **Netlify** (Starter) | ✅ Yes | ✅ Yes | Auto-detects Next.js, handles server actions + revalidation. **Recommended.** |
| **Railway** | $5 credit, then pay-as-you-go (~$5–10/mo) | ✅ Yes | More control, slightly more technical. |
| **Cloudflare Pages** | ✅ Yes | ✅ Yes | Free + commercial-safe, but requires `@opennextjs/cloudflare` adapter setup. |
| **Vercel Pro** | ❌ $20/mo | ✅ Yes | Easiest, priciest. |
| **Vercel Hobby** | ✅ Yes | ❌ **No** | Only for hobby/non-commercial projects. |

**Netlify deploy steps:**

1. Go to **https://netlify.com** → **Sign up** with GitHub.
2. Click **Add new site → Import an existing project → Deploy with GitHub**.
3. Authorize Netlify, choose the `fawakih` repo.
4. Netlify auto-detects Next.js. Leave the build command as `npm run build` and publish directory as `.next`.
5. Scroll to **Environment variables** → add **every** variable from Step 2 (all 7 of them).
6. Click **Deploy site**. Wait 2–3 minutes.
7. Copy the URL Netlify gives you (e.g. `https://fawakih-abc123.netlify.app`).
8. Go back to Netlify → **Site configuration → Environment variables** → edit `NEXT_PUBLIC_SITE_URL` → paste the new URL → save.
9. Trigger a redeploy (Deploys → Trigger deploy → Deploy site).
10. Go to **Supabase → Authentication → URL Configuration**:
    - **Site URL** → `https://fawakih-abc123.netlify.app`
    - **Redirect URLs** → add `https://fawakih-abc123.netlify.app/**`

Done. Your site is live, and every future `git push` to `main` will redeploy automatically.

**Railway alternative:** push to GitHub → railway.app → New Project → Deploy from GitHub → pick the repo → add the same env vars → deploy → set `NEXT_PUBLIC_SITE_URL` to the Railway URL and update Supabase URLs the same way.

---

## Step 7 — Daily use (from your Android phone)

1. Open your live URL in Chrome.
2. Tap **⋮ → Add to Home screen** for a one-tap shortcut.
3. Tap **Admin** → sign in with the admin email + password.
4. To **change a price**: Products → Edit → update the price → **Save changes** → the customer page updates within seconds.
5. To **mark a product out of stock**: Edit → Availability → **Out of stock** → Save.
6. To **add a product**: **+ Add product** → fill the form → tap **Upload image** → choose from Gallery or Camera → **Create product**.
7. To **delete a product**: Products → **Delete** → confirm.
8. To **hide a product** without deleting: Edit → uncheck **Published** → Save.

The photo picker works with the camera on Android Chrome — you can snap a fresh photo of the fruit and it uploads straight from your phone.

---

## How security works

Four layers protect your shop — even a determined visitor cannot edit prices:

1. **Database (RLS).** Every write to `products` or `storage.objects` is rejected unless `auth.jwt() → 'app_metadata' ->> 'role' = 'admin'`. This is enforced by PostgreSQL itself.
2. **Server middleware.** Any request to `/admin/*` without an admin session is redirected to `/admin/login` before the page renders.
3. **Server actions.** Every create/edit/delete re-checks the role before touching the database.
4. **UI.** The dashboard is only rendered when `app_metadata.role === 'admin'` — but this is cosmetic, not the real guard.

The `anon` key is safe to ship to the browser — RLS is what actually protects your data.

---

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `Invalid email or password` on login | Wrong password, or the user was created in a different Supabase project | Reset password in Supabase → Authentication → Users |
| `Access denied. This account is not an administrator` | Forgot Step 3, or the role was set but the user is still on an old session | Run the `update auth.users` SQL, then sign out and sign back in |
| Admin pages redirect to login after signing in | `NEXT_PUBLIC_SUPABASE_URL` is wrong, or cookies are blocked | Check env vars; test in a normal (non-incognito) window |
| Images don't appear | The `product-images` bucket isn't public, or `next.config.ts` remote pattern is wrong | Bucket should be public (SQL sets it); re-run the migration if needed |
| Price changes don't appear on the site | Browser cache | Hard refresh (Ctrl+Shift+R, or clear site data on mobile); wait 30 seconds if `revalidate` hasn't fired |
| `Build fails — env var undefined` | Env variables not set on the host | Re-add all 7 vars in Netlify/Railway and redeploy |
| Supabase project paused | Free tier auto-pauses after 7 days of no activity | Open the Supabase dashboard — it wakes automatically |
| `next/image` domain error | Trying to load an image from a non-Supabase URL | All images must be uploaded through the admin form |

---

## Command cheat sheet

```bash
npm install       # Install dependencies (first time only)
npm run dev       # Local dev server at http://localhost:3000
npm run build     # Production build — run this before deploying to catch errors
npm run start     # Run the production build locally
npm run lint      # Check code style
```

---

## File map

```
app/            — Next.js pages (public + admin)
components/     — Reusable UI (header, product card, forms…)
lib/            — Supabase clients, server actions, utilities
types/          — TypeScript types
supabase/       — SQL migration
public/         — Static assets (logo, favicon)
```

The sample products inserted by the migration (Apple, Mango, Grape, Pineapple, Watermelon, Honeymelon, Honeydew, Guava, Pomegranate) are clearly sample data — delete or replace them from the admin panel once you're set up.
