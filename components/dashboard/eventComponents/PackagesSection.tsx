"use client";

import React, { useState } from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import { AiOutlinePlus, AiOutlineEdit } from "react-icons/ai";
import { IoIosSend } from "react-icons/io";
import GroupOptionsModal from "./GroupOptionsModal";
import Image from "next/image";
import { Group, Package } from "@/app/interface/Group";
import CreatePackageModal from "@/components/CreatePackageModal";
import { useRouter } from "next-nprogress-bar";
import { toast, ToastContainer } from "react-toastify";
// import AddGroup from "@/components/AddGroupCaller";
import AddGroup2 from "@/components/AddGroupCaller2";
// import { isNull } from "node:util";

interface PackagesSectionProps {
  eventData: {
    _id: string;
    eventImgUrl: string;
    isDollarAccount?: any;
    isNairaAccount?: any;
    eventGroups: Group[];
    isShared?: boolean;
  };
}

const PackagesSection: React.FC<PackagesSectionProps> = ({ eventData }) => {
  const [openModalPackage, setOpenModalPackage] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [group1, setGroup1] = useState<Group | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "update">("create");
  const [isAddGroupOpen, setIsAddGroupOpen] = useState(false);
  // New state to keep track of the selected group for sharing (if needed for modal)
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const router = useRouter();

  // Use groups from eventData
  const groups = eventData.eventGroups || [];

  // Open modal and store selected group for group-specific actions.
  const openGroupOptions = (group: Group) => {
    setSelectedGroup(group);
    setIsModalOpen(true);
  };

  const toggleModal = () => setIsModalOpen((prev) => !prev);

  const formatNumber = (value: number): string => {
    return value.toLocaleString("en-US");
  };

  // Pass dynamic group id by receiving it as an argument.
  const handleInvitedContacts = (groupId: string) => {
    // Navigate to the invited contacts page with the dynamic groupId
    router.push(`/dashboard/invited-contacts/${groupId}`);
  };

  // const handleSendInviteClick = () => {
  //   // You may also pass the group id here if needed; currently, this navigates to a general share-contact page.
  //   router.push("/dashboard/share-contact");
  // };

  const handleSendInviteClick = (groupId: string) => {
    router.push(`/dashboard/share-contact?groupId=${groupId}`);
  };

  const handleViewOneGroup = (group: Group) => {
    router.push(`/dashboard/groups/${group._id}`);
  };

  // const handleAddGroupClick = () => {
  //   // localStorage.setItem("eventId", eventId);
  //   router.push("/dashboard/create-group");
  // };

  const handleDisabledAction = () => {
    toast.warning("This action is not allowed on a disabled group.");
  };

  return (
    <>
      <ToastContainer />
      <div className="flex justify-between items-center mb-4 mt-11">
        <h1 className="capitalize text-2xl text-[#111827] font-bold font-general">
          Groups
        </h1>

        <button
          // onClick={handleAddGroupClick}
          onClick={() => {
            //  localStorage.setItem("eventId", eventId)
            localStorage.setItem("eventId", eventData._id);
            localStorage.setItem("groupLength", eventData?.eventGroups.length.toString());
            localStorage.setItem("isNairaAccount", eventData.isNairaAccount);
            localStorage.setItem("isDollarAccount", eventData.isDollarAccount);
            setIsAddGroupOpen(true);
          }}
          className="flex items-center outline-none"
        >
          <Image src="/images/plus.png" alt="plus" width={32} height={32} />
          <span className="font-general font-medium text-base text-[#751423] capitalize">
            Add New Group
          </span>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <div key={group._id} className="bg-white rounded-2xl p-6">
            {/* Header Section */}
            <div className="flex justify-between items-start">
              <span
                className={`${
                  group.groupPrivacy.toLowerCase() === "private"
                    ? "text-red-600 border-red-600 bg-[#DE42221F]"
                    : "text-[#2B9EA0] border-[#2B9EA0] bg-[#2B9EA01F]"
                } border px-3 rounded-full text-sm font-medium capitalize`}
              >
                {group.groupPrivacy}
              </span>
              <span onClick={() => openGroupOptions(group)}>
                <FiMoreHorizontal
                  size={24}
                  className="text-gray-500 cursor-pointer"
                />
              </span>
            </div>

            {/* Group Title and Description */}
            <div
              onClick={() => handleViewOneGroup(group)}
              className="cursor-pointer"
            >
              <div className="flex items-center mt-2">
                <h2 className="text-xl font-bold text-[#111827] capitalize">
                  {group.groupName}
                </h2>
                {group.isDisabled && (
                  <span className="ml-2 px-3 text-xs font-medium border border-[#DE4222] bg-[#DE42221F] text-[#DE4222] rounded-full">
                    Disabled
                  </span>
                )}
              </div>

              <p className="text-[#718096] text-sm mt-1 truncate-text2">
                {group.groupDescription}
              </p>
            </div>

            {/* Packages Section */}
            <div className="flex justify-between items-center mt-6">
              <h3 className="text-lg font-bold text-gray-900">Packages</h3>
              {/* <button
                onClick={() => {
                  setModalMode("create");
                  setSelectedPackage(null);
                  setOpenModalPackage(true);
                  setGroup1(group);
                }}
                className="text-primary flex items-center gap-1 font-medium"
              >
                <AiOutlinePlus size={18} /> Add New
              </button> */}
              <button
                onClick={() => {
                  if (group.isDisabled) {
                    handleDisabledAction();
                  } else {
                    setModalMode("create");
                    setSelectedPackage(null);
                    setOpenModalPackage(true);
                    setGroup1(group);
                  }
                }}
                className={`text-primary flex items-center gap-1 font-medium ${
                  group.isDisabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <AiOutlinePlus size={18} /> Add New
              </button>
            </div>

            {/* Packages List */}
            <div className="max-h-56 overflow-y-auto no-scrollbar space-y-4 mt-4">
              {group.packages.map((pkg) => (
                <div
                  key={pkg._id}
                  className="border rounded-xl p-3 flex items-center gap-4"
                >
                  <Image
                    src={
                      pkg.packageImgUrls && pkg.packageImgUrls.length > 0
                        ? pkg.packageImgUrls[0]
                        : "https://placehold.co/600x400/png"
                    }
                    alt={pkg.packageTitle}
                    className="w-16 h-16 rounded-lg object-cover"
                    width={64}
                    height={64}
                  />
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-[#111827] truncate-text2">
                      {pkg.packageTitle
                        .split(" ")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}
                    </h4>
                    <p className="text-[#718096] font-medium text-xs">
                      <span>
                        {pkg.packagePriceCurrency === "NGN" ? "₦" : "$"}
                      </span>
                      {formatNumber(pkg.packagePrice)}
                    </p>
                  </div>
                  {!eventData.isShared && (
                    <AiOutlineEdit
                      onClick={() => {
                        if (group.isDisabled) {
                          handleDisabledAction();
                        } else {
                          setModalMode("update");
                          setSelectedPackage(pkg);
                          setOpenModalPackage(true);
                        }
                      }}
                      size={20}
                      className={`text-[#718096] cursor-pointer ${
                        group.isDisabled ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Contacts and Invite Section */}
            <div className="mt-6 flex justify-between items-center">
              {/* Pass the dynamic group id when clicking Contacts */}
              {!group.isDisabled && (
                <button
                  onClick={() => handleInvitedContacts(group._id)}
                  className="text-gray-500 text-sm font-medium outline-none"
                >
                  Contacts
                </button>
              )}
              {/* <button
                onClick={() => handleInvitedContacts(group._id)}
                className="text-gray-500 text-sm font-medium outline-none"
              >
                Contacts: <span className="text-gray-900 font-bold">0</span>
              </button> */}
              {/* <button
                // onClick={handleSendInviteClick}
                onClick={() => handleSendInviteClick(group._id)}
                className="text-primary flex items-center gap-1 font-medium outline-none"
              >
                <IoIosSend size={18} /> Send Invite
              </button> */}
              <button
                onClick={() => {
                  if (group.isDisabled) {
                    handleDisabledAction();
                  } else {
                    handleSendInviteClick(group._id);
                  }
                }}
                className={`text-primary flex items-center gap-1 font-medium outline-none ${
                  group.isDisabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <IoIosSend size={18} /> Send Invite
              </button>
            </div>
          </div>
        ))}
        {/* <div className="flex justify-center">
          <div
            className="flex w-full max-w-2xl py-4 rounded-2xl flex-col border-[2px] border-dashed justify-center items-center ml-[5px] bg-[#FFFFFF66] cursor-pointer"
            onClick={handleAddGroupClick}
          >
            <Image src="/images/plus.png" alt="plus" width={32} height={32} />
            <span className="font-general font-semibold text-sm text-[#751423]">
              Add Groups
            </span>
          </div>
        </div> */}
      </div>

      {isAddGroupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-5 z-50">
          <AddGroup2
            mode="noGroup"
            setIsAddGroupOpen={setIsAddGroupOpen}
            selectedGroup={null}
            isShared={eventData?.isShared}
          />
        </div>
      )}
      {openModalPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <CreatePackageModal
            setOpenModalPackage={setOpenModalPackage}
            mode={modalMode}
            packageData={selectedPackage}
            groudId={group1?._id}
            groupCurrency={group1?.groupCurrency}
          />
        </div>
      )}
      {/* You may also have a GroupOptionsModal if needed */}
      <GroupOptionsModal
        isOpen={isModalOpen}
        onClose={toggleModal}
        group={selectedGroup}
        // eventData={eventData}
      />
    </>
  );
};

export default PackagesSection;