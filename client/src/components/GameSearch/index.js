import React, { Component } from 'react';
import { MenuItem, Paper, TextField, InputAdornment } from '@material-ui/core';
import Autosuggest from 'react-autosuggest';
import {Redirect} from 'react-router-dom';
import SearchIcon from '@material-ui/icons/Search';

let debounce;
export default class GameSearch extends Component {
    state = {
        value: '',
        suggestions: [],
        redirect: false,
        gameId: ''
    }

    onChange = (event, { newValue }) => {
        newValue !== 'Loading...' && (
            this.setState({
                value: newValue
            })
        );
    };

    getSuggestionValue = (suggestion) => {
        return suggestion.name;
    }

    renderSuggestion = (suggestion, { query, isHighlighted }) => {
        return (
            <MenuItem selected={isHighlighted} component="div">
                {suggestion.name}
            </MenuItem>
        );
    }

    onSuggestionsFetchRequested = ({ value, reason }) => {
        clearTimeout(debounce);
        debounce = setTimeout(() => {
            let url = new URL('../getSuggestions', window.location.origin);
            url.searchParams.append('search', value);
            this.setState({suggestions: [{
                name: 'Loading...'
            }]
            });
            reason === 'input-changed' && (
                fetch(url).then(res => res.json())
                    .then(data => this.setState({ suggestions: data.results }))
                    .catch(err => console.log(err))
            );
        }, 500);
    }

    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    }

    onSuggestionSelected = (event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) => {
        if(suggestionValue !== 'Loading...') {
            this.setState({
                redirect: true,
                gameId: suggestion.guid
            });
        }
    }

    shouldRenderSuggestions = (value) => {
        return value.trim().length > 3;
    }

    renderInputComponent = inputProps => {
        return (
            <Paper elevation={1} style={{padding: '0.5em'}} square>
                <TextField fullWidth autoFocus InputProps={inputProps}
            />
            </Paper>
        );
    }

    renderSuggestionsContainer = options => {
        const { containerProps, children } = options;

        return (
            <Paper {...containerProps} square>
                {children}
            </Paper>
        );
    }

    render() {
        if(this.state.redirect) {
            return <Redirect push to={"/game/" + this.state.gameId} />;
        }
        const inputProps = {
            value: this.state.value,
            onChange: this.onChange,
            placeholder: 'Search a game',
            disableUnderline: true,
            startAdornment: (
                <InputAdornment position="start">
                    <SearchIcon  />
                </InputAdornment>
            )
        }
        const theme = {
            container: {
                flexGrow: 1,
                position: 'relative',
                height: 250
            },
            suggestionsContainerOpen: {
                position: 'absolute',
                zIndex: 1,
                left: 0,
                right: 0
            },
            suggestion: {
                display: 'block'
            },
            suggestionsList: {
                margin: 0,
                padding: 0,
                listStyleType: 'none'
            }
        }
        return (
            <Autosuggest suggestions={this.state.suggestions}
                inputProps={inputProps}
                getSuggestionValue={this.getSuggestionValue}
                renderSuggestion={this.renderSuggestion}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                shouldRenderSuggestions={this.shouldRenderSuggestions}
                renderInputComponent={this.renderInputComponent}
                renderSuggestionsContainer={this.renderSuggestionsContainer}
                onSuggestionSelected={this.onSuggestionSelected}
                theme={theme}
                focusInputOnSuggestionClick={false}
            />
        );
    }
}