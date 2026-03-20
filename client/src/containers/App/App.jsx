import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
                    <Sidebar isOpen={this.state.isSidebarOpen} onClose={this.toggleDrawer} />
                    <Routes>
                        <Route exact path="/" element={<MainPage />} />
                        <Route path="/collection" element={<CollectionPage />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/games/:id" element={<GamePage updateNav={this.updateNav} />} />
                    </Routes>
                </div>
            </Router>
        );
    }
}

export default App;
