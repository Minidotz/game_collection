import React, { Component } from 'react';
import { Paper, List, ListItem, ListItemText, Toolbar, Typography, Select, MenuItem, Avatar } from '@material-ui/core';
import { Link } from 'react-router-dom';

export default class RecentItems extends Component {
    state = {
        limit: this.props.limit || 10
    }
    handleChange = e => {
        this.setState({ limit: e.target.value });
    }
    render() {
        return (
            <Paper square>
                <Toolbar style={{backgroundColor: '#f7f7f7'}}>
                    <div>
                        <Typography variant="title">
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
                {this.props.data.length > 0 ? (
                    <List>
                        {this.props.data.sort((a, b) => new Date(b.createDate) - new Date(a.createDate)).slice(0, this.state.limit).map(d => {
                            return (
                                <ListItem key={d._id} button component={Link} to={'/game/' + d.guid} >
                                    <Avatar alt={d.title} src={d.image} />
                                    <ListItemText primary={d.title} />
                                </ListItem>
                            )
                        })}
                    </List>
                ) : (
                    <List>
                        <ListItem>
                            <ListItemText primary={<em>No data</em>} />
                        </ListItem>
                    </List>
                )}
            </Paper>
        );
    }
}