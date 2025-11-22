import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { prisma } from '@/lib/db';
import { formatCurrency, formatDate } from '@/lib/utils';
import Link from 'next/link';
import {
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  Filter,
  Download,
  MessageSquare,
} from 'lucide-react';

async function getLeads() {
  return prisma.lead.findMany({
    take: 50,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      owner: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });
}

const statusColors = {
  NEW: 'default',
  CONTACTED: 'secondary',
  QUALIFIED: 'info',
  PROPOSAL_SENT: 'warning',
  NEGOTIATION: 'warning',
  WON: 'success',
  LOST: 'destructive',
  ON_HOLD: 'outline',
} as const;

const sourceIcons = {
  WEBSITE: '🌐',
  REFERRAL: '👥',
  SOCIAL_MEDIA: '📱',
  PHONE: '📞',
  WALK_IN: '🚶',
  EMAIL: '✉️',
  ADVERTISEMENT: '📢',
  OTHER: '📋',
};

export default async function LeadsPage() {
  const leads = await getLeads();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Leads CRM</h1>
              <p className="text-gray-600 mt-1">
                Manage your customer pipeline and track conversions
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Link href="/leads/import">
                <Button variant="outline">Import Leads</Button>
              </Link>
              <Link href="/leads/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Lead
                </Button>
              </Link>
            </div>
          </div>

          {/* Filters */}
          <div className="mt-6 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search leads by name, phone, or email..."
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
          {[
            { label: 'New', count: leads.filter(l => l.status === 'NEW').length, color: 'bg-blue-100 text-blue-700' },
            { label: 'Contacted', count: leads.filter(l => l.status === 'CONTACTED').length, color: 'bg-purple-100 text-purple-700' },
            { label: 'Qualified', count: leads.filter(l => l.status === 'QUALIFIED').length, color: 'bg-green-100 text-green-700' },
            { label: 'Proposal', count: leads.filter(l => l.status === 'PROPOSAL_SENT').length, color: 'bg-yellow-100 text-yellow-700' },
            { label: 'Negotiation', count: leads.filter(l => l.status === 'NEGOTIATION').length, color: 'bg-orange-100 text-orange-700' },
            { label: 'Won', count: leads.filter(l => l.status === 'WON').length, color: 'bg-emerald-100 text-emerald-700' },
            { label: 'Lost', count: leads.filter(l => l.status === 'LOST').length, color: 'bg-red-100 text-red-700' },
            { label: 'On Hold', count: leads.filter(l => l.status === 'ON_HOLD').length, color: 'bg-gray-100 text-gray-700' },
          ].map((stat) => (
            <div key={stat.label} className={`${stat.color} rounded-lg p-4 text-center`}>
              <div className="text-2xl font-bold">{stat.count}</div>
              <div className="text-xs mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Leads Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Leads ({leads.length})</CardTitle>
            <CardDescription>Track and manage your sales pipeline</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leads.map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center gap-4 p-4 rounded-lg border hover:bg-gray-50 transition-colors group"
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
                      {lead.name.charAt(0)}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-lg">{lead.name}</h3>
                      <Badge variant={statusColors[lead.status]}>
                        {lead.status.replace('_', ' ')}
                      </Badge>
                      <span className="text-xl">{sourceIcons[lead.source]}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {lead.phone}
                      </div>
                      {lead.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {lead.email}
                        </div>
                      )}
                      {lead.city && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {lead.city}, {lead.state}
                        </div>
                      )}
                    </div>

                    <div className="mt-2 text-sm">
                      <span className="font-medium text-gray-700">{lead.projectType}</span>
                      {lead.budget && (
                        <span className="ml-3 text-gray-600">
                          Budget: {formatCurrency(lead.budget)}
                        </span>
                      )}
                      <span className="ml-3 text-gray-500">
                        {formatDate(lead.createdAt, 'relative')}
                      </span>
                    </div>

                    {lead.requirements && (
                      <p className="mt-2 text-sm text-gray-600 line-clamp-1">
                        {lead.requirements}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex-shrink-0 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(`tel:${lead.phone}`)}
                    >
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`)}
                    >
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                    <Link href={`/leads/${lead.id}`}>
                      <Button size="sm">View Details</Button>
                    </Link>
                  </div>
                </div>
              ))}

              {leads.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg mb-2">No leads found</p>
                  <Link href="/leads/new">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Lead
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
