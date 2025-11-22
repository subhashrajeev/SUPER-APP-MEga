# Package Versions and Rationale

This document explains the technology choices and package versions used in the IVR INTERIORS Web Super App.

## Core Framework

### Next.js 14.1.0
**Rationale**: Latest stable version with App Router, Server Actions, and excellent performance. Provides:
- File-based routing
- Server-side rendering (SSR)
- Static site generation (SSG)
- API routes
- Built-in image optimization
- Excellent TypeScript support

### React 18.2.0
**Rationale**: Latest stable React with concurrent features, automatic batching, and Suspense improvements.

### TypeScript 5.3.3
**Rationale**: Latest stable version for type safety, improved developer experience, and reduced runtime errors.

## Database & ORM

### Prisma 5.8.1
**Rationale**: Modern ORM with excellent TypeScript support, migrations, and type-safe database queries.
- Auto-generated TypeScript types
- Migration system
- Prisma Studio for database browsing
- Connection pooling
- Query optimization

### PostgreSQL (via DATABASE_URL)
**Rationale**: Enterprise-grade relational database with:
- ACID compliance
- Full-text search
- JSON support
- Excellent performance
- Wide hosting options (Supabase, Neon, Railway)

## UI & Styling

### TailwindCSS 3.4.0
**Rationale**: Utility-first CSS framework for rapid UI development:
- Small bundle size (purges unused styles)
- Consistent design system
- Responsive utilities
- Dark mode support
- Excellent developer experience

### Radix UI (various)
**Rationale**: Unstyled, accessible component primitives:
- WCAG 2.1 compliant
- Keyboard navigation
- Screen reader support
- Highly customizable
- No runtime styles (works with Tailwind)

Packages:
- `@radix-ui/react-dialog` - Modals
- `@radix-ui/react-dropdown-menu` - Dropdowns
- `@radix-ui/react-select` - Select inputs
- `@radix-ui/react-toast` - Notifications
- And more...

### class-variance-authority 0.7.0
**Rationale**: For building type-safe variant-based component APIs (used in Button, Badge, etc.)

### tailwind-merge 2.2.0
**Rationale**: Intelligently merge Tailwind classes without conflicts

### tailwindcss-animate 1.0.7
**Rationale**: Pre-built animation utilities for Tailwind

## Animation & Motion

### Framer Motion 10.18.0
**Rationale**: Production-ready motion library for React:
- Declarative animations
- Gestures and drag
- Layout animations
- Server-side rendering support
- Excellent performance

### Lottie React 2.4.0
**Rationale**: Airbnb's Lottie for vector animations:
- Lightweight JSON animations
- Created in After Effects
- Better than GIFs
- Scalable and crisp

## 3D & Graphics

### React Three Fiber 8.15.13
**Rationale**: React renderer for Three.js:
- Declarative 3D
- Component-based
- Excellent performance
- Full Three.js API access

### @react-three/drei 9.92.7
**Rationale**: Useful helpers and abstractions for R3F:
- Pre-built components
- Camera controls
- Loaders
- Effects

### Three.js 0.160.0
**Rationale**: Industry-standard WebGL library for 3D graphics

### Konva 9.3.1 & React-Konva 18.2.10
**Rationale**: 2D canvas library for measurement annotations:
- High performance
- Event handling
- Export to images
- Mobile touch support

## State Management

### Zustand 4.4.7
**Rationale**: Lightweight state management:
- Minimal boilerplate
- No context providers needed
- TypeScript-first
- Devtools support
- 1.2kb gzipped

### @tanstack/react-query 5.17.9
**Rationale**: Powerful async state management:
- Caching
- Background refetching
- Optimistic updates
- Pagination
- Infinite scroll

### @tanstack/react-table 8.11.2
**Rationale**: Headless table library:
- Sorting, filtering, pagination
- Column resizing
- Row selection
- Virtual scrolling
- Framework agnostic core

## Authentication & Security

### jose 5.2.0
**Rationale**: Modern JWT library:
- Small bundle size
- Works in Edge runtime
- Full JWT/JWE/JWS support
- TypeScript-first

### bcryptjs 2.4.3
**Rationale**: Password hashing:
- Industry standard
- Configurable rounds
- Salt generation
- Pure JavaScript (no native deps)

## File Handling

### @supabase/supabase-js 2.39.3
**Rationale**: Supabase client for:
- File storage
- Authentication (optional)
- Real-time subscriptions
- Database access

### @supabase/auth-helpers-nextjs 0.8.7
**Rationale**: Next.js-specific Supabase helpers

## PDF Generation

