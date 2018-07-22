import React, { Component } from 'react';
import { CircularProgress, Typography, Grid, Tooltip, Button, Snackbar, ButtonBase, IconButton } from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';
import PhotoIcon from '@material-ui/icons/Photo';

export default class GamePage extends Component {
    state = {
        loading: true,
        gameData: null,
        notification: {
            isNotifOpen: false,
            notifMessage: ''
        }
    }
    componentDidMount() {
        fetch('/game/' + this.props.match.params.id)
        .then(res => res.json())
        .then(res => {
            this.setState({ gameData: res.results, loading: false });
            this.props.updateNav(res.results.name)
        }).catch(err => console.log(err));
    }

    addToCollection = () => {
        fetch('/add_to_collection', {
            method: 'POST',
            body: JSON.stringify({
                title: this.state.gameData.name,
                guid: this.state.gameData.guid,
                image: this.state.gameData.image.medium_url
            }),
            headers: { 'Content-Type': 'application/json' }
        }).then(res => {
            if(res.ok) {
                this.setState({
                    notification: {
                        isNotifOpen: true,
                        notifMessage: 'Added to collection'
                    }
                });
            }
            else {
                this.setState({
                    notification: {
                        isNotifOpen: true,
                        notifMessage: 'An error occurred'
                    }
                });
            }
        }).catch(err => console.log(err));
    }

    handleCloseNotification = () => {
        this.setState({
            notification: {
                isNotifOpen: false,
                notifMessage: ''
            }
        });
    }

    uploadPic = (e) => {
        var data = new FormData();
        data.append('guid', e.target.id);
        data.append('img', e.target.files[0]);
        fetch('/upload', {
            method: 'POST',
            body: data
        });
    }

    handleClick = e => {
        e.stopPropagation();
    }

    render() {
        if(this.state.loading) {
            return (
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh'}}>
                    <CircularProgress />
                </div>
            );
        }
        return (
            <div>
                <Grid container spacing={24}>
                    <Grid item sm={3} xs={12}>
                        <input type="file" accept="image/jpeg" id={"img-" + this.state.gameData.guid} style={{ display: 'none' }} onClick={this.handleClick} onChange={this.uploadPic} />
                        <label htmlFor={"img-" + this.state.gameData.guid}>
                            <ButtonBase component="span" onClick={this.handleClick}>
                                <img src={this.state.gameData.myImage ? this.state.gameData.myImage : this.state.gameData.image.medium_url} alt="" width="100%" />
                            </ButtonBase>
                        </label>
                    </Grid>
                    <Grid item sm>
                        <Typography variant="title" gutterBottom>Summary</Typography>
                        <Typography variant="body1">{this.state.gameData.deck}</Typography>
                    </Grid>
                </Grid>
                <Grid container spacing={24}>
                    <Grid item xs>
                        <Typography dangerouslySetInnerHTML={{__html: this.state.gameData.description}} style={{overflowX: 'hidden'}} >
                        </Typography>
                    </Grid>
                </Grid>
                <Tooltip title="Add to Collection">
                    <Button variant="fab" color="primary" onClick={this.addToCollection} aria-label="add" style={{ position: 'fixed', right: '20px', bottom: '20px'}}>
                        <FavoriteIcon />
                    </Button>
                </Tooltip>
                <Snackbar open={this.state.notification.isNotifOpen} message={this.state.notification.notifMessage} autoHideDuration={2000} onClose={this.handleCloseNotification} action={
                    <Button color="inherit" size="small" onClick={this.handleCloseNotification}>
                        Close
                    </Button>
                } />
            </div>
        );
    }
}