import React from 'react'
import { Carousel } from "antd";
import slider4 from '../../assets/images/slide4.jpg';
import slider5 from '../../assets/images/slide5.jpg';

const SliderComponent = () => {
    return (
        <Carousel autoplay>
            <div>
                <img src={slider4} alt="Slider 1" className='slider-img' />
            </div>
            <div>
                <img src={slider5} alt="Slider 2" className='slider-img' />
            </div>
        </Carousel>
    );
}

export default SliderComponent