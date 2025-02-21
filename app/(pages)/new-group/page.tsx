"use client";

import { useState } from "react";
import Image from "next/image";
import RightBar from "@/components/Rightbar";
import GeneralModal from "@/components/generalModal";
import PrivateGroup from "@/components/PrivateModal";
import CreatePackageModal from "@/components/CreatePackageModal";
import AddGroup from "@/components/AddGroupCaller";
import CreateGroupCaller from "@/components/AddNew";
import { groups } from "@/data/mockData"; 



const NewGroup = () => {
    const [isRightBarOpen, setIsRightBarOpen] = useState(false);
    const [isAddGroupOpen, setIsAddGroupOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
    const [openModal, setOpenModal] = useState(false);

    console.log(selectedGroup);
    


    const hasGeneralGroup = groups.some((group) => group.type === "general");
    const hasPrivateGroup = groups.some((group) => group.type === "private");
    

    // Open AddGroup modal
    const handleAddGroupClick = () => {
        setIsAddGroupOpen(true);
    };

    // Close AddGroup modal
    const handleCloseAddGroup = () => {
        setIsAddGroupOpen(false);
    };

    // Open CreatePackageModal when a group is clicked
    const handleGroupClick = (groupId: string) => {
        setSelectedGroup(groupId);
    };
    

    return (
        <section className="border border-gray-700 bg-[#EEEFF2] dark:bg-gray-900 mt-10">
            <div className="py-8 lg:py-16 mx-auto max-w-screen-lg">
                <div className="h-20 mb-12">
                    <h3 className="mb-1 text-[32px] tracking-tight font-general font-bold text-center text-[#111827] dark:text-white">
                        Event Groups & Packages
                    </h3>
                    <p className="flex gap-1 justify-center items-center mb-8 lg:mb-16 font-general text-lg font-medium text-center text-[#718096] dark:text-gray-400 sm:text-xl">
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
                    <AddGroup />
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
                                    <GeneralModal key={group.id} group={group} setOpenModal={setOpenModal}/>
                                ))}
                        </div>

                        {/* Right Side */}
                        <div className="flex flex-col space-y-4">
                            {/* AddGroup (Only when called) */}
                            {isAddGroupOpen && <AddGroup />}

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
                                    <PrivateGroup key={group.id} group={group} setOpenModal={setOpenModal}/>
                                ))}
                        </div>

                        {/* Right Side */}
                        <div className="flex flex-col space-y-4">
                            {/* AddGroup (Only when called) */}
                            {isAddGroupOpen && <AddGroup />}

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
                                    <GeneralModal key={group.id} group={group} setOpenModal={setOpenModal}/>
                                ))}
                        </div>

                    {/* Private Groups - Displayed Vertically */}
                    <div className="flex flex-col justify-start gap-6 ml-16">
                        {groups
                            .filter((group) => group.type === "private")
                            .map((group) => (
                                <PrivateGroup key={group.id} group={group} setOpenModal={setOpenModal}/>
                            ))}
                    </div>

                    {/* CreateGroupCaller */}
                    <CreateGroupCaller />
                    </div>
                        )}
                    </>
                )}

                {/* AddGroup Modal Popup */}
                {isAddGroupOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <AddGroup />
                    </div>
                    )}
                </div>

                {/* Add Group Modal */}
                {/* {isAddGroupOpen && <AddGroup onClose={handleCloseAddGroup} />} */}

                {/* Create Package Modal */}
                {openModal && (
                    <div className="absolute top-0 right-0 left-0 z-50">
                        <CreatePackageModal
                            // isOpen={!!selectedGroup}
                            // groupId={selectedGroup}
                            // onClose={() => setSelectedGroup(null)}
                            setOpenModal={setOpenModal}
                        />
                    </div>
                )}

                <RightBar isOpen={isRightBarOpen} setIsOpen={setIsRightBarOpen} />
            </div>
        </section>
    );
};

export default NewGroup;
