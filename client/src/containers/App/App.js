import React, { Component } from 'react';
import { AppBar, Toolbar, Typography, IconButton } from '@material-ui/core';
import * as Icons from '@material-ui/icons';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import MainPage from '../MainPage';
import Contact from '../Contact';
import GamePage from '../GamePage';
import CollectionPage from '../CollectionPage';
import Sidebar from '../../components/Sidebar';

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
                    <AppBar>
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

                    <Route exact path="/" component={MainPage} />
                    <Route path="/collection" component={CollectionPage} />
                    <Route path="/contact" component={Contact} />
                    <Route path="/game/:id" render={routeProps => <GamePage {...routeProps} updateNav={this.updateNav} />} />
                </div>
            </Router>
        );
    }
}

export default App;
