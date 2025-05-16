import React from 'react';
import { Checked } from '../icons/Icons';
import { useRouter } from 'next/navigation';

const ResetSuccess: React.FC = () => {
    const router = useRouter();
    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 px-1 flex items-center justify-center">
          <div className="flex flex-col justify-center items-center bg-white p-6 rounded-[24px] w-full max-w-md text-center relative">
            <Checked width={100} height={100} />
            <p className="font-bold text-3xl mt-4">Password reset successful</p>
            <p className="font-medium text-[#718096] mt-2">
              Your password has been successfully reset. <br />
              You can now log in with your new password.
            </p>
            <button
              className="button_v1 mt-6 w-full"
              onClick={() => router.push("/")}
            >
              Continue to Login
            </button>
          </div>
        </div>
      );
};

export default ResetSuccess;
