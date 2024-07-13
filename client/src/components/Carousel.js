
import React, { useState } from 'react';
import Slider from 'react-slick';
import { useSession } from '../context/SessionContext';
import {Link} from 'react-router-dom'

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CustomerRegistration from './CustomerRegistration';
import InfluencerRegistration from './InfluencerRegistration';


function Carousel() {

  // const [showCustomerRegistration, setShowCustomerRegistration] = useState(false);
  // const [showInfluencerRegistration, setShowInfluencerRegistration] = useState(false);
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

  // const handleCustomerClick = async() => {
  //   setShowCustomerRegistration(true);
  //   setShowInfluencerRegistration(false);
  // }

  // const handleInfluencerClick = async() => {
  //   setShowCustomerRegistration(false);
  //   setShowCustomerRegistration(true);
  // }
  
  return (
    <div >
    <div className=" mt-10 bg-pink-100 mx-10 py-8">
      
      <p className="text-center text-pink-500 font-semibold mt-3">Explore the trending styles</p>
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
    <div className="mt-16 text-center">
    <Link to="/customerregistration" className="ml-10 bg-pink-500 p-4">Register as customer</Link>
    <Link to="/influencerregistration" className="ml-10 bg-orange-500 p-4">Register as influencer</Link>
    </div>

    
    </div>
  );
}

export default Carousel;
