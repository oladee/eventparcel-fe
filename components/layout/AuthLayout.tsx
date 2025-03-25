"use client";

import React, { useEffect, useState, ReactNode } from "react";
import Container from "../dashboard/Container";
import HeaderLayout from "./HeaderLayout";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Access localStorage only on the client side
    const authToken = localStorage.getItem("authToken");
    setToken(authToken);
  }, []);

  if (token) {
    return <Container>{children}</Container>;
  } else {
    return <HeaderLayout>{children}</HeaderLayout>;
  }
};

export default AuthLayout;