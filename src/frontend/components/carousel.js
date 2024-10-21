import React from "react";
import { Carousel } from "react-responsive-carousel";
import { Box, Typography } from "@mui/material";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "../styling/carousel.css"; // Import your custom CSS

const TestimonialsCarousel = () => {
  const testimonials = [
    { text: "Seamless consultation experience!", author: "John Doe" },
    {
      text: "Fast delivery of medicines. Highly recommend!",
      author: "Jane Smith",
    },
    {
      text: "Friendly doctors and efficient appointments!",
      author: "David Lee",
    },
  ];

  return (
    <div>
      <h1 style={{ display: "flex", justifyContent: "center" }}>
        What Our Pateints Say
      </h1>
      <div className="carousel-container">
        <Carousel
          showArrows={true}
          infiniteLoop={true}
          showThumbs={false}
          showStatus={false}
          autoPlay={true}
          interval={4000}
        >
          {testimonials.map((testimonial, index) => (
            <Box key={index} className="testimonial-box" textAlign="center">
              <img
                style={{
                  height: "150px",
                  width: "150px",
                  borderRadius: "50%",
                }}
                src="data:image/jpeg;base64,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"
              />
              <Typography
                className="testimonial-text"
                variant="body1"
                paragraph
              >
                "{testimonial.text}"
              </Typography>
              <Typography className="testimonial-author" variant="h6">
                - {testimonial.author}
              </Typography>
            </Box>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default TestimonialsCarousel;
