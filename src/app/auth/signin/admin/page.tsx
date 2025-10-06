"use client";

import { useState, useEffect } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Wheat, Mail, Lock, Chrome, Shield, Settings, BarChart3 } from "lucide-react";

export default function AdminSignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard/admin";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        const session = await getSession();
        if (session?.user?.role === "ADMIN") {
          router.push("/dashboard/admin");
        } else if (session?.user?.role) {
          const roleRedirects = {
            CUSTOMER: "/dashboard/customer",
            SELLER: "/dashboard/seller",
            SHOP_OWNER: "/dashboard/shop-owner",
            RIDER: "/dashboard/rider",
          };
          const redirectTo = roleRedirects[session.user.role] || callbackUrl;
          router.push(redirectTo);
        } else {
          router.push(callbackUrl);
        }
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-slate-100 px-4">
      <Card className="w-full max-w-md border-gray-200 shadow-lg">
        <CardHeader className="text-center bg-gradient-to-r from-gray-600 to-slate-700 text-white rounded-t-lg">
          <Link href="/" className="flex items-center justify-center gap-2 mb-4 hover:opacity-80 transition-opacity">
            <Wheat className="h-8 w-8 text-white" />
            <span className="text-2xl font-bold">AgroMart</span>
          </Link>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="h-6 w-6" />
            <CardTitle className="text-2xl">Admin Portal</CardTitle>
          </div>
          <CardDescription className="text-gray-100">
            Administrative access to AgroMart platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Settings className="h-5 w-5 text-gray-600" />
              <h3 className="font-semibold text-gray-800">Admin Capabilities</h3>
            </div>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Monitor platform operations</li>
              <li>• Manage users and permissions</li>
              <li>• View comprehensive analytics</li>
              <li>• System configuration control</li>
            </ul>
          </div>

          <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
            <div className="flex items-center gap-2 text-amber-800">
              <Shield className="h-4 w-4" />
              <span className="text-sm font-medium">Secure Admin Access</span>
            </div>
            <p className="text-xs text-amber-700 mt-1">
              This portal is restricted to authorized administrators only.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Admin Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter admin email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 border-gray-200 focus:border-gray-500"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Admin Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 border-gray-200 focus:border-gray-500"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gray-600 hover:bg-gray-700"
              disabled={isLoading}
            >
              {isLoading ? "Authenticating..." : "Access Admin Panel"}
            </Button>
          </form>

          <div className="text-center text-sm text-gray-600">
            Not an admin?{" "}
            <Link 
              href="/auth/signin" 
              className="text-gray-600 hover:text-gray-700 font-medium"
            >
              Choose different role
            </Link>
          </div>

          <div className="text-center text-sm text-gray-500">
            <Link 
              href="/auth/forgot-password" 
              className="hover:text-gray-700"
            >
              Forgot admin credentials?
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}