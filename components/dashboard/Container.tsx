"use client";

import { useRouter } from "next-nprogress-bar";
import { useEffect } from "react";

function Container({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    // Parse the URL search parameters
    const searchParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = searchParams.get('token');

    // If there's a token in the URL, store it in localStorage
    if (tokenFromUrl) {
      localStorage.setItem('authToken', tokenFromUrl);

      // Optionally, remove the token from the URL by replacing the current route
      const cleanUrl = window.location.pathname;
      router.replace(cleanUrl);
    }

    // After checking URL parameters, verify that we have a valid authToken in localStorage
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      router.push('/');
    }
  }, [router]);

  return (
    <main className="absolute top-0 left-0 right-0 md:pl-64 !pt-16 h-screen overflow-y-auto custom-scrollbar bg-gray-100">
      <div className="!p-4 md:!p-6">{children}</div>
    </main>
  );
}

export default Container;













// "use client";

// import { useRouter } from "next-nprogress-bar";
// import { useEffect } from "react";

// function Container({ children }: { children: React.ReactNode }) {
//   const router = useRouter();
 
//   useEffect(() => {
//     const authToken = localStorage.getItem('authToken');
//     if (!authToken) {
//       router.push('/');
//     }
//   }, [router]);

//   return (
//     <main className="absolute top-0 left-0 right-0  md:pl-64 !pt-16 h-screen overflow-y-auto custom-scrollbar bg-gray-100">
//       <div className="!p-4 md:!p-6">{children}</div>
//     </main>
//   );
// }

// export default Container;
