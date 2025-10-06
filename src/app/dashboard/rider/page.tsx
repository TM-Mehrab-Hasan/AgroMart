"use client";

import { useState } from "react";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Truck, 
  MapPin, 
  Clock, 
  DollarSign,
  Package,
  Route,
  CheckCircle,
  AlertCircle,
  Navigation,
  Phone,
  Star,
  Calendar
} from "lucide-react";
import { formatBDTaka } from "@/lib/api/landing";

export default function RiderDashboard() {
  const [selectedTab, setSelectedTab] = useState("deliveries");

  // Dummy data
  const riderStats = {
    totalDeliveries: 342,
    todayDeliveries: 8,
    pendingDeliveries: 3,
    totalEarnings: 28400,
    todayEarnings: 850,
    rating: 4.7,
    completionRate: 96.5
  };

  const pendingDeliveries = [
    {
      id: "DEL-1001",
      orderId: "ORD-1289",
      customer: "Sarah Johnson",
      address: "123 Green St, Garden City, NY 12345",
      phone: "+1 234-567-8901",
      items: ["Organic Rice", "Fresh Tomatoes"],
      priority: "High",
      estimatedTime: "30 mins",
      distance: "2.5 km",
      amount: 540,
      pickupLocation: "Green Valley Farm",
      timeSlot: "2:00 PM - 4:00 PM"
    },
    {
      id: "DEL-1002", 
      orderId: "ORD-1288",
      customer: "Mike Chen",
      address: "456 Business Ave, Corporate Park, NY 12346",
      phone: "+1 234-567-8902",
      items: ["Greek Yogurt", "Fresh Milk"],
      priority: "Medium",
      estimatedTime: "45 mins",
      distance: "4.2 km",
      amount: 280,
      pickupLocation: "Dairy Fresh Farm",
      timeSlot: "4:00 PM - 6:00 PM"
    },
    {
      id: "DEL-1003",
      orderId: "ORD-1287",
      customer: "Emily Davis", 
      address: "789 Oak Lane, Suburban Area, NY 12347",
      phone: "+1 234-567-8903",
      items: ["Bell Peppers", "Spinach", "Carrots"],
      priority: "Low",
      estimatedTime: "25 mins",
      distance: "1.8 km",
      amount: 320,
      pickupLocation: "Organic Gardens",
      timeSlot: "6:00 PM - 8:00 PM"
    }
  ];

  const completedDeliveries = [
    {
      id: "DEL-0998",
      orderId: "ORD-1285",
      customer: "John Smith",
      amount: 420,
      completedAt: "11:30 AM",
      rating: 5,
      tip: 50,
      distance: "3.1 km"
    },
    {
      id: "DEL-0997",
      orderId: "ORD-1284", 
      customer: "Lisa Brown",
      amount: 280,
      completedAt: "10:15 AM",
      rating: 4,
      tip: 30,
      distance: "2.7 km"
    },
    {
      id: "DEL-0996",
      orderId: "ORD-1283",
      customer: "Robert Wilson",
      amount: 390,
      completedAt: "9:45 AM",
      rating: 5,
      tip: 40,
      distance: "4.5 km"
    }
  ];

  const earningsHistory = [
    { date: "2025-10-06", deliveries: 8, earnings: 850, tips: 120, bonus: 50 },
    { date: "2025-10-05", deliveries: 12, earnings: 1180, tips: 180, bonus: 100 },
    { date: "2025-10-04", deliveries: 10, earnings: 920, tips: 150, bonus: 0 },
    { date: "2025-10-03", deliveries: 9, earnings: 840, tips: 110, bonus: 50 },
    { date: "2025-10-02", deliveries: 11, earnings: 1050, tips: 160, bonus: 100 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-25 to-yellow-100">
      <Header />
      
      {/* Header Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Rider Dashboard</h1>
            <p className="text-gray-600">Manage your deliveries and track earnings</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Navigation className="h-4 w-4 mr-2" />
              Start Navigation
            </Button>
            <Button className="bg-orange-600 hover:bg-orange-700">
              Update Status
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today&apos;s Deliveries</CardTitle>
              <Truck className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{riderStats.todayDeliveries}</div>
              <p className="text-xs text-gray-600">{riderStats.pendingDeliveries} pending</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today&apos;s Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatBDTaka(riderStats.todayEarnings)}</div>
              <p className="text-xs text-green-600">+{formatBDTaka(120)} in tips</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rider Rating</CardTitle>
              <Star className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{riderStats.rating}</div>
              <p className="text-xs text-gray-600">Based on {riderStats.totalDeliveries} deliveries</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{riderStats.completionRate}%</div>
              <p className="text-xs text-green-600">Excellent performance</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="deliveries">Active Deliveries</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Active Deliveries Tab */}
          <TabsContent value="deliveries" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Pending Deliveries</CardTitle>
                  <Badge variant="secondary">{riderStats.pendingDeliveries} pending</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingDeliveries.map((delivery) => (
                    <div key={delivery.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{delivery.id}</h3>
                          <Badge 
                            variant={
                              delivery.priority === "High" ? "destructive" : 
                              delivery.priority === "Medium" ? "secondary" : "outline"
                            }
                          >
                            {delivery.priority} Priority
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">{formatBDTaka(delivery.amount)}</p>
                          <p className="text-sm text-gray-600">{delivery.distance}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="font-medium">Customer: {delivery.customer}</p>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {delivery.address}
                          </p>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            {delivery.phone}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">Pickup: {delivery.pickupLocation}</p>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {delivery.timeSlot}
                          </p>
                          <p className="text-sm text-gray-600">
                            Items: {delivery.items.join(", ")}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          ETA: {delivery.estimatedTime}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Phone className="h-4 w-4 mr-1" />
                            Call
                          </Button>
                          <Button size="sm" variant="outline">
                            <Navigation className="h-4 w-4 mr-1" />
                            Navigate
                          </Button>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            Mark Delivered
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Completed Tab */}
          <TabsContent value="completed" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Today&apos;s Completed Deliveries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {completedDeliveries.map((delivery) => (
                    <div key={delivery.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{delivery.id}</h3>
                          <Badge variant="default">Completed</Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          Customer: {delivery.customer}
                        </p>
                        <p className="text-sm text-gray-500">
                          Completed at {delivery.completedAt} • {delivery.distance}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-sm">Rating:</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-3 w-3 ${i < delivery.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{formatBDTaka(delivery.amount)}</p>
                        {delivery.tip > 0 && (
                          <p className="text-sm text-green-600">+{formatBDTaka(delivery.tip)} tip</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Earnings Tab */}
          <TabsContent value="earnings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Total Earnings */}
              <Card>
                <CardHeader>
                  <CardTitle>Total Earnings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-green-600">{formatBDTaka(riderStats.totalEarnings)}</p>
                      <p className="text-gray-600">All time earnings</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-lg font-bold">{formatBDTaka(riderStats.todayEarnings)}</p>
                        <p className="text-sm text-gray-600">Today</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-lg font-bold">{formatBDTaka(5400)}</p>
                        <p className="text-sm text-gray-600">This Week</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total Deliveries</span>
                      <span className="font-bold">{riderStats.totalDeliveries}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Completion Rate</span>
                      <span className="font-bold text-green-600">{riderStats.completionRate}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Average Rating</span>
                      <span className="font-bold">{riderStats.rating}/5.0</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>On-time Delivery</span>
                      <span className="font-bold text-green-600">94%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Earnings History */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Earnings History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {earningsHistory.map((day, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-gray-600" />
                        <div>
                          <p className="font-medium">{day.date}</p>
                          <p className="text-sm text-gray-600">{day.deliveries} deliveries</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatBDTaka(day.earnings)}</p>
                        <div className="text-sm text-gray-600">
                          <span className="text-green-600">+{formatBDTaka(day.tips)} tips</span>
                          {day.bonus > 0 && <span className="text-blue-600"> +{formatBDTaka(day.bonus)} bonus</span>}
                        </div>
                      </div>
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
                <CardTitle>Rider Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Full Name</label>
                      <p className="text-gray-600">Alex Rodriguez</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Rider ID</label>
                      <p className="text-gray-600">RDR-2025-001</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Phone</label>
                      <p className="text-gray-600">+1 234-567-8900</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <p className="text-gray-600">alex.rodriguez@agromart.com</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Vehicle Type</label>
                      <p className="text-gray-600">Motorcycle</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Vehicle Number</label>
                      <p className="text-gray-600">NY-1234-AB</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Join Date</label>
                      <p className="text-gray-600">January 15, 2025</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Status</label>
                      <Badge variant="default">Active</Badge>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline">Edit Profile</Button>
                    <Button variant="outline">Vehicle Details</Button>
                    <Button variant="outline">Documents</Button>
                  </div>
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