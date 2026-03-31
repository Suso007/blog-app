# Quick Setup Guide

Follow these steps to get your blog up and running in minutes!

## Step 1: Install Node.js

Make sure you have Node.js 18 or higher installed:
```bash
node --version
```

If not installed, download from https://nodejs.org

## Step 2: Get a Neon Database

1. Go to https://neon.tech
2. Sign up for a free account
3. Create a new project (choose any name)
4. Go to Dashboard → Connection Details
5. Copy the connection string (looks like: `postgresql://...`)

## Step 3: Configure Environment

1. In the project folder, copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and fill in:
   ```env
   DATABASE_URL="paste-your-neon-connection-string-here"
   ADMIN_PASSWORD="choose-a-secure-password"
   NEXTAUTH_SECRET="run: openssl rand -base64 32"
   ```

## Step 4: Install and Setup

Run these commands in order:

```bash
# Install all dependencies
npm install

# Setup database
npx prisma generate
npx prisma db push

# Start development server
npm run dev
```

## Step 5: Access Your Blog

- **Blog Homepage**: http://localhost:3000
- **Login**: http://localhost:3000/login
- **Admin Panel**: http://localhost:3000/admin (after login)

## Creating Your First Post

1. Go to http://localhost:3000/login
2. Enter your admin password
3. Click "New Post" 
4. Fill in the details:
   - Title
   - Excerpt (short description)
   - Content (your blog post)
   - Category
   - Cover Image URL (optional)
   - Check "Publish immediately" to make it visible
5. Click "Create Post"

## Need Help?

- Check the main README.md for detailed documentation
- Use `npx prisma studio` to view/edit database directly
- Check browser console for any errors

## Deployment (Optional)

To deploy to Vercel:

1. Push code to GitHub
2. Go to https://vercel.com
3. Import your GitHub repository
4. Add environment variables (same as .env)
5. Deploy!

That's it! Enjoy your new blog! 🎉
