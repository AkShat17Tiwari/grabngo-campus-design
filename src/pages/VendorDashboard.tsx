import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, DollarSign, ShoppingCart, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { dummyDailySales, dummyMonthlySales, dummyPopularItems, dummyHourlySales } from '@/data/dummyAnalytics';
import { useRole } from '@/hooks/useRole';
import { supabase } from '@/integrations/supabase/client';

const VendorDashboard = () => {
  const navigate = useNavigate();
  const { outletId } = useRole();
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [outletName, setOutletName] = useState<string>('');
  const [useDummyData] = useState(true); // Using dummy data for demo

  // Use dummy data scaled down for vendor
  const vendorDailySales = dummyDailySales.map(d => ({
    ...d,
    orders: Math.floor(d.orders * 0.5),
    revenue: Math.floor(d.revenue * 0.5)
  }));

  const vendorPopularItems = dummyPopularItems.slice(0, 5);

  useEffect(() => {
    const loadOutletInfo = async () => {
      if (outletId) {
        const { data } = await supabase
          .from('outlets')
          .select('name')
          .eq('id', outletId)
          .single();
        
        if (data) {
          setOutletName(data.name);
        }
      }
      setLoading(false);
    };

    loadOutletInfo();
  }, [outletId]);

  const analytics = {
    totalOrders: vendorDailySales.reduce((sum, d) => sum + d.orders, 0),
    totalRevenue: vendorDailySales.reduce((sum, d) => sum + d.revenue, 0),
    completedOrders: Math.floor(vendorDailySales.reduce((sum, d) => sum + d.orders, 0) * 0.85),
    avgOrderValue: Math.round(vendorDailySales.reduce((sum, d) => sum + d.revenue, 0) / vendorDailySales.reduce((sum, d) => sum + d.orders, 0)),
    ordersByDate: vendorDailySales,
    ordersByHour: dummyHourlySales.map(h => ({ ...h, orders: Math.floor(h.orders * 0.5) })),
    topItems: vendorPopularItems
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Vendor Dashboard</h1>
              {outletName && <p className="text-sm text-muted-foreground">{outletName}</p>}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Period Selector */}
        <Tabs value={period} onValueChange={(v) => setPeriod(v as any)} className="mb-6">
          <TabsList>
            <TabsTrigger value="daily">Last 7 Days</TabsTrigger>
            <TabsTrigger value="weekly">Last 4 Weeks</TabsTrigger>
            <TabsTrigger value="monthly">Last 6 Months</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{analytics.totalRevenue?.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.completedOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{analytics.avgOrderValue}</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Orders Over Time */}
          <Card>
            <CardHeader>
              <CardTitle>Orders Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.ordersByDate}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="orders" stroke="hsl(var(--primary))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Revenue Over Time */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.ordersByDate}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Orders by Hour */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Orders by Hour</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.ordersByHour}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="orders" fill="hsl(var(--secondary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Items */}
        <Card>
          <CardHeader>
            <CardTitle>Top 5 Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topItems?.map((item: any, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                      {index + 1}
                    </div>
                    <span className="font-medium">{item.item}</span>
                  </div>
                  <div className="text-muted-foreground">
                    {item.orders} orders
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VendorDashboard;
