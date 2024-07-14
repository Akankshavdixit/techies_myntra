import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold text-red-600 mb-4">Unauthorized Access</h1>
      <p className="text-lg text-gray-800 mb-4">
        You do not have permission to view this page. Please login as an influencer to access this content.
      </p>
      <Link to="/" className="text-blue-500 hover:underline">Go to Home Page</Link>
    </div>
  );
};

export default UnauthorizedPage;
