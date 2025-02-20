// "use strict"

// import Image from "next/image";

// const PackageModal = () => {
 
//     return (
//         <div className="w-[680px] h-screen flex flex-col gap-4">
//             <div className="flex flex-col gap-1">
//                 <p className="font-general font-bold text-xl text-[#111827]">Create Package</p>
//                 <p className="font-general font-medium text-lg text-[#718096]">How do you want to sell to this group</p>
//             </div>
//             <div>
//                 <div>
//                     <p>img</p>
//                     <p>img</p>
//                     <p>img</p>
//                     <div>
//                         <p>Add Image</p>
//                     </div>
//                 </div>
//                 <input type="text" placeholder="Add package title"/>
//                 <input type="text" placeholder="Add package description"/>
//                 <div>
//                     <div>
//                         img
//                         <input type="text" placeholder="Add package price" />
//                     </div>
//                     <input type="text" placeholder="Quantity (optional)" />
//                 </div>
//             </div>
//             <div className="flex flex-col">
//                 <p className=" font-general font-semibold text-base text-[#111827]">How would you like to handle delivery</p>
//                 <p className=" font-general font-medium text-xs text-[#718096]">with Event Parcel platform, you can manage and track delivery easily</p>
//                 <div>
//                      <div className="flex gap-14 mb-3">
//                         <div className="flex items-center gap-2">
//                             <Image
//                                 src="/images/check.png" 
//                                 alt="check"
//                                 width={20}
//                                 height={20}
//                             />
//                             <span className="font-general font-medium text-base text-[#111827]"> Home Delivery </span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                             <Image
//                                 src="/images/checked.png" 
//                                 alt="check"
//                                 width={20}
//                                 height={20}
//                             />
//                             <span  className="font-general font-medium text-base text-[#111827]">Pickup</span>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <div>
//                 <button>Cancel</button>
//                 <button>Create Packages</button>
//             </div>
//         </div>
//     );
// };

// export default PackageModal;