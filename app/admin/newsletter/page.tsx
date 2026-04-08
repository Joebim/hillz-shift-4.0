'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Mail, Download, Search, Calendar, ChevronRight } from 'lucide-react';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Card } from '@/src/components/ui/Card';
import { format } from 'date-fns';

interface NewsletterEmail {
  id: string;
  email: string;
  subscribedAt: string | Date;
  active: boolean;
}

export default function NewsletterAdminPage() {
  const [search, setSearch] = useState('');

  const { data: emails = [], isLoading, error } = useQuery<NewsletterEmail[]>({
    queryKey: ['newsletter-emails'],
    queryFn: async () => {
      const res = await fetch('/api/newsletter');
      if (!res.ok) throw new Error('Failed to fetch newsletter emails');
      const json = await res.json();
      return json.data;
    },
  });

  const filteredEmails = emails.filter(e => 
    e.email.toLowerCase().includes(search.toLowerCase())
  );

  const exportCSV = () => {
    const csv = [
      ['Email', 'Subscribed At', 'Status'],
      ...emails.map(e => [
        e.email,
        format(new Date(e.subscribedAt), 'yyyy-MM-dd HH:mm:ss'),
        e.active ? 'Active' : 'Inactive'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-emails-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[2rem] border border-slate-200/60 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center shadow-inner">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Newsletter Subscribers</h1>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{emails.length} Total Subscriptions</p>
          </div>
        </div>
        <Button 
          onClick={exportCSV}
          variant="outline" 
          className="rounded-xl border-slate-200 gap-2 h-12 px-6"
          disabled={emails.length === 0}
        >
          <Download className="w-4 h-4" /> Export CSV
        </Button>
      </div>

      {/* Main Content */}
      <Card variant="default" padding="none" className="bg-white rounded-[2rem] border-slate-200/60 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search by email..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11 h-12 bg-white border-slate-200 rounded-xl focus:ring-violet-500/10 focus:border-violet-500 transition-all font-medium"
            />
          </div>
        </div>

        {/* Table/List */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading subscribers...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center text-red-500 font-bold">
              Error loading data. Please try again.
            </div>
          ) : filteredEmails.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-slate-200" />
              </div>
              <p className="text-slate-500 font-bold">No subscribers found.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100">
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Subscriber</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Date Joined</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                  <th className="px-8 py-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEmails.map((e) => (
                  <tr key={e.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-xs uppercase">
                          {e.email[0]}
                        </div>
                        <span className="font-bold text-slate-700">{e.email}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-slate-500 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-300" />
                        {format(new Date(e.subscribedAt), 'MMM do, yyyy • p')}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        e.active ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                      }`}>
                        {e.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors inline-block" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
}
