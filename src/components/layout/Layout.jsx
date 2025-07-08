import React from 'react';
import { Outlet } from 'react-router';

const Layout = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <Outlet />
        </div>
    );
};

export  default Layout;
