import React, { Component } from 'react';
import { Grid, CircularProgress } from '@material-ui/core';
import GameSearch from '../../components/GameSearch';
import RecentItems from '../../components/RecentItems';

export default class MainPage extends Component {
    state = {
        gamesAdded: [],
        searches: [],
        loading: true
    }

    getGames = () => {
        return fetch('/games').then(res => res.json())
            .then(json => this.setState({
                gamesAdded: json
            })
            ).catch(err => console.log(err));
    }

    getSearches = () => {
        return fetch('/searches').then(res => res.json())
            .then(json => this.setState({
                searches: json
            })
            ).catch(err => console.log(err));
    }

    componentDidMount() {
        Promise.all([this.getGames(), this.getSearches()]).then(res =>
            this.setState({ loading: false })
        );
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
                <Grid container justify="center" >
                    <Grid item xs={12} sm={9}>
                        <GameSearch updateNav={this.props.updateNav} />
                    </Grid>
                </Grid>
                <Grid container spacing={8} >
                    <Grid item xs={12} sm>
                        <RecentItems data={this.state.gamesAdded} unit="games" title="Recently Added" />
                    </Grid>
                    <Grid item xs={12} sm>
                        <RecentItems data={this.state.searches} unit="searches" title="Recently Searched" />
                    </Grid>
                </Grid>
            </div>
        );
    }
}