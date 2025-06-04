"use client"


import { useEffect } from 'react';
import { Google } from '../icons/Icons';
import axios from 'axios';
import { identifyUser, trackEvent } from '@/lib/mixpanel';
import getBrowserType from '@/lib/getBrowserType';

const SocialSignup: React.FC = () => {
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
      trackEvent("sign-up started", {
        source: "sign-up page",
        sign_up_method: "Google",
        timestamp: new Date().toISOString(),
        page_name: "sign-up Page",
      });
          
      try {
        const response = await axios.post(
          "https://api.eventparcel.com/auth/user",
          { token } // Send token in the request body
        );
        if (response.data && response.data.data) {  
        trackEvent("sign-up completed", {
          source: "sign-up page",
          sign_up_method: "Google",
          timestamp: new Date().toISOString(),
          page_name: "sign-up Page",
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
        trackEvent("sign-up failed", {
          source: "sign-up page",
          sign_up_method: "Google",
          timestamp: new Date().toISOString(),
          page_name: "sign-up Page",
        });
        console.error("Error during authentication:", error.message);
      }
    };

    handleAuthentication();
  }, []);

  return (
    // <div className="grid grid-cols-3 gap-4 place-items-center justify-center">
    <div className="flex items-center justify-center">
      <a href='https://api.eventparcel.com/auth/google' className="authButton w-max">
        <Google width={20} height={20} /> <span className='hidden sm:block'>Google</span>
      </a>
      {/* <a href='https://api.eventparcel.com/auth/facebook' className="authButton w-max">
        <Facebook width={20} height={20} /> <span className='hidden sm:block'>Facebook</span>
      </a>
      <button className="authButton w-max">
        <Apple width={20} height={20} /> <span className='hidden sm:block'>Apple</span>
      </button> */}
    </div>
  );
};

export default SocialSignup;
















// import { useEffect, useState } from 'react'
// import { Facebook, Google, Apple } from '../icons/Icons'
// import axios from 'axios';

// const SocialSignup: React.FC = () => {
//   const urlParams = new URLSearchParams(window.location.search);
//   const [authToken, setAuthToken] = useState<string | null>(null);
//   const token = urlParams.get("token");
//   console.log(token);

//   useEffect(() => {
//     if (!token) {
//       return;
//     }
//     setAuthToken(token);
//     const handleAuthentication = async () => {
//       try {
//         const response = await axios.get(
//           "https://api.eventparcel.com/auth/user",  authToken 
//           // {
//           //   headers: {
//           //     Authorization: `Bearer ${token}`,
//           //   },
//           // }
//         );
//         if (response.data && response.data.data) {
//           const user = response.data.data;
//           console.log(user);
//           localStorage.setItem("personInfo", JSON.stringify(user));
//         }
//       } catch (error: any) {
//         console.error("Error during authentication:", error.message);
//       }
//     };

//     // const timer = setTimeout(() => {
//     //   handleAuthentication();
//     // }, 10000);

//     // return () => clearTimeout(timer);
//     handleAuthentication();
//   }, [token]);

//   return (
//     <div className="grid lg:grid-cols-3 gap-4">
//       <a href='https://api.eventparcel.com/auth/google' className="authButton">
//         <Google width={20} height={20} /> Google
//       </a>
//       <a href='https://api.eventparcel.com/auth/facebook' className="authButton">
//         <Facebook width={20} height={20} /> Facebook
//       </a>
//       <button className="authButton">
//         <Apple width={20} height={20} /> Apple
//       </button>
//     </div>
//   )
// }

// export default SocialSignup
