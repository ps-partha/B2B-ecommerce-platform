"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ImageUpload } from "@/components/image-upload"

export default function AddListingPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [images, setImages] = useState<Array<{ id?: number; url: string; file?: File }>>([])
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    price: "",
    originalPrice: "", // For showing discounted price
    description: "",
    features: [""], // For bullet points shown on product page
    productInfo: [{ key: "", value: "" }],
    transferInfo: {
      deliveryTime: "",
      returns: "",
    },
  })
  const [errors, setErrors] = useState({
    title: "",
    category: "",
    price: "",
    originalPrice: "",
    description: "",
    features: "",
    productInfo: "",
    transferInfo: "",
    images: "",
  })

  const router = useRouter()
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }))
    if (errors.category) {
      setErrors((prev) => ({ ...prev, category: "" }))
    }
  }

  const handleImagesChange = (newImages: Array<{ id?: number; url: string; file?: File }>) => {
    setImages(newImages)
    if (errors.images) {
      setErrors((prev) => ({ ...prev, images: "" }))
    }
  }

  const validateForm = () => {
    let valid = true
    const newErrors = { ...errors }

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
      valid = false
    }

    if (!formData.category) {
      newErrors.category = "Category is required"
      valid = false
    }

    if (!formData.price) {
      newErrors.price = "Price is required"
      valid = false
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = "Price must be a positive number"
      valid = false
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
      valid = false
    } else if (formData.description.length < 50) {
      newErrors.description = "Description must be at least 50 characters"
      valid = false
    }

    // New validations for additional fields
    if (formData.features.length === 0 || formData.features.some((f) => !f.trim())) {
      newErrors.features = "At least one feature is required"
      valid = false
    }

    // Validate product info
    const productInfoEmpty = formData.productInfo.some((item) => !item.key.trim() || !item.value.trim())
    if (productInfoEmpty) {
      newErrors.productInfo = "All product information fields are required"
      valid = false
    }

    // Validate transfer info
    const transferInfoEmpty = Object.values(formData.transferInfo).some((value) => !value.trim())
    if (transferInfoEmpty) {
      newErrors.transferInfo = "All transfer information fields are required"
      valid = false
    }

    // Image validation
    if (images.length === 0) {
      newErrors.images = "At least one image is required"
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleSubmitListing = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      // 1. Filter out empty features
      const filteredFeatures = formData.features.filter((feature) => feature.trim() !== "")

      // 2. Filter out empty product info
      const filteredProductInfo = formData.productInfo.filter(
        (info) => info.key.trim() !== "" && info.value.trim() !== "",
      )

      // 3. Prepare the data to send to the API
      const listingData = {
        title: formData.title,
        description: formData.description,
        price: formData.price,
        originalPrice: formData.originalPrice || null,
        category: formData.category,
        features: filteredFeatures,
        productInfo: filteredProductInfo,
        transferInfo: formData.transferInfo,
        imageUrls: images.map((img) => img.url),
      }

      // 4. Send the data to the API
      const response = await fetch("/api/listings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(listingData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to create listing")
      }

      // 5. Show success message
      toast({
        title: "Listing created",
        description: "Your listing has been created successfully.",
      })

      // 6. Redirect to dashboard
      router.push("/seller-dashboard")
    } catch (error) {
      console.error("Error creating listing:", error)
      toast({
        title: "Failed to create listing",
        description:
          error instanceof Error ? error.message : "There was an error creating your listing. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/seller-dashboard" className="mb-4 flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold md:text-3xl">Create New Listing</h1>
        <p className="text-muted-foreground">Fill in the details to create a new listing</p>
      </div>

      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmitListing} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Enter a descriptive title"
                    className={errors.title ? "border-red-500" : ""}
                    value={formData.title}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={handleSelectChange} disabled={isLoading}>
                    <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gaming-accounts">Gaming Accounts</SelectItem>
                      <SelectItem value="social-media-accounts">Social Media Accounts</SelectItem>
                      <SelectItem value="digital-products">Digital Products</SelectItem>
                      <SelectItem value="services">Services</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="text-xs text-red-500">{errors.category}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    placeholder="0.00"
                    min="0.01"
                    step="0.01"
                    className={errors.price ? "border-red-500" : ""}
                    value={formData.price}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  {errors.price && <p className="text-xs text-red-500">{errors.price}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Provide a detailed description of what you're selling"
                    rows={6}
                    className={errors.description ? "border-red-500" : ""}
                    value={formData.description}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
                  <p className="text-xs text-muted-foreground">
                    {formData.description.length}/500 characters (minimum 50)
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-2">
                  <Label htmlFor="features">Key Features</Label>
                  <div className="space-y-2">
                    {formData.features.map((feature, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={feature}
                          onChange={(e) => {
                            const newFeatures = [...formData.features]
                            newFeatures[index] = e.target.value
                            setFormData((prev) => ({ ...prev, features: newFeatures }))
                          }}
                          placeholder={`Feature ${index + 1}`}
                          disabled={isLoading}
                        />
                        {index > 0 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              const newFeatures = formData.features.filter((_, i) => i !== index)
                              setFormData((prev) => ({ ...prev, features: newFeatures }))
                            }}
                            disabled={isLoading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  {formData.features.length < 5 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          features: [...prev.features, ""],
                        }))
                      }}
                      disabled={isLoading}
                    >
                      Add Feature
                    </Button>
                  )}
                  {errors.features && <p className="text-xs text-red-500">{errors.features}</p>}
                </div>

                {/* Original Price for Discount */}
                <div className="space-y-2">
                  <Label htmlFor="originalPrice">Original Price ($) (Optional, for showing discount)</Label>
                  <Input
                    id="originalPrice"
                    name="originalPrice"
                    type="number"
                    placeholder="0.00"
                    min="0.01"
                    step="0.01"
                    className={errors.originalPrice ? "border-red-500" : ""}
                    value={formData.originalPrice}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  {errors.originalPrice && <p className="text-xs text-red-500">{errors.originalPrice}</p>}
                </div>

                {/* Product Information */}
                <div className="space-y-2">
                  <Label>Product Information</Label>
                  <div className="space-y-3">
                    {formData.productInfo.map((item, index) => (
                      <div key={index} className="flex gap-2">
                        <div className="flex-1">
                          <Input
                            value={item.key}
                            onChange={(e) => {
                              const newProductInfo = [...formData.productInfo]
                              newProductInfo[index].key = e.target.value
                              setFormData((prev) => ({ ...prev, productInfo: newProductInfo }))
                            }}
                            placeholder="Key"
                            disabled={isLoading}
                          />
                        </div>
                        <div className="flex-1">
                          <Input
                            value={item.value}
                            onChange={(e) => {
                              const newProductInfo = [...formData.productInfo]
                              newProductInfo[index].value = e.target.value
                              setFormData((prev) => ({ ...prev, productInfo: newProductInfo }))
                            }}
                            placeholder="Value"
                            disabled={isLoading}
                          />
                        </div>
                        {formData.productInfo.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              const newProductInfo = formData.productInfo.filter((_, i) => i !== index)
                              setFormData((prev) => ({ ...prev, productInfo: newProductInfo }))
                            }}
                            disabled={isLoading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        productInfo: [...prev.productInfo, { key: "", value: "" }],
                      }))
                    }}
                    disabled={isLoading}
                  >
                    Add Product Information
                  </Button>
                  {errors.productInfo && <p className="text-xs text-red-500">{errors.productInfo}</p>}
                </div>

                {/* Transfer Information */}
                <div className="space-y-2">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="deliveryTime">Delivery Time</Label>
                      <Select
                        value={formData.transferInfo.deliveryTime}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            transferInfo: { ...prev.transferInfo, deliveryTime: value },
                          }))
                        }
                        disabled={isLoading}
                      >
                        <SelectTrigger id="deliveryTime">
                          <SelectValue placeholder="e.g., Within 24 hours" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="24-hours">Within 24 hours</SelectItem>
                          <SelectItem value="1-2-days">1–2 days</SelectItem>
                          <SelectItem value="3-5-days">3–5 days</SelectItem>
                          <SelectItem value="up-to-1-week">Up to 1 week</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="returns">Returns</Label>
                      <Select
                        value={formData.transferInfo.returns}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            transferInfo: { ...prev.transferInfo, returns: value },
                          }))
                        }
                        disabled={isLoading}
                      >
                        <SelectTrigger id="returns">
                          <SelectValue placeholder="e.g., Not Accepted" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="not-accepted">Not Accepted</SelectItem>
                          <SelectItem value="accepted">Accepted</SelectItem>
                          <SelectItem value="30-days-return">30 Days Return</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {errors.transferInfo && <p className="text-xs text-red-500">{errors.transferInfo}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Images (Maximum 4)</Label>
                  <ImageUpload
                    maxImages={4}
                    initialImages={[]}
                    onImagesChange={handleImagesChange}
                    disabled={isLoading}
                  />
                  {errors.images && <p className="text-xs text-red-500">{errors.images}</p>}
                </div>

                <div className="flex gap-4">
                  <Button type="submit" className="flex-1 bg-violet-600 hover:bg-violet-700" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Listing"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => router.push("/dashboard")}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 text-lg font-semibold">Listing Guidelines</h2>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mt-0.5 text-green-500"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  <span>Provide accurate and detailed information about what you're selling</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mt-0.5 text-green-500"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  <span>Upload clear, high-quality images</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mt-0.5 text-green-500"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  <span>Set a fair and competitive price</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mt-0.5 text-green-500"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  <span>Be responsive to buyer inquiries</span>
                </li>
              </ul>

              <div className="mt-6 rounded-lg bg-amber-50 p-4 text-amber-800">
                <h3 className="mb-2 font-medium">Important Notice</h3>
                <p className="text-sm">
                  All listings are reviewed by our team before being published. Listings that violate our terms of
                  service will be rejected.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 text-lg font-semibold">Fees & Payments</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Transaction Fee</span>
                  <span className="font-medium">4.5%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Payment Processing</span>
                  <span className="font-medium">2.9% + $0.30</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Payout Time</span>
                  <span className="font-medium">2-3 business days</span>
                </div>
              </div>

              <div className="mt-4 text-xs text-muted-foreground">
                Fees are deducted from the final sale price. You'll receive the remaining amount in your account
                balance.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
