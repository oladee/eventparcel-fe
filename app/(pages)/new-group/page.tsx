"use client";

import { useState } from "react";
import Image from "next/image";
import RightBar from "@/components/Rightbar";
import PrivateGroup from "@/components/PrivateModal";
import AddGroup from "@/components/AddGroupCaller";
import CreateGroupCaller from "@/components/AddNew";
import { groups } from "@/data/mockData";
import GeneralModal from "@/components/generalModal";
import FormButtons from "@/components/aboutEvent/FormButtons";

const NewGroup: React.FC = () => {
  const [isRightBarOpen, setIsRightBarOpen] = useState(false);
  const [isAddGroupOpen, setIsAddGroupOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);


  const isFormValid = groups.length > 0 && groups.some(group => group.packages.length > 0);
  const hasGeneralGroup = groups.some(group => group.type === "general");
  const hasPrivateGroup = groups.some(group => group.type === "private");

  const handleAddGroupClick = () => {
    setIsAddGroupOpen(true);
  };

  return (
    <section className="border border-gray-300 bg-[#EEEFF2] mt-10 p-4 sm:p-6 lg:p-10">
      <div className="py-6 lg:py-12 mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-6 lg:mb-12 text-center">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Event Groups & Packages
          </h3>
          <p className="flex items-center justify-center gap-2 text-sm sm:text-base text-gray-600">
            Create groups and packages for different types of guests
            <Image
              onClick={() => setIsRightBarOpen(true)}
              src="/images/information.png"
              width={20}
              height={20}
              alt="information"
              className="cursor-pointer"
            />
          </p>
        </div>

        {/* Content Section */}
        <div className="flex flex-col items-center sm:items-start">
          {!hasGeneralGroup && !hasPrivateGroup ? (
            <button onClick={handleAddGroupClick} className="w-full sm:w-auto">
              <AddGroup mode="noGroup" setIsAddGroupOpen={setIsAddGroupOpen} />
            </button>
          ) : (
            <>
              {/* General Groups Only */}
              {hasGeneralGroup && !hasPrivateGroup && (
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full sm:w-auto">
                    {groups
                      .filter(group => group.type === "general")
                      .map(group => (
                        <GeneralModal key={group.id} group={group} />
                      ))}
                  </div>

                  {/* Sidebar Actions */}
                  <div className="flex flex-col space-y-4">
                    {isAddGroupOpen && <AddGroup mode="availGroup" setIsAddGroupOpen={setIsAddGroupOpen} />}
                    <CreateGroupCaller />
                  </div>
                </div>
              )}

              {/* Private Groups Only */}
              {hasPrivateGroup && !hasGeneralGroup && (
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full sm:w-auto">
                    {groups
                      .filter(group => group.type === "private")
                      .map(group => (
                        <PrivateGroup key={group.id} group={group} />
                      ))}
                  </div>

                  {/* Sidebar Actions */}
                  <div className="flex flex-col space-y-4">
                    {isAddGroupOpen && <AddGroup mode="availGroup" setIsAddGroupOpen={setIsAddGroupOpen} />}
                    <CreateGroupCaller />
                  </div>
                </div>
              )}

              {/* Both General and Private Groups */}
              {hasGeneralGroup && hasPrivateGroup && (
                <div className="grid mx-8 lg:ml-24 grid-cols-1 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 md:gap-8 gap-6">
                  {/* General Groups */}
                  <div className="flex flex-col gap-4">
                    {groups
                      .filter(group => group.type === "general")
                      .map(group => (
                        <GeneralModal key={group.id} group={group} />
                      ))}
                  </div>

                  {/* Private Groups */}
                  <div className="lg:ml-5 flex flex-col gap-4">
                    {groups
                      .filter(group => group.type === "private")
                      .map(group => (
                        <PrivateGroup key={group.id} group={group} />
                      ))}
                  </div>

                  {/* Sidebar Actions */}
                  <div className="flex flex-col space-y-4 sm:w-3/4 md:w-2/3">
                    {isAddGroupOpen && <AddGroup mode="availGroup" setIsAddGroupOpen={setIsAddGroupOpen} />}
                    <CreateGroupCaller />
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Right Bar */}
        <RightBar isOpen={isRightBarOpen} setIsOpen={setIsRightBarOpen} />
      </div>

      <FormButtons
          isFormValid={!!isFormValid}
          onContinue={() => isFormValid && setShowSuccess(!showSuccess)}
        />
    </section>
  );
};

export default NewGroup;
