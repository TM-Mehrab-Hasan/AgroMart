"use client";

import { useState } from "react";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ShoppingCart, 
  Package, 
  Heart, 
  MapPin,
  CreditCard,
  Truck,
  Star,
  Eye,
  RotateCcw
} from "lucide-react";
import Link from "next/link";
import { formatBDTaka } from "@/lib/api/landing";

export default function CustomerDashboard() {
  const [selectedTab, setSelectedTab] = useState("overview");

  // Dummy data
  const customerStats = {
    totalOrders: 12,
    pendingOrders: 2,
    totalSpent: 3400,
    savedItems: 8,
    addresses: 2
  };

  const recentOrders = [
    {
      id: "ORD-001",
      items: ["Organic Rice", "Fresh Tomatoes"],
      total: 540,
      status: "Delivered",
      date: "2025-10-02",
      seller: "Green Valley Farm",
      deliveryDate: "2025-10-04"
    },
    {
      id: "ORD-002",
      items: ["Greek Yogurt", "Fresh Milk"],
      total: 180,
      status: "Processing",
      date: "2025-10-04",
      seller: "Dairy Fresh Farm",
      deliveryDate: "2025-10-06"
    },
    {
      id: "ORD-003",
      items: ["Bell Peppers", "Spinach"],
      total: 130,
      status: "Pending",
      date: "2025-10-05",
      seller: "Organic Gardens",
      deliveryDate: "2025-10-07"
    }
  ];

  const wishlistItems = [
    {
      id: 1,
      name: "Salmon Fish",
      price: 800,
      seller: "Ocean Fresh",
      image: "/api/placeholder/100/100",
      inStock: false
    },
    {
      id: 2,
      name: "Quinoa",
      price: 250,
      seller: "Health Harvest",
      image: "/api/placeholder/100/100",
      inStock: true
    },
    {
      id: 3,
      name: "Cottage Cheese",
      price: 180,
      seller: "Farm House Dairy",
      image: "/api/placeholder/100/100",
      inStock: true
    }
  ];

  const addresses = [
    {
      id: 1,
      type: "Home",
      name: "John Doe",
      address: "123 Green Street, Garden City, NY 12345",
      phone: "+1 234-567-8901",
      isDefault: true
    },
    {
      id: 2,
      type: "Office",
      name: "John Doe",
      address: "456 Business Ave, Corporate Park, NY 12346",
      phone: "+1 234-567-8901",
      isDefault: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-25 to-blue-100">
      <Header />
      
      {/* Header Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Customer Dashboard</h1>
            <p className="text-gray-600">Track your orders and manage your account</p>
          </div>
          <Button className="bg-green-600 hover:bg-green-700" asChild>
            <Link href="/products">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Continue Shopping
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customerStats.totalOrders}</div>
              <p className="text-xs text-gray-600">All time</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <CreditCard className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatBDTaka(customerStats.totalSpent)}</div>
              <p className="text-xs text-green-600">Great savings achieved!</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
              <Truck className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customerStats.pendingOrders}</div>
              <p className="text-xs text-gray-600">Being processed</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Wishlist Items</CardTitle>
              <Heart className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customerStats.savedItems}</div>
              <p className="text-xs text-gray-600">Saved for later</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Orders</TabsTrigger>
            <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
            <TabsTrigger value="addresses">Addresses</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{order.id}</h3>
                          <Badge 
                            variant={
                              order.status === "Delivered" ? "default" : 
                              order.status === "Processing" ? "secondary" : "outline"
                            }
                          >
                            {order.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          {order.items.join(", ")}
                        </p>
                        <p className="text-sm text-gray-500">
                          From {order.seller} • Ordered: {order.date}
                        </p>
                        <p className="text-sm text-gray-500">
                          Expected delivery: {order.deliveryDate}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg">{formatBDTaka(order.total)}</p>
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {order.status === "Delivered" && (
                            <Button size="sm" variant="outline">
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wishlist Tab */}
          <TabsContent value="wishlist" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Wishlist</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {wishlistItems.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="w-full h-32 bg-gray-100 rounded-lg mb-3"></div>
                      <h3 className="font-semibold mb-1">{item.name}</h3>
                      <p className="text-sm text-gray-600 mb-1">by {item.seller}</p>
                      <p className="font-bold text-green-600 mb-3">{formatBDTaka(item.price)}</p>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="flex-1"
                          disabled={!item.inStock}
                        >
                          {item.inStock ? "Add to Cart" : "Out of Stock"}
                        </Button>
                        <Button size="sm" variant="outline">
                          <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Delivery Addresses</CardTitle>
                  <Button size="sm">Add New Address</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <div key={address.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{address.type}</h3>
                          {address.isDefault && (
                            <Badge variant="outline">Default</Badge>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">Edit</Button>
                          <Button size="sm" variant="outline">Delete</Button>
                        </div>
                      </div>
                      <p className="font-medium">{address.name}</p>
                      <p className="text-gray-600">{address.address}</p>
                      <p className="text-gray-600">{address.phone}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Full Name</label>
                      <p className="text-gray-600">John Doe</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <p className="text-gray-600">john.doe@example.com</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Phone</label>
                      <p className="text-gray-600">+1 234-567-8901</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Member Since</label>
                      <p className="text-gray-600">January 2025</p>
                    </div>
                  </div>
                  <Button className="mt-4">Edit Profile</Button>
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