import React from 'react';
import { Drawer, List, ListItem, ListItemText, ListItemIcon } from '@material-ui/core';
import { Home as HomeIcon, VideogameAsset as VideogameAssetIcon, Mail as MailIcon } from '@material-ui/icons';
import { NavLink } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    listItem: {
        '&.active': {
            backgroundColor: theme.palette.primary.main
        },
        '&:hover': {
            backgroundColor: theme.palette.secondary.main
        }
    },
    primary: {}
});

const AdapterLink = React.forwardRef((props, ref) => <NavLink innerRef={ref} {...props} />);

function Sidebar(props) {
    return (
        <Drawer open={props.isOpen} onClose={props.onClose}>
            <List component="nav" style={{ width: 250 }}>
                <ListItem divider>
                    <ListItemIcon>
                        <img src="favicon.ico" width="32" height="32" alt="" />
                    </ListItemIcon>
                    <ListItemText primary="Game Collection" />
                </ListItem>
                <ListItem button className={props.classes.listItem} component={AdapterLink} to="/" exact>
                    <ListItemIcon>
                        <HomeIcon />
                    </ListItemIcon>
                    <ListItemText classes={{ primary: props.classes.primary }} primary="Home" />
                </ListItem>
                <ListItem button className={props.classes.listItem} component={AdapterLink} to="/collection" exact>
                    <ListItemIcon>
                        <VideogameAssetIcon />
                    </ListItemIcon>
                    <ListItemText classes={{ primary: props.classes.primary }} primary="My Collection" />
                </ListItem>
                <ListItem button className={props.classes.listItem} component={AdapterLink} to="/contact" exact>
                    <ListItemIcon>
                        <MailIcon />
                    </ListItemIcon>
                    <ListItemText classes={{ primary: props.classes.primary }} primary="Contact" />
                </ListItem>
            </List>
        </Drawer>
    );
}

export default withStyles(styles)(Sidebar);