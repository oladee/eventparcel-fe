import React, { useState } from 'react';
import Checked  from '../public/images/goldenIcon.png';
import Image from 'next/image';
import axiosInstance from '@/lib/axiosInstance';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

type DeleteProps = {
  selectedId?: string;
  setDelete: React.Dispatch<React.SetStateAction<boolean>>;
  setPackages: React.Dispatch<React.SetStateAction<any>>;
};


const DeletePackageCaution = ({ selectedId, setDelete, setPackages }: DeleteProps) => {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);

        try{
            const response = await axiosInstance.delete(`/delete-package/${selectedId}`);
             const succcessMessage =
                response?.data?.message;

            toast.success(succcessMessage, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored"
            });
            
            setPackages((prev: any[]) => 
                prev.filter((pkg) => pkg._id !== selectedId));

            setDelete(false);
        }catch (error) {
            if (axios.isAxiosError(error)) {
            const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "An unknown error occurred.";

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
        } finally {
            setLoading(false);
        }
    };

  return (
    <>
    <ToastContainer />
    <div className="fixed p-4 w-screen inset-0  overflow-y-auto  bg-[#00000098] h-screen left-0 top-0 z-30 flex items-center justify-center md:justify-center px-2">
    <div className="bg-white p-6 rounded-[24px] w-full  max-w-md grid place-items-center text-center gap-4">
      <Image 
        src={Checked}
        alt=''
        width={100}
        height={100}
        />
      <p className="font-bold text-2xl md:text-3xl">
        Are you sure you want to delete this package   
      </p>
      <p className="font-medium text-[#718096]">
        You will not be able to reverse this action once completed
      </p>
      <div onClick={() => setDelete(false)} className="button_v1">
        <button className="">Go Back</button>
      </div>
      <div className="w-full bg-[#FFFFFF] text-[#111827] border border-[#111827] py-3 rounded-[12px] hover:bg-red-800 transition flex items-center justify-center">
        <button onClick={handleDelete} className="">{loading ? "Deleting Package..." : "Delete Package"}</button>
      </div>
    </div>
  </div>
    </>
  );
};

export default DeletePackageCaution;