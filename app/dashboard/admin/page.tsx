"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Users, Package, DollarSign, Activity } from "lucide-react";
import api from "@/lib/api";
import dynamic from 'next/dynamic';

const BarChart: any = dynamic(() => import('recharts').then(mod => ({ default: mod.BarChart as any })), { ssr: false });
const Bar: any = dynamic(() => import('recharts').then(mod => ({ default: mod.Bar as any })), { ssr: false });
const XAxis: any = dynamic(() => import('recharts').then(mod => ({ default: mod.XAxis as any })), { ssr: false });
const YAxis: any = dynamic(() => import('recharts').then(mod => ({ default: mod.YAxis as any })), { ssr: false });
const CartesianGrid: any = dynamic(() => import('recharts').then(mod => ({ default: mod.CartesianGrid as any })), { ssr: false });
const Tooltip: any = dynamic(() => import('recharts').then(mod => ({ default: mod.Tooltip as any })), { ssr: false });
const ResponsiveContainer: any = dynamic(() => import('recharts').then(mod => ({ default: mod.ResponsiveContainer as any })), { ssr: false });
const LineChart: any = dynamic(() => import('recharts').then(mod => ({ default: mod.LineChart as any })), { ssr: false });
const Line: any = dynamic(() => import('recharts').then(mod => ({ default: mod.Line as any })), { ssr: false });
const PieChart: any = dynamic(() => import('recharts').then(mod => ({ default: mod.PieChart as any })), { ssr: false });
const Pie: any = dynamic(() => import('recharts').then(mod => ({ default: mod.Pie as any })), { ssr: false });
const Cell: any = dynamic(() => import('recharts').then(mod => ({ default: mod.Cell as any })), { ssr: false });
const Legend: any = dynamic(() => import('recharts').then(mod => ({ default: mod.Legend as any })), { ssr: false });
import { LoadingSpinner } from "@/components/shared";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    overview: { totalUsers: 0, totalAdmins: 0, totalProducts: 0, totalContacts: 0 },
    charts: { productsByCategory: [] as any[], roleDistribution: [] as any[], userGrowth: [] as any[] }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/stats');
        setStats(res.data.data);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center py-20"><LoadingSpinner size="lg" /></div>;
  }

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Admin Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-card border border-border rounded-2xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Items</p>
              <h3 className="text-2xl font-bold text-foreground">{stats.overview.totalProducts}</h3>
            </div>
          </div>
        </div>

        <div className="p-6 bg-card border border-border rounded-2xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Users</p>
              <h3 className="text-2xl font-bold text-foreground">{stats.overview.totalUsers}</h3>
            </div>
          </div>
        </div>

        <div className="p-6 bg-card border border-border rounded-2xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/10 text-green-500 rounded-xl">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Admins</p>
              <h3 className="text-2xl font-bold text-foreground">{stats.overview.totalAdmins}</h3>
            </div>
          </div>
        </div>

        <div className="p-6 bg-card border border-border rounded-2xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-500/10 text-orange-500 rounded-xl">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Contacts / Queries</p>
              <h3 className="text-2xl font-bold text-foreground">{stats.overview.totalContacts}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 bg-card border border-border rounded-2xl shadow-sm">
          <h2 className="text-xl font-semibold mb-6">Products by Category</h2>
          <div className="h-[300px]">
            {stats.charts.productsByCategory && stats.charts.productsByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.charts.productsByCategory}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground border border-dashed border-border rounded-xl">
                No products found
              </div>
            )}
          </div>
        </div>

        <div className="p-6 bg-card border border-border rounded-2xl shadow-sm">
          <h2 className="text-xl font-semibold mb-6">User Growth (Last 6 Months)</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.charts.userGrowth || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="users" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4, fill: "hsl(var(--primary))" }} activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 bg-card border border-border rounded-2xl shadow-sm lg:col-span-2">
          <h2 className="text-xl font-semibold mb-6">Role Distribution</h2>
          <div className="h-[300px]">
            {stats.charts.roleDistribution && stats.charts.roleDistribution.length > 0 && stats.charts.roleDistribution.some(d => d.value > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.charts.roleDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.charts.roleDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground border border-dashed border-border rounded-xl">
                No users found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
