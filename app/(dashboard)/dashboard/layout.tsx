"use client";

import { useState } from "react";
import HeaderDashboard from "@/components/dashboard/HeaderDashboard";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { AppWrapper } from "@/context";

function Layout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="flex h-full w-full bg-gray-100">
      <AppWrapper>
        {/* Sidebar */}
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

        {/* Main content */}
        <div className="flex flex-col flex-grow">
          <HeaderDashboard toggleSidebar={toggleSidebar} />

          {/* Main dashboard content */}
          <main className="p-2 sm:p-3 lg:p-6">{children}</main>
        </div>
      </AppWrapper>
    </div>
  );
}

export default Layout;



















// import HeaderDashboard from "@/components/dashboard/HeaderDashboard";
// import { Sidebar } from "@/components/dashboard/Sidebar";
// import { AppWrapper } from "@/context";

// function Layout({
//   children
// }: Readonly<{
//   children: React.ReactNode;
// }>) {

//   return (
//     <div className="flex h-full w-full bg-gray-100">
//       <AppWrapper>
//         {/* Sidebar */}
//         <Sidebar />

//         {/* Main content */}
//         <div className="flex flex-col flex-grow">
//           <HeaderDashboard />

//           {/* Main dashboard content */}
//           <main className="p-2 sm:p-3 lg:p-6">{children}</main>
//         </div>
//       </AppWrapper>
//     </div>
//   );
// }

// export default Layout;
