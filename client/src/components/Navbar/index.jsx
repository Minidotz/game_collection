import { AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import { ArrowBack, Menu as MenuIcon } from '@mui/icons-material';
import UserNavbarItem from '../UserNavbarItem';


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
                <Typography variant="h6" color="inherit" sx={{ flexGrow: 1 }}>
                    {title}
                </Typography>
                <UserNavbarItem />
            </Toolbar>
        </AppBar>
    )
}

export default Navbar;