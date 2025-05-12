"use client";

import HeaderDashboard from "@/components/dashboard/HeaderDashboard";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { AppWrapper, useMyContext } from "@/context";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { setIsOpen } = useMyContext();

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  return (
    <div className="flex h-full w-full bg-gray-100">
      {/* Sidebar uses context internally */}
      <Sidebar />

      {/* Main content */}
      <div className="flex flex-col flex-grow">
        <HeaderDashboard toggleSidebar={toggleSidebar} />
        <main className="p-2 sm:p-3 lg:p-6 !pt-16">{children}</main>
      </div>
    </div>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AppWrapper>
      <LayoutContent>{children}</LayoutContent>
    </AppWrapper>
  );
}








// "use client";

// import { useState } from "react";
// import HeaderDashboard from "@/components/dashboard/HeaderDashboard";
// import { Sidebar } from "@/components/dashboard/Sidebar";
// import { AppWrapper } from "@/context";

// function Layout({ children }: { children: React.ReactNode }) {
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleSidebar = () => setIsOpen(!isOpen);

//   return (
//     <div className="flex h-full w-full bg-gray-100">
//       <AppWrapper>
//         {/* Sidebar */}
//         <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

//         {/* Main content */}
//         <div className="flex flex-col flex-grow">
//           <HeaderDashboard toggleSidebar={toggleSidebar} />

//           {/* Main dashboard content */}
//           <main className="p-2 sm:p-3 lg:p-6 !pt-16">{children}</main>
//         </div>
//       </AppWrapper>
//     </div>
//   );
// }

// export default Layout;
