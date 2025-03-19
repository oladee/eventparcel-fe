"use client";

import { useRouter } from "next-nprogress-bar";
import { useEffect } from "react";

function Container({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      router.push('/');
    }
  }, [router]);

  return (
    <main className="absolute top-0 left-0 right-0  md:pl-64 !pt-16 h-screen overflow-y-auto custom-scrollbar bg-gray-100">
      <div className="!p-4 md:!p-6">{children}</div>
    </main>
  );
}

export default Container;
