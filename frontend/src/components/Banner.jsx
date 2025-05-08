import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import api from "../api/axios";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const BannerCarousel = () => {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    api
      .get("/banners/all")
      .then((res) => setBanners(res.data))
      .catch(console.error);
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
    <div className="w-full max-w-7xl mx-auto px-2 py-4">
      <Slider {...settings}>
        {banners.map((banner) => (
          <div key={banner._id} className="relative">
            <a
              href={banner.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-[200px] sm:h-[250px] md:h-[350px] lg:h-[450px] object-cover rounded-xl"
              />

              {(banner.title || banner.subtitle) && (
                <div className="absolute bottom-6 left-6 bg-black bg-opacity-50 text-white p-3 sm:p-4 rounded-xl max-w-[80%]">
                  {banner.title && (
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold">
                      {banner.title}
                    </h2>
                  )}
                  {banner.subtitle && (
                    <p className="text-sm sm:text-base">{banner.subtitle}</p>
                  )}
                </div>
              )}
            </a>
          </div>
        ))}
      </Slider>
    </div>
  );
};

const SamplePrevArrow = ({ onClick }) => (
  <div
    className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer bg-white hover:bg-gray-100 p-2 rounded-full shadow-md"
    onClick={onClick}
  >
    <FaArrowLeft size={18} className="text-gray-700" />
  </div>
);

const SampleNextArrow = ({ onClick }) => (
  <div
    className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer bg-white hover:bg-gray-100 p-2 rounded-full shadow-md"
    onClick={onClick}
  >
    <FaArrowRight size={18} className="text-gray-700" />
  </div>
);

export default BannerCarousel;
