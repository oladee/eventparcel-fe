"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

function AdminContainer({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const userRef = useRef<{ role: string } | null>(null);



  useEffect(() => {
  const loadUserData = () => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    const authToken = localStorage.getItem("authToken")
    if (loggedInUser && authToken) {
      const parsedUser = JSON.parse(loggedInUser);
      userRef.current = {
        role: parsedUser.role || ""
      };

      // Redirect if the user is not an admin or superAdmin
      if (parsedUser?.data?.role !== "admin" && parsedUser?.data?.role !== "superAdmin") {
        router.replace("/adminLogin");
        return;
      }
    } else {
      router.replace("/adminLogin");
    }
  };

    loadUserData();
  }, [router]);

  return (
    <main className="absolute top-0 left-0 right-0 md:pl-64 !pt-16 h-screen overflow-y-auto custom-scrollbar bg-gray-100">
      <div className="!p-4 md:!p-6">{children}</div>
    </main>
  );
}

export default AdminContainer;

// "use client";

// import axiosInstance from "@/lib/axiosInstance";
// import { useRouter } from "next-nprogress-bar";
// import { useEffect, useState } from "react";
// import { toast } from "react-toastify";

// function AdminContainer({ children }: { children: React.ReactNode }) {
//   const router = useRouter();
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   useEffect(() => {
//     const searchParams = new URLSearchParams(window.location.search);
//     const tokenFromUrl = searchParams.get("token");

//     if (tokenFromUrl) {
//       localStorage.setItem("authToken", tokenFromUrl);

//       const cleanUrl = window.location.pathname;
//       router.replace(cleanUrl);
//     }

//     const authToken = localStorage.getItem("authToken");
//     if (!authToken) {
//       // router.push("/");
//       console.log("Auth Token:", "There are no authToken"); // Debugging line

//       return;
//     }

//     setIsAuthenticated(true);

//     const fetchUserProfile = async () => {
//       try {
//         const response = await axiosInstance.post("/profile-details", {
//           token: authToken,
//         });
//         localStorage.setItem("loggedInUser", JSON.stringify(response.data));
//         localStorage.setItem("loggedInUserEmail", response.data.email)
//         console.log("User profile fetched successfully:", response.data);
//       } catch (error: any) {
//         console.error("Error fetching user profile:", error);
//         toast.error(
//           error.response?.data?.message || "Failed to fetch user profile."
//         );
//       }
//     };

//     fetchUserProfile();
//   }, [router]);

//   if (!isAuthenticated) return null;

//   return (
//     <main className="absolute top-0 left-0 right-0 md:pl-64 !pt-16 h-screen overflow-y-auto custom-scrollbar bg-gray-100">
//       <div className="!p-4 md:!p-6">{children}</div>
//     </main>
//   );
// }

// export default AdminContainer;
