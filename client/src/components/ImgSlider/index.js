import React from 'react';
import './main.css';
import Slider from 'react-slick';

export default function ImgSlider(props) {
    let settings = {
        className: 'imgSlider',
        infinite: true,
        arrows: true,
        swipeToSlide: true,
        variableWidth: true,
        dots: true
    };
    let imgIndex = 0;
    return (
        <Slider {...settings}>
            {props.images && props.images.slice(0, props.limit).map(img => {
                return (
                    <div key={imgIndex++}>
                        <a href={img.original_url} >
                            <img src={img.small_url} alt="" />
                        </a>
                    </div>
                );
            })
            }
        </Slider>
    );
}