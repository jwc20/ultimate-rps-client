import React from 'react';
import { Outlet } from 'react-router';

const Layout = () => {
    return (
        <div className="container">
            <Outlet />
        </div>
    );
};

export  default Layout;
