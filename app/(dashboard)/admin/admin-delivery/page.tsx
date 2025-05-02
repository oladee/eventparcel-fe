import AdminContainer from "@/components/admin/AdminContainer";
import DeliveryStatCardGroup from "@/components/admin/dashboard/DeliveryStatCardGroup";
import DeliveryTable from "@/components/admin/dashboard/DeliveryTable";
import React from "react";

const page = () => {
  return (
    <AdminContainer>
      <div className="w-full h-full flex flex-col gap-2 items-center justify-center">
        {/* Top section: stat cards*/}
        <div className="w-full">
            <DeliveryStatCardGroup />
        </div>
        {/* Table section */}
        <div className="w-full">
          <DeliveryTable />
        </div>
      </div>
    </AdminContainer>
  );
};

export default page;
