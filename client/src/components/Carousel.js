
import React from 'react';
import Slider from 'react-slick';
import { useSession } from '../context/SessionContext';
import {Link} from 'react-router-dom'

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


function Carousel() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };
  
  return (
    <div className="bg-purple-100">
    <div className=" mt-10 bg-purple-400 mx-10 py-8">
      
      <p className="text-center text-white font-semibold mt-3">Explore the trending styles</p>
      <div className="mt-7 mx-10">
        <Slider {...settings}>
          <img src="https://images.bewakoof.com/web/trending-spring-outfits-for-girls-bewakoof-blog-4-1620740562.jpg" className="mx-auto my-4 px-8 h-64 w-full"></img>
          <img src="https://images.bewakoof.com/web/trending-spring-outfits-for-girls-bewakoof-blog-4-1620740562.jpg" className="mx-auto my-4 h-64 px-8 w-full"></img>
          <img src="https://images.bewakoof.com/web/trending-spring-outfits-for-girls-bewakoof-blog-4-1620740562.jpg" className="mx-auto my-4 h-64 px-8 w-full"></img>
          <img src="https://images.bewakoof.com/web/trending-spring-outfits-for-girls-bewakoof-blog-4-1620740562.jpg" className="mx-auto my-4 h-64 px-8 w-full"></img>
          <img src="https://images.bewakoof.com/web/trending-spring-outfits-for-girls-bewakoof-blog-4-1620740562.jpg" className="mx-auto my-4 h-64 px-8 w-full"></img>
          <img src="https://images.bewakoof.com/web/trending-spring-outfits-for-girls-bewakoof-blog-4-1620740562.jpg" className="mx-auto my-4 h-64 px-8 w-full"></img>
        </Slider>
      </div>
    </div>

    <Link to="/customerregistration" className="ml-10 bg-purple-800 p-4">Register as customer</Link>
    <Link to="/customerregistration">Register as influencer</Link>


    </div>
  );
}

export default Carousel;
