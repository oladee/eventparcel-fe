import { CSV, Doc, Done } from "@/components/icons/Icons";
import React from "react";

const Page: React.FC = () => {
  return (
    <div className="h-screen bg-gray-50 flex flex-col justify-between">
      <div className="flex flex-col items-center justify-center p-6 mt-28">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center">
          Share Invite & Import Contacts
        </h2>
        <p className="text-gray-600 text-center mt-2">
          Get invite link and import contacts for direct share
        </p>

        <div className="mt-8 w-full max-w-md grid gap-4">
          <div className="flex items-center p-4 bg-white shadow-md rounded-[10px] gap-4 border border-gray-200 cursor-pointer hover:shadow-lg transition">
            <Doc width={60} height={60} />
            <div>
              <h3 className="text-[#111827] font-semibold">
                Import from contact list
              </h3>
              <p className="text-sm text-gray-500">
                You can import directly from your device linked contacts
              </p>
            </div>
            <Done width={30} height={30} />
          </div>

          <div className="flex items-center p-4 bg-white shadow-md rounded-[10px] gap-4 border border-gray-200 cursor-pointer hover:shadow-lg transition">
            <CSV width={60} height={60} />
            <div>
              <h3 className="text-[#111827] font-semibold">Upload CSV</h3>
              <p className="text-sm text-gray-500">
                You can upload a csv file exported from your contact list
              </p>
            </div>
            <Done width={30} height={30} />
          </div>

        </div>
      </div>
      <div className="bg-[#FFFF] py-10 flex justify-center">
        <div className="max-w-md flex gap-4 items-center justify-center sm:justify-end w-full">
          <button className="p-3 border border-[#111827] rounded-[12px] font-manrope font-extrabold text-base text-[#111827]">
            Save for later
          </button>
          <button
            // disabled={true}
            className={`bg-primary text-white py-3 px-8 rounded-[12px] hover:bg-red-800 transition flex items-center justify-center font-extrabold font-manrope ${
              true ? "opacity-50 cursor-not-allowed" : ""
            }`}
            // onClick={() => {}}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
