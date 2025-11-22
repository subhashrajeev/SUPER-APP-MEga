# IVR INTERIORS - Web Super App

> **Production-grade business management platform for interior design companies**

A comprehensive, modern web application built with Next.js 14, TypeScript, Prisma, and PostgreSQL. This super app unifies **27 powerful business modules** into one elegant, performant solution.

![IVR INTERIORS](./public/images/ivr-visiting-card.jpg)

## 🌟 Features

### Complete Suite of 27 Integrated Modules

1. **Dashboard** - Customizable widgets with real-time analytics
2. **Leads CRM** - Full pipeline management with Kanban board
3. **Quotation Builder** - Professional quotes with PDF generation
4. **Project Management** - Gantt timeline, phases, and milestones
5. **Inventory & Stock** - SKU-based inventory with reorder alerts
6. **Site Measurement** - Photo annotation with Konva canvas
7. **Materials Catalog** - Searchable catalog with filters
8. **Agreements & Invoices** - Automated PDF generation
9. **Employee Management** - Attendance, tasks, payroll summaries
10. **Appointment Booking** - Calendar with Google Calendar sync
11. **Route Optimizer** - Mapbox integration with TSP fallback
12. **Service Tickets** - Warranty and post-installation support
13. **Payments & EMI** - Payment tracking with EMI calculator
14. **Vendor Management** - Purchase orders and price lists
15. **AI Content Generator** - LLM-powered social media captions
16. **Client Portal** - Secure tokenized client access
17. **Cost Estimator** - Public-facing calculator widget
18. **Before/After Showcase** - Interactive comparison sliders
19. **Floorplan Analyzer** - ML-powered floor plan analysis (POC)
20. **Price Tracker** - Material price history and alerts
21. **Virtual Showroom** - 3D models with React Three Fiber
22. **AR Measurement** - WebXR-based AR tools (POC)
23. **Marketing Analytics** - Campaign performance tracking
24. **Notifications** - Unified notification center with activity log
25. **Administration** - Role-based access control (RBAC)
26. **PWA & Offline** - Service worker with offline sync queue
27. **Integrations** - Pluggable adapters for external services

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: TailwindCSS with custom design system
- **UI Components**: Radix UI primitives
- **Animations**: Framer Motion + Lottie
- **3D Rendering**: React Three Fiber
- **State Management**: Zustand + React Query
- **Authentication**: JWT with bcrypt
- **File Storage**: Supabase Storage
- **PDF Generation**: Puppeteer (server-side)
- **AI Integration**: OpenAI, Anthropic Claude
- **Payment**: Stripe, Razorpay
- **Maps**: Mapbox (with fallback algorithm)
- **Email**: Nodemailer (SMTP)
- **Analytics**: Vercel Analytics, PostHog (optional)
- **Testing**: Jest, Playwright
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18.17+
- pnpm 8.0+
- PostgreSQL 14+
- Git

## ⚡ Quick Start

### 1. Clone the Repository

