// components/layouts/SellerLayout.jsx
import React from "react";

import { ReactNode } from "react";

const SellerLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main>{children}</main>
  );
};

export default SellerLayout;
