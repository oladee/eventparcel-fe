"use client";

import Image from "next/image";
import { useState } from "react";
import CreatePackageModal from "./CreatePackageModal";
import { Group, Package } from "@/app/interface/Group";
import axiosInstance from "@/lib/axiosInstance";
import axios from "axios";
import AddGroup from "./AddGroupCaller";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteConfirmationDialog from "./modals/DeleteConfirmationDialog";

type generalGroupProps = {
  group: Group;
};

<<<<<<< HEAD
    // const handleDeletePackage = async (id: any) => {

    //     setDeleteId(id);
    //     setDeletEndPoint("delete-package")
    //     setIsDialogOpen(true);
    //     };
=======
const GeneralModal: React.FC<generalGroupProps> = ({ group }) => {
  const [openModalPackage, setOpenModalPackage] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "update">("create");
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [isAddGroupOpen, setIsAddGroupOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>("");
  const [deleteEndPoint, setDeletEndPoint] = useState<string | null>("");
  const [packages, setPackages] = useState(group.packages);

  const handleDelete = async () => {
    if (!deleteId) return;
>>>>>>> 384a62119b333e3a752ede669ad0fe5c3e3bcdcd

    try {
      await axiosInstance.delete(`/${deleteEndPoint}/${deleteId}`);
      if (deleteEndPoint === "delete-package") {
        setPackages((prev) => prev.filter((pkg) => pkg._id !== deleteId));
      }

      toast.success(`Group deleted successfully `, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light"
      });

      setIsDialogOpen(false);
      window.location.reload();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "An unknown error occurred.";
        // setError(errorMessage);

        // Show toast notification
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored"
        });
      } else {
        console.error("Unexpected Error:", error);
      }
    }
  };

  const handleDeletePackage = async (id: any) => {
    setDeleteId(id);
    setDeletEndPoint("delete-package");
    setIsDialogOpen(true);
  };

  const handleDeleteModal = () => {
    setDeleteId(group._id);
    setDeletEndPoint("delete-group");
    setIsDialogOpen(true);
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
        onDelete={handleDelete}
<<<<<<< HEAD
      />
        <div className="w-[320px]">
                <div className="w-[320px] h-auto space-y-6 bg-[#FFFFFF] pt-4 p-8 rounded-3xl">
                    <div className="flex items-center justify-between">
                    <div
                        id="privacy"
                        className={`w-[76px] h-[22px] flex justify-center items-center px-10 py-2 rounded-[50px] font-general font-medium text-sm 
                        ${group.groupPrivacy === "Private" ? "text-[#DE4222] border border-[#DE4222] bg-[#f6ebe9]"  : "text-[#2B9EA0] border border-[#2B9EA0] bg-[#ebf3f3]"}`}
                        >
                        {group.groupPrivacy}
                    </div>
                        <div id="edit" className="flex justify-center items-center gap-2 cursor-pointer" onClick={() => {
                            handleAddGroupClick();
                            setSelectedGroup(group);
                            }}>
                            <Image 
                                src="/images/edit.png"
                                alt=""
                                width={16}
                                height={16}
                            />
                            <span className="font-general font-medium text-sm text-[#718096]">Edit</span>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span id="groupTitle" className="font-general font-semibold text-xl text-[#111827]">
                            {group.groupName}
                        </span>
                        <span id="groupDesc" className="font-general font-medium text-sm text-[#718096]">
                            {group.groupDescription}
                        </span>
                    </div>
                    <div className="flex flex-col gap-3">
                    {group.packages.length > 0 ? (
                        <div id="package" className="flex justify-between">
                            <p className="font-general font-semibold text-base text-[#111827]">Packages</p>
                            <div className="flex justify-center items-center gap-2 cursor-pointer"
                                 id="addNewPackage"
                                  onClick={() => {
                                    setModalMode("create");
                                    setSelectedPackage(null);
                                    setOpenModalPackage(true)
                                }} 
                            >
                                <span className="font-general font-medium text-sm text-[#751423]">+</span>
                                <span className="font-general font-medium text-sm text-[#751423]">Add New</span>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <p className="font-general mb-3 font-semibold text-base text-[#111827]">Packages</p>
                            <button 
                                onClick={() => {
                                    setModalMode("create");
                                    setSelectedPackage(null);
                                    setOpenModalPackage(true)
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
                            <div key={index} className="flex justify-between items-center border border-gray-300 p-2 rounded-[12px]">
                                <div className="flex items-center gap-2">
                                    <Image 
                                        src={item.packageImgUrls && item.packageImgUrls.length > 0 ? item.packageImgUrls[0] : "/images/placeholder.png"} 
                                        alt="cloth"
                                        width={60}
                                        height={60}
                                        className="rounded-[5.29px] object-contain h-[60px] w-[60px]"
                                    />
                                    <div className="flex flex-col">
                                        <span id="packageHeader" className="text-sm font-general font-semibold leading-tight text-[#111827]">
                                        {item.packageTitle
                                        .split(" ")
                                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                        .join(" ")
                                        }
                                        </span>
                                        <p id="packagePrice" className="font-general font-medium text-xs text-[#718096]">₦{item.packagePrice}</p>
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
                    <div id="delete" className="flex items-center gap-1 cursor-pointer" onClick={handleDeleteModal}>
                        <Image 
                            src="/images/trash.png"
                            alt="delete_package"
                            height={16}
                            width={16}
                        />
                        <span  className="font-general font-medium text-sm text-[#DE4222]">Delete</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Image 
                              src="/images/copy.png"
                              alt="delete_package"
                              height={16}
                              width={16}
                        />
                        <span id="copy" className="font-general font-medium text-sm text-[#718096]">Copy</span>
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
                            <AddGroup mode="availGroup" setIsAddGroupOpen={setIsAddGroupOpen} selectedGroup={selectedGroup} />
                        </div>
                    )}
=======
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
>>>>>>> 384a62119b333e3a752ede669ad0fe5c3e3bcdcd
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
              {group.groupDescription}
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
                      className="rounded-[5.29px] object-contain h-[60px] w-[60px]"
                    />
                    <div className="flex flex-col">
                      <span
                        id="packageHeader"
                        className="text-sm font-general font-semibold leading-tight text-[#111827]"
                      >
                        {item.packageTitle
                          .split(" ")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ")}
                      </span>
                      <p
                        id="packagePrice"
                        className="font-general font-medium text-xs text-[#718096]"
                      >
                        ₦{item.packagePrice}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center items-center gap-5">
                    <Image
                      src="/images/trash.png"
                      alt="delete"
                      id="deletePackage"
                      width={12}
                      height={12}
                      onClick={() => {
                        handleDeletePackage(item._id);
                        setSelectedPackage(item);
                      }}
                      className="cursor-pointer"
                    />
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
              <Image
                src="/images/copy.png"
                alt="delete_package"
                height={16}
                width={16}
              />
              <span
                id="copy"
                className="font-general font-medium text-sm text-[#718096]"
              >
                Copy
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
