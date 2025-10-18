import React from 'react';
import Image from 'next/image';
import { BiLoaderCircle } from 'react-icons/bi';



interface WarningModalProps {
  title: string;
  des: string;
  actionBtnTxt: string;
  handleActionBtn: () => void;
  handleClose: () => void;
  loading: boolean;
}


const InfoModal: React.FC<WarningModalProps> = ({ handleActionBtn, handleClose, loading, title, des, actionBtnTxt }) => {

  return (
    <>
      <div className="fixed p-4 w-screen inset-0  overflow-y-auto  bg-[#00000098] h-screen left-0 top-0 z-[1000] flex items-center justify-center md:justify-center px-2">
        <div className="bg-white p-6 rounded-[24px] w-full  max-w-md grid place-items-center text-center gap-4">
          <Image
            src='/images/goldenIcon.png'
            alt='WARNING-ICON'
            width={100}
            height={100}
          />
          <p className="font-bold text-2xl md:text-3xl">
            {title}
          </p>
          <p className="font-medium text-[#718096]">
            {des}
          </p>
          <div onClick={handleActionBtn} className="button_v1">
            {loading ? (
              <BiLoaderCircle className="animate-spin mr-2" size={22} />
            ) : (
              <span>{actionBtnTxt}</span>
            )}
          </div>
          <div onClick={handleClose} className="w-full bg-[#FFFFFF] text-[#111827] border border-[#111827] py-3 rounded-[12px] hover:bg-red-800 transition flex items-center justify-center">
            <button className="">Go Back</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default InfoModal;