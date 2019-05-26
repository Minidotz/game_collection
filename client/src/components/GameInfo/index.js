import React from 'react';
import { Typography, Grid, Card, CardContent, CardHeader, Chip } from '@material-ui/core';
import moment from 'moment';

export default function GameInfo(props) {
    return (
        <Card square>
            <CardHeader title="Game Info" />
            <CardContent>
                <Typography gutterBottom>
                    {props.data.deck}
                </Typography>
                <Typography><b>Genres:</b></Typography>
                {props.data.genres && (
                    props.data.genres.map(g => {
                        return <Chip key={g.id} label={g.name} style={{margin: '2px'}} />
                    })
                )}
                <Typography><b>Platforms:</b></Typography>
                {props.data.platforms && (
                    props.data.platforms.map(p => {
                        return <Chip key={p.id} label={p.name} style={{margin: '2px'}} />
                    })
                )}
                <Grid container spacing={1}>
                    <Grid item>
                        <Typography><b>Release Date:</b></Typography>
                    </Grid>
                    <Grid item>
                        <Typography>{moment(props.data.original_release_date).format('D MMM YYYY')}</Typography>
                    </Grid>
                </Grid>
                <Grid container spacing={1}>
                    <Grid item>
                        <Typography><b>Developers:</b></Typography>
                    </Grid>
                    <Grid item xs>
                        <Typography>
                            {props.data.developers && props.data.developers.map(dev => {
                                return dev.name;
                            }).join(', ')}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container spacing={1}>
                    <Grid item>
                        <Typography><b>Publishers:</b></Typography>
                    </Grid>
                    <Grid item xs>
                        <Typography>
                            {props.data.publishers && props.data.publishers.map(pub => {
                                return pub.name;
                            }).join(',')}
                        </Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}