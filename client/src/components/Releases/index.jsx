import { useEffect, useState } from 'react';
import { Paper, Toolbar, Typography, Select, MenuItem, CircularProgress } from '@mui/material';
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
            <Toolbar style={{ backgroundColor: '#f7f7f7' }}>
                <div>
                    <Typography variant="h6">
                        {title}
                    </Typography>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                    {platforms.length > 0 && (
                        <Select value={selectedPlatformId} style={{ margin: '0 5px' }} onChange={handleChange} >
                            {platforms.map(p => {
                                return <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                            })}
                        </Select>
                    )}
                </div>
            </Toolbar>
            {loading && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CircularProgress />
                </div>
            )}
            {!loading && (
                <GameList data={releases} />
            )}
        </Paper>
    );
}