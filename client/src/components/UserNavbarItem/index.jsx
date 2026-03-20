import React from 'react';
import { Typography, Button, Avatar, Box } from '@mui/material';

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

const UserNavbarItem = () => {
    return (
        <Box sx={styles.root}>
            <Button disableRipple>
                <Avatar sx={styles.avatar}>SP</Avatar>
                <Typography variant="subtitle2" color="inherit" sx={styles.nameText}>Stratos</Typography>
            </Button>
        </Box>
    )
}

export default UserNavbarItem