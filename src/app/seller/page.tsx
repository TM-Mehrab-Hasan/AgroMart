"use client";

import { useState } from "react";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Plus,
  Edit,
  Eye,
  BarChart3,
  Users,
  Star
} from "lucide-react";
import Link from "next/link";
import { formatBDTaka } from "@/lib/api/landing";

export default function SellerDashboard() {
  const [selectedTab, setSelectedTab] = useState("overview");

  // Dummy data
  const sellerStats = {
    totalProducts: 24,
    totalSales: 45600,
    monthlyRevenue: 12400,
    totalOrders: 156,
    rating: 4.6,
    totalCustomers: 89
  };

  const products = [
    {
      id: 1,
      name: "Organic Rice",
      category: "Crops",
      price: 120,
      stock: 50,
      sold: 25,
      status: "Active",
      image: "/api/placeholder/100/100"
    },
    {
      id: 2,
      name: "Fresh Tomatoes",
      category: "Vegetables",
      price: 60,
      stock: 30,
      sold: 45,
      status: "Active",
      image: "/api/placeholder/100/100"
    },
    {
      id: 3,
      name: "Wheat Flour",
      category: "Crops",
      price: 45,
      stock: 0,
      sold: 78,
      status: "Out of Stock",
      image: "/api/placeholder/100/100"
    },
    {
      id: 4,
      name: "Bell Peppers",
      category: "Vegetables",
      price: 90,
      stock: 20,
      sold: 12,
      status: "Active",
      image: "/api/placeholder/100/100"
    }
  ];

  const recentOrders = [
    {
      id: "ORD-001",
      customer: "John Doe",
      product: "Organic Rice",
      quantity: 2,
      amount: 240,
      status: "Delivered",
      date: "2025-10-04"
    },
    {
      id: "ORD-002",
      customer: "Jane Smith",
      product: "Fresh Tomatoes",
      quantity: 3,
      amount: 180,
      status: "Processing",
      date: "2025-10-05"
    },
    {
      id: "ORD-003",
      customer: "Mike Johnson",
      product: "Bell Peppers",
      quantity: 1,
      amount: 90,
      status: "Pending",
      date: "2025-10-05"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-25 to-green-100">
      <Header />
      
      {/* Header Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Seller Dashboard</h1>
            <p className="text-gray-600">Manage your products and track your sales</p>
          </div>
          <Button className="bg-green-600 hover:bg-green-700" asChild>
            <Link href="/seller/add-product">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sellerStats.totalProducts}</div>
              <p className="text-xs text-gray-600">Active listings</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatBDTaka(sellerStats.monthlyRevenue)}</div>
              <p className="text-xs text-green-600">+15% from last month</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sellerStats.totalOrders}</div>
              <p className="text-xs text-gray-600">This month</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rating</CardTitle>
              <Star className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sellerStats.rating}</div>
              <p className="text-xs text-gray-600">From {sellerStats.totalCustomers} customers</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Sales Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <BarChart3 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">Sales chart would go here</p>
                    <p className="text-sm text-gray-500">Monthly sales: {formatBDTaka(sellerStats.monthlyRevenue)}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Customer Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Customers</span>
                      <span className="font-semibold">{sellerStats.totalCustomers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Repeat Customers</span>
                      <span className="font-semibold">67%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Rating</span>
                      <span className="font-semibold flex items-center gap-1">
                        {sellerStats.rating}
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg"></div>
                        <div>
                          <h3 className="font-semibold">{product.name}</h3>
                          <p className="text-sm text-gray-600">{product.category}</p>
                          <p className="text-sm">
                            <span className="font-medium">{formatBDTaka(product.price)}/kg</span>
                            <span className="ml-2 text-gray-500">Stock: {product.stock}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={product.status === "Active" ? "default" : "destructive"}>
                          {product.status}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
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
                      <div>
                        <h3 className="font-semibold">{order.id}</h3>
                        <p className="text-sm text-gray-600">{order.customer}</p>
                        <p className="text-sm">{order.product} × {order.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatBDTaka(order.amount)}</p>
                        <p className="text-sm text-gray-600">{order.date}</p>
                        <Badge 
                          variant={
                            order.status === "Delivered" ? "default" : 
                            order.status === "Processing" ? "secondary" : "outline"
                          }
                        >
                          {order.status}
                        </Badge>
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