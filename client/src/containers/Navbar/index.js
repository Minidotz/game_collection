import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Button, Avatar } from '@material-ui/core';
import { ArrowBack, Menu as MenuIcon} from '@material-ui/icons';

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
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Button disableRipple>
                        <Avatar style={{ backgroundColor: '#b02d27' }}>SP</Avatar>
                        <Typography variant="subtitle2" color="inherit" style={{ paddingLeft: '0.5em', textTransform: "none" }}>Stratos</Typography>
                    </Button>
                </div>
            </Toolbar>
        </AppBar>
    )
}

export default Navbar;