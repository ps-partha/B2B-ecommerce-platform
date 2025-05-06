// components/layouts/AdminLayout.jsx
"use client"
import React from "react";
import TopNav from "../top-nav";
const UserLayout = ({ children }) => {

  return (
    <div className="layout ">
        <TopNav/>
         <main>{children}</main>
    </div>
  );
};

export default UserLayout;