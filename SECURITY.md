# Security Guidelines

This document outlines security best practices and guidelines for the IVR INTERIORS Web Super App.

## Table of Contents

1. [Environment Variables](#environment-variables)
2. [Authentication & Authorization](#authentication--authorization)
3. [Data Protection](#data-protection)
4. [API Security](#api-security)
5. [Input Validation](#input-validation)
6. [File Upload Security](#file-upload-security)
7. [Database Security](#database-security)
8. [Third-Party Integrations](#third-party-integrations)
9. [Production Hardening](#production-hardening)
10. [Incident Response](#incident-response)

---

## Environment Variables

### Critical Variables

**NEVER commit these to version control:**

\`\`\`bash
# Authentication Secrets (REQUIRED - Generate 32+ character random strings)
JWT_SECRET=
SESSION_SECRET=
NEXTAUTH_SECRET=

# Database (Use strong passwords)
DATABASE_URL=
DIRECT_URL=

# Payment Gateways (Keep SECRET keys secure)
STRIPE_SECRET_KEY=
RAZORPAY_KEY_SECRET=

# Supabase (SERVICE_ROLE has admin access)
SUPABASE_SERVICE_ROLE_KEY=

# API Keys
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
MAPBOX_SECRET_TOKEN=
REMOVE_BG_API_KEY=

# Email
SMTP_PASSWORD=

# Twilio
TWILIO_AUTH_TOKEN=
\`\`\`

### Generate Secure Secrets

\`\`\`bash
# Method 1: OpenSSL
openssl rand -base64 32

# Method 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Method 3: Online (use trusted sources only)
# https://www.uuidgenerator.net/
\`\`\`

### Environment Variable Validation

The app validates required environment variables on startup:

\`\`\`typescript
// Add to lib/env.ts
export function validateEnv() {
  const required = ['DATABASE_URL', 'JWT_SECRET', 'SESSION_SECRET'];

  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }
}
\`\`\`

### Production vs Development

Use different secrets for each environment:

\`\`\`
Development: .env.local (gitignored)
Staging: Vercel Environment Variables
Production: Vercel Environment Variables (different from staging)
\`\`\`

---

## Authentication & Authorization

### Password Security

**Implemented:**
- bcrypt hashing with 10 rounds (adjustable in `lib/auth.ts`)
- No plaintext password storage
- Password strength requirements (enforced client-side)

**Best Practices:**
\`\`\`typescript
// Minimum requirements
- 8+ characters
- 1 uppercase letter
- 1 lowercase letter
- 1 number
- 1 special character
\`\`\`

### JWT Sessions

**Configuration:**
- 7-day expiry (configurable)
- HS256 algorithm
- Refresh tokens recommended for production

**Token Storage:**
- HttpOnly cookies (prevents XSS)
- Secure flag in production
- SameSite=Strict

\`\`\`typescript
// Set secure cookies
cookies().set('session', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60, // 7 days
});
\`\`\`

### Role-Based Access Control (RBAC)

**Implemented Roles:**
- SUPERADMIN: Full access
- ADMIN: Most features
- PROJECT_MANAGER: Projects, leads
- SALES: Leads, quotations
- TECHNICIAN: Projects, service tickets
- CLIENT: Read-only portal access

**Check Permissions:**
\`\`\`typescript
import { requireRole } from '@/lib/auth';

export async function DELETE(request: Request) {
  await requireRole(['SUPERADMIN', 'ADMIN']);
  // ... delete logic
}
\`\`\`

### Multi-Factor Authentication (MFA)

**Recommended for Production:**
- OTP via SMS (Twilio)
- TOTP (Google Authenticator)
- Email verification

Currently not implemented - add to roadmap for v2.

---

## Data Protection

### Personal Identifiable Information (PII)

**Protected Fields:**
- User emails
- Phone numbers
- Addresses
- Payment information
- ID documents

**Guidelines:**
1. Encrypt at rest (database level)
2. Encrypt in transit (HTTPS only)
3. Minimize PII collection
4. Provide data export (GDPR compliance)
5. Implement data deletion

### Data Encryption

**In Transit:**
- HTTPS enforced (configured in `next.config.js`)
- TLS 1.2+ required
- HSTS headers

**At Rest:**
- Database: Use encrypted PostgreSQL (Supabase provides this)
- File storage: Supabase Storage encryption
- Backups: Encrypted backups

### Data Retention

**Policy:**
- Active users: Indefinite
- Inactive users (2+ years): Archive
- Deleted accounts: 90-day soft delete, then purge
- Audit logs: 2 years

**Implementation:**
\`\`\`sql
-- Add deleted_at timestamp for soft deletes
ALTER TABLE users ADD COLUMN deleted_at TIMESTAMP;

-- Scheduled job to purge after 90 days
DELETE FROM users
WHERE deleted_at < NOW() - INTERVAL '90 days';
\`\`\`

---

## API Security

### Rate Limiting

**Implemented in middleware:**

\`\`\`typescript
// middleware.ts
import { Ratelimit } from '@upstash/ratelimit';

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(10, '10 s'),
});

export async function middleware(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1';
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    );
  }

  return NextResponse.next();
}
\`\`\`

**Limits:**
- Public endpoints: 100 requests/hour per IP
- Authenticated: 1000 requests/hour per user
- File uploads: 10 uploads/hour per user

### CORS Configuration

\`\`\`typescript
// next.config.js headers
{
  key: 'Access-Control-Allow-Origin',
  value: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
}
\`\`\`

### API Key Rotation

**Schedule:**
- Development keys: Never (but don't use in production)
- Production keys: Every 90 days
- After suspected breach: Immediately

### Webhook Security

**Verify webhook signatures:**

\`\`\`typescript
// Stripe webhook
import { headers } from 'next/headers';
import Stripe from 'stripe';

const signature = headers().get('stripe-signature');
const event = stripe.webhooks.constructEvent(
  body,
  signature,
  process.env.STRIPE_WEBHOOK_SECRET
);
\`\`\`

---

## Input Validation

### Server-Side Validation (Required)

**Never trust client input. Always validate on server:**

\`\`\`typescript
import { z } from 'zod';

const LeadSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().optional(),
  phone: z.string().regex(/^[+]?[0-9]{10,15}$/),
  budget: z.number().positive().optional(),
});

export async function createLead(data: unknown) {
  const validated = LeadSchema.parse(data); // Throws if invalid
  // ... create lead
}
\`\`\`

### SQL Injection Prevention

**Prisma protects automatically:**
\`\`\`typescript
// SAFE - Prisma parameterizes queries
const user = await prisma.user.findUnique({
  where: { email: userInput },
});

// NEVER do raw SQL with user input:
// UNSAFE: prisma.$queryRaw`SELECT * FROM users WHERE email = '${email}'`
\`\`\`

### XSS Prevention

**React escapes by default, but be careful with:**

\`\`\`typescript
// UNSAFE
<div dangerouslySetInnerHTML={{ __html: userContent }} />

// SAFE - sanitize first
import DOMPurify from 'isomorphic-dompurify';
<div dangerouslySetInnerHTML={{
  __html: DOMPurify.sanitize(userContent)
}} />
\`\`\`

### CSRF Protection

**Next.js Server Actions include CSRF protection automatically.**

For API routes, use CSRF tokens:
\`\`\`typescript
import { csrf } from '@/lib/csrf';

export async function POST(request: Request) {
  await csrf.verify(request);
  // ... handle request
}
\`\`\`

---

## File Upload Security

### Allowed File Types

\`\`\`typescript
const ALLOWED_TYPES = {
  images: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  documents: ['application/pdf'],
  models: ['model/gltf-binary', 'model/gltf+json'],
};

function validateFileType(file: File, category: keyof typeof ALLOWED_TYPES) {
  if (!ALLOWED_TYPES[category].includes(file.type)) {
    throw new Error('Invalid file type');
  }
}
\`\`\`

### File Size Limits

\`\`\`typescript
const MAX_FILE_SIZE = {
  image: 5 * 1024 * 1024,      // 5MB
  document: 10 * 1024 * 1024,   // 10MB
  model: 20 * 1024 * 1024,      // 20MB
};
\`\`\`

### Scan for Malware

**Recommended (not implemented):**
- ClamAV integration
- VirusTotal API
- AWS S3 Malware Scanning

### Secure File Storage

\`\`\`typescript
// Store with random names
import { randomUUID } from 'crypto';

const filename = `${randomUUID()}-${Date.now()}.${extension}`;
const path = `projects/${projectId}/${filename}`;
\`\`\`

### Signed URLs for Private Files

\`\`\`typescript
import { getSignedUrl } from '@/services/supabase/client';

const signedUrl = await getSignedUrl('private-bucket', filePath, 3600);
// URL expires in 1 hour
\`\`\`

---

## Database Security

### Connection Security

\`\`\`env
# Use SSL for production
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
\`\`\`

### Prepared Statements

Prisma uses prepared statements automatically. No additional work needed.

### Principle of Least Privilege

\`\`\`sql
-- Create limited user for app
CREATE USER app_user WITH PASSWORD 'strong_password';

-- Grant only necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;

-- Don't grant DROP, TRUNCATE, or other dangerous permissions
\`\`\`

### Database Backups

**Automated backups:**
- Daily backups (Supabase does this)
- Weekly full backups
- Monthly archival

**Test restore procedure quarterly.**

### Audit Logs

**Log all sensitive operations:**
\`\`\`typescript
await prisma.activityLog.create({
  data: {
    userId: user.id,
    action: 'DELETE_PROJECT',
    entity: 'Project',
    entityId: projectId,
    ipAddress: request.ip,
    userAgent: request.headers.get('user-agent'),
  },
});
\`\`\`

---

## Third-Party Integrations

### API Key Management

**Never hardcode keys. Use environment variables.**

\`\`\`typescript
// WRONG
const stripe = new Stripe('sk_live_...');

// RIGHT
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
\`\`\`

### Verify Webhook Signatures

All webhooks (Stripe, Razorpay, Twilio) must verify signatures.

### Third-Party Scripts

**Avoid loading third-party scripts when possible.**

If required:
\`\`\`typescript
// Use Next.js Script component with strategy
import Script from 'next/script';

<Script
  src="https://trusted-cdn.com/script.js"
  strategy="lazyOnload"
  integrity="sha384-..."
  crossOrigin="anonymous"
/>
\`\`\`

### Dependency Security

\`\`\`bash
# Check for vulnerabilities
pnpm audit

# Fix automatically
pnpm audit fix

# Update dependencies
pnpm update
\`\`\`

Run `pnpm audit` before every deployment.

---

## Production Hardening

### Security Headers

**Configured in `next.config.js`:**

\`\`\`javascript
{
  key: 'X-Content-Type-Options',
  value: 'nosniff',
},
{
  key: 'X-Frame-Options',
  value: 'DENY',
},
{
  key: 'X-XSS-Protection',
  value: '1; mode=block',
},
{
  key: 'Referrer-Policy',
  value: 'strict-origin-when-cross-origin',
},
{
  key: 'Content-Security-Policy',
  value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; ...",
},
\`\`\`

### HTTPS Enforcement

**Vercel enforces HTTPS automatically.**

For custom hosting:
\`\`\`nginx
# Nginx redirect
server {
    listen 80;
    return 301 https://$host$request_uri;
}
\`\`\`

### Disable Debug Mode

\`\`\`env
# Production
NODE_ENV=production
NEXT_PUBLIC_DEBUG=false
\`\`\`

### Error Handling

**Don't leak sensitive info in errors:**

\`\`\`typescript
try {
  // ... operation
} catch (error) {
  console.error('Error details:', error); // Server logs only

  return NextResponse.json(
    { error: 'An error occurred' }, // Generic message to client
    { status: 500 }
  );
}
\`\`\`

### Monitoring & Alerts

**Set up:**
- Error tracking (Sentry)
- Uptime monitoring
- Security scanning
- Anomaly detection

---

## Incident Response

### In Case of Security Breach

1. **Immediate Actions:**
   - Rotate all secrets and API keys
   - Force logout all users
   - Disable affected features
   - Notify security team

2. **Investigation:**
   - Check audit logs
   - Review access logs
   - Identify affected users
   - Determine scope of breach

3. **Communication:**
   - Notify affected users (within 72 hours per GDPR)
   - Provide clear next steps
   - Offer support

4. **Recovery:**
   - Patch vulnerability
   - Restore from clean backup if needed
   - Enhanced monitoring

5. **Post-Mortem:**
   - Document what happened
   - How it was fixed
   - Preventive measures
   - Update security practices

### Security Contacts

- **Security Team**: security@ivrinteriors.com
- **Dev Team Lead**: dev@ivrinteriors.com
- **Emergency**: [Phone number]

---

## Security Checklist

### Before Each Deployment

- [ ] All environment variables set
- [ ] Secrets rotated (if scheduled)
- [ ] `pnpm audit` run and clean
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] Rate limiting active
- [ ] Backups verified
- [ ] Monitoring active
- [ ] Error tracking configured

### Monthly Review

- [ ] Review audit logs
- [ ] Update dependencies
- [ ] Check for failed login attempts
- [ ] Review API usage patterns
- [ ] Test backup restore
- [ ] Update security documentation

### Quarterly Review

- [ ] Rotate all secrets
- [ ] Security training for team
- [ ] Penetration testing
- [ ] Review access controls
- [ ] Update incident response plan

---

**Last Updated**: January 2025
**Security Officer**: [Name]
**Next Review**: April 2025

For security issues, contact: security@ivrinteriors.com