### Puppeteer 21.7.0
**Rationale**: Headless Chrome for server-side PDF generation:
- Full CSS support
- JavaScript execution
- High-quality PDFs
- Screenshots
- Production-ready

### jsPDF 2.5.1
**Rationale**: Client-side PDF generation fallback:
- No server required
- Works in browser
- Smaller bundle

### html2canvas 1.4.1
**Rationale**: Convert DOM to canvas for client-side PDF:
- Screenshot capability
- Works with jsPDF
- Fallback for Puppeteer

## Image Processing

### Sharp 0.33.1
**Rationale**: High-performance image processing:
- Resize, crop, rotate
- Format conversion
- Color manipulation
- Fast (uses libvips)
- Works in Next.js API routes

## AI Integration

### OpenAI 4.24.1
**Rationale**: Official OpenAI SDK:
- GPT-4 Turbo
- DALL·E 3
- Embeddings
- TypeScript support
- Streaming

## Payment Processing

### Stripe 14.12.0
**Rationale**: Payment processing:
- International support
- Strong API
- Excellent docs
- Webhook support
- Comprehensive features

## Email

### Nodemailer 6.9.8
**Rationale**: Email sending:
- SMTP support
- Attachments
- HTML emails
- Template support
- Reliable

## Data Handling

### Zod 3.22.4
**Rationale**: TypeScript-first schema validation:
- Runtime validation
- Type inference
- Composable schemas
- Error messages
- Used with React Hook Form

### react-hook-form 7.49.3
**Rationale**: Performant form library:
- Minimal re-renders
- Zod integration
- Validation
- TypeScript support

### date-fns 3.0.6
**Rationale**: Modern date utility library:
- Tree-shakeable
- Immutable
- TypeScript support
- i18n support
- Smaller than Moment.js

## UI Enhancements

### react-beautiful-dnd 13.1.1
**Rationale**: Drag and drop for Kanban boards:
- Accessible
- Smooth animations
- Flexible
- Mobile support

### react-dropzone 14.2.3
**Rationale**: File upload with drag & drop:
- Multiple files
- Validation
- Preview
- Accessible

### recharts 2.10.3
**Rationale**: Composable charting library:
- Built on D3
- Responsive
- Customizable
- TypeScript support

## PWA

### next-pwa 5.6.0
**Rationale**: PWA support for Next.js:
- Service worker generation
- Precaching
- Runtime caching
- Offline support

## Development Tools

### ESLint 8.56.0
**Rationale**: Code quality and consistency

### Prettier 3.1.1
**Rationale**: Code formatting

### prettier-plugin-tailwindcss 0.5.10
**Rationale**: Sort Tailwind classes automatically

## Testing

### Jest 29.7.0
**Rationale**: Unit testing framework:
- Fast
- Snapshot testing
- Mocking
- Coverage reports

### @playwright/test 1.40.1
**Rationale**: E2E testing:
- Cross-browser
- Auto-wait
- Screenshots
- Trace viewer
- Parallel execution

### @testing-library/react 14.1.2
**Rationale**: Testing utilities:
- User-centric queries
- Accessible
- Best practices

## Analytics & Monitoring

### @vercel/analytics 1.1.1
**Rationale**: Web analytics:
- Privacy-friendly
- Zero config on Vercel
- Performance insights

### @vercel/speed-insights 1.0.2
**Rationale**: Core Web Vitals:
- Real user monitoring
- Performance tracking

## Utilities

### uuid 9.0.1
**Rationale**: Generate unique IDs

### clsx 2.1.0
**Rationale**: Conditional className utility

### lucide-react 0.303.0
**Rationale**: Modern icon library:
- Tree-shakeable
- Consistent design
- TypeScript support
- 1000+ icons

### react-hot-toast 2.4.1
**Rationale**: Toast notifications:
- Lightweight
- Customizable
- Accessible
- Promise-based

## Version Policy

- **Dependencies**: We use exact versions to ensure reproducible builds
- **Updates**: Security updates applied immediately, feature updates quarterly
- **Testing**: All updates tested in staging before production
- **LTS**: Prefer LTS versions for core dependencies

## Package Manager

### pnpm 8.0+
**Rationale**: Fast, disk-space efficient package manager:
- Faster than npm/yarn
- Strict node_modules
- Workspace support
- Content-addressable storage

## Hosting Recommendations

### Vercel (Recommended)
- Zero-config Next.js deployment
- Edge functions
- Analytics included
- Excellent DX

### Alternative Hosting
- **Railway**: Database + app hosting
- **Supabase**: Database + storage + auth
- **Neon**: Serverless PostgreSQL
- **Fly.io**: Global deployment

---

**Last Updated**: January 2025
**Maintained By**: IVR INTERIORS Development Team
