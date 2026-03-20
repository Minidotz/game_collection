import { useEffect, useRef, useState } from 'react';
import { useLocation, useOutletContext, useParams } from 'react-router-dom';
import { CircularProgress, Typography, Grid, Tooltip, Button, Snackbar, ButtonBase, Paper, Tabs, Tab, Zoom, Fab } from '@mui/material';
import { Favorite as FavoriteIcon, Delete as DeleteIcon } from '@mui/icons-material';
import GameInfo from '../../components/GameInfo';
import ImgSlider from '../../components/ImgSlider';

export default function GamePage() {
    const { id: routeId } = useParams();
    const location = useLocation();
    const { updateNav } = useOutletContext() || {};
    const inCollectionControllerRef = useRef(null);

    const [loading, setLoading] = useState(true);
    const [gameData, setGameData] = useState(null);
    const [notification, setNotification] = useState({
        isNotifOpen: false,
        notifMessage: '',
    });
    const [inCollection, setInCollection] = useState(false);
    const [tabValue, setTabValue] = useState(0);
    const [screenshots, setScreenshots] = useState(null);

    const resolvedId = routeId || (location && location.pathname ? location.pathname.split('/').pop() : null);

    useEffect(() => {
        if (!resolvedId) {
            console.warn('GamePage: no game id available in props');
            return;
        }

        if (updateNav && location && location.state && location.state.title) {
            updateNav(location.state.title);
        }

        if (inCollectionControllerRef.current) {
            inCollectionControllerRef.current.abort();
        }

        const controller = new AbortController();
        inCollectionControllerRef.current = controller;

        fetch('/inCollection/' + resolvedId, { signal: controller.signal })
            .then(res => res.ok ? res.json() : Promise.reject(new Error(`Request failed: ${res.status}`)))
            .then((result) => {
                if (!controller.signal.aborted && result && typeof result.found === 'boolean') {
                    setInCollection(result.found);
                }
            })
            .catch((err) => {
                if (err.name !== 'AbortError') {
                    console.log(err);
                }
            });

        setLoading(true);

        fetch('/games/' + resolvedId)
            .then(res => res.json())
            .then(res => {
                setGameData(res.results);
                setLoading(false);
                if (updateNav) {
                    updateNav(res.results && res.results.name ? res.results.name : '');
                }
            })
            .catch(err => console.log(err));

        fetch(`/games/${resolvedId}/screenshots`)
            .then(res => res.json())
            .then(res => {
                setScreenshots(res.results);
            })
            .catch(err => console.log(err));

        return () => {
            if (inCollectionControllerRef.current) {
                inCollectionControllerRef.current.abort();
            }
        };
    }, [location, resolvedId, updateNav]);

    const addToCollection = () => {
        if (!gameData) {
            return;
        }

        fetch('/add_to_collection', {
            method: 'POST',
            body: JSON.stringify({
                title: gameData.name,
                guid: gameData.guid,
                image: gameData.image.medium_url,
            }),
            headers: { 'Content-Type': 'application/json' },
        })
            .then(res => {
                if (res.ok) {
                    setNotification({
                        isNotifOpen: true,
                        notifMessage: 'Added to collection',
                    });
                    setInCollection(true);
                } else {
                    setNotification({
                        isNotifOpen: true,
                        notifMessage: 'An error occurred',
                    });
                }
            })
            .catch(err => console.log(err));
    };

    const removeFromCollection = () => {
        if (!gameData) {
            return;
        }

        fetch('/removeFromCollection', {
            method: 'POST',
            body: JSON.stringify({
                guid: gameData.guid,
            }),
            headers: { 'Content-Type': 'application/json' },
        }).then(res => {
            if (res.ok) {
                setInCollection(false);
                setNotification({
                    isNotifOpen: true,
                    notifMessage: 'Removed from Collection',
                });
            }
        });
    };

    const handleCloseNotification = () => {
        setNotification({
            isNotifOpen: false,
            notifMessage: '',
        });
    };

    const uploadPic = (e) => {
        if (!gameData) {
            return;
        }

        const data = new FormData();
        data.append('guid', e.target.id);
        data.append('img', e.target.files[0]);
        fetch('/upload', {
            method: 'POST',
            body: data,
        });
    };

    const handleClick = (e) => {
        e.stopPropagation();
    };

    const handleTabChange = (e, value) => {
        setTabValue(value);
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                <CircularProgress />
            </div>
        );
    }

    if (!gameData) {
        return (
            <div className="content">
                <Typography>Game not found.</Typography>
            </div>
        );
    }

    return (
        <div className="content">
            <Grid container spacing={2}>
                <Grid item sm={4} xs={12}>
                    <Grid container direction="column">
                        <Grid item xs={12}>
                            <input type="file" accept="image/jpeg" id={'img-' + gameData.guid} style={{ display: 'none' }} onClick={handleClick} onChange={uploadPic} />
                            <label htmlFor={'img-' + gameData.guid}>
                                <ButtonBase component="span" onClick={handleClick}>
                                    <img src={gameData.myImage ? gameData.myImage : (gameData.image && gameData.image.medium_url)} alt="" width="100%" />
                                </ButtonBase>
                            </label>
                        </Grid>
                        <Grid item xs={12}>
                            <GameInfo data={gameData} />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item sm={8} xs={12}>
                    <Grid container>
                        <Grid item xs={12}>
                            <Paper square>
                                <Tabs value={tabValue} onChange={handleTabChange} indicatorColor="primary" >
                                    <Tab label="Overview" />
                                    <Tab label="Images" />
                                </Tabs>
                            </Paper>
                            {tabValue === 0 && (
                                <Paper square>
                                    {gameData.description ? (
                                        (() => {
                                            const html = gameData.description.replace(/style=\".*?\"/g, '');
                                            return <Typography dangerouslySetInnerHTML={{ __html: html }} style={{ overflowX: 'hidden', padding: '0.5em' }} />;
                                        })()
                                    ) : (
                                        <Typography style={{ overflowX: 'hidden', padding: '0.5em' }} />
                                    )}
                                </Paper>
                            )}
                            {tabValue === 1 && (
                                <Paper square style={{ padding: '2em' }}>
                                    <ImgSlider images={screenshots} limit={10} />
                                </Paper>
                            )}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Tooltip title="Remove from Collection">
                <Zoom in={inCollection} >
                    <Fab color="secondary" onClick={removeFromCollection} aria-label="remove" style={{ position: 'fixed', right: '30px', bottom: '30px' }}>
                        <DeleteIcon />
                    </Fab>
                </Zoom>
            </Tooltip>
            <Tooltip title="Add to Collection">
                <Zoom in={!inCollection}>
                    <Fab color="primary" onClick={addToCollection} aria-label="add" style={{ position: 'fixed', right: '30px', bottom: '30px' }}>
                        <FavoriteIcon />
                    </Fab>
                </Zoom>
            </Tooltip>
            <Snackbar open={notification.isNotifOpen} message={notification.notifMessage} autoHideDuration={2000} onClose={handleCloseNotification} action={
                <Button color="inherit" size="small" onClick={handleCloseNotification}>
                    Close
                </Button>
            } />
        </div>
    );
}