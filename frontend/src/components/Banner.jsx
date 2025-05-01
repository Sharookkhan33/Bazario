import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import api from "../api/axios"; // fixed path if needed
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const BannerCarousel = () => {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    api.get("/banners/all").then((res) => setBanners(res.data)).catch(console.error);
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    prevArrow: <SamplePrevArrow />,
    nextArrow: <SampleNextArrow />,
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-2">
      <Slider {...settings}>
        {banners.map((banner) => (
          <div key={banner._id} className="relative">
            <a href={banner.link} target="" rel="noopener noreferrer">
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-[250px] object-cover rounded-lg"
              />
             {(banner.title || banner.subtitle) && (
  <div className="absolute bottom-6 left-6 text-white bg-black bg-opacity-50 p-4 rounded">
    {banner.title && <h2 className="text-xl font-bold">{banner.title}</h2>}
    {banner.subtitle && <p className="text-sm">{banner.subtitle}</p>}
  </div>
)}

            </a>
          </div>
        ))}
      </Slider>
    </div>
  );
};

const SamplePrevArrow = (props) => {
  const { onClick } = props;
  return (
    <div className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer bg-white p-2 rounded-full shadow" onClick={onClick}>
      <FaArrowLeft size={20} />
    </div>
  );
};

const SampleNextArrow = (props) => {
  const { onClick } = props;
  return (
    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer bg-white p-2 rounded-full shadow" onClick={onClick}>
      <FaArrowRight size={20} />
    </div>
  );
};

export default BannerCarousel;
