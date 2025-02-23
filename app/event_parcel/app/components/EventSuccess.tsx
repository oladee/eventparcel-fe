import React from 'react';

const EventSuccess: React.FC = () => {
  return (
    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
      <strong className="font-bold">Success!</strong>
      <span className="block sm:inline">Your event has been successfully submitted.</span>
    </div>
  );
};

export default EventSuccess;