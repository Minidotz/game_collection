import React, { Component } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemText, Table, TableBody, TableCell, TableHead, TableRow, Paper, TextField, Grid, Select, MenuItem, FormControl, InputLabel, CircularProgress, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, InputAdornment, Snackbar, Avatar } from '@material-ui/core';
import * as Icons from '@material-ui/icons';
import './App.css';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import spacing from '@material-ui/core/styles/spacing';
import Moment from "moment";

class App extends Component {
    state = {
        response: null
    };

    loadData = () => {
        this.callApi()
            .then(res => this.setState({ response: res }))
            .catch(err => console.log(err));
    }

    componentDidMount() {
        this.loadData();
    }

    callApi = async () => {
        const response = await fetch('/games');
        const body = await response.json();

        if (response.status !== 200) throw Error(body.message);

        return body;
    };

    render() {
        return (
            <Router>
                <Navbar data={this.state.response} handleDataChange={this.loadData} />
            </Router>
        );
    }
}

class Navbar extends Component {
    state = {
        title: '',
        company: '',
        genre: '',
        platform: '',
        release_date: new Date(),
        image: '',
        isEdit: false,
        isOpen: false,
        isSidebarOpen: false,
        notification: {
            isNotifOpen: false,
            notifMessage: ''
        }
    };

    handleCloseDialog = () => {
        this.setState({
            title: '',
            company: '',
            genre: '',
            platform: '',
            release_date: new Date(),
            image: '',
            isEdit: false,
            isOpen: false
        });
    }

