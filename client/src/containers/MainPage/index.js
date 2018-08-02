import React from 'react';
import { Grid } from '@material-ui/core';
import GameSearch from '../../components/GameSearch';

export default function MainPage(props) {
    return (
        <div className="content">
            <Grid container justify="center" >
                <Grid item xs={12} sm={9}>
                    <GameSearch updateNav={props.updateNav} />
                </Grid>
            </Grid>
        </div>
    );
}