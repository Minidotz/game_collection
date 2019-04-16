import React from 'react';
import { AppBar, Toolbar, IconButton, Typography } from '@material-ui/core';
import { ArrowBack, Menu as MenuIcon } from '@material-ui/icons';
import UserNavbarItem from '../../components/UserNavbarItem';


const Navbar = ({ title, showBack, goBack, toggleDrawer }) => {
    return (
        <AppBar>
            <Toolbar>
                <IconButton color="inherit" aria-label="Menu" onClick={showBack ? goBack : toggleDrawer}>
                    {showBack ? (
                        <ArrowBack />
                    ) : (
                        <MenuIcon />
                    )}
                </IconButton>
                <Typography variant="h6" color="inherit" style={{ flexGrow: 1 }}>
                    {title}
                </Typography>
                <UserNavbarItem />
            </Toolbar>
        </AppBar>
    )
}

export default Navbar;