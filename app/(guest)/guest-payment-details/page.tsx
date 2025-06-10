"use client";

import HeaderLayout from "@/components/layout/HeaderLayout";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BiLoaderCircle } from "react-icons/bi";
import { trackEvent } from "@/lib/mixpanel";

function PaymentDetailsCard() {
  const searchParams = useSearchParams();
  const cartItems = searchParams.get('orderData');
  const parsedCartItems = useMemo(() => {
    return cartItems ? JSON.parse(cartItems) : [];
  }, [cartItems]);
  const [discountCode, setDiscountCode] = useState("");
  const [discountResponse, setDiscountResponse] = useState<any>(null);
  const [isLoadingDiscount, setIsLoadingDiscount] = useState(false);
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  const eventId = parsedCartItems?.data?.eventId;
  const Router = useRouter();

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDiscountCode(e.target.value);
  };

  // Debounced discount validation using useEffect and setTimeout
  useEffect(() => {
    
    // Only proceed if discountCode length is exactly 8
    if (discountCode.length !== 8) {
      setDiscountResponse(null); // Clear any previous response
      return;
    }

    const handler = setTimeout(() => {
      if (!discountCode.trim()) {
        setDiscountResponse(null);
        return;
      }

      setIsLoadingDiscount(true);
      axiosInstance.post("/calculate-discounted-total", {
        eventId: eventId,  
        discountCode: discountCode,
        items: parsedCartItems?.data?.items?.map((item: any) => ({
          packageId: item.packageId,
          quantity: item.quantity,
          deliveryMethod: item.deliveryMethod,
        })),
      })
      .then(response => {
        setDiscountResponse(response.data.data);
      })
      .catch(error => {
        setDiscountResponse(null);
        toast.error(error.response?.data?.message || "Invalid discount code");
      })
      .finally(() => {
        setIsLoadingDiscount(false);
      });
    }, 600);

    return () => {
      clearTimeout(handler);
    };
  }, [discountCode, eventId, parsedCartItems?.data?.items]);


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
  const isHomeDelivery = parsedCartItems?.data?.deliveryType === "homeDelivery";
  // let tax;
  // if (discountResponse) {
  //   tax = (discountResponse?.finalAmount * 7.5) / 100; 
  // } else {
  //   tax = parsedCartItems?.data?.tax ?? 0;
  // }
  const deliveryFee = parsedCartItems?.data?.homeDeliveryFee ?? 0;

  let grandTotal;

  if(!isHomeDelivery) {
    grandTotal = subtotal;
  }else {
    grandTotal = subtotal + deliveryFee;
  }
  
  // Apply discount if valid
  if (discountResponse?.discountAmount) {
    grandTotal -= discountResponse.discountAmount;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingPayment(true);
    
    try {
      const payload: any = {};
      if (discountCode) {
        payload.discountCode = discountCode;
      }
  
      const res = await axiosInstance.post(`/checkout-contd/${parsedCartItems?.data?._id}`, payload);
      
      // Success tracking data
      const successEvent = {
        eventName: "Purchase Initiated",
        data: {
          source: "guest payment page",
          event_id: res?.data?.data?.updatedOrder?.eventId,
          timestamp: new Date().toISOString(),
          page_name: "Guest Payment Page",
          transaction_id: res.data.data.reference,
          payment_partner: res.data.data.paymentPartner,
          delivery_type: res?.data?.data?.updatedOrder?.deliveryType,
          guest_firstname: res?.data?.data?.updatedOrder?.guestFirstName,
          guest_lasttname: res?.data?.data?.updatedOrder?.guestLastName,
          guest_email: res?.data?.data?.updatedOrder?.guestEmail,
          status: "success"
        }
      };
  
      // Store in localStorage
      localStorage.setItem('lastSuccessfulEvent', JSON.stringify(successEvent));
      trackEvent(successEvent.eventName, successEvent.data);
  
      Router.push(res.data.data.paymentUrl);
    } catch (error: any) {
      // Error tracking data
      const errorEvent = {
        eventName: "Purchase Failed",
        data: {
          source: "guest payment page",
          timestamp: new Date().toISOString(),
          page_name: "Guest Payment Page",
          error_message: error.response?.data?.message || "Payment failed",
          status: "failed"
        }
      };
  
      // Store in localStorage
      localStorage.setItem('lastFailedEvent', JSON.stringify(errorEvent));
      trackEvent(errorEvent.eventName, errorEvent.data);
  
      toast.error(error.response?.data?.message || "Payment failed");
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
                {item.packageTitle
                  .split(' ')
                  .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ')
                }
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
            {parsedCartItems?.data?.deliveryType === "homeDelivery" && (
              <div className="flex justify-between">
              <span className="text-[#A0AEC0] font-medium text-sm font-general">Home Delivery</span>
              <span className="text-[#A0AEC0] font-medium text-sm font-general">
                {currencySymbol === "NGN" ? "₦" : "$"}{deliveryFee.toLocaleString()}
              </span>
            </div>
            )}
            {/* <div className="flex justify-between">
              <span className="text-[#A0AEC0] font-medium text-sm font-general">Tax</span>
              <span className="text-[#A0AEC0] font-medium text-sm font-general">
                {currencySymbol === "NGN" ? "₦" : "$"}{tax.toLocaleString()}
              </span>
            </div> */}
            <hr className="border-[#F1F2F4]"/>
            <div className="flex justify-between font-medium text-[#111827]">
              <span className="font-general font-semibold text-sm text-[#111827]">Subtotal</span>
              <span className="font-general font-semibold text-sm text-[#111827]">
                {currencySymbol === "NGN" ? "₦" : "$"}{(subtotal + deliveryFee).toLocaleString()}
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
                {discountResponse.discountObject?.discountValueType === "percentage" && (
                    discountResponse.discountAmount
                      ? `${discountResponse.discountObject?.discountValue}% Discount`
                      : "Invalid discount code"
                  )}
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


export default function PaymentDetailsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentDetailsCard />
    </Suspense>
  );
}
















