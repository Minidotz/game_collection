import React from 'react';
import { Dialog, DialogContent, IconButton, Toolbar } from '@mui/material';
import GameSearch from '../GameSearch';
import CloseIcon from '@mui/icons-material/Close';

function SearchDialog(props) {
    return (
        <Dialog open={props.search} onClose={props.closeSearch} fullWidth fullScreen={props.fullScreen} PaperProps={{ sx: { minHeight: '30vh' } }}>
            <Toolbar disableGutters sx={{ justifyContent: 'flex-end' }}>
                <IconButton color="inherit" onClick={props.closeSearch} aria-label="Close" >
                    <CloseIcon />
                </IconButton>
            </Toolbar>
            <DialogContent sx={{ pt: '5px' }}>
                <GameSearch />
            </DialogContent>
        </Dialog>
    );
}

export default SearchDialog;