"use client"


import { useEffect } from 'react';
import { Google } from '../icons/Icons';
import axios from 'axios';
import { identifyUser, trackEvent } from '@/lib/mixpanel';
import getBrowserType from '@/lib/getBrowserType';

const SocialSignin: React.FC = () => {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    console.log(token);

    if (!token) {
      return;
    }
    const handleAuthentication = async () => {
      trackEvent("sign-in started", {
        source: "sign-in page",
        sign_up_method: "Google",
        timestamp: new Date().toISOString(),
        page_name: "sign-in Page",
      });
          
      try {
        const response = await axios.post(
          "https://api-eventparcel.onrender.com/auth/user",
          { token } // Send token in the request body
        );
        if (response.data && response.data.data) {  
        trackEvent("sign-in completed", {
          source: "sign-in page",
          sign_up_method: "Google",
          timestamp: new Date().toISOString(),
          page_name: "sign-in Page",
        });
  
        identifyUser(response.data.data.hostId, {
          userType: response.data.data.role,
          location,
          browser_type: getBrowserType(),
          email: response.data.data.email,
          user_first_name: response.data.data.firstName,
          user_last_name: response.data.data.lastName,
        });
          const user = response.data.data;
          console.log(user);
          localStorage.setItem("personInfo", JSON.stringify(user));
        }
      } catch (error: any) {
        trackEvent("sign-in failed", {
          source: "sign-in page",
          sign_up_method: "Google",
          timestamp: new Date().toISOString(),
          page_name: "sign-in Page",
        });
        console.error("Error during authentication:", error.message);
      }
    };

    handleAuthentication();
  }, []);

  return (
    // <div className="grid grid-cols-3 gap-4 place-items-center justify-center">
    <div className="flex items-center justify-center">
      <a href='https://api-eventparcel.onrender.com/auth/google' className="authButton w-max">
        <Google width={20} height={20} /> <span className='hidden sm:block'>Google</span>
      </a>
      {/* <a href='https://api-eventparcel.onrender.com/auth/facebook' className="authButton w-max">
        <Facebook width={20} height={20} /> <span className='hidden sm:block'>Facebook</span>
      </a>
      <button className="authButton w-max">
        <Apple width={20} height={20} /> <span className='hidden sm:block'>Apple</span>
      </button> */}
    </div>
  );
};

export default SocialSignin;
