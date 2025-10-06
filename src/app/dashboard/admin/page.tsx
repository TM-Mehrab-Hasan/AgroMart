"use client";

import { useState } from "react";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp,
  Store,
  Package,
  AlertTriangle,
  Eye,
  Edit,
  Ban,
  CheckCircle,
  BarChart3,
  PieChart,
  Activity
} from "lucide-react";
import { formatBDTaka } from "@/lib/api/landing";

export default function AdminDashboard() {
  const [selectedTab, setSelectedTab] = useState("overview");

  // Dummy data
  const systemStats = {
    totalUsers: 2845,
    totalSellers: 324,
    totalOrders: 1289,
    totalRevenue: 185600,
    activeShops: 267,
    totalProducts: 3421,
    pendingReviews: 23,
    systemIssues: 3
  };

  const recentOrders = [
    {
      id: "ORD-1289",
      customer: "Sarah Johnson",
      seller: "Green Valley Farm",
      amount: 540,
      status: "Completed",
      date: "2025-10-06",
      items: 3
    },
    {
      id: "ORD-1288",
      customer: "Mike Chen",
      seller: "Dairy Fresh Farm", 
      amount: 280,
      status: "Processing",
      date: "2025-10-06",
      items: 2
    },
    {
      id: "ORD-1287",
      customer: "Emily Davis",
      seller: "Ocean Fresh",
      amount: 720,
      status: "Shipped",
      date: "2025-10-05",
      items: 4
    }
  ];

  const recentUsers = [
    {
      id: 1,
      name: "Alex Thompson",
      email: "alex.thompson@email.com",
      role: "CUSTOMER",
      joinDate: "2025-10-06",
      orders: 0,
      status: "Active"
    },
    {
      id: 2,
      name: "Maria Rodriguez",
      email: "maria.r@farmfresh.com",
      role: "SELLER",
      joinDate: "2025-10-05",
      orders: 12,
      status: "Active"
    },
    {
      id: 3,
      name: "David Kim",
      email: "d.kim@organics.com",
      role: "SHOP_OWNER",
      joinDate: "2025-10-04",
      orders: 45,
      status: "Pending"
    }
  ];

  const systemIssues = [
    {
      id: 1,
      type: "Payment",
      description: "Gateway timeout reported by 3 users",
      severity: "High",
      reportedBy: "System Monitor",
      date: "2025-10-06"
    },
    {
      id: 2,
      type: "Delivery",
      description: "Delayed shipments in North region",
      severity: "Medium", 
      reportedBy: "Customer Service",
      date: "2025-10-05"
    },
    {
      id: 3,
      type: "Product",
      description: "Inventory sync issues with 2 sellers",
      severity: "Low",
      reportedBy: "Seller Support",
      date: "2025-10-04"
    }
  ];

  const topSellers = [
    {
      name: "Green Valley Farm",
      revenue: 45600,
      orders: 234,
      rating: 4.8,
      products: 67
    },
    {
      name: "Ocean Fresh",
      revenue: 38900,
      orders: 189,
      rating: 4.7,
      products: 43
    },
    {
      name: "Dairy Fresh Farm",
      revenue: 32400,
      orders: 156,
      rating: 4.9,
      products: 28
    },
    {
      name: "Organic Gardens",
      revenue: 28700,
      orders: 142,
      rating: 4.6,
      products: 89
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-25 to-indigo-100">
      <Header />
      
      {/* Header Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600">Monitor and manage the AgroMart platform</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Export Report</Button>
            <Button className="bg-purple-600 hover:bg-purple-700">System Settings</Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemStats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-green-600">+12% from last month</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatBDTaka(systemStats.totalRevenue)}</div>
              <p className="text-xs text-green-600">+8% from last month</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Shops</CardTitle>
              <Store className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemStats.activeShops}</div>
              <p className="text-xs text-green-600">+5 new this week</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Issues</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemStats.systemIssues}</div>
              <p className="text-xs text-red-600">Requires attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="sellers">Sellers</TabsTrigger>
            <TabsTrigger value="issues">Issues</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Chart Placeholder */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Revenue Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <TrendingUp className="h-12 w-12 text-purple-600 mx-auto mb-2" />
                      <p className="text-gray-600">Revenue Chart Visualization</p>
                      <p className="text-sm text-gray-500">Monthly revenue: {formatBDTaka(systemStats.totalRevenue)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Top Sellers */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Sellers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topSellers.map((seller, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-semibold">{seller.name}</p>
                          <p className="text-sm text-gray-600">{seller.orders} orders • {seller.products} products</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">{formatBDTaka(seller.revenue)}</p>
                          <div className="flex items-center gap-1">
                            <span className="text-sm">{seller.rating}</span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className={`text-xs ${i < Math.floor(seller.rating) ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Orders Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total Orders</span>
                      <span className="font-bold">{systemStats.totalOrders}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Processing</span>
                      <span className="text-orange-600">34</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Completed</span>
                      <span className="text-green-600">1,198</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">User Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Active Users</span>
                      <span className="font-bold">2,134</span>
                    </div>
                    <div className="flex justify-between">
                      <span>New Signups</span>
                      <span className="text-blue-600">89</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sellers</span>
                      <span className="text-purple-600">{systemStats.totalSellers}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Platform Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>System Uptime</span>
                      <span className="text-green-600 font-bold">99.9%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Products</span>
                      <span className="font-bold">{systemStats.totalProducts}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pending Reviews</span>
                      <span className="text-orange-600">{systemStats.pendingReviews}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Recent User Registrations</CardTitle>
                  <Button size="sm" variant="outline">View All Users</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{user.name}</h3>
                          <Badge variant={user.role === "CUSTOMER" ? "default" : user.role === "SELLER" ? "secondary" : "outline"}>
                            {user.role}
                          </Badge>
                          <Badge variant={user.status === "Active" ? "default" : "outline"}>
                            {user.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <p className="text-sm text-gray-500">
                          Joined: {user.joinDate} • {user.orders} orders
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Ban className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{order.id}</h3>
                          <Badge 
                            variant={
                              order.status === "Completed" ? "default" : 
                              order.status === "Processing" ? "secondary" : "outline"
                            }
                          >
                            {order.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          Customer: {order.customer} • Seller: {order.seller}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.date} • {order.items} items
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{formatBDTaka(order.amount)}</p>
                        <div className="flex gap-2 mt-1">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sellers Tab */}
          <TabsContent value="sellers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Sellers Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topSellers.map((seller, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{seller.name}</h3>
                          <Badge variant="default">Active</Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {seller.products} products • {seller.orders} orders completed
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-sm">Rating: {seller.rating}</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={`text-xs ${i < Math.floor(seller.rating) ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-green-600">{formatBDTaka(seller.revenue)}</p>
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Issues Tab */}
          <TabsContent value="issues" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Issues & Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systemIssues.map((issue) => (
                    <div key={issue.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{issue.type} Issue</h3>
                          <Badge 
                            variant={
                              issue.severity === "High" ? "destructive" : 
                              issue.severity === "Medium" ? "secondary" : "outline"
                            }
                          >
                            {issue.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{issue.description}</p>
                        <p className="text-sm text-gray-500">
                          Reported by {issue.reportedBy} • {issue.date}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      <Footer />
    </div>
  );
}