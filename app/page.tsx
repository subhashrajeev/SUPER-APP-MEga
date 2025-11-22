import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LayoutDashboard,
  Users,
  FileText,
  FolderKanban,
  Package,
  Ruler,
  Palette,
  FileCheck,
  UserCog,
  Calendar,
  Route,
  Wrench,
  CreditCard,
  Building2,
  Sparkles,
  Lock,
  Calculator,
  ImagePlus,
  Layers,
  DollarSign,
  Box,
  Smartphone,
  BarChart3,
  Bell,
  Settings,
} from 'lucide-react';

const modules = [
  {
    title: 'Dashboard',
    description: 'Customizable widgets and quick actions',
    icon: LayoutDashboard,
    href: '/dashboard',
    color: 'from-blue-500 to-blue-600',
  },
  {
    title: 'Leads CRM',
    description: 'Lead management with Kanban pipeline',
    icon: Users,
    href: '/leads',
    color: 'from-purple-500 to-purple-600',
  },
  {
    title: 'Quotation Builder',
    description: 'Create and manage quotations',
    icon: FileText,
    href: '/quotations',
    color: 'from-green-500 to-green-600',
  },
  {
    title: 'Project Management',
    description: 'Track projects with Gantt timeline',
    icon: FolderKanban,
    href: '/projects',
    color: 'from-orange-500 to-orange-600',
  },
  {
    title: 'Inventory & Stock',
    description: 'Manage inventory and stock levels',
    icon: Package,
    href: '/inventory',
    color: 'from-red-500 to-red-600',
  },
  {
    title: 'Site Measurement',
    description: 'Photo annotation and measurements',
    icon: Ruler,
    href: '/measurements',
    color: 'from-teal-500 to-teal-600',
  },
  {
    title: 'Materials Catalog',
    description: 'Digital catalog with filters',
    icon: Palette,
    href: '/materials',
    color: 'from-pink-500 to-pink-600',
  },
  {
    title: 'Agreements & Invoices',
    description: 'Generate PDFs and manage billing',
    icon: FileCheck,
    href: '/invoices',
    color: 'from-indigo-500 to-indigo-600',
  },
  {
    title: 'Employee Management',
    description: 'Staff roster and attendance',
    icon: UserCog,
    href: '/employees',
    color: 'from-yellow-500 to-yellow-600',
  },
  {
    title: 'Appointments',
    description: 'Calendar and booking system',
    icon: Calendar,
    href: '/appointments',
    color: 'from-cyan-500 to-cyan-600',
  },
  {
    title: 'Route Optimizer',
    description: 'Optimize daily routes with maps',
    icon: Route,
    href: '/routes',
    color: 'from-lime-500 to-lime-600',
  },
  {
    title: 'Service Tickets',
    description: 'Warranty and service management',
    icon: Wrench,
    href: '/service-tickets',
    color: 'from-rose-500 to-rose-600',
  },
  {
    title: 'Payments & EMI',
    description: 'Payment tracking and EMI planner',
    icon: CreditCard,
    href: '/payments',
    color: 'from-violet-500 to-violet-600',
  },
  {
    title: 'Vendor Management',
    description: 'Vendors and purchase orders',
    icon: Building2,
    href: '/vendors',
    color: 'from-fuchsia-500 to-fuchsia-600',
  },
  {
    title: 'AI Content Generator',
    description: 'Generate captions and visuals',
    icon: Sparkles,
    href: '/ai-content',
    color: 'from-amber-500 to-amber-600',
  },
  {
    title: 'Client Portal',
    description: 'Secure client access portal',
    icon: Lock,
    href: '/client-portal',
    color: 'from-emerald-500 to-emerald-600',
  },
  {
    title: 'Cost Estimator',
    description: 'Public cost calculator widget',
    icon: Calculator,
    href: '/estimator',
    color: 'from-blue-400 to-blue-500',
  },
  {
    title: 'Before/After',
    description: 'Showcase transformations',
    icon: ImagePlus,
    href: '/before-after',
    color: 'from-purple-400 to-purple-500',
  },
  {
    title: 'Floorplan Analyzer',
    description: 'AI-powered floorplan analysis',
    icon: Layers,
    href: '/floorplan',
    color: 'from-green-400 to-green-500',
  },
  {
    title: 'Price Tracker',
    description: 'Material price history',
    icon: DollarSign,
    href: '/price-tracker',
    color: 'from-orange-400 to-orange-500',
  },
  {
    title: 'Virtual Showroom',
    description: '3D models and renders',
    icon: Box,
    href: '/showroom',
    color: 'from-red-400 to-red-500',
  },
  {
    title: 'AR Measurement',
    description: 'Augmented reality tools',
    icon: Smartphone,
    href: '/ar-measurement',
    color: 'from-teal-400 to-teal-500',
  },
  {
    title: 'Marketing Analytics',
    description: 'Campaign performance tracking',
    icon: BarChart3,
    href: '/analytics',
    color: 'from-pink-400 to-pink-500',
  },
  {
    title: 'Notifications',
    description: 'Activity log and alerts',
    icon: Bell,
    href: '/notifications',
    color: 'from-indigo-400 to-indigo-500',
  },
  {
    title: 'Administration',
    description: 'User roles and permissions',
    icon: Settings,
    href: '/admin',
    color: 'from-gray-500 to-gray-600',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-6">
              <div className="inline-block px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-soft mb-4">
                <span className="text-sm font-semibold text-gradient">
                  Complete Business Management Platform
                </span>
              </div>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold mb-6 text-gray-900">
              IVR INTERIORS
              <span className="block text-4xl md:text-5xl mt-4 text-gradient">
                Web Super App
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              Unified platform for interior design business management.
              <br />
              <span className="font-semibold">27 powerful modules</span> in one elegant solution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button size="lg" className="text-lg px-8 py-6 shadow-glow">
                  Open Dashboard
                </Button>
              </Link>
              <Link href="/estimator">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  Try Cost Estimator
                </Button>
              </Link>
            </div>

            {/* Demo Credentials */}
            <div className="mt-12 glass rounded-lg p-6 max-w-md mx-auto">
              <h3 className="font-semibold mb-3 text-gray-900">Demo Credentials</h3>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Email:</strong> demo@ivr.local
              </p>
              <p className="text-sm text-gray-600">
                <strong>Password:</strong> Demo123!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">All Modules at a Glance</h2>
          <p className="text-xl text-gray-600">
            Comprehensive suite of 27 integrated modules
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <Link key={module.href} href={module.href}>
                <Card className="h-full hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${module.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                    <CardDescription>{module.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="bg-white/50 backdrop-blur-sm py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Built with Modern Technology</h2>
            <p className="text-xl text-gray-600">Production-grade stack for 2025</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              'Next.js 14',
              'TypeScript',
              'Prisma ORM',
              'PostgreSQL',
              'TailwindCSS',
              'Framer Motion',
              'React Three Fiber',
              'Supabase',
            ].map((tech) => (
              <div
                key={tech}
                className="glass rounded-lg p-6 text-center font-semibold hover:shadow-soft-lg transition-shadow"
              >
                {tech}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-2">IVR INTERIORS</h3>
          <p className="text-gray-400 mb-4">Premium Interior Design Solutions</p>
          <p className="text-sm text-gray-500">
            © 2025 IVR INTERIORS. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
