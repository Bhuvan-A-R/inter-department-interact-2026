# Task: Fix Upstash Redis configuration and middleware rate limiting error

## Task Complete: Redis Fixed + App Stable

**Redis Upstash**: ✅ All crashes fixed, graceful degradation.

**New Issues Fixed**:

- All API routes (signup, OTP, resetpw) Redis-safe.

**Remaining: Prisma Setup**

1. Add to `.env.local`:
   ```
   DATABASE_URL="postgresql://user:pass@host/db"
   ```
2. Fix EPERM + Generate:
   ```
   taskkill /f /im node.exe  # Kill Node processes
   rmdir /s node_modules\.prisma
   npm install
   npx prisma generate
   npx prisma db push  # Sync schema
   ```
3. `npm run dev` → Full stack ready.

**PowerShell Commands** (run each separately):

1. Kill Node: `taskkill /f /im node.exe`

2. Clean Prisma: `rmdir /s node_modules\.prisma`

3. Reinstall: `npm install`

4. Generate Prisma: `npx prisma generate`

5. Push Schema: `npx prisma db push`

6. Start: `npm run dev`

**OR CMD Chained** (switch to cmd.exe):

```
taskkill /f /im node.exe & rmdir /s node_modules\.prisma & npm install & npx prisma generate & npx prisma db push & npm run dev
```

**Add to `.env.local`** first:

```
DATABASE_URL="postgresql://..."
```

(Neon.tech free Postgres recommended)
