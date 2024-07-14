import React from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Slide = ({ imageSrc, caption }) => (
  <div className="mx-auto px-8">
    <img src={imageSrc} className="h-128 w-full object-cover rounded-lg" alt="Trending style" />
    <p className="text-center text-gray-600 mt-2">{caption}</p>
  </div>
);

function Carousel() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 0
        }
      }
    ]
  };

  const slides = [
    {
      imageSrc: "https://storage.googleapis.com/myntra-weforshe-hackathon.appspot.com/838ddf25-3633-4548-9f00-bdd439b4db681661193870772KASSUALLYRedBrownPrintedJumpsuit6.jpg",
      caption: "Spring outfits for girls"
    },
    {
      imageSrc: "https://storage.googleapis.com/myntra-weforshe-hackathon.appspot.com/2dab063d-f03b-46a4-beb6-0302a8475c361704262527029RoadsterWomenBaggyFitParachuteJoggers1.jpg",
      caption: "Casual and trendy"
    },
    {
      imageSrc: "https://storage.googleapis.com/myntra-weforshe-hackathon.appspot.com/78ae2021-8405-4aef-85c8-c4b68b988ae91648366218358TokyoTalkiesWomenBurgundyCropBikerJacket6.jpg",
      caption: "Explore latest styles"
    },
    {
      imageSrc: "https://storage.googleapis.com/myntra-weforshe-hackathon.appspot.com/aea14200-3a67-4ed1-a659-5929a7ea52a41714359821872SASSAFRASCottonDenimTop1.jpg",
      caption: "New arrivals"
    },
    {
      imageSrc: "https://storage.googleapis.com/myntra-weforshe-hackathon.appspot.com/527d5c5a-fb7b-43f9-9773-9809a4cb3c331683313624386AthenablueLinenwrapplaysuit1.jpg",
      caption: "Summer fashion trends"
    },
    {
      imageSrc: "https://storage.googleapis.com/myntra-weforshe-hackathon.appspot.com/d52792d9-8f87-4e80-a916-255e514b9eaf1650970655702-Sangria-Women-Skirts-5161650970655169-1.jpg",
      caption: "Stylish and comfortable"
    }
  ];

  return (
    <div className="bg-pink-100  py-8 rounded-lg shadow-md">
      <p className="text-center text-pink-500 font-semibold mt-3 text-lg">
        Explore the Trending Styles
      </p>
      <div className="mt-7 mx-10">
        <Slider {...settings}>
          {slides.map((slide, index) => (
            <Slide key={index} imageSrc={slide.imageSrc} caption={slide.caption} />
          ))}
        </Slider>
      </div>
      <div className="mt-8 flex justify-center">
        <Link to="/customerregistration" className="mx-4 bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition duration-300">
          Register as Customer
        </Link>
        <Link to="/influencerregistration" className="mx-4 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition duration-300">
          Register as Influencer
        </Link>
      </div>
    </div>
  );
}

export default Carousel;
