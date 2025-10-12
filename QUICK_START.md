# 🚀 Quick Start Guide

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database
- Git installed

## Installation Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/MontherIsmail/Portfolio.git
   cd Portfolio
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp env.example .env.local
   # Edit .env.local with your actual values
   ```

4. **Set up the database**

   ```bash
   npm run db:push
   npm run db:generate
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## Project Structure

```
Portfolio/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Homepage
│   │   └── globals.css     # Global styles
│   ├── components/         # React components
│   │   ├── layout/        # Layout components
│   │   ├── sections/      # Page sections
│   │   └── ui/           # UI components
│   ├── lib/              # Utilities
│   └── types/            # TypeScript types
├── prisma/               # Database schema
├── public/              # Static assets
└── docs/               # Documentation
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push database schema
- `npm run db:generate` - Generate Prisma client
- `npm run db:studio` - Open Prisma Studio

## Next Steps

1. Create GitHub issues using the provided template
2. Start with Issue #1: Project Setup & Configuration
3. Follow the development roadmap
4. Create pull requests for each completed issue

## Support

- Check the `GITHUB_ISSUES_CREATION_GUIDE.md` for detailed issue templates
- Review the `README.md` for project overview
- Follow the development roadmap in the issues