    handleOpenDialog = () => {
        this.setState({ isOpen: true });
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleRowClick = (id) => {
        this.setState({
            isEdit: true,
            isOpen: true
        });
        this.setState(this.props.data.filter(el => el._id === id)[0]);
    }

    handleOpenNotification = (message) => {
        this.setState({
            notification: {
                isNotifOpen: true,
                notifMessage: message
            }
        })
    }

    handleCloseNotification = () => {
        this.setState({
            notification: { isNotifOpen: false }
        });
    }

    toggleDrawer = () => {
        this.setState({
            isSidebarOpen: !this.state.isSidebarOpen
        });
    }

    handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            let reader = new FileReader();
            reader.onload = (e) => {
                this.setState({image: e.target.result});
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    }

    render() {
        return (
            <div>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton color="inherit" aria-label="Menu" onClick={this.toggleDrawer}>
                            <Icons.Menu />
                        </IconButton>
                        <Typography variant="title" color="inherit">
                            Game Collection
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Sidebar isOpen={this.state.isSidebarOpen} onClose={this.toggleDrawer} />
                <Paper style={{ width: '80%', textAlign: 'center', margin: 'auto', overflowX: 'auto' }}>
                    <GameTable data={this.props.data} handleRowClick={this.handleRowClick} handleDataChange={this.props.handleDataChange} handleOpenNotification={this.handleOpenNotification} />
                </Paper>
                <GameDialog isEdit={this.state.isEdit} handleDataChange={this.props.handleDataChange} data={this.state} handleCloseDialog={this.handleCloseDialog} handleOpenDialog={this.handleOpenDialog} handleChange={this.handleChange} handleOpenNotification={this.handleOpenNotification} handleImageChange={this.handleImageChange} />
                <Tooltip title="Add new game">
                    <Button variant="fab" color="primary" onClick={this.handleOpenDialog} aria-label="add" style={{ position: 'absolute', bottom: spacing.unit * 2, right: spacing.unit * 2 }}>
                        <Icons.Add />
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

class GameTable extends Component {
    deleteRow = (e, id) => {
        fetch('/delete', {
            method: 'POST',
            body: JSON.stringify({ id: id }),
            headers: { 'Content-Type': 'application/json' }
        }).then(this.props.handleOpenNotification('Deleted'))
            .then(this.props.handleDataChange())
            .then(e.stopPropagation());
    }

    handleClick = e => {
        e.stopPropagation();
    }

    uploadPic = (e) => {
        var data = new FormData();
        data.append('id', e.target.id);
        data.append('img', e.target.files[0]);
        fetch('/upload', {
            method: 'POST',
            body: data
        });
    }

    render() {
        return (
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell>Title</TableCell>
                        <TableCell>Company</TableCell>
                        <TableCell>Genre</TableCell>
                        <TableCell>Platform</TableCell>
                        <TableCell>Release Date</TableCell>
                        <TableCell />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {this.props.data && this.props.data.map(n => {
                        return (
                            <TableRow key={n._id} onClick={() => this.props.handleRowClick(n._id)} hover>
                                <TableCell>
                                    <input type="file" accept="image/jpeg" id={"img-" + n._id} style={{ display: 'none' }} onClick={this.handleClick} onChange={this.uploadPic} />
                                    <label htmlFor={"img-" + n._id}>
                                        <IconButton onClick={this.handleClick} component="span">
                                            <Avatar src={n.image}>
                                                {!n.image && (
                                                    <Icons.PhotoCamera/>
                                                )}
                                            </Avatar>
                                        </IconButton>
                                    </label>
                                </TableCell>
                                <TableCell>{n.title}</TableCell>
                                <TableCell>{n.company}</TableCell>
                                <TableCell>{n.genre}</TableCell>
                                <TableCell>{n.platform}</TableCell>
                                <TableCell>{Moment(n.release_date).format('DD-MMM-YYYY')}</TableCell>
                                <TableCell>
                                    <IconButton onClick={(e) => this.deleteRow(e, n._id)}><Icons.Delete /></IconButton>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                    {!this.props.data && (
                        <TableRow>
                            <TableCell colSpan={6} style={{ textAlign: 'center' }}>
                                <div>
                                    <CircularProgress />
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        );
    }
}

class GameDialog extends Component {
    handleSubmit = (e) => {
        e.preventDefault();
        if (this.props.isEdit) {
            fetch('/update', {
                method: 'POST',
                body: JSON.stringify(this.props.data),
                headers: { 'Content-Type': 'application/json' }
            }).then(this.props.handleCloseDialog())
                .then(this.props.handleOpenNotification(this.props.data.title + ' has been updated.'))
                .then(this.props.handleDataChange());
        }
        else {
            fetch('/add', {
                method: 'POST',
                body: JSON.stringify(this.props.data),
                headers: { 'Content-Type': 'application/json' }
            }).then(this.props.handleCloseDialog())
                .then(this.props.handleOpenNotification('New game added'))
                .then(this.props.handleDataChange());
        }
    }

    render() {
        return (
            <div>
                <Dialog open={this.props.data.isOpen} onClose={this.props.handleCloseDialog} aria-labelledby="form-dialog-title">
                    <Toolbar style={{backgroundColor: '#f7f7f7'}}>
                        {this.props.isEdit && (
                            <div>
                                <input type="file" accept="image/jpeg" id={"img-" + this.props.data._id} style={{ display: 'none' }} />
                                <label htmlFor={"img-" + this.props.data._id}>
                                    <IconButton onClick={this.handleClick} component="span">
                                        <Avatar src={this.props.data.image}>
                                            {!this.props.data.image && (
                                                <Icons.PhotoCamera />
                                            )}
                                        </Avatar>
                                    </IconButton>
                                </label>
                            </div>
                        )}
                        <DialogTitle id="form-dialog-title">
                            {this.props.data.isEdit ? this.props.data.title : 'Create Game'}
                        </DialogTitle>
                    </Toolbar>
                    <DialogContent>
                        <AddForm handleChange={this.props.handleChange} data={this.props.data} handleImageChange={this.props.handleImageChange} />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.props.handleCloseDialog}>Cancel</Button>
                        <Button onClick={this.handleSubmit} color="primary">Save</Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

class AddForm extends Component {
    state = {
        platformOptions: []
    }

    componentDidMount() {
        fetch('/platforms')
            .then(res => res.json())
            .then(data => this.setState({ platformOptions: data }));
    }

    render() {
        return (
            <form >
                <Grid container spacing={0}>
                    {!this.props.data.isEdit && (
                        <Grid item xs={2}>
                            <input type="file" accept="image/jpeg" id="img" name="cover" style={{ display: 'none' }} onChange={this.props.handleImageChange} />
                            <label htmlFor="img">
                                <IconButton onClick={this.handleClick} component="span" style={{ margin: 'auto' }}>
                                    <Avatar src={this.props.data.image} style={{ width: 45, height: 45 }}>
                                        {!this.props.data.image && (
                                            <Icons.PhotoCamera />
                                        )}
                                    </Avatar>
                                </IconButton>
                            </label>
                        </Grid>
                    )}
                    <Grid item xs>
                        <TextField id="title" name="title" label="Title" value={this.props.data.title} onChange={this.props.handleChange} margin="dense" autoFocus required fullWidth />
                    </Grid>
                    <TextField id="company" name="company" label="Company" value={this.props.data.company} onChange={this.props.handleChange} margin="dense" fullWidth />
                    <TextField id="genre" name="genre" label="Genre" value={this.props.data.genre} onChange={this.props.handleChange} margin="dense" fullWidth />
                    <FormControl fullWidth margin="dense">
                        <InputLabel htmlFor="platform">Platform</InputLabel>
                        <Select onChange={this.props.handleChange}
                            inputProps={{
                                name: 'platform',
                                id: 'platform'
                            }}
                            value={this.props.data.platform}>
                            {this.state.platformOptions.map(platform => (
                                <MenuItem key={platform} value={platform}>{platform}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField id="release_date" name="release_date" type="date" label="Release Date" defaultValue={Moment(this.props.data.release_date).format('YYYY-MM-DD')} InputLabelProps={{ shrink: true }} onChange={this.props.handleChange} margin="dense" fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Icons.DateRange />
                                </InputAdornment>
                            ),
                        }} />
                </Grid>
            </form>
        );
    }
}

function Sidebar(props) {
    return (
        <Drawer open={props.isOpen} onClose={props.onClose}>
            <List style={{ width: 250 }}>
                <ListItem button>
                    <ListItemText primary="Home" />
                </ListItem>
                <ListItem button component={Link} to="/contact">
                    <ListItemText primary="Contact" />
                </ListItem>
            </List>
        </Drawer>
    );
}

export default App;
