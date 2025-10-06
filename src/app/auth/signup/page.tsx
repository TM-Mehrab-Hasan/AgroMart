"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Wheat, Mail, Lock, User, Phone, UserCheck } from "lucide-react";
import { UserRole } from "@prisma/client";

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "" as UserRole | "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(""); // Clear error when user starts typing
  };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      setError("Please fill in all required fields");
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setSuccess("Account created successfully! Please sign in.");
      setTimeout(() => {
        router.push("/auth/signin");
      }, 2000);
    } catch (error: any) {
      setError(error.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const roleOptions = [
    { value: UserRole.CUSTOMER, label: "Customer", description: "Buy agricultural products" },
    { value: UserRole.SELLER, label: "Seller/Producer", description: "Farmer, fisherman, dairy producer" },
    { value: UserRole.SHOP_OWNER, label: "Shop Owner", description: "Sell products from multiple farmers" },
    { value: UserRole.RIDER, label: "Delivery Rider", description: "Deliver orders to customers" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-25 to-green-100 px-4 py-8 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-20 w-16 h-16 bg-green-200/40 rounded-full blur-lg animate-bounce delay-500"></div>
      <div className="absolute bottom-20 right-20 w-20 h-20 bg-emerald-200/30 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/3 right-10 w-12 h-12 bg-green-300/50 rounded-full blur-md animate-pulse delay-300"></div>
      
      <Card className="w-full max-w-md backdrop-blur-sm bg-white/95 shadow-2xl border-0 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/40 to-emerald-50/40 rounded-lg"></div>
        <CardHeader className="text-center relative z-10">
          <Link href="/" className="flex items-center justify-center gap-3 mb-6 hover:scale-105 transition-transform duration-300">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
              <Wheat className="h-8 w-8 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
              AgroMart
            </span>
          </Link>
          <CardTitle className="text-3xl font-bold text-gray-800">Create Account</CardTitle>
          <CardDescription className="text-lg text-gray-600">
            Join our agricultural marketplace community
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 relative z-10">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="pl-10 border-green-200 focus:border-green-500"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="pl-10 border-green-200 focus:border-green-500"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+880 1XXX-XXXXXX"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="pl-10 border-green-200 focus:border-green-500"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Account Type *</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleInputChange("role", value)}
                disabled={isLoading}
              >
                <SelectTrigger className="border-green-200 focus:border-green-500">
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-gray-400" />
                    <SelectValue placeholder="Select your role" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex flex-col py-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{option.label}</span>
                          <div className={`w-3 h-3 rounded-full ${
                            option.value === UserRole.CUSTOMER ? 'bg-blue-500' :
                            option.value === UserRole.SELLER ? 'bg-green-500' :
                            option.value === UserRole.SHOP_OWNER ? 'bg-purple-500' :
                            'bg-orange-500'
                          }`}></div>
                        </div>
                        <span className="text-sm text-gray-500">{option.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div className="text-xs text-gray-600 p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 transition-all hover:shadow-md">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <strong className="text-blue-700">Customer</strong>
                  </div>
                  <span className="text-blue-600">Buy fresh products</span>
                </div>
                <div className="text-xs text-gray-600 p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 transition-all hover:shadow-md">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <strong className="text-green-700">Farmer</strong>
                  </div>
                  <span className="text-green-600">Sell your produce</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-xs text-gray-600 p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200 transition-all hover:shadow-md">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <strong className="text-purple-700">Shop Owner</strong>
                  </div>
                  <span className="text-purple-600">Multiple locations</span>
                </div>
                <div className="text-xs text-gray-600 p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200 transition-all hover:shadow-md">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <strong className="text-orange-700">Rider</strong>
                  </div>
                  <span className="text-orange-600">Deliver orders</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password (min. 6 characters)"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="pl-10 border-green-200 focus:border-green-500"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  className="pl-10 border-green-200 focus:border-green-500"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="text-center bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
            <p className="text-gray-700 font-medium mb-2">Already have an account?</p>
            <Link 
              href="/auth/signin" 
              className="text-green-600 hover:text-green-700 font-bold text-lg hover:underline transition-all duration-300"
            >
              Sign in here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}