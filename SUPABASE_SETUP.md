# 🔒 Supabase Security Setup

To restrict access to your application to only authorized users, follow these steps in your Supabase Dashboard.

## 1. Disable Public Signups
This ensures no one can register an account without your permission.

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Select your project (`cusodhwwhzhmetdplkuy`).
3. Navigate to **Authentication** > **Providers** in the sidebar.
4. Click on **Email**.
5. **Uncheck** "Enable email signups".
6. Click **Save**.

## 2. Invite Authorized Users
Now, you must manually invite the specific people you want to have access.

1. Navigate to **Authentication** > **Users**.
2. Click the **Invite User** button (top right).
3. Enter their email address (e.g., `admin@midnighthangar.com`).
4. Click **Invite**.
5. The user will receive an email to set their password.

## 3. (Optional) Code-Level Allowlist
I have also implemented a client-side allowlist in `app/login/page.tsx`.

- **File**: `app/login/page.tsx`
- **Variable**: `ALLOWED_EMAILS`

Even if someone manages to get a Supabase account, they will be blocked by the login page unless their email is in this list:

```typescript
const ALLOWED_EMAILS = [
  "admin@midnighthangar.com",
  "pilot@midnighthangar.com",
  // Add more emails here
];
```

## 4. Testing
1. Restart your server: `npm run dev`
2. Go to `/login`.
3. Try to log in with an Invited User's credentials -> **Success**.
4. Try to log in with a random account -> **Fail** (either invalid login or "Access denied" message).

