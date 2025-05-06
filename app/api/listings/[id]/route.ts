import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const id = Number.parseInt(params.id)

        if (isNaN(id)) {
            return NextResponse.json({ success: false, message: "Invalid listing ID" }, { status: 400 })
        }

        const listing = await prisma.listing.findUnique({
            where: { id },
            include: {
                seller: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                avatar: true,
                                username: true,
                            },
                        },
                    },
                },
                category: true,
                images: true,
                reviews: {
                    include: {
                        giver: {
                            select: {
                                name: true,
                                avatar: true,
                            },
                        },
                    },
                    take: 5,
                },
                _count: {
                    select: {
                        reviews: true,
                    },
                },
            },
        })

        if (!listing) {
            return NextResponse.json({ success: false, message: "Listing not found" }, { status: 404 })
        }



        // Check if the current user has favorited this listing
        let isFavorited = false
        const session = await getServerSession(authOptions)

        if (session?.user) {
            const favorite = await prisma.favorite.findUnique({
                where: {
                    userId_listingId: {
                        userId: Number.parseInt(session.user.id),
                        listingId: id,
                    },
                },
            })

            isFavorited = !!favorite
        }

        // Calculate average rating
        const averageRating = await prisma.review.aggregate({
            where: { listingId: id },
            _avg: { rating: true },
        })

        return NextResponse.json({
            success: true,
            data: {
                ...listing,
                isFavorited,
                averageRating: averageRating._avg.rating || 0,
            },
        })
    } catch (error) {
        console.error("Error fetching listing:", error)
        return NextResponse.json({ success: false, message: "Failed to fetch listing" }, { status: 500 })
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
      const session = await getServerSession(authOptions);
      const User = session?.user;
  
      if (!User || User.role !== "SELLER") {
        return NextResponse.json(
          { success: false, message: "You must be logged in to update a listing" },
          { status: 401 }
        );
      }
  
      const id = Number.parseInt(params.id);
      if (isNaN(id)) {
        return NextResponse.json({ message: "Invalid listing ID" }, { status: 400 });
      }
  
      const existingListing = await prisma.listing.findUnique({
        where: { id },
        include: { images: true },
      });
  
      if (!existingListing) {
        return NextResponse.json({ message: "Listing not found" }, { status: 404 });
      }
  
      if (existingListing.sellerId !== Number.parseInt(session.user.id)) {
        return NextResponse.json({ message: "You are not authorized to update this listing" }, { status: 403 });
      }
  
      const data = await req.json();
  
      if (!data.title || !data.description || !data.price || !data.categoryId) {
        return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
      }
  
      await prisma.listing.update({
        where: { id },
        data: {
          title: data.title,
          description: data.description,
          price: Number.parseFloat(data.price),
          originalPrice: data.originalPrice ? Number.parseFloat(data.originalPrice) : null,
          categoryId: Number.parseInt(data.categoryId),
          status: data.status,
          featured: data.featured,
          features: data.features || [],
          productInfo: data.productInfo || [],
          transferInfo: data.transferInfo || "",
        },
      });
  
      if (data.imageUrls && data.imageUrls.length > 0) {
        const existingImageIds = existingListing.images.map((img) => img.id);
        const imageIdsToKeep = data.imageIds || [];
  
        if (existingImageIds.length > 0) {
          await prisma.image.deleteMany({
            where: {
              id: {
                in: existingImageIds.filter((id) => !imageIdsToKeep.includes(id)),
              },
              listingId: id,
            },
          });
        }
  
        const existingUrls = existingListing.images.map((img) => img.url);
        const newImageUrls = data.imageUrls.filter((url: string) => !existingUrls.includes(url));
  
        if (newImageUrls.length > 0) {
          await prisma.image.createMany({
            data: newImageUrls.map((url: string) => ({
              url,
              listingId: id,
            })),
          });
        }
      }
  
      // ✅ Refetch the updated listing with images
      const updatedListingWithImages = await prisma.listing.findUnique({
        where: { id },
        include: {
          images: {
            select: {
              id: true,
              url: true,
            },
          },
        },
      });
  
      return NextResponse.json({
        success: true,
        message: "Listing updated successfully",
        data: updatedListingWithImages,
      });
  
    } catch (error) {
      console.error("Error updating listing:", error);
      return NextResponse.json({ success: false, message: "Failed to update listing" }, { status: 500 });
    }
  }
  

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return NextResponse.json(
                { success: false, message: "You must be logged in to delete a listing" },
                { status: 401 },
            )
        }

        const id = Number.parseInt(params.id)
        if (isNaN(id)) {
            return NextResponse.json({ success: false, message: "Invalid listing ID" }, { status: 400 })
        }

        // Get the listing to check ownership
        const existingListing = await prisma.listing.findUnique({
            where: { id },
            include: {
                seller: true,
            },
        })

        if (!existingListing) {
            return NextResponse.json({ success: false, message: "Listing not found" }, { status: 404 })
        }

        // Check if user is the seller or an admin
        const user = await prisma.user.findUnique({
            where: { id: Number.parseInt(session.user.id) },
            include: { sellerProfile: true },
        })

        if (
            !user ||
            (user.role !== "SELLER" && (!user.sellerProfile || user.sellerProfile.id !== existingListing.sellerId))
        ) {
            return NextResponse.json(
                { success: false, message: "You don't have permission to delete this listing" },
                { status: 403 },
            )
        }

        // Delete listing (this will cascade delete images due to onDelete: Cascade)
        await prisma.listing.delete({
            where: { id },
        })

        return NextResponse.json({
            success: true,
            message: "Listing deleted successfully",
        })
    } catch (error) {
        console.error("Error deleting listing:", error)
        return NextResponse.json({ success: false, message: "Failed to delete listing" }, { status: 500 })
    }
}
