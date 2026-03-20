import React, { Component } from 'react';
import { Autocomplete, Paper, TextField, InputAdornment } from '@mui/material';
import { Navigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';

let debounce;
export default class GameSearch extends Component {
    state = {
        value: null,
        inputValue: '',
        suggestions: [],
        redirect: false,
        gameId: '',
        title: '',
        loading: false,
    }

    onInputChange = (event, newInputValue) => {
        this.setState({ inputValue: newInputValue });
        clearTimeout(debounce);

        if (!newInputValue || newInputValue.trim().length <= 3) {
            this.setState({ suggestions: [], loading: false });
            return;
        }

        debounce = setTimeout(() => {
            let url = new URL('../suggestions', window.location.origin);
            url.searchParams.append('search', newInputValue);
            this.setState({ loading: true });

            fetch(url)
                .then(res => res.json())
                .then(data => this.setState({ suggestions: data.results || [], loading: false }))
                .catch(err => {
                    console.log(err);
                    this.setState({ loading: false });
                });
        }, 500);
    };

    onChange = (event, suggestion) => {
        if (!suggestion) {
            return;
        }

        fetch('/searches', {
            method: 'POST',
            body: JSON.stringify({
                title: suggestion.name,
                guid: suggestion.guid,
            }),
            headers: { 'Content-Type': 'application/json' },
        })
            .then(res => {
                if (res.ok) {
                    this.setState({
                        redirect: true,
                        gameId: suggestion.guid,
                        title: suggestion.name,
                    });
                }
            })
            .catch(err => console.log(err));
    }

    render() {
        if(this.state.redirect) {
            return <Navigate push to={{pathname: "/games/" + this.state.gameId, state: { title: this.state.title }}} />;
        }
        const inputAdornment = (
            <InputAdornment position="start">
                <SearchIcon />
            </InputAdornment>
        );

        return (
            <Paper elevation={1} style={{ padding: '0.5em' }} square>
                <Autocomplete
                    freeSolo
                    fullWidth
                    options={this.state.suggestions}
                    getOptionLabel={(option) => option?.name || ''}
                    filterOptions={(options) => options}
                    loading={this.state.loading}
                    onChange={this.onChange}
                    inputValue={this.state.inputValue}
                    onInputChange={this.onInputChange}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            autoFocus
                            placeholder="Search a game"
                            InputProps={{
                                ...params.InputProps,
                                startAdornment: inputAdornment,
                            }}
                        />
                    )}
                />
            </Paper>
        );
    }
}