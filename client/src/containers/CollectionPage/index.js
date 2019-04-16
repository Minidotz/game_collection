import React, { Component } from 'react';
import { Typography, Grid, Card, CardMedia, CardContent, Fab } from '@material-ui/core';
import Slider from 'react-slick';
import './main.css';
import { Redirect } from 'react-router-dom';
import SearchDialog from '../../components/SearchDialog';
import SearchIcon from '@material-ui/icons/Search';

export default class CollectionPage extends Component {
    state = {
        response: null,
        loading: true,
        search: false
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

    openSearch = () => {
        this.setState({search: true});
    }

    closeSearch = () => {
        this.setState({search: false});
    }

    render() {
        return (
            <div className="content">
                <Typography variant="h5" gutterBottom>My Collection</Typography>
                <Grid container>
                    <Grid item xs={12}>
                        <GameSlider data={this.state.response} updateNav={this.props.updateNav} />
                    </Grid>
                </Grid>
                <SearchDialog search={this.state.search} closeSearch={this.closeSearch} />
                <Fab color="secondary" onClick={this.openSearch} aria-label="search" style={{ position: 'fixed', right: '30px', bottom: '30px' }}>
                    <SearchIcon />
                </Fab>
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
            slidesToShow: 5,
            responsive: [
                {
                  breakpoint: 1024,
                  settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1
                  }
                },
                {
                  breakpoint: 600,
                  settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                  }
                }
            ],
            speed: 500,
            autoplay: true,
            arrows: false,
            swipeToSlide: true
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
                                    <Typography variant="subtitle1" align="center" noWrap>{n.title}</Typography>
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