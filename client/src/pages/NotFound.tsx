import React from 'react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-extrabold">404</h1>
        <p className="mt-4 text-lg">Page not found</p>
      </div>
    </div>
  );
};

export default NotFound;
