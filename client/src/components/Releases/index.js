import React, { Component } from 'react';
import { Paper, List, ListItem, ListItemText, Toolbar, Typography, Select, MenuItem, Avatar, CircularProgress } from '@material-ui/core';
import { Link } from 'react-router-dom';

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
            .catch(err => console.log(err));
    }

    render() {
        return (
            <Paper square>
                <Toolbar style={{ backgroundColor: '#f7f7f7' }}>
                    <div>
                        <Typography variant="title">
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
                    <List>
                        {this.state.releases.length > 0 ? (
                            this.state.releases.map(d => {
                                return (
                                    <ListItem key={d.guid} button component={Link} to={`/game/3030-${d.game.id}`} >
                                        <Avatar alt={d.name} src={d.image.icon_url} />
                                        <ListItemText primary={d.name} />
                                    </ListItem>
                                )
                            })
                        ) : (
                            <ListItem>
                                <ListItemText primary={<em>No data</em>} />
                            </ListItem>
                        )}
                    </List>
                )}
            </Paper>
        )
    }
}