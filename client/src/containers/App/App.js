import React, { Component } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText, Grid, ListItemIcon, Divider } from '@material-ui/core';
import * as Icons from '@material-ui/icons';
import './App.css';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import Contact from '../Contact';
import GameSearch from '../../components/GameSearch';
import GamePage from '../GamePage';
import CollectionPage from '../CollectionPage';

class App extends Component {
    state = {
        isSidebarOpen: false,
        showBack: false,
        title: 'Game Collection'
    };

    toggleDrawer = () => {
        this.setState({
            isSidebarOpen: !this.state.isSidebarOpen
        });
    }

    updateNav = (title) => {
        this.setState({
            showBack: true,
            title: title
        });
    }

    goBack = () => {
        this.setState({
            showBack: false,
            title: 'Game Collection'
        });
        window.history.back();
    }

    render() {
        return (
            <Router>
                <div>
                    <AppBar position="static" style={{marginBottom: '1em'}} >
                        <Toolbar>
                            {this.state.showBack ? (
                                <IconButton color="inherit" aria-label="Menu" onClick={() => this.goBack()}>
                                    <Icons.ArrowBack />
                                </IconButton>
                            ) : (
                                    <IconButton color="inherit" aria-label="Menu" onClick={this.toggleDrawer}>
                                        <Icons.Menu />
                                    </IconButton>
                                )}
                            <Typography variant="title" color="inherit">
                                {this.state.title}
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <Sidebar isOpen={this.state.isSidebarOpen} onClose={this.toggleDrawer} />

                    <Route exact path="/" render={() => <Content data={this.state.response} handleDataChange={this.loadData} loading={this.state.loading} updateNav={this.updateNav} />} />
                    <Route path="/collection" component={CollectionPage} />
                    <Route path="/contact" component={Contact} />
                    <Route path="/game/:id" component={GamePage} />
                </div>
            </Router>
        );
    }
}

function Content(props) {
    return (
        <div>
            <Grid container>
                <Grid container justify="center" >
                    <Grid item xs={12} sm={9}>
                        <GameSearch updateNav={props.updateNav} />
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
}



function Sidebar(props) {
    return (
        <Drawer open={props.isOpen} onClose={props.onClose}>
            <List style={{ width: 250 }}>
                <ListItem>
                    <ListItemText primary="Game Collection" />
                </ListItem>
                <Divider />
                <ListItem button component={Link} to="/">
                    <ListItemIcon>
                        <Icons.Home />
                    </ListItemIcon>
                    <ListItemText primary="Home" />
                </ListItem>
                <ListItem button component={Link} to="/collection">
                    <ListItemIcon>
                        <Icons.VideogameAsset />
                    </ListItemIcon>
                    <ListItemText primary="My Collection" />
                </ListItem>
                <ListItem button component={Link} to="/contact">
                    <ListItemIcon>
                        <Icons.Mail />
                    </ListItemIcon>
                    <ListItemText primary="Contact" />
                </ListItem>
            </List>
        </Drawer>
    );
}

export default App;
