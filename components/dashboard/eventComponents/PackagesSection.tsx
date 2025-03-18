import Image from "next/image";
import React from "react";
import { FaShareAlt } from "react-icons/fa";

const PackagesSection: React.FC = () => {
  const packages = [
    {
      id: 1,
      title: "General Aso Ebi",
      privacy: "Public",
      packagePrice: "0.00",
      imageUrl: "/images/aso-ebi-1.jpg", // Replace with your actual image
      items: [
        {
          name: "4 Yards of Aso Oke and Cap for Men",
          price: "0.00",
          link: "https://eventparcel.com/p3..."
        }
      ]
    },
    {
      id: 2,
      title: "Olawale Aso Ebi",
      privacy: "Private",
      packagePrice: "0.00",
      imageUrl: "/images/aso-ebi-2.jpg", // Replace with your actual image
      items: [
        {
          name: "4 Yards of Aso Oke and Cap for Men",
          price: "0.00",
          link: "https://eventparcel.com/p3..."
        }
      ]
    },
    {
      id: 3,
      title: "Ogunmekun Family",
      privacy: "Private",
      packagePrice: "0.00",
      imageUrl: "/images/aso-ebi-3.jpg", // Replace with your actual image
      items: [
        {
          name: "4 Yards of Aso Oke and Cap for Men",
          price: "0.00",
          link: "https://eventparcel.com/p3..."
        }
      ]
    }
  ];

  return (
    <div className="mt-8 px-4 md:px-8 lg:px-16">
      <div
        className="
          grid 
          grid-cols-1 
          md:grid-cols-2 
          lg:grid-cols-3 
          gap-6
        "
      >
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="border rounded-lg shadow-sm p-4 flex flex-col justify-between"
          >
            {/* Title + Privacy */}
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-semibold text-gray-800">
                {pkg.title}
              </h2>
              <span
                className={`text-xs font-medium px-2 py-1 rounded ${
                  pkg.privacy === "Public"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {pkg.privacy}
              </span>
            </div>

            {/* Packages + Price */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-700">
                Packages
              </span>
              <span className="text-sm text-gray-600">{pkg.packagePrice}</span>
            </div>

            {/* Package Items */}
            {pkg.items.map((item, index) => (
              <div key={index} className="mb-4">
                <div className="flex items-center space-x-3">
                  {/* Image of cloth */}
                  <Image
                    src={pkg.imageUrl}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                    width={64}
                    height={64}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">
                      {item.name}
                    </p>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline text-xs"
                    >
                      {item.link}
                    </a>
                  </div>
                  <span className="text-sm text-gray-600">{item.price}</span>
                  <button
                    type="button"
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaShareAlt />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PackagesSection;
