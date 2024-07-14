import React from 'react';
import Layout from './Layout';

const NotFoundPage = () => {
  return (
    <Layout>
    <div className="flex flex-col items-center justify-center h-screen text-center ">
      <h1 className="text-4xl font-bold text-pink-500">404 - Page Not Found</h1>
      <p className="text-lg mt-4">Oops! The page you are looking for does not exist.</p>
    </div>
    </Layout>
  );
};

export default NotFoundPage;
