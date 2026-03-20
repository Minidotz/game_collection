import { useEffect, useState } from 'react';
import { Box, Grid, CircularProgress } from '@mui/material';
import GameSearch from '../../components/GameSearch';
import RecentItems from '../../components/RecentItems';
import Releases from '../../components/Releases';
import pageStyles from '../../styles/page.module.css';

export default function MainPage({ updateNav }) {
    const [gamesAdded, setGamesAdded] = useState([]);
    const [searches, setSearches] = useState([]);
    const [platforms, setPlatforms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        const getGames = () => {
            return fetch('/games')
                .then(res => res.json())
                .then(json => {
                    if (mounted) {
                        setGamesAdded(json);
                    }
                })
                .catch(err => console.log(err));
        };

        const getSearches = () => {
            return fetch('/searches')
                .then(res => res.json())
                .then(json => {
                    if (mounted) {
                        setSearches(json);
                    }
                })
                .catch(err => console.log(err));
        };

        const getPlatforms = async () => {
            try {
                const res = await fetch('/platforms');
                const nextPlatforms = await res.json();
                if (mounted) {
                    setPlatforms(nextPlatforms);
                }
            } catch (error) {
                console.log(error);
            }
        };

        Promise.all([getGames(), getSearches(), getPlatforms()]).then(() => {
            if (mounted) {
                setLoading(false);
            }
        });

        return () => {
            mounted = false;
        };
    }, []);
    if (loading) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box className={pageStyles.content}>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <Grid container>
                        <Grid item xs={12} sm={12}>
                            <GameSearch updateNav={updateNav} />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container spacing={1}>
                        <Grid item xs={12} sm={6}>
                            <Grid container spacing={1} direction="column">
                                <Grid item>
                                    <RecentItems data={gamesAdded} unit="games" title="Recently Added" />
                                </Grid>
                                <Grid item>
                                    <RecentItems data={searches} unit="searches" title="Recently Searched" />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Releases title="New Releases" platforms={platforms} />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
}