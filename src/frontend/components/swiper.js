import React from "react";
import { Carousel } from "react-responsive-carousel";
import { Paper, Button, Box, Typography } from "@mui/material";
import appointment from "../assets/appointment.png";

const ImageCarousel = () => {
  const items = [
    {
      name: "Online Consultations",
      description: "Consult top doctors from the comfort of your home.",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4U7qor0eWtbflDQkmw5BFdTypOmMp-lj3RkNsh7u_9GD-Q13IPgSHWitd7xcgBIqyhEs&usqp=CAU",
    },
    {
      name: "Buy Medicine",
      description: "Order medicines with quick home delivery.",
      img: "https://via.placeholder.com/800x400?text=Buy+Medicine",
    },
    {
      name: "Health Tracking",
      description: "Easily track your health and medication adherence.",
      img: appointment,
    },
  ];

  return (
    <Carousel
      autoPlay={true}
      interval={3}
      animation="slide"
      indicators={true}
      navButtonsAlwaysVisible={true}
    >
      {items.map((item, index) => (
        <CarouselItem key={index} item={item} />
      ))}
    </Carousel>
  );
};

const CarouselItem = ({ item }) => {
  return (
    <Paper>
      {/* <Box
        component="img"
        src={item.img}
        alt={item.name}
        sx={{
          backgroundColor: "none",
          width: "auto",
          borderRadius: "50px",
          height: "300px",
          objectFit: "contain",
        }}
      /> */}
      <img
        src={appointment}
        style={{
          backgroundColor: "none",
          background: "none",
          width: "auto",
          borderRadius: "50px",
          height: "300px",
          objectFit: "contain",
        }}
      />
    </Paper>
  );
};

export default ImageCarousel;
