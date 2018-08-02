import React from 'react';
import { Drawer, List, ListItem, ListItemText, ListItemIcon } from '@material-ui/core';
import { Home as HomeIcon, VideogameAsset as VideogameAssetIcon, Mail as MailIcon } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    listItem: {
        '&:focus': {
            backgroundColor: theme.palette.primary.main
        },
    },
    primary: {}
});

function Sidebar(props) {
    return (
        <Drawer open={props.isOpen} onClose={props.onClose}>
            <List style={{ width: 250 }}>
                <ListItem divider>
                    <ListItemText primary="Game Collection" />
                </ListItem>
                <ListItem button className={props.classes.listItem} component={Link} to="/">
                    <ListItemIcon>
                        <HomeIcon />
                    </ListItemIcon>
                    <ListItemText classes={{ primary: props.classes.primary }} primary="Home" />
                </ListItem>
                <ListItem button className={props.classes.listItem} component={Link} to="/collection">
                    <ListItemIcon>
                        <VideogameAssetIcon />
                    </ListItemIcon>
                    <ListItemText classes={{ primary: props.classes.primary }} primary="My Collection" />
                </ListItem>
                <ListItem button className={props.classes.listItem} component={Link} to="/contact">
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