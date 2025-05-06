// components/layouts/LayoutWrapper.jsx
"use client"
import React from "react";
import AdminLayout from "./AdminLayout";
import SellerLayout from "./SellerLayout";
import UserLayout from "./UserLayout";
import { useSession } from "next-auth/react";
interface LayoutWrapperProps {
  children: React.ReactNode;
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children}) => {
  const {data : session } = useSession();

  switch (session?.user.role) {
    case "admin":
      return <AdminLayout>{children}</AdminLayout>;
    case "seller":
      return <SellerLayout>{children}</SellerLayout>;
    case "user":
    default:
      return <UserLayout>{children}</UserLayout>;
  }
};

export default LayoutWrapper;
