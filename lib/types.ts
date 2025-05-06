import { ReactNode } from "react";

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  limit: number;
}

export interface ViewProduct {
  id: number;
  title: string;
  description: string;
  price: string;
  originalPrice: string;
  status: string;
  featured: boolean;
  slug: string;
  features: string[];
  productInfo: {
    key: string;
    value: string;
  }[];
  transferInfo: {
    deliveryTime: string;
    returns: string;
  };
  sellerId: number;
  categoryId: number;
  views: number;
  sales: number;
  createdAt: string;
  updatedAt: string;
  seller: {
    id: number;
    userId: number;
    bio: string | null;
    location: string | null;
    sellerRating: number | null;
    totalSales: number;
    responseRate: number;
    responseTime: string | null;
    completedOrders: number;
    cancellationRate: number;
    balance: string;
    createdAt: string;
    updatedAt: string;
    user: {
      id: number;
      name: string;
      avatar: string | null;
      username: string | null;
    };
  };
  category: {
    id: number;
    name: string;
    slug: string;
    description: string;
    icon: string;
    createdAt: string;
    updatedAt: string;
  };
  images: {
    id: number;
    url: string;
    listingId: number;
    isMain: boolean;
    createdAt: string;
  }[];
  reviews: any[]; // you can define a Review interface if needed
  _count: {
    reviews: number;
  };
  isFavorited: boolean;
  averageRating: number;
}



export interface Product {
  id: string | number
  title : string
  category : string
  price : number
  rating : number
  sold : number
  image : string
  badges? : string[]
}
export interface ProductCardProps {
  product: Product;
}


// Removed duplicate import of ReactNode
export interface Notification {
  id: string
  title: string
  message: string
  date: string
  read: boolean
  type: "comment" | "like" | "mention" | "follow" | "video" | "system" | string
  link?: string
  icon?: ReactNode
  user_id?: number
}

export interface UserSession {
  id: string
  role: string
  name?: string | null
  email?: string | null
  avatar?: string | null
  isLoggedIn?: boolean | null
  isSeller?: boolean | null
  sellerProfileId?: string | null
}

export interface Session {
  user: {
    id: string
    role: string
    name?: string | null
    email?: string | null
    avatar?: string | null
    isLoggedIn?: boolean | null
    isSeller?: boolean | null
    sellerProfileId?: string | null
  }
}
