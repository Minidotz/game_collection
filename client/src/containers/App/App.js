import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import MainPage from '../MainPage';
import Contact from '../Contact';
import GamePage from '../GamePage';
import CollectionPage from '../CollectionPage';
import Sidebar from '../../components/Sidebar';
import Navbar from '../Navbar';

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
                    <Navbar showBack={this.state.showBack} title={this.state.title} goBack={this.goBack} toggleDrawer={this.toggleDrawer} />
                    {/* <AppBar>
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
                            <Typography variant="h6" color="inherit" style={{ flexGrow: 1 }}>
                                {this.state.title}
                            </Typography>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Button disableRipple>
                                    <Avatar style={{ backgroundColor: '#b02d27' }}>SP</Avatar>
                                    <Typography variant="subheading" color="inherit" style={{ paddingLeft: '0.5em', textTransform: "none" }}>Stratos</Typography>
                                </Button>
                            </div>
                        </Toolbar>
                    </AppBar> */}
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
