"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MoreHorizontal, Eye, Edit, Trash, ArrowUp, ArrowDown, Package } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { LucideIcon } from "lucide-react"
import * as Icons from "lucide-react"

interface Category {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  listingsCount: number
  displayOrder: number
  isActive: boolean
}

async function fetchCategories() {
  // In a real application, this would fetch from your API
  // For now, we'll return mock data
  const mockCategories: Category[] = [
    {
      id: "1",
      name: "Gaming Accounts",
      slug: "gaming-accounts",
      description: "Buy and sell gaming accounts for various platforms",
      icon: "GamepadIcon",
      listingsCount: 245,
      displayOrder: 1,
      isActive: true,
    },
    {
      id: "2",
      name: "Social Media Accounts",
      slug: "social-media-accounts",
      description: "Buy and sell social media accounts with established followers",
      icon: "Share2Icon",
      listingsCount: 189,
      displayOrder: 2,
      isActive: true,
    },
    {
      id: "3",
      name: "Digital Products",
      slug: "digital-products",
      description: "Digital goods including software, designs, and more",
      icon: "FileDigitIcon",
      listingsCount: 312,
      displayOrder: 3,
      isActive: true,
    },
    {
      id: "4",
      name: "Services",
      slug: "services",
      description: "Professional services for various digital needs",
      icon: "HeadphonesIcon",
      listingsCount: 156,
      displayOrder: 4,
      isActive: true,
    },
    {
      id: "5",
      name: "Domains & Websites",
      slug: "domains-websites",
      description: "Buy and sell domains, websites, and web applications",
      icon: "GlobeIcon",
      listingsCount: 98,
      displayOrder: 5,
      isActive: true,
    },
    {
      id: "6",
      name: "Subscriptions",
      slug: "subscriptions",
      description: "Premium subscriptions for various digital services",
      icon: "CalendarIcon",
      listingsCount: 76,
      displayOrder: 6,
      isActive: true,
    },
    {
      id: "7",
      name: "Virtual Items",
      slug: "virtual-items",
      description: "In-game items, virtual goods, and digital collectibles",
      icon: "BoxIcon",
      listingsCount: 203,
      displayOrder: 7,
      isActive: true,
    },
    {
      id: "8",
      name: "Other",
      slug: "other",
      description: "Other digital products and services",
      icon: "MoreHorizontalIcon",
      listingsCount: 45,
      displayOrder: 8,
      isActive: false,
    },
  ]

  return mockCategories
}

export function CategoriesList() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useState(() => {
    const loadCategories = async () => {
      setIsLoading(true)
      const result = await fetchCategories()
      setCategories(result)
      setIsLoading(false)
    }

    loadCategories()
  })

  const getIconComponent = (iconName: string): LucideIcon => {
    // @ts-ignore - dynamic icon import
    return Icons[iconName] || Icons.HelpCircle
  }

  const moveCategory = (id: string, direction: "up" | "down") => {
    const newCategories = [...categories]
    const index = newCategories.findIndex((c) => c.id === id)

    if (direction === "up" && index > 0) {
      // Swap with the category above
      const temp = newCategories[index]
      newCategories[index] = newCategories[index - 1]
      newCategories[index - 1] = temp

      // Update display orders
      newCategories[index].displayOrder = index + 1
      newCategories[index - 1].displayOrder = index
    } else if (direction === "down" && index < newCategories.length - 1) {
      // Swap with the category below
      const temp = newCategories[index]
      newCategories[index] = newCategories[index + 1]
      newCategories[index + 1] = temp

      // Update display orders
      newCategories[index].displayOrder = index + 1
      newCategories[index + 1].displayOrder = index + 2
    }

    setCategories(newCategories)
    // In a real app, you would save this to the database
  }

  const toggleCategoryStatus = (id: string) => {
    const newCategories = categories.map((category) =>
      category.id === id ? { ...category, isActive: !category.isActive } : category,
    )

    setCategories(newCategories)
    // In a real app, you would save this to the database
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Listings</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => {
              const IconComponent = getIconComponent(category.icon)

              return (
                <TableRow key={category.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => moveCategory(category.id, "up")}
                        disabled={category.displayOrder === 1}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <span>{category.displayOrder}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => moveCategory(category.id, "down")}
                        disabled={category.displayOrder === categories.length}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-medium">{category.name}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">{category.description}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{category.slug}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span>{category.listingsCount}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {category.isActive ? (
                      <Badge variant="default">Active</Badge>
                    ) : (
                      <Badge variant="outline">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/categories/${category.id}`} className="cursor-pointer">
                            <Eye className="mr-2 h-4 w-4" />
                            View Listings
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/categories/${category.id}/edit`} className="cursor-pointer">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Category
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => toggleCategoryStatus(category.id)} className="cursor-pointer">
                          {category.isActive ? (
                            <>
                              <Eye className="mr-2 h-4 w-4" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <Eye className="mr-2 h-4 w-4" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="cursor-pointer text-destructive focus:text-destructive"
                          disabled={category.listingsCount > 0}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete Category
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
