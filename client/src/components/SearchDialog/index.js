import React from 'react';
import { Dialog, DialogContent, IconButton, Toolbar } from '@material-ui/core';
import GameSearch from '../GameSearch';
import CloseIcon from '@material-ui/icons/Close';
import withMobileDialog from '@material-ui/core/withMobileDialog';

function SearchDialog(props) {
    return (
        <Dialog open={props.search} onClose={props.closeSearch} fullWidth fullScreen={props.fullScreen} >
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

export default withMobileDialog()(SearchDialog);