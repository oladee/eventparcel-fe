"use client";

import Image from "next/image";
import { useState } from "react";
import CreatePackageModal from "./CreatePackageModal";
import { Group, Package } from "@/app/interface/Group";
import AddGroup from "./AddGroupCaller";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteConfirmationDialog from "./modals/DeleteConfirmationDialog";

type generalGroupProps = {
  group: Group;
  handleDuplicate: (groudId: string) => void;
  handleDeleteGroup: (groupId: string) => void;
  loadingGroup: boolean;
};

const GeneralModal: React.FC<generalGroupProps> = ({ group, handleDuplicate, handleDeleteGroup, loadingGroup }) => {
  const [openModalPackage, setOpenModalPackage] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "update">("create");
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [isAddGroupOpen, setIsAddGroupOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>("");
  const [, setDeletEndPoint] = useState<string | null>("");
  const [packages] = useState(group.packages);

  const handleDeleteModal = () => {
    setDeleteId(group._id);
    setDeletEndPoint("delete-group");
    setIsDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deleteId) {
      handleDeleteGroup(deleteId);
      setIsDialogOpen(false);
    }
  };

  const handleAddGroupClick = () => {
    setIsAddGroupOpen(true);
  };

  return (
    <>
      <ToastContainer aria-live="polite" className="absolute " />
      <DeleteConfirmationDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onDelete={confirmDelete}
      />

      <div className="w-[320px]">
        <div className="w-[320px] h-auto space-y-6 bg-[#FFFFFF] pt-4 p-8 rounded-3xl">
          <div className="flex items-center justify-between">
            <div
              id="privacy"
              className={`w-[76px] h-[22px] flex justify-center items-center px-10 py-2 rounded-[50px] font-general font-medium text-sm 
                        ${
                          group.groupPrivacy === "Private"
                            ? "text-[#DE4222] border border-[#DE4222] bg-[#f6ebe9]"
                            : "text-[#2B9EA0] border border-[#2B9EA0] bg-[#ebf3f3]"
                        }`}
            >
              {group.groupPrivacy}
            </div>
            <div
              id="edit"
              className="flex justify-center items-center gap-2 cursor-pointer"
              onClick={() => {
                handleAddGroupClick();
                setSelectedGroup(group);
              }}
            >
              <Image src="/images/edit.png" alt="" width={16} height={16} />
              <span className="font-general font-medium text-sm text-[#718096]">
                Edit
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <span
              id="groupTitle"
              className="font-general font-semibold text-xl text-[#111827]"
            >
              {group.groupName}
            </span>
            <span
              id="groupDesc"
              className="font-general font-medium text-sm text-[#718096]"
            >
              {group.groupDescription.charAt(0).toUpperCase() + group.groupDescription.slice(1)}
            </span>
          </div>
          <div className="flex flex-col gap-3">
            {group.packages.length > 0 ? (
              <div id="package" className="flex justify-between">
                <p className="font-general font-semibold text-base text-[#111827]">
                  Packages
                </p>
                <div
                  className="flex justify-center items-center gap-2 cursor-pointer"
                  id="addNewPackage"
                  onClick={() => {
                    setModalMode("create");
                    setSelectedPackage(null);
                    setOpenModalPackage(true);
                  }}
                >
                  <span className="font-general font-medium text-sm text-[#751423]">
                    +
                  </span>
                  <span className="font-general font-medium text-sm text-[#751423]">
                    Add New
                  </span>
                </div>
              </div>
            ) : (
              <div>
                <p className="font-general mb-3 font-semibold text-base text-[#111827]">
                  Packages
                </p>
                <button
                  onClick={() => {
                    setModalMode("create");
                    setSelectedPackage(null);
                    setOpenModalPackage(true);
                  }}
                  className="font-manrope font-extrabold text-xs py-3 px-20 flex justify-center items-center whitespace-nowrap rounded-[10px] border-[2px] border-[#751423] text-[#751423]"
                  id="createPackage"
                >
                  Create Package
                </button>
              </div>
            )}

            {/* Scrollable Packages List */}
            <div className="max-h-[165px] overflow-y-auto space-y-2 scrollbar-hide">
              {packages.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center border border-gray-300 p-2 rounded-[12px]"
                >
                  <div className="flex items-center gap-2">
                    <Image
                      src={
                        item.packageImgUrls && item.packageImgUrls.length > 0
                          ? item.packageImgUrls[0]
                          : "/images/placeholder.png"
                      }
                      alt="cloth"
                      width={60}
                      height={60}
                      style={{width: "60px", height:"60px", borderRadius: "5.29px"}}
                    />
                    <div className="flex flex-col">
                    <span
                        id="packageHeader"
                        className="text-sm font-general font-semibold leading-tight text-[#111827]"
                      >
                        {item.packageTitle
                          .split(" ")
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(" ")
                          .slice(0, 41)}
                        {item.packageTitle.length > 41 && "..."}
                      </span>
                      <p
                        id="packagePrice"
                        className="font-general font-medium text-xs text-[#718096]"
                      >
                        {group.groupCurrency === "NGN" ? "₦" : "$"}{item.packagePrice}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center items-center gap-5">
                    <Image
                      src="/images/edit.png"
                      alt="edit"
                      id="editPackage"
                      width={12}
                      height={12}
                      className="cursor-pointer"
                      onClick={() => {
                        setModalMode("update");
                        setSelectedPackage(item);
                        setOpenModalPackage(true);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-between">
            <div
              id="delete"
              className="flex items-center gap-1 cursor-pointer"
              onClick={handleDeleteModal}
            >
              <Image
                src="/images/trash.png"
                alt="delete_package"
                height={16}
                width={16}
              />
              <span className="font-general font-medium text-sm text-[#DE4222]">
                Delete
              </span>
            </div> 
            <div className="flex items-center gap-1">
            {loadingGroup ? (
               <svg
               className="animate-spin h-4 w-4 text-gray-400"
               xmlns="http://www.w3.org/2000/svg"
               fill="none"
               viewBox="0 0 24 24"
             >
               <circle
                 className="opacity-25"
                 cx="12"
                 cy="12"
                 r="10"
                 stroke="currentColor"
                 strokeWidth="4"
               ></circle>
               <path
                 className="opacity-75"
                 fill="currentColor"
                 d="M4 12a8 8 0 018-8v4l3-3-3-3v4a10 10 0 00-10 10h4z"
               ></path>
             </svg>
            ) : (
              <Image
              src="/images/copy.png"
              alt="delete_package"
              height={16}
              width={16}
            />
            )}
              <span
                id="copy"
                className="font-general font-medium text-sm text-[#718096]"
                onClick={() => handleDuplicate(group._id)}
              >
                {
                  loadingGroup ? "Duplicating" : "Duplicate"
                }
              </span>
            </div>
          </div>
        </div>
        {openModalPackage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <CreatePackageModal
              setOpenModalPackage={setOpenModalPackage}
              mode={modalMode}
              packageData={selectedPackage}
              groudId={group._id}
              groupCurrency={group.groupCurrency}
            />
          </div>
        )}
        {isAddGroupOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-5 z-50">
            <AddGroup
              mode="availGroup"
              setIsAddGroupOpen={setIsAddGroupOpen}
              selectedGroup={selectedGroup}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default GeneralModal;
