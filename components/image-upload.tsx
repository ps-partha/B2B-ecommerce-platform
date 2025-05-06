"use client"

import type React from "react"

import { useState, useRef } from "react"
import { ImagePlus, Trash2, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

interface ImageUploadProps {
    maxImages?: number
    initialImages?: Array<{ id?: number; url: string }>
    onImagesChange: (images: Array<{ id?: number; url: string; file?: File }>) => void
    disabled?: boolean
}

export function ImageUpload({ maxImages = 4, initialImages = [], onImagesChange, disabled = false }: ImageUploadProps) {
    const [images, setImages] = useState<Array<{ id?: number; url: string; file?: File }>>(initialImages)
    const [uploading, setUploading] = useState(false)
    const [deleting, setDeleting] = useState<number | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { toast } = useToast()

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            // Check if adding new images would exceed the limit
            if (images.length + e.target.files.length > maxImages) {
                toast({
                    title: "Too many images",
                    description: `You can only upload a maximum of ${maxImages} images`,
                    variant: "destructive",
                })
                return
            }

            setUploading(true)

            try {
                // Create a FormData object to send the files
                const formData = new FormData()
                Array.from(e.target.files).forEach((file) => {
                    formData.append("files", file)
                })

                // Upload the files to the server
                const response = await fetch("/api/listings/uploads", {
                    method: "POST",
                    body: formData,
                })

                const data = await response.json()

                if (!data.success) {
                    throw new Error(data.message || "Failed to upload images")
                }

                // Add the new images to the state
                const newImages = data.files.map((file: any) => ({
                    url: file.path,
                    file: Array.from(e.target.files as FileList).find((f) => f.name === file.originalName),
                }))

                const updatedImages = [...images, ...newImages]
                setImages(updatedImages)
                onImagesChange(updatedImages)

                // Reset the file input
                if (fileInputRef.current) {
                    fileInputRef.current.value = ""
                }
            } catch (error) {
                console.error("Error uploading images:", error)
                toast({
                    title: "Upload failed",
                    description: error instanceof Error ? error.message : "Failed to upload images",
                    variant: "destructive",
                })
            } finally {
                setUploading(false)
            }
        }
    }

    const removeImage = async (index: number) => {
        setDeleting(index)

        try {
            const imageToRemove = images[index]

            // Only call the delete API if the image has a URL and it's in the product_images directory
            if (imageToRemove.url && imageToRemove.url.includes("/product_images/")) {
                // Call the API to delete the image from the server
                const response = await fetch("/api/listings/uploads/delete", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ imagePath: imageToRemove.url }),
                })

                const data = await response.json()

                if (!data.success) {
                    throw new Error(data.message || "Failed to delete image")
                }
            }

            // Remove the image from the state regardless of API success
            setImages((prev) => {
                const newImages = [...prev]
                newImages.splice(index, 1)
                onImagesChange(newImages)
                return newImages
            })

            toast({
                title: "Image removed",
                description: "The image has been removed successfully",
            })
        } catch (error) {
            console.error("Error deleting image:", error)
            toast({
                title: "Deletion failed",
                description: error instanceof Error ? error.message : "Failed to delete image",
                variant: "destructive",
            })
        } finally {
            setDeleting(null)
        }
    }
    return (
        <div className="space-y-2">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                {images.map((image, index) => (
                    <div key={index} className="relative aspect-square overflow-hidden rounded-md border bg-muted">
                        <img
                            src={image.url || "/placeholder.svg"}
                            alt={`Product image ${index + 1}`}
                            className="h-full w-full object-cover"
                        />
                        <button
                            type="button"
                            className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
                            onClick={() => removeImage(index)}
                            disabled={disabled || deleting === index}
                        >
                            {deleting === index ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </button>
                        {index === 0 && <Badge className="absolute left-2 top-2 bg-primary">Main</Badge>}
                    </div>
                ))}
                {images.length < maxImages && (
                    <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-md border border-dashed bg-muted hover:bg-muted/80">
                        {uploading ? (
                            <div className="flex flex-col items-center justify-center">
                                <Loader2 className="mb-2 h-8 w-8 animate-spin text-muted-foreground" />
                                <span className="text-sm font-medium">Uploading...</span>
                            </div>
                        ) : (
                            <>
                                <ImagePlus className="mb-2 h-8 w-8 text-muted-foreground" />
                                <span className="text-sm font-medium">Add Image</span>
                                <span className="text-xs text-muted-foreground">PNG, JPG or WEBP</span>
                                <span className="text-xs text-muted-foreground">
                                    {images.length}/{maxImages} images
                                </span>
                            </>
                        )}
                        <Input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleImageUpload}
                            disabled={disabled || uploading || images.length >= maxImages}
                        />
                    </label>
                )}
            </div>
        </div>
    )
}
