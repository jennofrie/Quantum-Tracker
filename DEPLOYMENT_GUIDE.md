# Deployment Guide: GitHub → Netlify

## ✅ Completed Steps (Automated)

### Step 1: Fixed Missing Dependency ✓
- Added `@supabase/supabase-js` to `package.json`
- This fixes the build error you encountered

### Step 2: Environment Variables Setup ✓
- Moved Aviation Stack API key from hardcoded to environment variable
- Updated `app/actions/flight-search.ts` to use `process.env.AVIATION_STACK_API_KEY`
- Added to `.env.local` for local development

### Step 3: Netlify Configuration ✓
- Created `netlify.toml` with optimal Next.js settings
- Configured Node.js version 18
- Added security headers

### Step 4: Next.js Config Verified ✓
- Current `next.config.mjs` is compatible with Netlify
- No changes needed

---

## 📋 Manual Steps (You Need To Do)

### Phase 1: GitHub Setup

#### Step 5: Initialize Git Repository
```bash
git init
git add .
git commit -m "Initial commit: Quantum Tracker flight lookup app"
```

#### Step 6: Connect to Existing GitHub Repository
Your repository already exists at: `https://github.com/jennofrie/Quantum-Tracker`

#### Step 7: Push to GitHub
```bash
git remote add origin https://github.com/jennofrie/Quantum-Tracker.git
git branch -M main
git push -u origin main
```

### Phase 2: Netlify Deployment

#### Step 8: Connect Repository to Netlify
1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **"Deploy with GitHub"**
4. Authorize Netlify to access your GitHub
5. Select your repository (`midnight-hangar` or whatever you named it)
6. Netlify should auto-detect Next.js settings

#### Step 9: Configure Environment Variables
In Netlify Site Settings → Environment Variables, add these **4 variables**:

| Variable Name | Value |
|---------------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project-id.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `your_supabase_anon_key_here` |
| `AVIATION_STACK_API_KEY` | `your_aviation_stack_api_key_here` |
| `OPENWEATHERMAP_API_KEY` | `your_openweathermap_api_key_here` (optional but recommended) |

Click **"Save"** after adding all variables.

#### Step 10: Deploy
- Netlify will automatically deploy after connecting the repo
- Monitor the build logs in the Netlify dashboard
- Wait for "Site is live" confirmation

### Phase 3: Supabase Configuration

#### Step 11: Update Supabase Redirect URLs
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** → **URL Configuration**
4. Update the following:

**Site URL:**
```
https://your-app-name.netlify.app
```
(Replace with your actual Netlify URL)

**Redirect URLs (add these):**
```
https://your-app-name.netlify.app/**
http://localhost:3000
http://localhost:3000/**
```

5. Click **"Save"**

### Phase 4: Testing

#### Step 12: Test Your Deployment
1. Visit your Netlify URL
2. Test the following:
   - ✓ Landing page loads
   - ✓ Click "Get Started" → Login page appears
   - ✓ Login with invited user credentials
   - ✓ Dashboard loads after login
   - ✓ Flight search functionality works
   - ✓ Guest access button works

---

## 🔧 Troubleshooting

### Build Fails on Netlify
- Check build logs in Netlify dashboard
- Verify all environment variables are set correctly
- Make sure `@supabase/supabase-js` is in `package.json` (already done)

### Login Doesn't Work
- Verify Supabase redirect URLs include your Netlify domain
- Check environment variables in Netlify match your Supabase credentials
- Ensure you've invited users in Supabase dashboard

### Flight Search Doesn't Work
- Verify `AVIATION_STACK_API_KEY` is set in Netlify environment variables
- Check browser console for any API errors

---

## 📝 Quick Reference

**Your Environment Variables:**
- Supabase URL: `https://your-project-id.supabase.co`
- Supabase Key: (your JWT token from Supabase dashboard)
- Aviation Stack Key: (your API key from Aviation Stack dashboard)

**Files Modified:**
- ✓ `package.json` - Added Supabase dependency
- ✓ `app/actions/flight-search.ts` - Using env variable for API key
- ✓ `.env.local` - Added Aviation Stack API key
- ✓ `netlify.toml` - Created Netlify configuration

**Next Steps:**
1. Push to GitHub (Steps 5-7)
2. Deploy on Netlify (Steps 8-10)
3. Configure Supabase URLs (Step 11)
4. Test everything (Step 12)

Good luck with your deployment! 🚀

