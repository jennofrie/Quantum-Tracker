# Security Fix: Exposed API Keys

## ✅ What I Fixed

I've removed all exposed API keys from your documentation files:
- ✅ `DEPLOYMENT_GUIDE.md` - Replaced real keys with placeholders
- ✅ `README.md` - Replaced real keys with placeholders
- ✅ Verified `.gitignore` properly excludes `.env*.local` and `.env` files

## ⚠️ CRITICAL: Rotate Your Exposed API Keys

Since these keys were committed to GitHub, you **MUST** rotate (regenerate) them:

### 1. OpenWeatherMap API Key
**Exposed Key**: `f7d855deb94fa98d91ba9e5f1b57ca7c`

**Steps to Rotate:**
1. Go to [OpenWeatherMap API Keys](https://home.openweathermap.org/api_keys)
2. Find the key `f7d855deb94fa98d91ba9e5f1b57ca7c`
3. Click "Delete" or "Regenerate" to create a new key
4. Update your `.env.local` file with the new key
5. Update Netlify environment variables with the new key

### 2. Aviation Stack API Key
**Exposed Key**: `eeb36f887a22bdf379ec3c76ad342845`

**Steps to Rotate:**
1. Go to [Aviation Stack Dashboard](https://aviationstack.com/dashboard)
2. Navigate to API Keys section
3. Delete or regenerate the exposed key
4. Create a new API key
5. Update your `.env.local` file with the new key
6. Update Netlify environment variables with the new key

### 3. Supabase Keys
**Exposed**: Supabase URL and Anon Key

**Steps to Rotate:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. The anon key can be regenerated, but the URL cannot be changed
5. If you want to completely secure it, consider creating a new Supabase project
6. Update your `.env.local` file with new keys
7. Update Netlify environment variables with new keys

## 🔄 Remove Keys from Git History

The keys are still in your Git history. To completely remove them:

### Option 1: Use BFG Repo-Cleaner (Recommended)
```bash
# Install BFG (if not installed)
# Download from: https://rtyley.github.io/bfg-repo-cleaner/

# Clone a fresh copy of your repo
git clone --mirror https://github.com/jennofrie/Quantum-Tracker.git

# Create a passwords.txt file with keys to remove
echo "f7d855deb94fa98d91ba9e5f1b57ca7c" > passwords.txt
echo "eeb36f887a22bdf379ec3c76ad342845" >> passwords.txt
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1c29kaHd3aHpobWV0ZHBsa3V5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzOTAxNDQsImV4cCI6MjA3OTk2NjE0NH0.EziC8OL0yhMfmR-2roHlVcH_RJZh7x7c6QXTMND2oWw" >> passwords.txt

# Run BFG
java -jar bfg.jar --replace-text passwords.txt Quantum-Tracker.git

# Clean up and push
cd Quantum-Tracker.git
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push --force
```

### Option 2: Manual Git History Rewrite (Advanced)
```bash
# WARNING: This rewrites history. Only do this if you understand the consequences.
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch DEPLOYMENT_GUIDE.md README.md" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (WARNING: This will rewrite GitHub history)
git push origin --force --all
```

### Option 3: Accept the Risk (Not Recommended)
If the repository is private and you're okay with the keys being in history:
- Just rotate the keys (they'll be invalid anyway)
- The old keys in history won't work anymore

## 📝 Next Steps

1. **Immediately rotate all exposed API keys** (most important!)
2. Update `.env.local` with new keys
3. Update Netlify environment variables with new keys
4. Commit the cleaned documentation files:
   ```bash
   git add DEPLOYMENT_GUIDE.md README.md
   git commit -m "Security: Remove exposed API keys from documentation"
   git push
   ```
5. (Optional) Remove keys from git history using one of the methods above

## 🛡️ Prevention Tips

1. **Never commit API keys** - Always use `.env.local` (already in `.gitignore`)
2. **Use placeholders in documentation** - Show format, not real values
3. **Use environment variables** - All keys should come from `.env.local` or Netlify
4. **Review before committing** - Check `git diff` before pushing
5. **Use GitHub Secrets** - For CI/CD, use GitHub Actions secrets

## ✅ Verification

After rotating keys, verify:
- ✅ Local app works with new keys in `.env.local`
- ✅ Netlify deployment works with new environment variables
- ✅ Old keys no longer work (test with old key to confirm)
- ✅ Documentation files show placeholders, not real keys

---

**Priority**: Rotate the OpenWeatherMap key immediately as it was specifically flagged by GitGuardian.

