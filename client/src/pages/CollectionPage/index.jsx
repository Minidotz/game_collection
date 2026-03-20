import { useState, useEffect } from 'react';
import { Typography, Grid, Card, CardMedia, CardContent, Fab } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import './main.css';
import { useNavigate } from 'react-router-dom';
import SearchDialog from '../../components/SearchDialog';
import SearchIcon from '@mui/icons-material/Search';

export default function CollectionPage(props) {
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState(false);

    useEffect(() => {
        let mounted = true;
        (async function load() {
            try {
                const res = await fetch('/games');
                const body = await res.json();
                if (res.status !== 200) throw new Error(body.message);
                if (mounted) {
                    setResponse(body);
                    setLoading(false);
                }
            } catch (err) {
                console.log(err);
            }
        })();
        return () => (mounted = false);
    }, []);

    const openSearch = () => setSearch(true);
    const closeSearch = () => setSearch(false);

    return (
        <div className="content">
            <Typography variant="h5" gutterBottom>My Collection</Typography>
            <Grid container>
                <Grid item xs={12}>
                    <GameSlider data={response} updateNav={props.updateNav} />
                </Grid>
            </Grid>
            <SearchDialog search={search} closeSearch={closeSearch} />
            <Fab color="secondary" onClick={openSearch} aria-label="search" style={{ position: 'fixed', right: '30px', bottom: '30px' }}>
                <SearchIcon />
            </Fab>
        </div>
    );
}

function GameSlider({ data }) {
    const navigate = useNavigate();

    const settings = {
        modules: [Navigation, Autoplay],
        spaceBetween: 12,
        slidesPerView: 5,
        loop: true,
        autoplay: { delay: 3000, disableOnInteraction: false },
        breakpoints: {
            1024: { slidesPerView: 3 },
            600: { slidesPerView: 1 }
        }
    };

    const handleOnClick = (game_id, title) => {
        navigate(`/games/${game_id}`, { state: { title } });
    };

    const items = Array.isArray(data) ? data : (data && data.results ? data.results : []);

    return (
        <Swiper
            modules={[Navigation, Autoplay]}
            navigation={false}
            spaceBetween={settings.spaceBetween}
            slidesPerView={settings.slidesPerView}
            loop={settings.loop}
            autoplay={settings.autoplay}
            breakpoints={settings.breakpoints}
        >
            {items.map(n => {
                const imageUrl = n && n.image ? (typeof n.image === 'string' ? n.image : (n.image.medium_url || n.image.original_url || '')) : '';
                return (
                    <SwiperSlide key={n._id}>
                        <Card className="coverContainer" onClick={() => handleOnClick(n.guid, n.title)} >
                            <CardMedia image={imageUrl} title={n.title} style={{ height: '0', paddingTop: '100%' }} />
                            <CardContent>
                                <Typography variant="subtitle1" align="center" noWrap>{n.title}</Typography>
                            </CardContent>
                        </Card>
                    </SwiperSlide>
                );
            })}
        </Swiper>
    );
}