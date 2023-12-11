import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Images from "./data";
import "./styles.css";
import React from "react";
import { useState, useEffect } from "react";
import Slider from "react-slick";
import { Box, Container } from "@mui/material";

export default function SimpleSlider() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1000,
    slidesToShow: 4,
    nextArrow: (
      <div>
        <div className="next-slick-arrow"> ⫸ </div>
      </div>
    ),
    prevArrow: (
      <div>
        <div className="prev-slick-arrow"> ⫷ </div>
      </div>
    ),
  };
  return (
    <Box sx={{ p: 8 }}>
      <div className="content">
        <h1 className="header">Car Gallery</h1>
        <div className="container">
          <Slider {...settings}>
            {Images.map((item) => (
              <div key={item.id}>
                <img src={item.src} alt={item.alt} className="img" />
                <h2 className="title">{item.title}</h2>
                <p className="description">{item.description}</p>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </Box>
  );
}
