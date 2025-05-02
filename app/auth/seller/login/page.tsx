"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Lock, Mail, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function SellerLoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  })

  const router = useRouter()
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    let valid = true
    const newErrors = { ...errors }

    if (!formData.email) {
      newErrors.email = "Email is required"
      valid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
      valid = false
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setErrors((prev) => ({ ...prev, general: "" }))

    try {
      const res = await fetch("/api/auth/seller-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      console.log(res);

      if (!res.ok) {
        setErrors((prev) => ({ ...prev, general: "Invalid email or password" }))
        toast({
          title: "Login failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Login successful",
          description: "Welcome to the admin dashboard!",
          variant: "success",
        })
        router.push("/dashboard")
      }


    } catch (error) {
      console.error("Login error:", error)
      setErrors((prev) => ({ ...prev, general: "An error occurred during login" }))
      toast({
        title: "Login failed",
        description: "An error occurred. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12">
      <Card className="w-full max-w-md overflow-hidden border-none shadow-lg transition-all duration-300 hover:shadow-xl dark:shadow-none dark:hover:shadow-primary/10">
        <CardHeader className="bg-gradient-to-br from-violet-600 via-indigo-700 to-purple-800 text-white dark:from-violet-950 dark:via-indigo-950 dark:to-purple-950">
          <div className="flex justify-center pb-4">
            <div className="rounded-full bg-white/20 p-3">
              <Shield className="h-8 w-8" />
            </div>
          </div>
          <CardTitle className="text-center text-2xl">Seller Dashboard</CardTitle>
          <CardDescription className="text-center text-white/80">
            Login to access the Seller control panel
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-8">
          {errors.general && (
            <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seller@example.com"
                  className={`pl-10 transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 ${errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""
                    }`}
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
              {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/auth/forgot-password" className="text-xs text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`pl-10 transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 ${errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""
                    }`}
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-muted-foreground transition-colors hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
            </div>

            <Button
              type="submit"
              className="w-full bg-primary text-white transition-all duration-300 hover:bg-primary/90 hover:shadow-md hover:shadow-primary/20"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg
                    className="mr-2 h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Logging in...
                </div>
              ) : (
                "Login to Seller Panel"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>
              Return to{" "}
              <Link href="/" className="font-medium text-primary hover:underline">
                main site
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
