import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import CarousalImage1 from "../assets/images/corausal1.jpg";
import CarousalImage2 from "../assets/images/corausal2.jpg";
import CarousalImage3 from "../assets/images/corausal3.jpg";

// Sample images (replace with real images)
const images = [
  CarousalImage1,
  CarousalImage2,
  CarousalImage3,
];
// const images = [
//   "https://picsum.photos/800/400/",
//   "https://picsum.photos/800/400/",
//   "https://picsum.photos/800/400/",
// ];

const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Handle Manual Navigation
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <div className="relative w-full h-[400px] overflow-hidden rounded-lg shadow-lg">
      {/* Carousel */}
      <div className="relative w-full h-full">
        {images.map((img, index) => (
          <motion.img
            key={index}
            src={img}
            alt={`Slide ${index}`}
            className={`absolute w-full h-full object-cover transition-opacity duration-700 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: index === currentIndex ? 1 : 0 }}
            transition={{ duration: 1 }}
          />
        ))}
      </div>

      {/* Overlay Message */}
      <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center p-6">
        <motion.h1 
          className="text-white text-3xl md:text-5xl font-bold mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Welcome to MediAssist Dashboard
        </motion.h1>
        <motion.p 
          className="text-gray-200 text-lg md:text-xl max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Manage your healthcare services efficiently with real-time insights and seamless control.
        </motion.p>
      </div>

      {/* Navigation Buttons */}
      <button onClick={prevSlide} className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800/60 p-2 rounded-full text-white hover:bg-gray-900 transition">
        <FiChevronLeft size={24} />
      </button>
      <button onClick={nextSlide} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800/60 p-2 rounded-full text-white hover:bg-gray-900 transition">
        <FiChevronRight size={24} />
      </button>
    </div>
  );
};

export default HeroSection;
