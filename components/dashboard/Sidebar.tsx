"use client";


// components/Sidebar.tsx
import { useState } from 'react';
import { FiMenu, FiX, FiHome, FiCalendar, FiShoppingBag, FiUsers, FiTruck, FiCreditCard, FiHelpCircle } from 'react-icons/fi';

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FiMenu className="w-6 h-6" />
      </button>

      <aside className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:relative inset-y-0 left-0 w-64 bg-white shadow-lg md:shadow-none z-40 transition-transform duration-200 ease-in-out`}>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-8">Event Parcel</h1>
          
          <nav className="space-y-4">
            <div className="space-y-2">
              {[
                { icon: FiHome, text: 'Dashboard' },
                { icon: FiCalendar, text: 'Events' },
                { icon: FiShoppingBag, text: 'Orders' },
                { icon: FiUsers, text: 'Contacts' },
                { icon: FiTruck, text: 'Delivery' },
                { icon: FiCreditCard, text: 'Transactions' },
              ].map((item) => (
                <a key={item.text} className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded">
                  <item.icon className="w-5 h-5" />
                  <span>{item.text}</span>
                </a>
              ))}
            </div>

            <div className="pt-4 border-t space-y-2">
              <p className="px-2 text-sm font-medium text-gray-500">ADMIN</p>
              {['Co-Host', 'Discounts'].map((text) => (
                <a key={text} className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded">
                  <span>{text}</span>
                </a>
              ))}
            </div>

            <div className="pt-4 border-t">
              <a className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded">
                <FiHelpCircle className="w-5 h-5" />
                <span>Get Help</span>
              </a>
            </div>
          </nav>
        </div>

        <button
          className="md:hidden absolute top-4 right-4 p-2"
          onClick={() => setIsOpen(false)}
        >
          <FiX className="w-6 h-6" />
        </button>
      </aside>
    </>
  );
};