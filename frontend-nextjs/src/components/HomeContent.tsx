"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Palette,
  Star,
  Users,
  Award,
  Sparkles,
  ArrowRight,
  Play,
  Heart,
  Eye,
  ShoppingCart,
  TrendingUp,
  Globe,
  Shield,
  Clock,
  ChevronLeft,
  ChevronRight,
  Brush,
  Camera,
  Zap,
  Gem,
  Crown,
  Infinity,
  User,
} from "lucide-react";
import ImageWithFallbackPublic from "@/components/ImageWithFallbackPublic";
import { artworksApi, categoriesApi } from "@/lib/api";
import { Artwork, Category } from "@/lib/api";

interface Stats {
  artworks: number;
  categories: number;
  customers: number;
  satisfaction: number;
}

// Animated Counter Component
const AnimatedCounter = ({
  end,
  duration = 2000,
  suffix = "",
}: {
  end: number;
  duration?: number;
  suffix?: string;
}) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (isVisible) {
      let start = 0;
      const increment = end / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [isVisible, end, duration]);

  return (
    <div
      ref={ref}
      className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent"
    >
      {count}
      {suffix}
    </div>
  );
};

// Floating Art Pieces Animation
const FloatingArt = () => {
  const artPieces = [
    {
      id: 1,
      image: "/lovable-uploads/03bcb36b-2cef-49c5-bebf-3ee8f4c081d2.png",
      delay: 0,
    },
    {
      id: 2,
      image: "/lovable-uploads/1dcc313f-7f0b-4090-9dc3-42d07e5291bf.png",
      delay: 1,
    },
    {
      id: 3,
      image: "/lovable-uploads/2fbe62dd-237c-4c35-8bd4-b3c4d5d69c05.png",
      delay: 2,
    },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {artPieces.map((piece) => (
        <div
          key={piece.id}
          className={`absolute w-32 h-32 md:w-48 md:h-48 rounded-2xl opacity-10 animate-float`}
          style={{
            animationDelay: `${piece.delay}s`,
            left: `${20 + piece.id * 25}%`,
            top: `${10 + piece.id * 20}%`,
          }}
        >
          <ImageWithFallbackPublic
            src={piece.image}
            alt="Floating Art"
            width={192}
            height={192}
            className="w-full h-full object-cover rounded-2xl blur-sm"
          />
        </div>
      ))}
    </div>
  );
};

