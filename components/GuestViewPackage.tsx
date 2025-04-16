import React, { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { useCartStore } from "@/app/store/useCartStore";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  packageDetails:any;
}

const PackageDetailsModal: React.FC<Props> = ({ isOpen, onClose, packageDetails }) => {
  const [quantity, setQuantity] = useState(1);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center px-4 ">
      <div className="bg-white rounded-2xl max-w-sm w-full h-[583px] overflow-hidden flex flex-col">
        {/* Sticky Header */}
        <div className="sticky top-0 bg-white z-10 p-5 border-b">
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-[2px]">
              <h2 className="text-lg font-bold text-[#111827]">Package Details</h2>
              <p className="font-general font-medium text-sm text-[#718096]">
                Details of what is in the package
              </p>
            </div>
            <button onClick={onClose}>
              <X className="w-5 h-5 text-[#A0AEC0]" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-5 flex-1">
          {/* Main Image */}
          <div className="w-full h-52 relative rounded-xl overflow-hidden mb-3">
            <Image
                src={packageDetails?.packageImgUrls[0]}
                alt="Main Preview"
                width={311}
                height={208} 
                className="object-cover rounded-xl w-full h-full"
            />
            </div>

          {/* Thumbnails */}
          <div className="flex gap-2 mb-4 justify-between">
            {packageDetails?.packageImgUrls.slice(1, 4).map((img: string, i: number) => (
              <div
                key={i}
                className="w-[93px] h-[93px] relative rounded-md overflow-hidden cursor-pointer hover:border-[#0891B2]"
              >
                <Image
                  src={img}
                  alt={`thumb-${i + 1}`} 
                  width={93}
                  height={93}
                  style={{borderRadius: "10PX"}}
                  className="object-cover w-full h-full rounded-[10px]"
                />
              </div>
            ))}
          </div>

          {/* Text Info */}
          <h3 className="text-[20px] w-[311px] font-bold text-[#111827] font-general">
          {packageDetails?.packageTitle &&
            packageDetails.packageTitle.charAt(0).toUpperCase() + packageDetails.packageTitle.slice(1)}
          </h3>
          <p className="text-sm font-medium text-[#718096] mt-2 mb-6">
          {packageDetails?.packageDescription &&
            packageDetails.packageDescription.charAt(0).toUpperCase() + packageDetails.packageDescription.slice(1)}
          </p>

          {/* Price & Quantity Selector */}
          <div className="mt-10">
            <div className="flex items-center justify-between mb-6">
              <span className="text-xl font-bold text-[#7D0021]">
              {packageDetails?.packagePriceCurrency === "NGN" ? "₦" : "$"}
              {packageDetails?.packagePrice?.toLocaleString()}
              </span>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(prev => Math.max(prev - 1, 1))}
                  className="w-10 h-10 flex items-center justify-center bg-gray-100 text-[#7D0021] rounded-[4px]"
                >
                  –
                </button>
                <span className="text-md font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="w-10 h-10 flex items-center justify-center bg-[#7D0021] text-white rounded-[4px]"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                useCartStore.getState().addToCart({
                  _id: packageDetails._id,
                  packageTitle: packageDetails.packageTitle,
                  packagePrice: packageDetails.packagePrice,
                  packagePriceCurrency: packageDetails.packagePriceCurrency,
                  quantity,
                });              
              }}
              className="w-full border border-[#7D0021] text-[#7D0021] py-2 rounded-[12px] font-medium mb-2"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetailsModal;
