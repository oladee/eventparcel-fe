"use client";

import HeaderLayout from "@/components/layout/HeaderLayout";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BiLoaderCircle } from "react-icons/bi";

export default function PaymentDetailsCard() {
  const searchParams = useSearchParams();
  const cartItems = searchParams.get('orderData');
  const parsedCartItems = cartItems ? JSON.parse(cartItems) : [];
  console.log("ddd",parsedCartItems)

  const [discountCode, setDiscountCode] = useState("");
  const [discountResponse, setDiscountResponse] = useState<any>(null);
  const [isLoadingDiscount, setIsLoadingDiscount] = useState(false);
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDiscountCode(e.target.value);
  };

  const fetchDiscount = debounce(async (code: string) => {
    if (!code) {
      setDiscountResponse(null);
      return;
    }

    setIsLoadingDiscount(true);
    try {
      const response = await axiosInstance.post("/calculate-discounted-total", {
        eventId: parsedCartItems?.data?.eventId,
        discountCode: code,
        items: parsedCartItems?.data?.items?.map((item: any) => ({
          packageId: item.packageId,
          quantity: item.quantity,
          deliveryMethod: item.deliveryMethod,
        })),
      });

      setDiscountResponse(response.data.data);
      console.log("dsic", response.data)
      toast.success("Discount applied successfully!");
    } catch (error: any) {
      setDiscountResponse(null);
      toast.error(error.response?.data?.message || "Invalid discount code");
      console.error("Failed to calculate discount:", error);
    } finally {
      setIsLoadingDiscount(false);
    }
  }, 600);

  // Calculate totals
  const itemTotal = parsedCartItems?.data?.items?.map((item: any) => {
    const totalItemPrice = item.packagePrice * item.quantity;
    return {
      ...item,
      totalPrice: totalItemPrice, 
    };
  }) || [];

  const subtotal = itemTotal.reduce((acc: number, item: any) => acc + item.totalPrice, 0);
  const currencySymbol = parsedCartItems?.data?.items?.[0]?.packagePriceCurrency || "NGN";
  const tax = (7.5 / 100) * subtotal;
  const deliveryFee = currencySymbol === "NGN" ? 3000 : 0;
  let grandTotal = subtotal + tax + deliveryFee;

  // Apply discount if valid
  if (discountResponse?.discountAmount) {
    grandTotal -= discountResponse.discountAmount;
  }

  useEffect(() => {
    fetchDiscount(discountCode);
    return () => fetchDiscount.cancel();
  }, [discountCode, fetchDiscount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingPayment(true);
    
    try {
      // const response = await axiosInstance.post("/process-payment", {
      //   items: parsedCartItems?.data?.items?.map((item: any) => ({
      //     packageId: item._id,
      //     quantity: item.quantity,
      //     deliveryMethod: item.deliveryMethod || "pickUp",
      //   })),
      //   discountCode: discountResponse ? discountCode : undefined,
      //   eventId: parsedCartItems?.data?.eventId,
      //   totalAmount: grandTotal,
      // });

      const response = await axiosInstance.post(`/checkout-contd/${parsedCartItems?.data?._id}`,{
        discountCode: discountCode
      });

      toast.success("Payment processed successfully!");
      console.log("Payment response:", response.data);
      // Redirect or handle successful payment here
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Payment failed");
      console.error("Payment error:", error);
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  return (
    <HeaderLayout>
      <ToastContainer position="top-right" autoClose={5000} />
      <div className="rounded-xl bg-[#F9FAFB] p-4 space-y-4 mt-20 pb-7">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl w-full max-w-sm shadow-sm py-5 px-4">
          <h2 className="text-xl font-bold font-general text-[#111827] mb-4">Payment Details</h2>

          {parsedCartItems?.data?.items?.map((item: any) => (
            <div key={item._id} className="h-[91px] flex items-start gap-3 p-3 rounded-[16px] bg-[#FAFAFA] mb-4">
              <Image
                src={item?.packageImgUrls?.[0] || "/default-image.png"}
                alt="Product"
                width={42}
                height={42}
                className="rounded object-cover w-[42px] h-[42px]"
              />
              <div className="w-[80%] h-full flex flex-col justify-between">
                <p className="flex text-sm font-semibold text-[#111827] mb-2.5">
                  {item.packageTitle}
                </p>
                <p className="text-xs text-[#718096] font-medium">
                  {currencySymbol === "NGN" ? "₦" : "$"}
                  {item.packagePrice?.toLocaleString()}
                </p>
              </div>
              <p className="w-[20%] text-xs text-[#718096] font-medium mt-[47px]">Qty: {item.quantity}</p>
            </div>
          ))}

          <div className="space-y-2 text-sm text-[#4B5563] mb-4 pt-4 flex flex-col gap-2">
            <div className="flex justify-between">
              <span className="text-[#A0AEC0] font-medium text-sm font-general">
                {parsedCartItems?.data?.items?.reduce((total: number, item: any) => total + item.quantity, 0) || 0} Item
              </span>
              <span className="text-[#A0AEC0] font-medium text-sm font-general">
                {currencySymbol === "NGN" ? "₦" : "$"}{subtotal.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#A0AEC0] font-medium text-sm font-general">Home Delivery</span>
              <span className="text-[#A0AEC0] font-medium text-sm font-general">
                {currencySymbol === "NGN" ? "₦" : "$"}{deliveryFee.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#A0AEC0] font-medium text-sm font-general">Tax</span>
              <span className="text-[#A0AEC0] font-medium text-sm font-general">
                {currencySymbol === "NGN" ? "₦" : "$"}{tax.toLocaleString()}
              </span>
            </div>
            <hr className="border-[#F1F2F4]"/>
            <div className="flex justify-between font-medium text-[#111827]">
              <span className="font-general font-semibold text-sm text-[#111827]">Subtotal</span>
              <span className="font-general font-semibold text-sm text-[#111827]">
                {currencySymbol === "NGN" ? "₦" : "$"}{(subtotal + deliveryFee + tax).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 border border-[#EEEFF2] py-2 px-3 rounded-[8px] mb-4 h-[142px]">
            <label htmlFor="discount-code" className="text-base font-medium text-[#718096] mb-1">
              Discount Code
            </label>
            <div className="relative">
              <input 
                id="discount-code"
                name="discountCode"
                type="text" 
                placeholder="Enter discount code" 
                className="bg-[#FAFAFA] h-[56px] w-full py-7 px-2 rounded-[12px] pr-10" 
                value={discountCode}
                onChange={handleDiscountChange}
                disabled={isLoadingDiscount}
              />
              {isLoadingDiscount && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <BiLoaderCircle size={20} color="#7A1626" />
                </div>
              )}
            </div>
            {discountResponse && (
              <div className="flex justify-between mt-2 text-sm">
                <span className={`font-general font-medium text-sm ${
                  discountResponse.discountAmount ? "text-[#A0AEC0]" : "text-[#DE4222]"
                }`}>
                  {discountResponse.discountAmount 
                    ? `${discountResponse.discountObject?.discountValue}% Discount` 
                    : "Invalid discount code"}
                </span>
                {discountResponse.discountAmount && (
                  <span className="font-general font-medium text-sm text-[#DE4222]">
                    -{currencySymbol === "NGN" ? "₦" : "$"}{discountResponse.discountAmount.toLocaleString()}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-between text-base font-semibold text-[#111827] border-t border-[#F1F2F4] pt-4">
            <span>Grand Total</span>
            <span>
              {currencySymbol === "NGN" ? "₦" : "$"}{grandTotal.toLocaleString()}
            </span>
          </div>

          <button 
            type="submit" 
            className="w-full mt-10 py-3 rounded-[8px] bg-[#7A1626] text-white font-semibold flex justify-center items-center gap-2"
            disabled={isSubmittingPayment || isLoadingDiscount}
          >
            {isSubmittingPayment ? (
              <>
                <BiLoaderCircle size={20} color="#ffffff" />
                Processing...
              </>
            ) : (
              "Make Payment"
            )}
          </button>
        </form>
      </div>
    </HeaderLayout>
  );
}