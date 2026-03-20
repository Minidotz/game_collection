import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export default function AppLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showBack, setShowBack] = useState(false);
    const [title, setTitle] = useState('Game Collection');

    const toggleDrawer = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    const updateNav = (nextTitle) => {
        setShowBack(true);
        setTitle(nextTitle);
    };

    const goBack = () => {
        setShowBack(false);
        setTitle('Game Collection');
        window.history.back();
    };

    return (
        <div>
            <Navbar showBack={showBack} title={title} goBack={goBack} toggleDrawer={toggleDrawer} />
            <Sidebar isOpen={isSidebarOpen} onClose={toggleDrawer} />
            <Outlet context={{ updateNav }} />
        </div>
    );
}
