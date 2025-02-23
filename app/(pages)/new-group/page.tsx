"use client";

import { useState } from "react";
import Image from "next/image";
import RightBar from "@/components/Rightbar";
// import GeneralModal from "@/components/generalModal";
import PrivateGroup from "@/components/PrivateModal";
import AddGroup from "@/components/AddGroupCaller";
import CreateGroupCaller from "@/components/AddNew";
import { groups } from "@/data/mockData"; 
import GeneralModal from "@/components/generalModal";



const NewGroup: React.FC = () => {
    const [isRightBarOpen, setIsRightBarOpen] = useState(false);
    const [isAddGroupOpen, setIsAddGroupOpen] = useState(false);
    // const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
    const [openModalPackage, setOpenModalPackage] = useState(false);
    const isFormValid = groups.length > 0 && groups.some(group => group.packages.length > 0);    


    const hasGeneralGroup = groups.some((group) => group.type === "general");
    const hasPrivateGroup = groups.some((group) => group.type === "private");
    

    // Open AddGroup modal
    const handleAddGroupClick = () => {
        setIsAddGroupOpen(true);
    };

    // // Close AddGroup modal
    // const handleCloseAddGroup = () => {
    //     setIsAddGroupOpen(false);
    // };

    // Open CreatePackageModal when a group is clicked
    // const handleGroupClick = (groupId: string) => {
    //     setSelectedGroup(groupId);
    // };
    

    return (
        <section className="border border-gray-700 bg-[#EEEFF2] mt-10">
            <div className="py-8 lg:py-16 mx-auto max-w-screen-lg">
                <div className="h-20 mb-12">
                    <h3 className="mb-1 text-[32px] tracking-tight font-general font-bold text-center text-[#111827]">
                        Event Groups & Packages
                    </h3>
                    <p className="flex gap-1 justify-center items-center mb-8 lg:mb-16 font-general text-lg font-medium text-center text-[#718096] sm:text-xl">
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

            <div className="flex flex-col">
            {/* Show AddGroup only if no groups exist */}
            {!hasGeneralGroup && !hasPrivateGroup ? (
                <button onClick={handleAddGroupClick}>
                    <AddGroup mode="noGroup" setIsAddGroupOpen={setIsAddGroupOpen} />
                </button>
            ) : (
            <>
                {/* If only general groups exist */}
                {hasGeneralGroup && !hasPrivateGroup && (
                    <div className="flex items-start gap-6">
                        {/* General Groups - Displayed Vertically */}
                        <div className="w-[750px] grid grid-cols-2 gap-11">
                            {groups
                                .filter((group) => group.type === "general")
                                .map((group) => (
                                    <GeneralModal key={group.id} group={group}/>
                                ))}
                        </div>

                        {/* Right Side */}
                        <div className="flex flex-col space-y-4">
                            {/* AddGroup (Only when called) */}
                            {isAddGroupOpen && <AddGroup mode="availGroup" setIsAddGroupOpen={setIsAddGroupOpen}/>}

                            {/* CreateGroupCaller */}
                            <CreateGroupCaller />
                        </div>
                    </div>
                )}

                {/* If only private groups exist */}
                {hasPrivateGroup && !hasGeneralGroup && (
                    <div className="flex items-start gap-6">
                        {/* Grid for Private Groups */}
                        <div className="w-[750px] grid grid-cols-2 gap-11">
                            {groups
                                .filter((group) => group.type === "private")
                                .map((group) => (
                                    <PrivateGroup key={group.id} group={group} />
                                ))}
                        </div>

                        {/* Right Side */}
                        <div className="flex flex-col space-y-4">
                            {/* AddGroup (Only when called) */}
                            {isAddGroupOpen && <AddGroup setIsAddGroupOpen={setIsAddGroupOpen}  mode="availGroup"/>}

                            {/* CreateGroupCaller */}
                            <CreateGroupCaller />
                        </div>
                    </div>
                )}


                {/* If both general and private groups exist */}
                {hasGeneralGroup && hasPrivateGroup && (
                    <div className="flex">
                        {/* General Groups - Displayed Vertically */}
                        <div className="flex flex-col justify-start gap-6">
                            {groups
                                .filter((group) => group.type === "general")
                                .map((group) => (
                                    <GeneralModal key={group.id} group={group} />
                                ))}
                        </div>

                    {/* Private Groups - Displayed Vertically */}
                    <div className="flex flex-col justify-start gap-6 ml-16">
                        {groups
                            .filter((group) => group.type === "private")
                            .map((group) => (
                                <PrivateGroup key={group.id} group={group} />
                            ))}
                    </div>

                    {/* CreateGroupCaller */}
                    <CreateGroupCaller />
                    </div>
                        )}
                    </>
                )}             
                </div>

                {/* Add Group Modal */}
                {/* {isAddGroupOpen && <AddGroup onClose={handleCloseAddGroup} />} */}

                {/* Create Package Modal */}
                {openModalPackage && (
                    <div className="absolute top-0 right-0 left-0 z-50">
                        {/* <CreatePackageModal
                            // isOpen={!!selectedGroup}
                            // groupId={selectedGroup}
                            // onClose={() => setSelectedGroup(null)}
                            setOpenModalPackage={setOpenModalPackage}
                            mode="create"
                        /> */}
                    </div>
                )}

                <RightBar isOpen={isRightBarOpen} setIsOpen={setIsRightBarOpen} />
            </div>
            <div className="bg-[#FFFF] h-32 py-10 flex justify-center">
                <div className="max-w-screen-md flex gap-4 items-center justify-center sm:justify-end w-full">
                    <button className="p-3 border border-[#111827] rounded-[12px] font-manrope font-extrabold text-base text-[#111827]">
                        Save for later
                    </button>
                    <button
                        disabled={isFormValid}
                        className={`bg-primary text-white py-3 px-8 rounded-[12px] hover:bg-red-800 transition flex items-center justify-center font-extrabold font-manrope ${
                        !isFormValid ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        // onClick={() => isFormValid && setShowSuccess(!showSuccess)}
                    >
                        Continue
                    </button>
                 </div>
            </div>
        </section>
    );
};

export default NewGroup;
