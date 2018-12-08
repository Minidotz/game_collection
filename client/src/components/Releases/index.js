import React, { Component } from 'react';
import { Paper, Toolbar, Typography, Select, MenuItem, CircularProgress } from '@material-ui/core';
import GameList from '../GameList';

export default class Releases extends Component {
    state = {
        selectedPlatformId: 94,
        loading: true,
        releases: []
    }

    componentDidMount() {
        this.getReleases(this.state.selectedPlatformId);
    }

    handleChange = e => {
        this.setState({ loading: true })
        this.getReleases(e.target.value);
        this.setState({ selectedPlatformId: e.target.value });
    }

    getReleases = (platformId) => {
        fetch(`/releases/${platformId}?limit=10`)
            .then(res => res.json())
            .then(json => { this.setState({ releases: json.results, loading: false }) })
            .catch(err => { 
                console.log(err);
                this.setState({loading: false});
            });
    }

    render() {
        return (
            <Paper square>
                <Toolbar style={{ backgroundColor: '#f7f7f7' }}>
                    <div>
                        <Typography variant="h6">
                            {this.props.title}
                        </Typography>
                    </div>
                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                        {this.props.platforms.length > 0 && (
                            <Select value={this.state.selectedPlatformId} style={{ margin: '0 5px' }} onChange={this.handleChange} >
                                {this.props.platforms.map(p => {
                                    return <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                                })}
                            </Select>
                        )}
                    </div>
                </Toolbar>
                {this.state.loading && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CircularProgress />
                    </div>
                )}
                {!this.state.loading && (
                    <GameList data={this.state.releases} />
                )}
            </Paper>
        )
    }
}