// "use client";

// import HeaderLayout from "@/components/layout/HeaderLayout";
// import Image from "next/image";
// import { useRouter, useSearchParams } from "next/navigation";
// import { Suspense, useEffect, useMemo, useState } from "react";
// import axiosInstance from "@/lib/axiosInstance";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { BiLoaderCircle } from "react-icons/bi";
// import { trackEvent } from "@/lib/mixpanel";

// function PaymentDetailsCard() {
//   const searchParams = useSearchParams();
//   const cartItems = searchParams.get('orderData');
//   const parsedCartItems = useMemo(() => {
//     return cartItems ? JSON.parse(cartItems) : [];
//   }, [cartItems]);
//   const [discountCode, setDiscountCode] = useState("");
//   const [discountResponse, setDiscountResponse] = useState<any>(null);
//   const [isLoadingDiscount, setIsLoadingDiscount] = useState(false);
//   const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
//   const eventId = parsedCartItems?.data?.eventId;
//   const Router = useRouter();

//   const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setDiscountCode(e.target.value);
//   };

//   // Debounced discount validation using useEffect and setTimeout
//   useEffect(() => {
    
//     // Only proceed if discountCode length is exactly 8
//     if (discountCode.length !== 8) {
//       setDiscountResponse(null); // Clear any previous response
//       return;
//     }

//     const handler = setTimeout(() => {
//       if (!discountCode.trim()) {
//         setDiscountResponse(null);
//         return;
//       }

//       setIsLoadingDiscount(true);
//       axiosInstance.post("/calculate-discounted-total", {
//         eventId: eventId,  
//         discountCode: discountCode,
//         items: parsedCartItems?.data?.items?.map((item: any) => ({
//           packageId: item.packageId,
//           quantity: item.quantity,
//           deliveryMethod: item.deliveryMethod,
//         })),
//       })
//       .then(response => {
//         setDiscountResponse(response.data.data);
//       })
//       .catch(error => {
//         setDiscountResponse(null);
//         toast.error(error.response?.data?.message || "Invalid discount code");
//       })
//       .finally(() => {
//         setIsLoadingDiscount(false);
//       });
//     }, 600);

//     return () => {
//       clearTimeout(handler);
//     };
//   }, [discountCode, eventId, parsedCartItems?.data?.items]);


//   // Calculate totals
//   const itemTotal = parsedCartItems?.data?.items?.map((item: any) => {
//     const totalItemPrice = item.packagePrice * item.quantity;
//     return {
//       ...item,
//       totalPrice: totalItemPrice, 
//     };
//   }) || [];

