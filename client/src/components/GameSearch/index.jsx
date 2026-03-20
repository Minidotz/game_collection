import { useRef, useState } from 'react';
import { Autocomplete, Paper, TextField, InputAdornment } from '@mui/material';
import { Navigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';

export default function GameSearch() {
    const debounceRef = useRef(null);
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [redirect, setRedirect] = useState(false);
    const [gameId, setGameId] = useState('');
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);

    const onInputChange = (event, newInputValue) => {
        setInputValue(newInputValue);
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        if (!newInputValue || newInputValue.trim().length <= 3) {
            setSuggestions([]);
            setLoading(false);
            return;
        }

        debounceRef.current = setTimeout(() => {
            const url = new URL('../suggestions', window.location.origin);
            url.searchParams.append('search', newInputValue);
            setLoading(true);

            fetch(url)
                .then(res => res.json())
                .then(data => {
                    setSuggestions(data.results || []);
                    setLoading(false);
                })
                .catch(err => {
                    console.log(err);
                    setLoading(false);
                });
        }, 500);
    };

    const onChange = (event, suggestion) => {
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
                    setRedirect(true);
                    setGameId(suggestion.guid);
                    setTitle(suggestion.name);
                }
            })
            .catch(err => console.log(err));
    };

    if (redirect) {
        return <Navigate to={`/games/${gameId}`} state={{ title }} />;
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
                options={suggestions}
                getOptionLabel={(option) => option?.name || ''}
                filterOptions={(options) => options}
                loading={loading}
                onChange={onChange}
                inputValue={inputValue}
                onInputChange={onInputChange}
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