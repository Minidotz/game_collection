import { useEffect, useState } from 'react';
import { Box, Paper, Toolbar, Typography, Select, MenuItem, CircularProgress } from '@mui/material';
import GameList from '../GameList';

export default function Releases({ title, platforms }) {
    const [selectedPlatformId, setSelectedPlatformId] = useState(94);
    const [loading, setLoading] = useState(true);
    const [releases, setReleases] = useState([]);

    useEffect(() => {
        let mounted = true;

        fetch(`/releases/${selectedPlatformId}?limit=10`)
            .then(res => res.json())
            .then(json => {
                if (mounted) {
                    setReleases(json.results);
                    setLoading(false);
                }
            })
            .catch(err => {
                console.log(err);
                if (mounted) {
                    setLoading(false);
                }
            });

        return () => {
            mounted = false;
        };
    }, [selectedPlatformId]);

    const handleChange = (e) => {
        setLoading(true);
        setSelectedPlatformId(e.target.value);
    };

    return (
        <Paper square>
            <Toolbar sx={{ backgroundColor: '#f7f7f7' }}>
                <Box>
                    <Typography variant="h6">
                        {title}
                    </Typography>
                </Box>
                <Box sx={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                    {platforms.length > 0 && (
                        <Select value={selectedPlatformId} sx={{ mx: '5px' }} onChange={handleChange}>
                            {platforms.map(p => {
                                return <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                            })}
                        </Select>
                    )}
                </Box>
            </Toolbar>
            {loading && (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CircularProgress />
                </Box>
            )}
            {!loading && (
                <GameList data={releases} />
            )}
        </Paper>
    );
}