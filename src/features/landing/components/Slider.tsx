'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface SliderProps {
  className?: string;
}

const slides = [
  {
    id: 1,
    image: '/images/recycle.jpg',
    title: 'Recicla por un Futuro Mejor',
    description: 'Únete al movimiento para crear un entorno sostenible para las futuras generaciones.'
  },
  {
    id: 2,
    image: '/images/recycling.webp',
    title: 'Gestión Inteligente de Residuos',
    description: 'Soluciones innovadoras para una recolección y reciclaje de residuos eficiente.'
  },
  {
    id: 3,
    image: '/images/recycling2.jpg',
    title: 'Tecnología Verde',
    description: 'Adoptando la tecnología para facilitar y hacer más accesible el reciclaje para todos.'
  }
];

export default function Slider({ className = '' }: SliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlay(false); // Pause auto-play when user interacts
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  return (
    <div className={`relative w-full h-96 md:h-[500px] lg:h-[600px] overflow-hidden rounded-lg shadow-lg ${className}`}>
      {/* Slides */}
      <div 
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="min-w-full h-full relative">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority={slide.id === 1}
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/70 bg-opacity-40" />
            
            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-4">
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 max-w-4xl text-shadow-md">
                {slide.title}
              </h2>
              <p className="text-sm md:text-lg lg:text-xl max-w-2xl opacity-90 text-shadow-md">
                {slide.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6" fill="black" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6" fill="black" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentSlide 
                ? 'bg-white scale-110' 
                : 'bg-white/50 hover:bg-opacity-70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Auto-play indicator */}
      <div className="absolute top-4 right-4">
        <div className={`w-2 h-2 rounded-full ${isAutoPlay ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
      </div>
    </div>
  );
}
