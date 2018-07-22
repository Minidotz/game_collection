import React, { Component } from 'react';
import { Typography, Grid, Card, CardMedia, CardContent } from '@material-ui/core';
import Slider from 'react-slick';
import './main.css';
import Redirect from 'react-router-dom/Redirect';

export default class CollectionPage extends Component {
    state = {
        response: null,
        loading: true,
    };

    loadData = () => {
        this.callApi()
            .then(res => this.setState({ response: res, loading: false }))
            .catch(err => console.log(err));
    }

    componentDidMount() {
        this.loadData();
    }

    callApi = async () => {
        const response = await fetch('/games');
        const body = await response.json();

        if (response.status !== 200) throw Error(body.message);
        return body;
    }

    render() {
        return (
            <div id="content">
                <Typography variant="headline" gutterBottom>My Collection</Typography>
                <Grid container>
                    <Grid item xs={12}>
                        <GameSlider data={this.state.response} updateNav={this.props.updateNav} />
                    </Grid>
                </Grid>
            </div>
        );
    }
}

class GameSlider extends Component {
    state = {
        redirect: false,
        id: ''
    }

    handleOnClick = (game_id) => {
        this.setState({
            redirect: true,
            id: game_id
        });
    }

    render() {
        let settings = {
            className: "center",
            centerMode: true,
            infinite: true,
            slidesToShow: 3,
            speed: 500,
            autoplay: true,
            arrows: false
        };
        if(this.state.redirect) {
            return <Redirect push to={"/game/" + this.state.id} />
        }
        return (
            <Slider {...settings}>
                {this.props.data && this.props.data.map(n => {
                    return (
                        <div key={n._id}>
                            <Card className="coverContainer" onClick={() => this.handleOnClick(n.guid)} >
                                <CardMedia image={n.image} title={n.title} style={{ height: '0', paddingTop: '100%' }} />
                                <CardContent>
                                    <Typography variant="subheading" align="center" noWrap>{n.title}</Typography>
                                </CardContent>
                            </Card>
                        </div>
                    );
                })
                }
            </Slider>
        );
    }
}