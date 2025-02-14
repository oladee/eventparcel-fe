"use client"


import { useEffect } from 'react';
import { Facebook, Google, Apple } from '../icons/Icons';
import axios from 'axios';

const SocialSignup: React.FC = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");
  console.log(token);

  useEffect(() => {
    if (!token) {
      return;
    }
    const handleAuthentication = async () => {
      try {
        const response = await axios.post(
          "https://api-eventparcel.onrender.com/auth/user",
          { token } // Send token in the request body
        );
        if (response.data && response.data.data) {
          const user = response.data.data;
          console.log(user);
          localStorage.setItem("personInfo", JSON.stringify(user));
        }
      } catch (error: any) {
        console.error("Error during authentication:", error.message);
      }
    };

    handleAuthentication();
  }, [token]);

  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <a href='https://api-eventparcel.onrender.com/auth/google' className="authButton">
        <Google width={20} height={20} /> Google
      </a>
      <a href='https://api-eventparcel.onrender.com/auth/facebook' className="authButton">
        <Facebook width={20} height={20} /> Facebook
      </a>
      <button className="authButton">
        <Apple width={20} height={20} /> Apple
      </button>
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
//           "https://api-eventparcel.onrender.com/auth/user",  authToken 
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
//       <a href='https://api-eventparcel.onrender.com/auth/google' className="authButton">
//         <Google width={20} height={20} /> Google
//       </a>
//       <a href='https://api-eventparcel.onrender.com/auth/facebook' className="authButton">
//         <Facebook width={20} height={20} /> Facebook
//       </a>
//       <button className="authButton">
//         <Apple width={20} height={20} /> Apple
//       </button>
//     </div>
//   )
// }

// export default SocialSignup
