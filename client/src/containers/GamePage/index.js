import React, { PureComponent } from 'react';
import { CircularProgress, Typography, Grid, Tooltip, Button, Snackbar, ButtonBase, IconButton, Paper, Tabs, Tab, Zoom } from '@material-ui/core';
import { Favorite as FavoriteIcon, Delete as DeleteIcon } from '@material-ui/icons';
import PhotoIcon from '@material-ui/icons/Photo';
import GameInfo from '../../components/GameInfo';

const overviewPattern = /(?:<[^Overview</h2>])(.*?)(?=<h2|$)/;
class GamePage extends PureComponent {
    state = {
        loading: true,
        gameData: null,
        notification: {
            isNotifOpen: false,
            notifMessage: ''
        },
        inCollection: false,
        tabValue: 0
    }

    inCollection = (guid) => {
        fetch('/inCollection/' + guid)
            .then(res => res.json())
            .then(res => {
                if (res) {
                    this.setState({ inCollection: true });
                    this.props.updateNav(res.title);
                }
            }).catch(err => console.log(err));
    }

    componentDidMount() {
        this.inCollection(this.props.match.params.id);
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
            if (res.ok) {
                this.setState({
                    notification: {
                        isNotifOpen: true,
                        notifMessage: 'Added to collection'
                    },
                    inCollection: true
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

    removeFromCollection = () => {
        fetch('/removeFromCollection', {
            method: 'POST',
            body: JSON.stringify({
                guid: this.state.gameData.guid
            }),
            headers: { 'Content-Type': 'application/json' }
        }).then(res => {
            res.ok && this.setState({
                inCollection: false,
                notification: {
                    isNotifOpen: true,
                    notifMessage: 'Removed from Collection'
                }
            })
        });
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
        if (this.state.loading) {
            return (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                    <CircularProgress />
                </div>
            );
        }
        return (
            <div className="content">
                <Grid container spacing={16}>
                    <Grid item sm={4} xs={12}>
                        <Grid container direction="column">
                            <Grid item xs={12}>
                                <input type="file" accept="image/jpeg" id={"img-" + this.state.gameData.guid} style={{ display: 'none' }} onClick={this.handleClick} onChange={this.uploadPic} />
                                <label htmlFor={"img-" + this.state.gameData.guid}>
                                    <ButtonBase component="span" onClick={this.handleClick}>
                                        <img src={this.state.gameData.myImage ? this.state.gameData.myImage : this.state.gameData.image.medium_url} alt="" width="100%" />
                                    </ButtonBase>
                                </label>
                            </Grid>
                            <Grid item xs={12}>
                                <GameInfo data={this.state.gameData} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item sm={8} xs={12}>
                        <Grid container>
                            <Grid item>
                                <Paper square>
                                    <Tabs value={this.state.tabValue} indicatorColor="primary" >
                                        <Tab label="Overview" />
                                    </Tabs>
                                </Paper>
                                {this.state.tabValue === 0 && (
                                    <Paper square>
                                        <Typography dangerouslySetInnerHTML={{ __html: overviewPattern.exec(this.state.gameData.description)[0].replace(/style=".*?(?:")/g, "") }} style={{ overflowX: 'hidden', padding: '0.5em' }} />
                                    </Paper>
                                )}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Tooltip title="Remove from Collection">
                    <Zoom in={this.state.inCollection} >
                        <Button variant="fab" color="secondary" onClick={this.removeFromCollection} aria-label="remove" style={{ position: 'fixed', right: '30px', bottom: '30px' }}>
                            <DeleteIcon />
                        </Button>
                    </Zoom>
                </Tooltip>
                <Tooltip title="Add to Collection">
                    <Zoom in={!this.state.inCollection}>
                        <Button variant="fab" color="primary" onClick={this.addToCollection} aria-label="add" style={{ position: 'fixed', right: '30px', bottom: '30px' }}>
                            <FavoriteIcon />
                        </Button>
                    </Zoom>
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

export default GamePage;