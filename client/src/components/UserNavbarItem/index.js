import React from 'react';
import { Typography, Button, Avatar, withStyles, CircularProgress, Menu, MenuItem } from '@material-ui/core';
import { useAuth0 } from "../../react-auth0-spa";
import { Link } from "react-router-dom";

const styles = {
    root: {
        display: 'flex',
        alignItems: 'center'
    },
    nameText: {
        paddingLeft: '0.5em',
        textTransform: "none"
    }
}

const UserNavbarItem = ({ classes }) => {
    const { isAuthenticated, loginWithRedirect, logout, loading, user } = useAuth0();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(null);
    }

    return (
        <div className={classes.root}>
            {loading &&
                <CircularProgress color="secondary" />
            }
            {!isAuthenticated && !loading &&
                <Button
                    color="inherit"
                    onClick={() =>
                        loginWithRedirect({
                            redirect_uri: window.location.origin
                        })
                    }
                >
                    Login
                </Button>
            }
            {isAuthenticated && !loading && user && 
                <div>
                    <Button disableRipple aria-haspopup="true" aria-controls="profile-menu" onClick={handleClick}>
                        <Avatar alt={user.name} src={user.picture} />
                        <Typography variant="subtitle2" color="inherit" className={classes.nameText}>{user.name}</Typography>
                    </Button>
                    <Menu getContentAnchorEl={null}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center'
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                        id="profile-menu"
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem component={Link} to={'/profile'} >Profile</MenuItem>
                        <MenuItem onClick={() => logout()} >Logout</MenuItem>
                    </Menu>
                </div>
            }
        </div>
    )
}

export default withStyles(styles)(UserNavbarItem);