//   const subtotal = itemTotal.reduce((acc: number, item: any) => acc + item.totalPrice, 0);
//   const currencySymbol = parsedCartItems?.data?.items?.[0]?.packagePriceCurrency || "NGN";
//   const isHomeDelivery = parsedCartItems?.data?.deliveryType === "homeDelivery";
//   let tax;
//   if (discountResponse) {
//     tax = (discountResponse?.finalAmount * 7.5) / 100; 
//   } else {
//     tax = parsedCartItems?.data?.tax ?? 0;
//   }
//   const deliveryFee = parsedCartItems?.data?.homeDeliveryFee ?? 0;

//   let grandTotal;

//   if(!isHomeDelivery) {
//     grandTotal = subtotal + tax;
//   }else {
//     grandTotal = subtotal + tax + deliveryFee;
//   }
  
//   // Apply discount if valid
//   if (discountResponse?.discountAmount) {
//     grandTotal -= discountResponse.discountAmount;
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmittingPayment(true);
    
//     try {
//       const payload: any = {};
//       if (discountCode) {
//         payload.discountCode = discountCode;
//       }
  
//       const res = await axiosInstance.post(`/checkout-contd/${parsedCartItems?.data?._id}`, payload);
      
//       // Success tracking data
//       const successEvent = {
//         eventName: "Purchase Initiated",
//         data: {
//           source: "guest payment page",
//           event_id: res?.data?.data?.updatedOrder?.eventId,
//           timestamp: new Date().toISOString(),
//           page_name: "Guest Payment Page",
//           transaction_id: res.data.data.reference,
//           payment_partner: res.data.data.paymentPartner,
//           delivery_type: res?.data?.data?.updatedOrder?.deliveryType,
//           guest_firstname: res?.data?.data?.updatedOrder?.guestFirstName,
//           guest_lasttname: res?.data?.data?.updatedOrder?.guestLastName,
//           guest_email: res?.data?.data?.updatedOrder?.guestEmail,
//           status: "success"
//         }
//       };
  
//       // Store in localStorage
//       localStorage.setItem('lastSuccessfulEvent', JSON.stringify(successEvent));
//       trackEvent(successEvent.eventName, successEvent.data);
  
//       Router.push(res.data.data.paymentUrl);
//     } catch (error: any) {
//       // Error tracking data
//       const errorEvent = {
//         eventName: "Purchase Failed",
//         data: {
//           source: "guest payment page",
//           timestamp: new Date().toISOString(),
//           page_name: "Guest Payment Page",
//           error_message: error.response?.data?.message || "Payment failed",
//           status: "failed"
//         }
//       };
  
//       // Store in localStorage
//       localStorage.setItem('lastFailedEvent', JSON.stringify(errorEvent));
//       trackEvent(errorEvent.eventName, errorEvent.data);
  
//       toast.error(error.response?.data?.message || "Payment failed");
//     } finally {
//       setIsSubmittingPayment(false);
//     }
//   };

//   return (
//     <HeaderLayout>
//       <ToastContainer position="top-right" autoClose={5000} />
//       <div className="rounded-xl bg-[#F9FAFB] p-4 space-y-4 mt-20 pb-7">
//         <form onSubmit={handleSubmit} className="bg-white rounded-xl w-full max-w-sm shadow-sm py-5 px-4">
//           <h2 className="text-xl font-bold font-general text-[#111827] mb-4">Payment Details</h2>

//           {parsedCartItems?.data?.items?.map((item: any) => (
//             <div key={item._id} className="h-[91px] flex items-start gap-3 p-3 rounded-[16px] bg-[#FAFAFA] mb-4">
//               <Image
//                 src={item?.packageImgUrls?.[0] || "/default-image.png"}
//                 alt="Product"
//                 width={42}
//                 height={42}
//                 className="rounded object-cover w-[42px] h-[42px]"
//               />
//               <div className="w-[80%] h-full flex flex-col justify-between">
//                 <p className="flex text-sm font-semibold text-[#111827] mb-2.5">
//                 {item.packageTitle
//                   .split(' ')
//                   .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
//                   .join(' ')
//                 }
//                 </p>
//                 <p className="text-xs text-[#718096] font-medium">
//                   {currencySymbol === "NGN" ? "₦" : "$"}
//                   {item.packagePrice?.toLocaleString()}
//                 </p>
//               </div>
//               <p className="w-[20%] text-xs text-[#718096] font-medium mt-[47px]">Qty: {item.quantity}</p>
//             </div>
//           ))}

