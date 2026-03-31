# Modern Blog Application

A beautifully designed, full-featured blog platform built with Next.js 14, TypeScript, Prisma, Neon Database, shadcn/ui, and Framer Motion.

## Features

✨ **Modern Design**
- Clean, elegant editorial design with custom typography
- Smooth animations using Framer Motion
- Responsive layout for all devices
- Custom gradient backgrounds and styling

📝 **Blog Management**
- Create, edit, and delete blog posts
- Rich text content with support for paragraphs
- Cover images for posts
- Category filtering and date sorting
- Published/draft status

🔐 **Authentication**
- Password-protected admin panel
- Secure cookie-based authentication
- Environment-based password configuration

🗄️ **Database**
- PostgreSQL with Neon serverless database
- Prisma ORM for type-safe database access
- Optimized queries with indexing

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: Neon PostgreSQL
- **ORM**: Prisma
- **UI Components**: shadcn/ui (Radix UI)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Prerequisites

- Node.js 18+ installed
- A Neon database account (free tier available at https://neon.tech)
- Git (optional)

## Installation

### 1. Clone or Download

Download the project files and navigate to the directory:

```bash
cd modern-blog-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your actual values:

```env
# Get this from your Neon database dashboard
DATABASE_URL="postgresql://username:password@your-neon-host/dbname?sslmode=require"

# Set a strong password for admin access
ADMIN_PASSWORD="your-secure-password-here"

# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET="your-nextauth-secret-here"
```

### 4. Set Up Neon Database

1. Go to https://neon.tech and create a free account
2. Create a new project
3. Copy the connection string from the dashboard
4. Paste it into your `.env` file as `DATABASE_URL`

### 5. Initialize Database

Run Prisma migrations to create your database schema:

```bash
npx prisma generate
npx prisma db push
```

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Public Blog

- Visit the homepage to see all published posts
- Filter posts by category
- Sort posts by date (newest/oldest)
- Click on any post to read the full content

### Admin Panel

1. Navigate to `/login`
2. Enter the password you set in `.env`
3. Access the admin dashboard at `/admin`
4. Create, edit, or delete posts
5. Toggle publish status for posts

## Project Structure

```
modern-blog-app/
├── app/
│   ├── admin/              # Admin dashboard
│   ├── api/                # API routes
│   │   ├── auth/           # Authentication endpoints
│   │   └── posts/          # Post CRUD endpoints
│   ├── blog/[slug]/        # Individual blog post pages
│   ├── login/              # Login page
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Homepage
├── components/
│   ├── blog/               # Blog-specific components
│   │   ├── navbar.tsx
│   │   ├── blog-card.tsx
│   │   └── post-editor.tsx
│   └── ui/                 # shadcn/ui components
├── lib/
│   ├── auth.ts             # Authentication helpers
│   ├── prisma.ts           # Prisma client
│   └── utils.ts            # Utility functions
├── prisma/
│   └── schema.prisma       # Database schema
└── middleware.ts           # Route protection
```

## Database Schema

```prisma
model Post {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  excerpt     String
  content     String
  category    String
  coverImage  String?
  published   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## API Routes

### Authentication

- `POST /api/auth/login` - Login with password
- `POST /api/auth/logout` - Logout and clear session

### Posts

- `GET /api/posts` - Get all published posts (supports `?category=` and `?sortBy=`)
- `POST /api/posts` - Create new post (requires auth)
- `GET /api/posts/[id]` - Get single post
- `PUT /api/posts/[id]` - Update post (requires auth)
- `DELETE /api/posts/[id]` - Delete post (requires auth)

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to set these in your deployment platform:

- `DATABASE_URL` - Your Neon database connection string
- `ADMIN_PASSWORD` - Your admin password
- `NEXTAUTH_SECRET` - A random secret key

## Customization

### Change Fonts

Edit `tailwind.config.ts` and `app/layout.tsx` to use different Google Fonts.

### Add More Categories

Edit the `CATEGORIES` array in `components/blog/post-editor.tsx`.

### Modify Color Scheme

Update the CSS variables in `app/globals.css` under `:root` and `.dark`.

### Custom Animations

Framer Motion animations can be customized in individual components.

## Troubleshooting

### Database Connection Issues

- Verify your `DATABASE_URL` is correct
- Ensure your Neon database is active
- Check that you've run `npx prisma db push`

### Login Not Working

- Verify `ADMIN_PASSWORD` is set in `.env`
- Clear browser cookies and try again
- Check browser console for errors

### Posts Not Appearing

- Ensure posts are marked as "published"
- Check the category filter settings
- Verify database contains posts (`npx prisma studio`)

## Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npx prisma studio    # Open Prisma database GUI
npx prisma generate  # Regenerate Prisma client
```

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues or questions, please check the code comments or create an issue in your repository.

---

Built with ❤️ using Next.js and modern web technologies.
