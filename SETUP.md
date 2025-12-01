# Ziad POS System - Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Initialize Database
```bash
npm run prisma:generate
npm run prisma:push
npm run prisma:seed
```

### 3. Start Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:3001` (or next available port if 3001 is busy).

---

## Default Login Credentials (Development Only)

After running the seed command, use these credentials to log in:

- **Username:** `admin`
- **Password:** `admin123`
- **Role:** Administrator (full access)

### Create Additional Users

To create more users (e.g., cashier), run:

```bash
node scripts/create-user.js <username> <password> <name> <role>
```

Example:
```bash
node scripts/create-user.js cashier1 cashier123 "Cashier One" CASHIER
```

Available roles: `ADMIN`, `CASHIER`

### Reset User Passwords

To reset passwords for users:

```bash
node scripts/reset-passwords.js
```

This will generate new random passwords for all users (output in development mode only).

---

## Troubleshooting

### "Invoice not found" error
- This happens when you navigate to an invoice before any sales have been recorded.
- Create a sale first using the POS section, then the invoice will display.

### Database issues
- Delete `prisma/dev.db` to reset the database
- Re-run seed: `npm run prisma:seed`

### Port already in use
- The app automatically finds an available port (check terminal output)
- Or kill the process on port 3000 and restart

---

## Project Structure

- `src/app/` - Next.js pages and API routes
- `src/context/DataContext.tsx` - Global state management (Prisma + API integration)
- `prisma/schema.prisma` - Database schema
- `src/auth.ts` - NextAuth configuration
- `electron/` - Desktop app entry point (optional)

---

## Development Commands

```bash
npm run dev                 # Start dev server
npm run build              # Production build
npm run lint               # Run ESLint
npm run prisma:generate    # Generate Prisma Client
npm run prisma:push        # Sync schema with DB
npm run prisma:seed        # Seed database
npm run electron:dev       # Start Electron dev (desktop)
```

---

## Security Notes

⚠️ **For Production:**
- Change `NEXTAUTH_SECRET` in `.env.local` to a secure random value
- Rotate default credentials immediately
- Use environment variables for all secrets
- Enable HTTPS
- Set up proper database backups

