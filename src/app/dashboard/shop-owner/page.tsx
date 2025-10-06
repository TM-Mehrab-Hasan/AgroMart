"use client";

import { useState } from "react";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Store, 
  Package, 
  DollarSign, 
  ShoppingCart,
  Users,
  TrendingUp,
  Eye,
  Edit,
  Plus,
  Star,
  AlertTriangle,
  CheckCircle,
  BarChart3
} from "lucide-react";
import { formatBDTaka } from "@/lib/api/landing";

export default function ShopOwnerDashboard() {
  const [selectedTab, setSelectedTab] = useState("overview");

  // Dummy data
  const shopStats = {
    totalRevenue: 156800,
    monthlyRevenue: 18400,
    totalOrders: 1847,
    pendingOrders: 12,
    totalProducts: 156,
    outOfStock: 8,
    totalCustomers: 892,
    shopRating: 4.6,
    activeShops: 3
  };

  const shops = [
    {
      id: 1,
      name: "Fresh Harvest Market",
      location: "Downtown Plaza",
      revenue: 68400,
      orders: 623,
      products: 67,
      rating: 4.7,
      status: "Active",
      manager: "Sarah Wilson"
    },
    {
      id: 2,
      name: "Organic Corner Store", 
      location: "Green Valley Mall",
      revenue: 52800,
      orders: 498,
      products: 54,
      rating: 4.5,
      status: "Active",
      manager: "Mike Johnson"
    },
    {
      id: 3,
      name: "Farm Direct Outlet",
      location: "Suburban Center",
      revenue: 35600,
      orders: 726,
      products: 35,
      rating: 4.6,
      status: "Active",
      manager: "Lisa Chen"
    }
  ];

  const recentOrders = [
    {
      id: "ORD-2001",
      customer: "John Smith",
      shop: "Fresh Harvest Market",
      items: ["Organic Apples", "Fresh Carrots"],
      total: 320,
      status: "Processing",
      date: "2025-10-06",
      manager: "Sarah Wilson"
    },
    {
      id: "ORD-2002",
      customer: "Emma Davis",
      shop: "Organic Corner Store",
      items: ["Quinoa", "Greek Yogurt"],
      total: 450,
      status: "Shipped",
      date: "2025-10-06",
      manager: "Mike Johnson"
    },
    {
      id: "ORD-2003",
      customer: "Robert Brown",
      shop: "Farm Direct Outlet",
      items: ["Fresh Milk", "Cottage Cheese"],
      total: 280,
      status: "Delivered",
      date: "2025-10-05",
      manager: "Lisa Chen"
    }
  ];

  const topProducts = [
    {
      name: "Organic Rice",
      shop: "Fresh Harvest Market",
      sales: 156,
      revenue: 23400,
      stock: 45,
      category: "Grains"
    },
    {
      name: "Fresh Tomatoes",
      shop: "Organic Corner Store", 
      sales: 134,
      revenue: 18900,
      stock: 23,
      category: "Vegetables"
    },
    {
      name: "Greek Yogurt",
      shop: "Farm Direct Outlet",
      sales: 128,
      revenue: 16800,
      stock: 67,
      category: "Dairy"
    },
    {
      name: "Quinoa",
      shop: "Fresh Harvest Market",
      sales: 112,
      revenue: 15600,
      stock: 34,
      category: "Grains"
    }
  ];

  const inventoryAlerts = [
    {
      product: "Salmon Fish",
      shop: "Fresh Harvest Market",
      currentStock: 2,
      minStock: 10,
      status: "Critical"
    },
    {
      product: "Bell Peppers",
      shop: "Organic Corner Store",
      currentStock: 5,
      minStock: 15,
      status: "Low"
    },
    {
      product: "Fresh Spinach",
      shop: "Farm Direct Outlet",
      currentStock: 8,
      minStock: 20,
      status: "Low"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-25 to-cyan-100">
      <Header />
      
      {/* Header Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Shop Owner Dashboard</h1>
            <p className="text-gray-600">Manage your multiple stores and track performance</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add New Shop
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              Analytics Report
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatBDTaka(shopStats.totalRevenue)}</div>
              <p className="text-xs text-green-600">+15% from last month</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Shops</CardTitle>
              <Store className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{shopStats.activeShops}</div>
              <p className="text-xs text-gray-600">All locations operational</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{shopStats.totalOrders}</div>
              <p className="text-xs text-orange-600">{shopStats.pendingOrders} pending</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{shopStats.totalProducts}</div>
              <p className="text-xs text-red-600">{shopStats.outOfStock} out of stock</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="shops">My Shops</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Chart Placeholder */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Revenue Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <TrendingUp className="h-12 w-12 text-emerald-600 mx-auto mb-2" />
                      <p className="text-gray-600">Multi-Shop Revenue Chart</p>
                      <p className="text-sm text-gray-500">This month: {formatBDTaka(shopStats.monthlyRevenue)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Top Products */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topProducts.map((product, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-semibold">{product.name}</p>
                          <p className="text-sm text-gray-600">{product.shop} • {product.category}</p>
                          <p className="text-sm text-gray-500">Stock: {product.stock} units</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">{formatBDTaka(product.revenue)}</p>
                          <p className="text-sm text-gray-600">{product.sales} sales</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Inventory Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Inventory Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {inventoryAlerts.map((alert, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-semibold">{alert.product}</p>
                        <p className="text-sm text-gray-600">{alert.shop}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={alert.status === "Critical" ? "destructive" : "secondary"}>
                          {alert.status}
                        </Badge>
                        <p className="text-sm text-gray-600 mt-1">
                          Current: {alert.currentStock} / Min: {alert.minStock}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Shops Tab */}
          <TabsContent value="shops" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Your Shops</CardTitle>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Shop
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {shops.map((shop) => (
                    <div key={shop.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">{shop.name}</h3>
                            <Badge variant="default">{shop.status}</Badge>
                          </div>
                          <p className="text-gray-600">{shop.location}</p>
                          <p className="text-sm text-gray-500">Manager: {shop.manager}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <p className="text-lg font-bold text-green-600">{formatBDTaka(shop.revenue)}</p>
                          <p className="text-sm text-gray-600">Revenue</p>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <p className="text-lg font-bold">{shop.orders}</p>
                          <p className="text-sm text-gray-600">Orders</p>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <p className="text-lg font-bold">{shop.products}</p>
                          <p className="text-sm text-gray-600">Products</p>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <div className="flex items-center justify-center gap-1">
                            <p className="text-lg font-bold">{shop.rating}</p>
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          </div>
                          <p className="text-sm text-gray-600">Rating</p>
                        </div>
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
                <CardTitle>Recent Orders Across All Shops</CardTitle>
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
                              order.status === "Delivered" ? "default" : 
                              order.status === "Shipped" ? "secondary" : "outline"
                            }
                          >
                            {order.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          Customer: {order.customer} • Shop: {order.shop}
                        </p>
                        <p className="text-sm text-gray-500">
                          Items: {order.items.join(", ")}
                        </p>
                        <p className="text-sm text-gray-500">
                          Manager: {order.manager} • {order.date}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{formatBDTaka(order.total)}</p>
                        <Button size="sm" variant="outline" className="mt-1">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Product Management</CardTitle>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{product.name}</h3>
                          <Badge variant="outline">{product.category}</Badge>
                          <Badge variant={product.stock > 20 ? "default" : product.stock > 10 ? "secondary" : "destructive"}>
                            {product.stock > 20 ? "In Stock" : product.stock > 10 ? "Low Stock" : "Critical"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">Shop: {product.shop}</p>
                        <p className="text-sm text-gray-500">Current Stock: {product.stock} units</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-green-600">{formatBDTaka(product.revenue)}</p>
                        <p className="text-sm text-gray-600">{product.sales} units sold</p>
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

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Shop Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Shop Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {shops.map((shop, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{shop.name}</p>
                          <p className="text-sm text-gray-600">{shop.orders} orders</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">{formatBDTaka(shop.revenue)}</p>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-sm">{shop.rating}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Customer Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Customer Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Total Customers</span>
                      <span className="font-bold">{shopStats.totalCustomers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Repeat Customers</span>
                      <span className="text-green-600">67%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg Order Value</span>
                      <span className="font-bold">{formatBDTaka(Math.round(shopStats.totalRevenue / shopStats.totalOrders))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Customer Rating</span>
                      <span className="font-bold">{shopStats.shopRating}/5.0</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Inventory Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Inventory Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Total Products</span>
                      <span className="font-bold">{shopStats.totalProducts}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>In Stock</span>
                      <span className="text-green-600">{shopStats.totalProducts - shopStats.outOfStock}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Out of Stock</span>
                      <span className="text-red-600">{shopStats.outOfStock}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Needs Restock</span>
                      <span className="text-orange-600">15</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      <Footer />
    </div>
  );
}