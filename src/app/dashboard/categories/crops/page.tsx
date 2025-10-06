"use client";

import { useState } from "react";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Wheat, 
  TrendingUp, 
  Package, 
  Users, 
  DollarSign,
  BarChart3,
  Plus,
  Filter,
  Search
} from "lucide-react";
import { formatBDTaka } from "@/lib/api/landing";

export default function CropsDashboard() {
  const [selectedFilter, setSelectedFilter] = useState("all");

  const cropsStats = {
    totalProducts: 156,
    activeSellers: 23,
    monthlyRevenue: 145200,
    avgPrice: 85,
    topProduct: "Organic Rice",
    growth: 12.5
  };

  const recentOrders = [
    { id: 1, product: "Organic Rice", quantity: "50 kg", price: 6000, buyer: "Rahman Store", status: "delivered" },
    { id: 2, product: "Wheat Flour", quantity: "25 kg", price: 1125, buyer: "City Mart", status: "pending" },
    { id: 3, product: "Corn Kernels", quantity: "30 kg", price: 2400, buyer: "Green Grocers", status: "processing" },
  ];

  const topProducts = [
    { name: "Organic Rice", sales: 245, revenue: 29400, trend: "up" },
    { name: "Wheat Flour", sales: 189, revenue: 8505, trend: "up" },
    { name: "Corn Kernels", sales: 156, revenue: 12480, trend: "down" },
    { name: "Quinoa", sales: 78, revenue: 19500, trend: "up" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-25 to-amber-100">
      <Header />
      
      {/* Dashboard Header */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
              <Wheat className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Crops Dashboard</h1>
              <p className="text-gray-600">Manage crops, grains, and cereals</p>
            </div>
          </div>
          <Button className="bg-amber-600 hover:bg-amber-700">
            <Plus className="h-4 w-4 mr-2" />
            Add New Product
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-amber-200 bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-800">{cropsStats.totalProducts}</div>
              <p className="text-xs text-gray-600">Active crop listings</p>
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Sellers</CardTitle>
              <Users className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-800">{cropsStats.activeSellers}</div>
              <p className="text-xs text-gray-600">Verified crop sellers</p>
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-800">{formatBDTaka(cropsStats.monthlyRevenue)}</div>
              <p className="text-xs text-green-600">+{cropsStats.growth}% from last month</p>
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Price</CardTitle>
              <BarChart3 className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-800">{formatBDTaka(cropsStats.avgPrice)}</div>
              <p className="text-xs text-gray-600">per kg average</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/60 backdrop-blur-sm">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-amber-800">Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{order.product}</p>
                          <p className="text-sm text-gray-600">{order.quantity} • {order.buyer}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatBDTaka(order.price)}</p>
                          <Badge 
                            variant={order.status === "delivered" ? "default" : "secondary"}
                            className={order.status === "delivered" ? "bg-green-100 text-green-800" : ""}
                          >
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Products */}
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-amber-800">Top Performing Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topProducts.map((product, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-600">{product.sales} units sold</p>
                        </div>
                        <div className="text-right flex items-center gap-2">
                          <div>
                            <p className="font-semibold">{formatBDTaka(product.revenue)}</p>
                            <div className="flex items-center gap-1">
                              <TrendingUp className={`h-3 w-3 ${product.trend === "up" ? "text-green-600" : "text-red-600"}`} />
                              <span className={`text-xs ${product.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                                {product.trend === "up" ? "↗" : "↘"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-amber-800">Product Management</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Product management interface will be implemented here...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-amber-800">Order Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Order management interface will be implemented here...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-amber-800">Analytics & Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Analytics and reporting interface will be implemented here...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      <Footer />
    </div>
  );
}