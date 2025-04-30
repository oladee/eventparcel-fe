import AdminContainer from "@/components/admin/AdminContainer";
import OrdersStatCardGroup from "@/components/admin/dashboard/OrderStartCardGroup";
import OrdersHeader from "@/components/admin/dashboard/OrderTable";
import React from "react";

const page = () => {
  return (
    <AdminContainer>
      <div className="w-full h-full flex flex-col gap-2 items-center justify-center">
        {/* Top section: stat cards*/}
        <div className="w-full">
            <OrdersStatCardGroup />
        </div>
        {/* Table section */}
        <div className="w-full">
          <OrdersHeader />
        </div>
      </div>
    </AdminContainer>
  );
};

export default page;
