# Monther Alzamli Portfolio

A modern, dynamic portfolio website with an admin dashboard for content management.

## 🚀 Features

- **Modern Frontend**: Built with Next.js 14, TypeScript, and Tailwind CSS
- **Admin Dashboard**: Secure content management without code changes
- **Responsive Design**: Mobile-first approach with beautiful animations
- **SEO Optimized**: Built-in SEO features for better search visibility
- **Image Management**: Cloudinary integration for easy image uploads
- **Authentication**: Secure admin access with NextAuth.js

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **Image Storage**: Cloudinary
- **Deployment**: VPS with PM2 and NGINX

## 📋 Project Structure

```
portfolio/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── page.tsx        # Homepage
│   │   ├── about/          # About page
│   │   ├── projects/       # Projects pages
│   │   └── dashboard/      # Admin dashboard
│   ├── components/         # Reusable UI components
│   ├── lib/               # Utilities and configurations
│   └── types/             # TypeScript type definitions
├── prisma/                # Database schema
├── public/               # Static assets
└── docs/                # Documentation
```

## 🎯 Development Roadmap

This project is being developed incrementally through GitHub issues and pull requests:

### Phase 1: Foundation

- [x] Project setup and configuration
- [ ] Database schema and Prisma setup
- [ ] Basic API routes

### Phase 2: Frontend

- [ ] Portfolio homepage components
- [ ] About, Skills, and Projects sections
- [ ] Contact form and responsive design

### Phase 3: Admin Dashboard

- [ ] Authentication system
- [ ] CRUD operations for content management
- [ ] Image upload functionality

### Phase 4: Polish & Deploy

- [ ] SEO optimization
- [ ] Performance improvements
- [ ] Deployment configuration

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run database migrations: `npm run db:push`
5. Start development server: `npm run dev`

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Monther Alzamli**

- GitHub: [@MontherIsmail](https://github.com/MontherIsmail)
- LinkedIn: [Monther Alzamli](https://linkedin.com/in/MontherAlzamli)
- Portfolio: [montheralzamli.com](https://montheralzamli.com)
