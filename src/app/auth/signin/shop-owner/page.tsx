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
import { Wheat, Mail, Lock, Chrome, Store, BarChart3, Users } from "lucide-react";

export default function ShopOwnerSignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard/shop-owner";

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
        if (session?.user?.role === "SHOP_OWNER") {
          router.push("/dashboard/shop-owner");
        } else if (session?.user?.role) {
          const roleRedirects = {
            ADMIN: "/dashboard/admin",
            CUSTOMER: "/dashboard/customer",
            SELLER: "/dashboard/seller",
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-violet-100 px-4">
      <Card className="w-full max-w-md border-purple-200 shadow-lg">
        <CardHeader className="text-center bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-t-lg">
          <Link href="/" className="flex items-center justify-center gap-2 mb-4 hover:opacity-80 transition-opacity">
            <Wheat className="h-8 w-8 text-white" />
            <span className="text-2xl font-bold">AgroMart</span>
          </Link>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Store className="h-6 w-6" />
            <CardTitle className="text-2xl">Shop Owner Portal</CardTitle>
          </div>
          <CardDescription className="text-purple-100">
            Sign in to manage your multiple shops
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              <h3 className="font-semibold text-purple-800">Shop Owner Benefits</h3>
            </div>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• Manage multiple shop locations</li>
              <li>• Source from various farmers</li>
              <li>• Advanced analytics and reporting</li>
              <li>• Inventory management across shops</li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 border-purple-200 focus:border-purple-500"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 border-purple-200 focus:border-purple-500"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In as Shop Owner"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-purple-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full border-purple-200 hover:bg-purple-50"
            onClick={() => signIn("google", { callbackUrl })}
            disabled={isLoading}
          >
            <Chrome className="mr-2 h-4 w-4" />
            Google
          </Button>

          <div className="text-center text-sm text-gray-600">
            Not a shop owner?{" "}
            <Link 
              href="/auth/signin" 
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              Choose different role
            </Link>
          </div>

          <div className="text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link 
              href="/auth/signup" 
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              Sign up as Shop Owner
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}