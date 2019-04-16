import React from 'react';
import { Typography, Button, Avatar, withStyles } from '@material-ui/core';

const styles = {
    root: {
        display: 'flex',
        alignItems: 'center'
    },
    avatar: {
        backgroundColor: '#b02d27'
    },
    nameText: {
        paddingLeft: '0.5em',
        textTransform: "none"
    }
}

const UserNavbarItem = ({ classes }) => {
    return (
        <div className={classes.root}>
            <Button disableRipple>
                <Avatar className={classes.avatar}>SP</Avatar>
                <Typography variant="subtitle2" color="inherit" className={classes.nameText}>Stratos</Typography>
            </Button>
        </div>
    )
}

export default withStyles(styles)(UserNavbarItem);