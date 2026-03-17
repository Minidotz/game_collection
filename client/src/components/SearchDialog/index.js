import React from 'react';
import { Dialog, DialogContent, IconButton, Toolbar } from '@mui/material';
import GameSearch from '../GameSearch';
import CloseIcon from '@mui/icons-material/Close';

function SearchDialog(props) {
    return (
        <Dialog open={props.search} onClose={props.closeSearch} fullWidth fullScreen={props.fullScreen} PaperProps={{style: {minHeight: '30vh'}}} >
            <Toolbar disableGutters style={{justifyContent: 'flex-end'}}>
                <IconButton color="inherit" onClick={props.closeSearch} aria-label="Close" >
                    <CloseIcon />
                </IconButton>
            </Toolbar>
            <DialogContent style={{paddingTop: '5px'}}>
                <GameSearch />
            </DialogContent>
        </Dialog>
    );
}

export default SearchDialog;