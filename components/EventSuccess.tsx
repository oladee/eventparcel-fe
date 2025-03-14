import React from "react";
import { Checked } from "../components/icons/Icons";
import Link from "next/link";
import { useRouter } from "next/navigation";

const EventSuccess: React.FC = () => {
  const router = useRouter();

  const handleAddCoHost = () => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      router.push("/add-cohost");
    } else {
      
      router.push("/");
  
    }
  };
  return (
    <div className="fixed p-4 w-screen inset-0  overflow-y-auto  bg-[#00000098] h-screen left-0 top-0 z-30 flex items-center justify-center md:justify-center px-2">
      <div className="bg-white p-6 rounded-[24px] w-full  max-w-md grid place-items-center text-center gap-4">
        <Checked width={100} height={100} />
        <p className="font-bold text-2xl md:text-3xl">
          You&apos;ve successfully created an event
        </p>
        <p className="font-medium text-[#718096]">
          You can now create groups for different type of guest and packages to
          sell according to group
        </p>
        <Link href="/new-group" className="button_v1">
          <button className="">Continue to Group</button>
        </Link>

        <button
          onClick={handleAddCoHost}
          className="p-3 border border-[#111827] rounded-[12px] font-manrope font-extrabold text-base text-[#111827] w-full"
        >
          Add a Co-Host
        </button>
      </div>
    </div>
  );
};

export default EventSuccess;
