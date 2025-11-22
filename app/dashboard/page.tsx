import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { prisma } from '@/lib/db';
import Link from 'next/link';
import {
  Users,
  FileText,
  FolderKanban,
  DollarSign,
  Calendar,
  Phone,
  MessageSquare,
  TrendingUp,
  Clock,
  CheckCircle2,
} from 'lucide-react';

async function getDashboardData() {
  const [
    totalLeads,
    openLeads,
    activeProjects,
    pendingInvoices,
    todayAppointments,
    outstandingAmount,
  ] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({
      where: {
        status: {
          in: ['NEW', 'CONTACTED', 'QUALIFIED'],
        },
      },
    }),
    prisma.project.count({
      where: {
        status: 'IN_PROGRESS',
      },
    }),
    prisma.invoice.count({
      where: {
        status: {
          in: ['SENT', 'OVERDUE', 'PARTIALLY_PAID'],
        },
      },
    }),
    prisma.appointment.count({
      where: {
        startTime: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lt: new Date(new Date().setHours(23, 59, 59, 999)),
        },
        status: {
          in: ['SCHEDULED', 'CONFIRMED'],
        },
      },
    }),
    prisma.invoice
      .aggregate({
        _sum: {
          dueAmount: true,
        },
        where: {
          status: {
            in: ['SENT', 'OVERDUE', 'PARTIALLY_PAID'],
          },
        },
      })
      .then((result) => result._sum.dueAmount || 0),
  ]);

  const recentLeads = await prisma.lead.findMany({
    take: 5,
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      name: true,
      phone: true,
      status: true,
      projectType: true,
      budget: true,
      createdAt: true,
    },
  });

  const upcomingAppointments = await prisma.appointment.findMany({
    take: 5,
    where: {
      startTime: {
        gte: new Date(),
      },
      status: {
        in: ['SCHEDULED', 'CONFIRMED'],
      },
    },
    orderBy: {
      startTime: 'asc',
    },
    select: {
      id: true,
      title: true,
      clientName: true,
      startTime: true,
      status: true,
    },
  });

  return {
    stats: {
      totalLeads,
      openLeads,
      activeProjects,
      pendingInvoices,
      todayAppointments,
      outstandingAmount,
    },
    recentLeads,
    upcomingAppointments,
  };
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  const statCards = [
    {
      title: 'Total Leads',
      value: data.stats.totalLeads,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      link: '/leads',
    },
    {
      title: 'Open Leads',
      value: data.stats.openLeads,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      link: '/leads',
    },
    {
      title: 'Active Projects',
      value: data.stats.activeProjects,
      icon: FolderKanban,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      link: '/projects',
    },
    {
      title: 'Pending Invoices',
      value: data.stats.pendingInvoices,
      icon: FileText,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      link: '/invoices',
    },
    {
      title: "Today's Appointments",
      value: data.stats.todayAppointments,
      icon: Calendar,
      color: 'text-teal-600',
      bgColor: 'bg-teal-100',
      link: '/appointments',
    },
    {
      title: 'Outstanding Payments',
      value: `₹${(data.stats.outstandingAmount / 100000).toFixed(1)}L`,
      icon: DollarSign,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      link: '/payments',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Welcome back! Here's what's happening today.
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/leads/new">
                <Button>
                  <Users className="w-4 h-4 mr-2" />
                  New Lead
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline">All Modules</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link key={stat.title} href={stat.link}>
                <Card className="hover:shadow-soft-lg transition-all duration-300 cursor-pointer group">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </CardTitle>
                    <div className={`p-2 rounded-lg ${stat.bgColor} group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stat.value}</div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used actions at your fingertips</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/leads/new">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <Phone className="w-6 h-6" />
                  <span className="text-sm">Call Lead</span>
                </Button>
              </Link>
              <Link href="/leads/new">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <MessageSquare className="w-6 h-6" />
                  <span className="text-sm">WhatsApp</span>
                </Button>
              </Link>
              <Link href="/quotations/new">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <FileText className="w-6 h-6" />
                  <span className="text-sm">New Quote</span>
                </Button>
              </Link>
              <Link href="/measurements/new">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <Clock className="w-6 h-6" />
                  <span className="text-sm">Measurement</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Leads */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Leads</CardTitle>
                  <CardDescription>Latest customer inquiries</CardDescription>
                </div>
                <Link href="/leads">
                  <Button variant="ghost" size="sm">View All</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.recentLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                          {lead.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-semibold">{lead.name}</h4>
                          <p className="text-sm text-gray-600">
                            {lead.phone} • {lead.projectType}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={
                        lead.status === 'NEW' ? 'default' :
                        lead.status === 'QUALIFIED' ? 'success' :
                        'secondary'
                      }>
                        {lead.status}
                      </Badge>
                      {lead.budget && (
                        <p className="text-sm text-gray-600 mt-1">
                          ₹{(lead.budget / 100000).toFixed(1)}L
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Appointments */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Upcoming Appointments</CardTitle>
                  <CardDescription>Your schedule for the week</CardDescription>
                </div>
                <Link href="/appointments">
                  <Button variant="ghost" size="sm">View All</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.upcomingAppointments.length > 0 ? (
                  data.upcomingAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center gap-4 p-4 rounded-lg border hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-lg bg-teal-100 flex flex-col items-center justify-center">
                          <span className="text-xs font-medium text-teal-600">
                            {new Date(appointment.startTime).toLocaleDateString('en-US', { month: 'short' })}
                          </span>
                          <span className="text-lg font-bold text-teal-600">
                            {new Date(appointment.startTime).getDate()}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{appointment.title}</h4>
                        <p className="text-sm text-gray-600">
                          {appointment.clientName}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(appointment.startTime).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      {appointment.status === 'CONFIRMED' && (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>No upcoming appointments</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
