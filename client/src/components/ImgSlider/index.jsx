import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import styles from './index.module.css';

export default function ImgSlider(props) {
    const images = Array.isArray(props.images) ? props.images.slice(0, props.limit || 10) : [];
    return (
        <div className={styles.imgSlider}>
            <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                spaceBetween={12}
                slidesPerView={'auto'}
                className={styles.mySwiper}
            >
                {images.map((img, idx) => (
                    <SwiperSlide key={idx} style={{ width: props.slideWidth || 240 }}>
                        <a href={img.original_url} target="_blank" rel="noreferrer">
                            <img src={img.small_url || img.original_url} alt="" className={styles.sliderImg} />
                        </a>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}