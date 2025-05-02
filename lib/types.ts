import { ReactNode } from "react";

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  limit: number;
}


export interface UserProfile {
  username: string
  displayName?: string
  profileImage?: string
  coverImage?: string
  bio?: string
  location?: string
  website?: string
  isVerified: boolean
  isCurrentUser: boolean
  joinedAt: string
  followers: number
  following: number
  videoCount: number
  postCount: number
  totalViews: number
  totalLikes: number
  totalComments: number
  topics?: string[]
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
