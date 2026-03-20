import { useMemo, useState } from 'react';
import { Box, Paper, Toolbar, Typography, Select, MenuItem } from '@mui/material';
import GameList from '../GameList';

export default function RecentItems({ data, limit: initialLimit = 5, title, unit }) {
    const [limit, setLimit] = useState(initialLimit);

    const visibleItems = useMemo(() => {
        if (!Array.isArray(data)) {
            return [];
        }
        return [...data]
            .sort((a, b) => new Date(b.createDate) - new Date(a.createDate))
            .slice(0, limit);
    }, [data, limit]);

    const handleChange = (e) => {
        setLimit(e.target.value);
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
                    <Typography>Show</Typography>
                    <Select value={limit} sx={{ mx: '5px' }} onChange={handleChange}>
                        <MenuItem value={5}>5</MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={15}>15</MenuItem>
                        <MenuItem value={20}>20</MenuItem>
                    </Select>
                    <Typography>{unit}</Typography>
                </Box>
            </Toolbar>
            <GameList data={visibleItems} />
        </Paper>
    );
}