import React from "react";
import { Switch } from "@headlessui/react";
import { FiMoreVertical, FiStar } from "react-icons/fi";
import Image from "next/image";

interface Props {
  // id: number;
  name: string;
  logo: string;
  description: string;
  rating?: { score: number; reviews: number };
  connected: boolean;
}
const IntegrationCard: React.FC<Props> = ({
  // id,
  name,
  logo,
  description,
  rating,
  connected
}) => (
  <div className="bg-white rounded-2xl p-6 flex flex-col justify-between">
    <div className="flex justify-between items-start">
      <div className="flex items-center space-x-3">
        <Image
          src={logo}
          alt={name}
          className="w-10 h-10 rounded-lg object-cover"
          width={40}
          height={40}
        />
        <div>
          <h4 className="text-lg font-semibold text-gray-900">{name}</h4>
          <p className="text-sm text-[#718096]">
            {connected ? (
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-[#0CAF60] mr-1"></div> Connected
              </div>
            ) : (
              "Not connected"
            )}
          </p>
        </div>
      </div>
      <Switch
        checked={connected}
        className={`${
          connected ? "bg-[#0CAF60]" : "bg-gray-200"
        } relative inline-flex h-6 w-11 items-center rounded-full`}
      >
        <span
          className={`${
            connected ? "translate-x-6" : "translate-x-1"
          } inline-block h-4 w-4 transform bg-white rounded-full transition`}
        />
      </Switch>
    </div>
    <p className="mt-4 text-sm text-[#718096] flex-1">{description}</p>
    {rating && (
      <div className="mt-4 flex items-center">
        <FiStar className="text-yellow-500" />
        <span className="ml-1 font-semibold text-gray-900">{rating.score}</span>
        <span className="ml-1 text-sm text-gray-500">
          ({rating.reviews.toLocaleString()})
        </span>
      </div>
    )}
    <button
      className={`${
        connected
          ? "border-red-500 text-red-500"
          : "border-green-500 text-green-500"
      } mt-6 w-full py-2 border rounded-2xl font-medium hover:bg-gray-50`}
    >
      {connected ? "Disconnect" : "Connect"}
    </button>
    <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
      <FiMoreVertical />
    </button>
  </div>
);
export default IntegrationCard;

// import React from 'react'
// import { Switch } from '@headlessui/react'
// import { FiMoreVertical, FiStar } from 'react-icons/fi'

// interface Props {
//   id: number
//   name: string
//   logo: string
//   description: string
//   rating?: {score:number;reviews:number}
//   connected: boolean
// }
// const IntegrationCard: React.FC<Props> = ({ id, name, logo, description, rating, connected }) => (
//   <div className="bg-white rounded-2xl shadow p-6 flex flex-col justify-between">
//     <div className="flex justify-between items-start">
//       <div className="flex items-center space-x-3">
//         <img src={logo} alt={name} className="w-10 h-10 rounded-lg object-cover" />
//         <div>
//           <h4 className="text-lg font-semibold text-gray-900">{name}</h4>
//           <p className="text-sm text-gray-500">{connected ? 'Connected' : 'Not connected'}</p>
//         </div>
//       </div>
//       <Switch checked={connected} className={`${connected?'bg-green-500':'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full`}>
//         <span
//           className={`${connected?'translate-x-6':'translate-x-1'} inline-block h-4 w-4 transform bg-white rounded-full transition`}
//         />
//       </Switch>
//     </div>
//     <p className="mt-4 text-gray-600 flex-1">{description}</p>
//     {rating && (
//       <div className="mt-4 flex items-center">
//         <FiStar className="text-yellow-500" />
//         <span className="ml-1 font-semibold text-gray-900">{rating.score}</span>
//         <span className="ml-1 text-sm text-gray-500">({rating.reviews.toLocaleString()})</span>
//       </div>
//     )}
//     <button className={`${connected?'border-red-500 text-red-500':'border-green-500 text-green-500'} mt-6 w-full py-2 border rounded-lg font-medium hover:bg-gray-50`}>
//       {connected ? 'Disconnect' : 'Connect'}
//     </button>
//     <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
//       <FiMoreVertical />
//     </button>
//   </div>
// )
// export default IntegrationCard
