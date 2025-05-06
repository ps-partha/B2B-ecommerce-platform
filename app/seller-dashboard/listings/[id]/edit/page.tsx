"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ImagePlus, Loader2, Save, Trash2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { ImageUpload } from "@/components/image-upload"

type Category = {
    id: number
    name: string
    slug: string
}

type Listing = {
    id: number
    title: string
    description: string
    sales: number
    views: number
    price: string
    slug : string
    originalPrice: string | null
    status: string
    createdAt: string
    updatedAt: string
    featured: boolean
    features: string[]
    productInfo: { key: string; value: string }[]
    transferInfo: {
        deliveryTime: string
        returns: string
    }
    sellerId: number
    categoryId: number
    seller: {
        user: {
            name: string
        }
    }
    images: {
        id: number
        url: string
        isMain: boolean
    }[]
    category: Category
}

export default function EditListingPage({ params }: { params: { id: string } }) {
    const [listing, setListing] = useState<Listing | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [images, setImages] = useState<Array<{ id?: number; url: string; file?: File }>>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        originalPrice: "",
        categoryId: "",
        status: "",
        featured: false,
        features: [""],
        productInfo: [{ key: "", value: "" }],
        transferInfo: {
            deliveryTime: "",
            returns: "",
        },
    })
    const [errors, setErrors] = useState<Record<string, string>>({})

    const router = useRouter()
    const { toast } = useToast()
    const listingId = params.id

    // Fetch listing data
    useEffect(() => {
        const fetchListing = async () => {
            try {
                const response = await fetch(`/api/listings/${listingId}?isedit=true`)
                const data = await response.json()

                if (data.success) {
                    const listingData = data.data
                    setListing(listingData)

                    // Set form data
                    setFormData({
                        title: listingData.title,
                        description: listingData.description,
                        price: listingData.price,
                        originalPrice: listingData.originalPrice || "",
                        categoryId: String(listingData.categoryId),
                        status: listingData.status,
                        featured: listingData.featured,
                        features: listingData.features.length > 0 ? listingData.features : [""],
                        productInfo: listingData.productInfo.length > 0 ? listingData.productInfo : [{ key: "", value: "" }],
                        transferInfo: listingData.transferInfo || {
                            deliveryTime: "",
                            returns: "",
                        },
                    })

                    // Set images
                    setImages(
                        listingData.images.map((img: any) => ({
                            url: img.url,
                            id: img.id,
                        })),
                    )
                } else {
                    toast({
                        title: "Error",
                        description: data.message || "Failed to fetch listing",
                        variant: "destructive",
                    })
                    router.push("/seller-dashboard/listings/")
                }
            } catch (error) {
                toast({
                    title: "Error",
                    description: "An unexpected error occurred",
                    variant: "destructive",
                })
                router.push("/seller-dashboard/listings/")
            } finally {
                setLoading(false)
            }
        }

        const fetchCategories = async () => {
            try {
                const response = await fetch("/api/categories")
                const data = await response.json()
                if (data.success) {
                    setCategories(data.categories)
                }
            } catch (error) {
                console.error("Failed to fetch categories:", error)
            }
        }

        fetchListing()
        fetchCategories()
    }, [listingId, router, toast])

    console.log(listing?.slug)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))

        // Clear error when user types
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }))
        }
    }

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }))
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }))
        }
    }

    const handleFeaturedChange = (value: boolean) => {
        setFormData((prev) => ({ ...prev, featured: value }))
    }

    const validateForm = () => {
        let valid = true
        const newErrors: Record<string, string> = {}

        if (!formData.title.trim()) {
            newErrors.title = "Title is required"
            valid = false
        }

        if (!formData.categoryId) {
            newErrors.categoryId = "Category is required"
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

        if (!formData.status) {
            newErrors.status = "Status is required"
            valid = false
        }

        // Validate features
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
        if (!formData.transferInfo.deliveryTime) {
            newErrors.deliveryTime = "Delivery time is required"
            valid = false
        }

        if (!formData.transferInfo.returns) {
            newErrors.returns = "Return policy is required"
            valid = false
        }

        // Image validation
        if (images.length === 0) {
            newErrors.images = "At least one image is required"
            valid = false
        } else if (images.length > 4) {
            newErrors.images = "Maximum 4 images allowed"
            valid = false
        }

        setErrors(newErrors)
        return valid
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateForm()) return
        setSaving(true)
        try {
            // 1. Filter out empty features and product info
            const filteredFeatures = formData.features.filter((feature) => feature.trim() !== "")
            const filteredProductInfo = formData.productInfo.filter(
                (info) => info.key.trim() !== "" && info.value.trim() !== "",
            )

            // 2. Prepare the data to send to the API
            const updateData = {
                title: formData.title,
                description: formData.description,
                price: formData.price,
                originalPrice: formData.originalPrice || null,
                categoryId: Number(formData.categoryId),
                status: formData.status,
                featured: formData.featured,
                features: filteredFeatures,
                productInfo: filteredProductInfo,
                transferInfo: formData.transferInfo,
                imageUrls: images.map((img) => img.url),
                imageIds: images.filter((img) => img.id).map((img) => img.id),
            }

            // 3. Send the data to the API
            const response = await fetch(`/api/listings/${listingId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updateData),
            })

            const data = await response.json()

            if (data.success) {
                toast({
                    title: "Success",
                    description: "Listing updated successfully",
                })
                router.push("/seller-dashboard/listings/")
            } else {
                throw new Error(data.message || "Failed to update listing")
            }
        } catch (error) {
            console.error("Error updating listing:", error)
            toast({
                title: "Error",
                description:
                    error instanceof Error ? error.message : "There was an error updating your listing. Please try again.",
                variant: "destructive",
            })
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="mb-6">
                    <Skeleton className="h-8 w-40" />
                    <Skeleton className="mt-2 h-4 w-60" />
                </div>
                <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
                    <Card>
                        <CardContent className="p-6">
                            <div className="space-y-6">
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-32 w-full" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        </CardContent>
                    </Card>
                    <div className="space-y-6">
                        <Card>
                            <CardContent className="p-6">
                                <Skeleton className="h-6 w-32 mb-4" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-3/4" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <Link
                    href="/seller-dashboard/listings/"
                    className="mb-4 flex items-center text-sm text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Listings
                </Link>
                <h1 className="text-2xl font-bold md:text-3xl">Edit Listing</h1>
                <p className="text-muted-foreground">Update the listing details</p>
            </div>

            <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
                <div className="space-y-6">
                    <Card>
                        <CardContent className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        placeholder="Enter a descriptive title"
                                        className={errors.title ? "border-red-500" : ""}
                                        value={formData.title}
                                        onChange={handleChange}
                                        disabled={saving}
                                    />
                                    {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="categoryId">Category</Label>
                                    <Select
                                        value={formData.categoryId}
                                        onValueChange={(value) => handleSelectChange("categoryId", value)}
                                        disabled={saving}
                                    >
                                        <SelectTrigger className={errors.categoryId ? "border-red-500" : ""}>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={String(category.id)}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.categoryId && <p className="text-xs text-red-500">{errors.categoryId}</p>}
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
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
                                            disabled={saving}
                                        />
                                        {errors.price && <p className="text-xs text-red-500">{errors.price}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="originalPrice">Original Price ($) (Optional)</Label>
                                        <Input
                                            id="originalPrice"
                                            name="originalPrice"
                                            type="number"
                                            placeholder="0.00"
                                            min="0.01"
                                            step="0.01"
                                            value={formData.originalPrice}
                                            onChange={handleChange}
                                            disabled={saving}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        placeholder="Provide a detailed description"
                                        rows={6}
                                        className={errors.description ? "border-red-500" : ""}
                                        value={formData.description}
                                        onChange={handleChange}
                                        disabled={saving}
                                    />
                                    {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
                                    <p className="text-xs text-muted-foreground">
                                        {formData.description.length}/500 characters (minimum 50)
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                        value={formData.status}
                                        onValueChange={(value) => handleSelectChange("status", value)}
                                        disabled={saving}
                                    >
                                        <SelectTrigger className={errors.status ? "border-red-500" : ""}>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ACTIVE">Active</SelectItem>
                                            <SelectItem value="PENDING">Pending</SelectItem>
                                            <SelectItem value="INACTIVE">Inactive</SelectItem>
                                            <SelectItem value="SOLD">Sold</SelectItem>
                                            <SelectItem value="REJECTED">Rejected</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.status && <p className="text-xs text-red-500">{errors.status}</p>}
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="featured">Featured Listing</Label>
                                        <Select
                                            value={formData.featured ? "yes" : "no"}
                                            onValueChange={(value) => handleFeaturedChange(value === "yes")}
                                            disabled={saving}
                                        >
                                            <SelectTrigger className="w-[100px]">
                                                <SelectValue placeholder="Featured?" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="yes">Yes</SelectItem>
                                                <SelectItem value="no">No</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Featured listings appear at the top of search results and on the homepage
                                    </p>
                                </div>

                                <Separator />

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
                                                    disabled={saving}
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
                                                        disabled={saving}
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
                                            disabled={saving}
                                        >
                                            Add Feature
                                        </Button>
                                    )}
                                    {errors.features && <p className="text-xs text-red-500">{errors.features}</p>}
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
                                                        disabled={saving}
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
                                                        disabled={saving}
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
                                                        disabled={saving}
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
                                        disabled={saving}
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
                                                disabled={saving}
                                            >
                                                <SelectTrigger id="deliveryTime" className={errors.deliveryTime ? "border-red-500" : ""}>
                                                    <SelectValue placeholder="e.g., Within 24 hours" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="within-24-hours">Within 24 hours</SelectItem>
                                                    <SelectItem value="1-2-days">1 to 2 days</SelectItem>
                                                    <SelectItem value="3-5-days">3 to 5 days</SelectItem>
                                                    <SelectItem value="up-to-1-week">Up to 1 week</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.deliveryTime && <p className="text-xs text-red-500">{errors.deliveryTime}</p>}
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
                                                disabled={saving}
                                            >
                                                <SelectTrigger id="returns" className={errors.returns ? "border-red-500" : ""}>
                                                    <SelectValue placeholder="e.g., Not Accepted" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="not-accepted">Not Accepted</SelectItem>
                                                    <SelectItem value="accepted">Accepted</SelectItem>
                                                    <SelectItem value="30-days-return">30 Days Return</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.returns && <p className="text-xs text-red-500">{errors.returns}</p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Images (Maximum 4)</Label>
                                    <ImageUpload
                                        maxImages={4}
                                        initialImages={images}
                                        onImagesChange={(newImages) => setImages(newImages)}
                                        disabled={saving}
                                    />
                                    {errors.images && <p className="text-xs text-red-500">{errors.images}</p>}
                                </div>

                                <div className="flex gap-4">
                                    <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90" disabled={saving}>
                                        {saving ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="mr-2 h-4 w-4" />
                                                Save Changes
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => router.push("/seller-dashboard/listings/")}
                                        disabled={saving}
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
                            <h2 className="mb-4 text-lg font-semibold">Listing Details</h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">ID</span>
                                    <span className="font-medium">{listing?.id}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Created</span>
                                    <span className="font-medium">{new Date(listing?.createdAt || "").toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Last Updated</span>
                                    <span className="font-medium">{new Date(listing?.updatedAt || "").toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Views</span>
                                    <span className="font-medium">{listing?.views || 0}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Sales</span>
                                    <span className="font-medium">{listing?.sales || 0}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Seller</span>
                                    <span className="font-medium">{listing?.seller?.user?.name || "Unknown"}</span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <Link href={`/${listing?.category.slug}/${listing?.slug}`} target="_blank">
                                    <Button variant="outline" className="w-full">
                                        View Public Listing
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