\`\`\`bash
git clone <repository-url>
cd SUPER-APP-MEga
\`\`\`

### 2. Install Dependencies

\`\`\`bash
pnpm install
\`\`\`

### 3. Environment Setup

Copy the environment template:

\`\`\`bash
cp .env.example .env
\`\`\`

**Required Environment Variables:**

\`\`\`env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ivr_interiors"
DIRECT_URL="postgresql://user:password@localhost:5432/ivr_interiors"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Auth (generate 32+ character secrets)
JWT_SECRET="your-secret-key-here"
SESSION_SECRET="your-session-secret-here"
\`\`\`

**Optional (for full functionality):**

See `.env.example` for complete list of integrations:
- Supabase (file storage)
- Stripe/Razorpay (payments)
- Mapbox (maps & routing)
- OpenAI/Claude (AI features)
- SMTP (emails)
- Twilio (WhatsApp)
- Remove.bg (image processing)

### 4. Database Setup

\`\`\`bash
# Generate Prisma client
pnpm db:generate

# Push schema to database
pnpm db:push

# Seed with demo data
pnpm db:seed
\`\`\`

### 5. Run Setup Script

\`\`\`bash
# Copies brand assets and completes setup
pnpm setup
\`\`\`

### 6. Start Development Server

\`\`\`bash
pnpm dev
\`\`\`

Visit [http://localhost:3000](http://localhost:3000)

## 🔐 Demo Credentials

| Role            | Email             | Password  |
|-----------------|-------------------|-----------|
| Admin           | demo@ivr.local    | Demo123!  |
| Sales           | sales@ivr.local   | Demo123!  |
| Project Manager | pm@ivr.local      | Demo123!  |
| Technician      | tech@ivr.local    | Demo123!  |

## 📂 Project Structure

\`\`\`
ivr-interiors-super-app/
├── app/                      # Next.js 14 App Router
│   ├── (auth)/              # Auth routes (login, register)
│   ├── dashboard/           # Dashboard module
│   ├── leads/               # Leads CRM
│   ├── quotations/          # Quotation builder
│   ├── projects/            # Project management
│   ├── [...other modules]   # 23 more modules
│   ├── api/                 # API routes
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/              # React components
│   ├── ui/                  # Reusable UI components
│   ├── modules/             # Module-specific components
│   └── providers.tsx        # Context providers
├── lib/                     # Utility libraries
│   ├── db.ts               # Prisma client
│   ├── auth.ts             # Authentication utilities
│   └── utils.ts            # Helper functions
├── services/                # Business logic & integrations
│   ├── ai-adapter/         # AI service adapters
│   ├── pdf/                # PDF generation
│   ├── supabase/           # Supabase client
│   └── integrations/       # External service integrations
├── prisma/                  # Database
│   ├── schema.prisma       # Database schema (all 27 modules)
│   └── seed.ts             # Seed script
├── public/                  # Static assets
│   └── images/             # Brand assets
├── scripts/                 # Utility scripts
│   └── copy-brand-asset.sh # Setup script
├── deployment/              # Deployment configs
├── tests/                   # Test files
├── .env.example             # Environment template
├── next.config.js           # Next.js config (with PWA)
├── tailwind.config.ts       # Tailwind config
├── tsconfig.json            # TypeScript config
└── package.json             # Dependencies
\`\`\`

## 🏗️ Architecture

### Database Schema

Complete schema covering all 27 modules with:
- 50+ models
- Proper relationships and indexes
- Full-text search support
- Optimized queries

### Authentication & Authorization

- JWT-based sessions (7-day expiry)
- Role-based access control (RBAC)
- 6 user roles: SUPERADMIN, ADMIN, PROJECT_MANAGER, SALES, TECHNICIAN, CLIENT
- Permission-based feature access
- Secure password hashing with bcrypt

### API Layer

- Next.js Server Actions for mutations
- API routes for complex operations
- Middleware for auth & rate limiting
- Input validation with Zod

### File Storage

- Supabase Storage for uploaded files
- Organized buckets (projects, measurements, materials)
- Signed URLs for secure access
- Automatic cleanup policies

### PDF Generation

- Server-side: Puppeteer for production PDFs
- Client-side fallback: html2canvas + jsPDF
- Templates for quotations, invoices, agreements, reports

### AI Features

- Pluggable adapters (OpenAI, Claude)
- Template-based prompts (see PROMPTS.md)
- Image generation (DALL·E 3)
- Background removal (Remove.bg)
- Social media content generation

### Offline Support

- Service Worker caching
- IndexedDB for offline data
- Sync queue for pending mutations
- Background sync when online

## 🛠️ Development

### Available Scripts

\`\`\`bash
pnpm dev              # Start dev server
pnpm build            # Production build
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm type-check       # TypeScript check
pnpm test             # Run unit tests
pnpm test:e2e         # Run E2E tests
pnpm db:generate      # Generate Prisma client
pnpm db:push          # Push schema to DB
pnpm db:seed          # Seed database
pnpm db:studio        # Open Prisma Studio
pnpm db:reset         # Reset database
pnpm format           # Format code
\`\`\`

### Testing

**Unit Tests (Jest):**
\`\`\`bash
pnpm test
\`\`\`

**E2E Tests (Playwright):**
\`\`\`bash
pnpm test:e2e
\`\`\`

Test coverage includes:
- Core utilities (auth, utils, calculations)
- Key user flows (create lead → quotation → invoice → project)
- PDF generation
- API routes

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Configure environment variables
4. Deploy

**Environment Variables to Set:**
- All from `.env.example`
- Set `DATABASE_URL` to production PostgreSQL (Supabase/Neon/Railway)
- Add API keys for enabled integrations

### Manual Deployment

\`\`\`bash
pnpm build
pnpm start
\`\`\`

### Database Migration

\`\`\`bash
# Production migration
pnpm db:migrate:deploy
\`\`\`

## 📱 PWA Setup

The app is PWA-ready with:
- Service worker auto-generated by `next-pwa`
- Offline caching for assets and API responses
- Install prompt for mobile
- Icons and manifest included

## 🔌 Integration Setup

### Stripe Payment

1. Create Stripe account
2. Get API keys from dashboard
3. Add to `.env`:
   \`\`\`
   STRIPE_SECRET_KEY=sk_...
   STRIPE_PUBLISHABLE_KEY=pk_...
   \`\`\`

### Mapbox Routing

1. Sign up at mapbox.com
2. Get access token
3. Add to `.env`:
   \`\`\`
   NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.eyJ1...
   \`\`\`

### OpenAI (AI Features)

1. Get API key from platform.openai.com
2. Add to `.env`:
   \`\`\`
   OPENAI_API_KEY=sk-proj-...
   \`\`\`

See [SECURITY.md](./SECURITY.md) for security best practices.

## 📊 Performance

- Lighthouse score: 85+ (mobile)
- First Contentful Paint: <1.5s
- Time to Interactive: <3s
- Code splitting and lazy loading
- Image optimization with next/image
- Database query optimization with indexes

## 🌍 Localization

Supports 3 languages:
- English (default)
- Telugu (తెలుగు)
- Hindi (हिन्दी)

Add translations in `locales/` directory.

## 🔒 Security

- XSS protection
- CSRF tokens
- SQL injection prevention (Prisma)
- Rate limiting on public endpoints
- Secure headers
- Environment variable validation

See [SECURITY.md](./SECURITY.md) for details.

## 📈 Scaling Considerations

- **Database**: Use connection pooling (PgBouncer)
- **Caching**: Add Redis for session/cache
- **Media**: Move to CDN (Cloudflare, CloudFront)
- **Background Jobs**: Queue system (Bull, BullMQ)
- **Monitoring**: Sentry for errors, Datadog for metrics

## 🤝 Contributing

This is a production codebase for IVR INTERIORS. For feature requests or bug reports, contact the development team.

## 📄 License

Proprietary. All rights reserved by IVR INTERIORS.

See [COPYRIGHT.md](./COPYRIGHT.md) for details.

## 📞 Support

- **Email**: dev@ivrinteriors.com
- **Documentation**: See `/docs` folder
- **API Docs**: See [PROMPTS.md](./PROMPTS.md)

## ✅ First 10 Things to Do After Deploy

1. ✅ **Change all default secrets** in environment variables
2. ✅ **Configure production database** (Supabase/Neon/Railway)
3. ✅ **Run database migrations** (`pnpm db:migrate:deploy`)
4. ✅ **Seed initial data** or import from existing system
5. ✅ **Set up Stripe** for payments (get live keys)
6. ✅ **Configure SMTP** for email notifications
7. ✅ **Add Mapbox token** for routing features
8. ✅ **Set up Sentry** for error monitoring
9. ✅ **Configure analytics** (PostHog/Plausible)
10. ✅ **Test critical flows**: Lead → Quote → Invoice → Project

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Offline-first architecture
- [ ] Real-time collaboration
- [ ] Advanced analytics dashboard
- [ ] Workflow automation builder
- [ ] Integration marketplace

---

**Built with ❤️ for IVR INTERIORS**

*Version 1.0.0 | 2025*
