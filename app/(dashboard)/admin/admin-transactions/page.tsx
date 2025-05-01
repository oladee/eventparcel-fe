import React from "react";
import AdminContainer from "@/components/admin/AdminContainer";
import TransactionStatCard from "@/components/admin/dashboard/TransactionStatCard";
import TransactionTable from "@/components/admin/dashboard/TransactionTable";

const page = () => {
  return (
    <AdminContainer>
      <div className="w-full h-full flex flex-col gap-2 items-center justify-center">
        {/* Top section: stat cards*/}
        <div className="w-full">
            <TransactionStatCard />
        </div>
        {/* Table section */}
        <div className="w-full">
          <TransactionTable />
        </div>
      </div>
    </AdminContainer>
  );
};

export default page;
