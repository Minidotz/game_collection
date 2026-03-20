import React from 'react';
import { Drawer, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import { Home as HomeIcon, VideogameAsset as VideogameAssetIcon, Mail as MailIcon } from '@mui/icons-material';
import { Link, NavLink } from 'react-router-dom';

const styles = {
    listItem: {
        '&.active': {
            backgroundColor: 'primary.main'
        },
        '&:hover': {
            backgroundColor: 'secondary.main'
        }
    }
}

// const AdapterLink = React.forwardRef((props, ref) => <NavLink innerRef={ref} {...props} />);

function Sidebar(props) {
    return (
        <Drawer open={props.isOpen} onClose={props.onClose}>
            <List component="nav" sx={{ width: 250 }}>
                <ListItem divider>
                    <ListItemIcon>
                        <img src="favicon.ico" width="32" height="32" alt="" />
                    </ListItemIcon>
                    <ListItemText primary="Game Collection" />
                </ListItem>
                <ListItem button sx={styles.listItem} component={NavLink} to="/">
                    <ListItemIcon>
                        <HomeIcon />
                    </ListItemIcon>
                    <ListItemText primary="Home" />
                </ListItem>
                <ListItem button sx={styles.listItem} component={NavLink} to="/collection">
                    <ListItemIcon>
                        <VideogameAssetIcon />
                    </ListItemIcon>
                    <ListItemText primary="My Collection" />
                </ListItem>
                <ListItem button sx={styles.listItem} component={NavLink} to="/contact">
                    <ListItemIcon>
                        <MailIcon />
                    </ListItemIcon>
                    <ListItemText primary="Contact" />
                </ListItem>
            </List>
        </Drawer>
    );
}

export default Sidebar