export default function HomeContent() {
  const [featuredArtworks, setFeaturedArtworks] = useState<Artwork[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [stats, setStats] = useState<Stats>({
    artworks: 150,
    categories: 8,
    customers: 500,
    satisfaction: 98,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Featured artworks carousel
  const featuredImages = [
    "/lovable-uploads/03bcb36b-2cef-49c5-bebf-3ee8f4c081d2.png",
    "/lovable-uploads/1dcc313f-7f0b-4090-9dc3-42d07e5291bf.png",
    "/lovable-uploads/2fbe62dd-237c-4c35-8bd4-b3c4d5d69c05.png",
    "/lovable-uploads/5632be5b-8b74-457c-8ea8-30f3985cae44.png",
    "/lovable-uploads/6472ba85-9629-4ee4-b31e-6cb52f2f6699.png",
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load featured artworks
        const artworksResponse = await artworksApi.getFeatured();
        if (artworksResponse?.success) {
          setFeaturedArtworks(artworksResponse.data || []);
        }

        // Load categories
        const categoriesResponse = await categoriesApi.getAll();
        if (categoriesResponse?.success) {
          setCategories(categoriesResponse.data || []);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        // Set empty arrays if API fails
        setFeaturedArtworks([]);
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [featuredImages.length]);

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % featuredImages.length);
  const prevSlide = () =>
    setCurrentSlide(
      (prev) => (prev - 1 + featuredImages.length) % featuredImages.length
    );

  return (
    <div className="min-h-screen bg-slate-900 overflow-hidden">
      {/* Hero Section with Enhanced Animations */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>

          {/* Floating Art Pieces */}
          <FloatingArt />

          {/* Animated Gradient Orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-amber-500/10 to-purple-500/10 rounded-full blur-3xl animate-spin-slow"></div>

          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8 animate-fade-in-up">
            <Badge
              variant="outline"
              className="border-amber-500/50 text-amber-400 bg-amber-500/10 backdrop-blur-sm px-6 py-3 text-sm font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
              Premium Art Collection
              <Crown className="w-4 h-4 ml-2" />
            </Badge>
          </div>

          <h1
            className="text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-8 leading-tight animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent drop-shadow-2xl">
              ELOUARATE
            </span>
            <br />
            <span className="text-slate-200 drop-shadow-xl">ART GALLERY</span>
          </h1>

          <p
            className="text-xl md:text-3xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in-up font-light"
            style={{ animationDelay: "0.4s" }}
          >
            Discover authentic{" "}
            <span className="text-amber-400 font-semibold">Moroccan art</span>{" "}
            and contemporary masterpieces.
            <br />
            Where{" "}
            <span className="text-purple-400 font-semibold">
              tradition meets
            </span>{" "}
            modern artistic expression.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 animate-fade-in-up"
            style={{ animationDelay: "0.6s" }}
          >
            <Link href="/store">
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-10 py-6 text-xl rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 group"
              >
                <Palette className="w-6 h-6 mr-3 transition-transform group-hover:rotate-12" />
                Explore Store
                <ArrowRight className="w-6 h-6 ml-3 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>

            <Link href="/artist-profile">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-slate-600 text-white hover:bg-slate-800/80 px-10 py-6 text-xl rounded-2xl backdrop-blur-sm transition-all duration-300 hover:border-amber-500/50 group"
              >
                <User className="w-6 h-6 mr-3 transition-transform group-hover:scale-110" />
                Meet the Artist
              </Button>
            </Link>
          </div>

          {/* Enhanced Stats with Animation */}
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto animate-fade-in-up"
            style={{ animationDelay: "0.8s" }}
          >
            <div className="text-center group">
              <AnimatedCounter end={stats.artworks} suffix="+" />
              <div className="text-slate-400 text-lg mt-2 group-hover:text-amber-400 transition-colors">
                Artworks
              </div>
            </div>
            <div className="text-center group">
              <AnimatedCounter end={stats.categories} suffix="+" />
              <div className="text-slate-400 text-lg mt-2 group-hover:text-amber-400 transition-colors">
                Categories
              </div>
            </div>
            <div className="text-center group">
              <AnimatedCounter end={stats.customers} suffix="+" />
              <div className="text-slate-400 text-lg mt-2 group-hover:text-amber-400 transition-colors">
                Happy Clients
              </div>
            </div>
            <div className="text-center group">
              <AnimatedCounter end={stats.satisfaction} suffix="%" />
              <div className="text-slate-400 text-lg mt-2 group-hover:text-amber-400 transition-colors">
                Satisfaction
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <div className="w-8 h-12 border-2 border-amber-400 rounded-full flex justify-center opacity-70 hover:opacity-100 transition-all duration-300">
            <div className="w-2 h-3 bg-amber-400 rounded-full mt-2 animate-pulse"></div>
          </div>
          <p className="text-xs text-amber-400 mt-2 tracking-wider">SCROLL</p>
        </div>
      </section>

      {/* Featured Artworks Carousel */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-800"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 mb-4">
              <Gem className="w-4 h-4 mr-2" />
              Featured Collection
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Masterpiece <span className="text-amber-400">Gallery</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Discover our carefully curated selection of exceptional artworks
            </p>
          </div>

          {/* Carousel */}
          <div className="relative">
            <div className="overflow-hidden rounded-3xl shadow-2xl">
              <div
                className="flex transition-transform duration-700 ease-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {featuredImages.map((image, index) => (
                  <div key={index} className="min-w-full relative">
                    <div className="aspect-video md:aspect-[21/9] relative">
                      <ImageWithFallbackPublic
                        src={image}
                        alt={`Featured Artwork ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                        <h3 className="text-2xl md:text-4xl font-bold text-white mb-2">
                          Masterpiece {index + 1}
                        </h3>
                        <p className="text-slate-200 text-lg mb-4">
                          Exceptional artistry meets timeless beauty
                        </p>
                        <Button className="bg-amber-500 hover:bg-amber-600">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Carousel Controls */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-slate-900/80 text-white hover:bg-slate-800 rounded-full backdrop-blur-sm"
              onClick={prevSlide}
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-slate-900/80 text-white hover:bg-slate-800 rounded-full backdrop-blur-sm"
              onClick={nextSlide}
            >
              <ChevronRight className="w-6 h-6" />
            </Button>

            {/* Carousel Indicators */}
            <div className="flex justify-center mt-6 space-x-2">
              {featuredImages.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "bg-amber-400 scale-125"
                      : "bg-slate-600 hover:bg-slate-500"
                  }`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section with Enhanced Design */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-800 to-slate-900"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZG90cyIgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxLjUiIGZpbGw9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4xKSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNkb3RzKSIvPjwvc3ZnPg==')] opacity-30"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 mb-4">
              <Brush className="w-4 h-4 mr-2" />
              Art Categories
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Explore Our <span className="text-purple-400">Collections</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <Card
                key={category.id}
                className="group bg-slate-800/50 border-slate-700/50 hover:border-amber-500/50 transition-all duration-500 hover:scale-105 hover:-translate-y-2 backdrop-blur-sm overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative">
                  <div className="aspect-video overflow-hidden relative">
                    <ImageWithFallbackPublic
                      src={
                        category.imageUrl ||
                        "/lovable-uploads/03bcb36b-2cef-49c5-bebf-3ee8f4c081d2.png"
                      }
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div
                    className="absolute top-4 right-4 w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0"
                    style={{ backgroundColor: category.color }}
                  ></div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-slate-400 mb-4 group-hover:text-slate-300 transition-colors">
                    {category.description}
                  </p>
                  <Link href={`/store?category=${category.id}`}>
                    <Button
                      variant="ghost"
                      className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 p-0 h-auto font-semibold"
                    >
                      Explore Collection
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-800"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 mb-4">
              <Shield className="w-4 h-4 mr-2" />
              Why Choose Us
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Premium <span className="text-emerald-400">Experience</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: "Authenticity Guaranteed",
                description:
                  "Every piece comes with certificate of authenticity",
                color: "emerald",
              },
              {
                icon: Globe,
                title: "Worldwide Shipping",
                description: "Safe and secure delivery to your doorstep",
                color: "blue",
              },
              {
                icon: TrendingUp,
                title: "Investment Value",
                description: "Artworks that appreciate in value over time",
                color: "purple",
              },
              {
                icon: Users,
                title: "Expert Consultation",
                description: "Get guidance from art experts and curators",
                color: "amber",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="group bg-slate-800/30 border-slate-700/50 hover:border-emerald-500/50 transition-all duration-500 text-center p-8 backdrop-blur-sm hover:scale-105"
              >
                <div
                  className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-${feature.color}-500/20 border border-${feature.color}-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon
                    className={`w-8 h-8 text-${feature.color}-400`}
                  />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-400 group-hover:text-slate-300 transition-colors">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-purple-500/10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-0 right-0 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Ready to Start Your{" "}
            <span className="text-amber-400">Art Journey?</span>
          </h2>
          <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
            Join thousands of art enthusiasts who trust us for exceptional
            artworks and unmatched service.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-12 py-6 text-xl rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 group"
              onClick={() =>
                window.open(
                  "https://wa.me/212658651060?text=Hello! I'm interested in purchasing your artwork.",
                  "_blank"
                )
              }
            >
              <svg
                className="w-6 h-6 mr-3"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.515z" />
              </svg>
              Contact on WhatsApp
              <ArrowRight className="w-6 h-6 ml-3 transition-transform group-hover:translate-x-1" />
            </Button>

            <Link href="/store">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-slate-600 text-white hover:bg-slate-800/80 px-12 py-6 text-xl rounded-2xl backdrop-blur-sm transition-all duration-300 hover:border-purple-500/50"
              >
                <Palette className="w-6 h-6 mr-3" />
                Visit Store
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
