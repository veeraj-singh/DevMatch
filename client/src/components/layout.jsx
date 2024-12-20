import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './sidebar'; // Adjust path as needed

const MainLayout = () => {
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar />
        <Outlet /> {/* Render the nested route here */}
    </div>
  );
};

export default MainLayout;