//           <div className="space-y-2 text-sm text-[#4B5563] mb-4 pt-4 flex flex-col gap-2">
//             <div className="flex justify-between">
//               <span className="text-[#A0AEC0] font-medium text-sm font-general">
//                 {parsedCartItems?.data?.items?.reduce((total: number, item: any) => total + item.quantity, 0) || 0} Item
//               </span>
//               <span className="text-[#A0AEC0] font-medium text-sm font-general">
//                 {currencySymbol === "NGN" ? "₦" : "$"}{subtotal.toLocaleString()}
//               </span>
//             </div>
//             {parsedCartItems?.data?.deliveryType === "homeDelivery" && (
//               <div className="flex justify-between">
//               <span className="text-[#A0AEC0] font-medium text-sm font-general">Home Delivery</span>
//               <span className="text-[#A0AEC0] font-medium text-sm font-general">
//                 {currencySymbol === "NGN" ? "₦" : "$"}{deliveryFee.toLocaleString()}
//               </span>
//             </div>
//             )}
//             <div className="flex justify-between">
//               <span className="text-[#A0AEC0] font-medium text-sm font-general">Tax</span>
//               <span className="text-[#A0AEC0] font-medium text-sm font-general">
//                 {currencySymbol === "NGN" ? "₦" : "$"}{tax.toLocaleString()}
//               </span>
//             </div>
//             <hr className="border-[#F1F2F4]"/>
//             <div className="flex justify-between font-medium text-[#111827]">
//               <span className="font-general font-semibold text-sm text-[#111827]">Subtotal</span>
//               <span className="font-general font-semibold text-sm text-[#111827]">
//                 {currencySymbol === "NGN" ? "₦" : "$"}{(subtotal + deliveryFee + tax).toLocaleString()}
//               </span>
//             </div>
//           </div>

//           <div className="flex flex-col gap-2 border border-[#EEEFF2] py-2 px-3 rounded-[8px] mb-4 h-[142px]">
//             <label htmlFor="discount-code" className="text-base font-medium text-[#718096] mb-1">
//               Discount Code
//             </label>
//             <div className="relative">
//               <input 
//                 id="discount-code"
//                 name="discountCode"
//                 type="text" 
//                 placeholder="Enter discount code" 
//                 className="bg-[#FAFAFA] h-[56px] w-full py-7 px-2 rounded-[12px] pr-10" 
//                 value={discountCode}
//                 onChange={handleDiscountChange}
//                 disabled={isLoadingDiscount}
//               />
//               {isLoadingDiscount && (
//                 <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
//                   <BiLoaderCircle size={20} color="#7A1626" />
//                 </div>
//               )}
//             </div>
//             {discountResponse && (
//               <div className="flex justify-between mt-2 text-sm">
//                 <span className={`font-general font-medium text-sm ${
//                   discountResponse.discountAmount ? "text-[#A0AEC0]" : "text-[#DE4222]"
//                 }`}>
//                 {discountResponse.discountObject?.discountValueType === "percentage" && (
//                     discountResponse.discountAmount
//                       ? `${discountResponse.discountObject?.discountValue}% Discount`
//                       : "Invalid discount code"
//                   )}
//                 </span>
//                 {discountResponse.discountAmount && (
//                   <span className="font-general font-medium text-sm text-[#DE4222]">
//                     -{currencySymbol === "NGN" ? "₦" : "$"}{discountResponse.discountAmount.toLocaleString()}
//                   </span>
//                 )}
//               </div>
//             )}
//           </div>

//           <div className="flex justify-between text-base font-semibold text-[#111827] border-t border-[#F1F2F4] pt-4">
//             <span>Grand Total</span>
//             <span>
//               {currencySymbol === "NGN" ? "₦" : "$"}{grandTotal.toLocaleString()}
//             </span>
//           </div>

//           <button 
//             type="submit" 
//             className="w-full mt-10 py-3 rounded-[8px] bg-[#7A1626] text-white font-semibold flex justify-center items-center gap-2"
//             disabled={isSubmittingPayment || isLoadingDiscount}
//           >
//             {isSubmittingPayment ? (
//               <>
//                 <BiLoaderCircle size={20} color="#ffffff" />
//                 Processing...
//               </>
//             ) : (
//               "Make Payment"
//             )}
//           </button>
//         </form>
//       </div>
//     </HeaderLayout>
//   );
// }


// export default function PaymentDetailsPage() {
//   return (
//     <Suspense fallback={<div>Loading...</div>}>
//       <PaymentDetailsCard />
//     </Suspense>
//   );
// }