import React, { useState } from 'react';
import { Box } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export default function AppLayout() {
    const navigate = useNavigate();
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
        navigate(-1);
    };

    return (
        <Box>
            <Navbar showBack={showBack} title={title} goBack={goBack} toggleDrawer={toggleDrawer} />
            <Sidebar isOpen={isSidebarOpen} onClose={toggleDrawer} />
            <Outlet context={{ updateNav }} />
        </Box>
    );
}
