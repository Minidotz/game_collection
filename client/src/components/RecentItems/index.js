import React, { Component } from 'react';
import { Paper, Toolbar, Typography, Select, MenuItem } from '@material-ui/core';
import GameList from '../GameList';

export default class RecentItems extends Component {
    state = {
        limit: this.props.limit || 5
    }
    handleChange = e => {
        this.setState({ limit: e.target.value });
    }
    render() {
        return (
            <Paper square>
                <Toolbar style={{backgroundColor: '#f7f7f7'}}>
                    <div>
                        <Typography variant="h6">
                            {this.props.title}
                        </Typography>
                    </div>
                    <div style={{marginLeft: 'auto', display: 'flex', alignItems: 'center'}}>
                        <Typography>Show</Typography>
                        <Select value={this.state.limit} style={{margin: '0 5px'}} onChange={this.handleChange} >
                            <MenuItem value={5}>5</MenuItem>
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={15}>15</MenuItem>
                            <MenuItem value={20}>20</MenuItem>
                        </Select>
                        <Typography>{this.props.unit}</Typography>
                    </div>
                </Toolbar>
                <GameList data={this.props.data.sort((a, b) => new Date(b.createDate) - new Date(a.createDate)).slice(0, this.state.limit)} />
            </Paper>
        );
    }
}