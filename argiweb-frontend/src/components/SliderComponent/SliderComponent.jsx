import React from 'react'
import { Carousel } from "antd";
import slider1 from '../../assets/images/slider1.jpg';
import slider2 from '../../assets/images/slider2.jpg';
import slider3 from '../../assets/images/slider3.jpg';

const SliderComponent = () => {
    return (
        <Carousel autoplay>
            <div>
                <img src={slider1} alt="Slider 1" style={{ width: '100%', height: 'auto' }} />
            </div>
            <div>
                <img src={slider2} alt="Slider 2" style={{ width: '100%', height: 'auto' }} />
            </div>
            <div>
                <img src={slider3} alt="Slider 3" style={{ width: '100%', height: 'auto' }} />
            </div>
        </Carousel>
    );
}

export default SliderComponent