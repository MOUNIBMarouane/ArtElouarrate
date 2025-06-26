import { useState, useEffect } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const TestimonialsSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Sarah Mitchell",
      role: "Art Collector",
      location: "New York, USA",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b05b?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      rating: 5,
      content:
        "ELOUARATE ART created the most stunning portrait of my family. The attention to detail and emotional depth captured in the painting exceeded all my expectations. It's now the centerpiece of our living room.",
      artworkType: "Family Portrait Commission",
    },
    {
      id: 2,
      name: "Ahmed Al-Rashid",
      role: "Gallery Owner",
      location: "Dubai, UAE",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      rating: 5,
      content:
        "Working with ELOUARATE ART has been a privilege. Their mastery of traditional techniques combined with contemporary vision creates pieces that resonate with collectors worldwide. Truly exceptional artistry.",
      artworkType: "Gallery Exhibition Pieces",
    },
    {
      id: 3,
      name: "Maria Gonzalez",
      role: "Interior Designer",
      location: "Barcelona, Spain",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      rating: 5,
      content:
        "I've commissioned multiple pieces for high-end residential projects. The quality, professionalism, and artistic vision consistently deliver results that leave my clients speechless. Absolutely outstanding work.",
      artworkType: "Custom Interior Art",
    },
    {
      id: 4,
      name: "James Wellington",
      role: "Private Collector",
      location: "London, UK",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      rating: 5,
      content:
        "The investment value aside, these artworks bring such joy and sophistication to our home. The artist's ability to capture emotion and tell stories through brushstrokes is truly remarkable.",
      artworkType: "Landscape Collection",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <section className="py-24 bg-gradient-to-br from-purple-50 via-white to-indigo-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-200/40 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-200/40 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-purple-200/50 shadow-sm mb-6">
            <Star className="h-4 w-4 text-yellow-500 mr-2" />
            <span className="text-purple-600 font-medium text-sm">
              Client Testimonials
            </span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            What Our Clients
            <span className="block bg-gradient-to-r from-purple-600 via-rose-600 to-orange-600 bg-clip-text text-transparent">
              Say About Us
            </span>
          </h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover why art collectors, designers, and enthusiasts worldwide
            trust us to create their most treasured pieces
          </p>
        </div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-100/50 overflow-hidden">
            <div className="relative p-12 lg:p-16">
              {/* Quote Icon */}
              <div className="absolute top-8 left-8 opacity-10">
                <Quote className="h-24 w-24 text-purple-600" />
              </div>

              {/* Testimonial Content */}
              <div className="relative text-center space-y-8">
                {/* Stars */}
                <div className="flex justify-center space-x-1">
                  {[...Array(testimonials[currentTestimonial].rating)].map(
                    (_, i) => (
                      <Star
                        key={i}
                        className="h-6 w-6 text-yellow-400 fill-current"
                      />
                    )
                  )}
                </div>

                {/* Testimonial Text */}
                <blockquote className="text-xl lg:text-2xl text-gray-700 leading-relaxed font-medium italic">
                  "{testimonials[currentTestimonial].content}"
                </blockquote>

                {/* Client Info */}
                <div className="flex flex-col items-center space-y-4">
                  <img
                    src={testimonials[currentTestimonial].avatar}
                    alt={testimonials[currentTestimonial].name}
                    className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  <div className="text-center">
                    <h4 className="text-lg font-bold text-gray-900">
                      {testimonials[currentTestimonial].name}
                    </h4>
                    <p className="text-purple-600 font-medium">
                      {testimonials[currentTestimonial].role}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {testimonials[currentTestimonial].location}
                    </p>
                  </div>
                </div>

                {/* Artwork Type */}
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full">
                  <span className="text-sm font-semibold text-purple-700">
                    {testimonials[currentTestimonial].artworkType}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <div className="absolute top-1/2 -translate-y-1/2 -left-6">
            <Button
              onClick={prevTestimonial}
              size="lg"
              className="rounded-full bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-purple-600 shadow-lg border border-gray-200/50 p-4"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 -right-6">
            <Button
              onClick={nextTestimonial}
              size="lg"
              className="rounded-full bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-purple-600 shadow-lg border border-gray-200/50 p-4"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Indicators */}
        <div className="flex justify-center space-x-3 mt-12">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentTestimonial(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentTestimonial
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 scale-125"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>

        {/* Bottom Statistics */}
        <div className="mt-20 grid sm:grid-cols-3 gap-8">
          <div className="text-center p-8 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-100/50">
            <div className="text-4xl font-bold text-purple-600 mb-2">500+</div>
            <div className="text-gray-700 font-semibold">Happy Clients</div>
          </div>
          <div className="text-center p-8 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-100/50">
            <div className="text-4xl font-bold text-rose-600 mb-2">98%</div>
            <div className="text-gray-700 font-semibold">
              Client Satisfaction
            </div>
          </div>
          <div className="text-center p-8 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-100/50">
            <div className="text-4xl font-bold text-orange-600 mb-2">5⭐</div>
            <div className="text-gray-700 font-semibold">Average Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
