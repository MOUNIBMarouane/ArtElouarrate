"use client";
import { Button } from "@/components/ui/button";
import {
  Palette,
  Brush,
  Award,
  Play,
  ArrowRight,
  Sparkles,
  Crown,
  PenTool,
  Layers,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const ArtistHero = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-slate-900/80 to-black/95"></div>

        {/* Floating Elements - More subtle for pencil art */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gray-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-slate-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gray-400/3 rounded-full blur-3xl animate-pulse delay-2000"></div>

        {/* Pencil stroke effects */}
        <div className="absolute top-20 left-20 text-gray-400/20 animate-pulse">
          <PenTool className="h-6 w-6" />
        </div>
        <div className="absolute bottom-32 right-32 text-gray-300/20 animate-pulse delay-1000">
          <Layers className="h-8 w-8" />
        </div>
        <div className="absolute top-1/3 right-20 text-slate-400/20 animate-pulse delay-2000">
          <Eye className="h-4 w-4" />
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-10">
            {/* Badge */}
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-400/10 to-slate-400/10 backdrop-blur-sm rounded-full border border-gray-400/20 shadow-lg">
              <PenTool className="h-5 w-5 text-gray-300 mr-2" />
              <span className="text-gray-300 font-semibold text-sm tracking-wider uppercase">
                Master Pencil Artist
              </span>
              <Sparkles className="h-4 w-4 text-gray-300 ml-2" />
            </div>

            {/* Main Title */}
            <div className="space-y-6">
              <h1 className="text-6xl lg:text-8xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-gray-200 via-white to-gray-300 bg-clip-text text-transparent">
                  ELOUARATE
                </span>

                <br />
                <span className="text-white">ART</span>
              </h1>

              {/* Animated Subtitle */}
              <div className="relative">
                <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-lg">
                  Creating{" "}
                  <span className="text-gray-200 font-semibold">
                    extraordinary pencil drawings
                  </span>{" "}
                  that capture the essence of life, emotion, and human spirit
                  through{" "}
                  <span className="text-gray-100 font-semibold">
                    masterful graphite techniques
                  </span>{" "}
                  and{" "}
                  <span className="text-white font-semibold">
                    incredible detail
                  </span>
                  .
                </p>

                {/* Decorative line */}
                <div className="absolute -left-6 top-0 w-1 h-full bg-gradient-to-b from-gray-300 via-gray-400 to-transparent"></div>
              </div>
            </div>

            {/* Enhanced Stats */}
            <div className="grid grid-cols-3 gap-8 py-8">
              <div className="text-center group">
                <div className="relative mb-4">
                  <div className="text-4xl lg:text-5xl font-bold text-white group-hover:text-gray-200 transition-colors duration-300">
                    200+
                  </div>
                  <div className="absolute -top-2 -right-2">
                    <div className="w-3 h-3 bg-gray-300 rounded-full animate-ping"></div>
                  </div>
                </div>
                <div className="text-sm text-gray-400 font-medium">
                  Pencil Drawings
                </div>
              </div>

              <div className="text-center group">
                <div className="relative mb-4">
                  <div className="text-4xl lg:text-5xl font-bold text-white group-hover:text-gray-200 transition-colors duration-300">
                    25+
                  </div>
                  <div className="absolute -top-2 -right-2">
                    <div className="w-3 h-3 bg-gray-300 rounded-full animate-ping delay-500"></div>
                  </div>
                </div>
                <div className="text-sm text-gray-400 font-medium">
                  Years Mastering
                </div>
              </div>

              {/* <div className="text-center group">
                <div className="relative mb-4">
                  <div className="text-4xl lg:text-5xl font-bold text-white group-hover:text-gray-200 transition-colors duration-300">
                    50+
                  </div>
                  <div className="absolute -top-2 -right-2">
                    <div className="w-3 h-3 bg-gray-300 rounded-full animate-ping delay-1000"></div>
                  </div>
                </div>
                <div className="text-sm text-gray-400 font-medium">
                  Exhibitions
                </div>
              </div> */}
            </div>

            {/* Enhanced Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6">
              <Link href="/ma3rid">
                <Button
                  size="lg"
                  className="group bg-gradient-to-r from-gray-200 to-white hover:from-white hover:to-gray-100 text-black font-bold px-10 py-4 rounded-full shadow-2xl hover:shadow-white/25 transition-all duration-300 transform hover:scale-105"
                >
                  <Eye className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  Enter 3D Gallery
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>

              <Link href="/profile">
                <Button
                  size="lg"
                  className="group border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-10 py-4 rounded-full font-bold transition-all duration-300 transform hover:scale-105"
                >
                  <PenTool className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                  Artist Profile
                </Button>
              </Link>
            </div>

            {/* Video Play Button */}
            <div className="pt-8">
              <button
                onClick={() => setIsVideoPlaying(true)}
                className="group flex items-center space-x-4 text-white hover:text-gray-200 transition-colors duration-300"
              >
                <div className="relative">
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/20 transition-all duration-300 border border-white/20">
                    <Play className="h-6 w-6 ml-1" />
                  </div>
                  <div className="absolute inset-0 rounded-full bg-white/20 animate-ping"></div>
                </div>
                <div>
                  <div className="font-semibold">Watch Drawing Process</div>
                  <div className="text-sm text-gray-400">
                    Time-lapse creation
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Right Content - Enhanced Artist Showcase */}
          <div className="relative">
            <div className="relative z-10 group">
              {/* Main Image Container */}
              <div className="relative overflow-hidden rounded-3xl shadow-2xl transform group-hover:scale-105 transition-transform duration-700">
                <img
                  src="https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Artist drawing with pencil"
                  className="w-full h-[600px] lg:h-[700px] object-cover"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Floating Badge */}
                <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-full border border-white/20">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">
                      Creating Masterpiece
                    </span>
                  </div>
                </div>
              </div>

              {/* Enhanced Professional Card */}
              <div className="absolute -bottom-8 -right-8 bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 group-hover:bg-white transition-all duration-500">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <PenTool className="h-8 w-8 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900 text-xl">
                      ELOUARATE
                    </h2>
                    <div className="text-gray-600 font-medium">
                      Pencil Drawing Specialist
                    </div>
                    <div className="flex items-center mt-2 text-sm text-gray-700">
                      <Award className="h-4 w-4 mr-1" />
                      <span>Hyperrealistic Master</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Decorative Elements */}
            <div className="absolute -top-8 -left-8 w-24 h-24 bg-gradient-to-r from-gray-400/10 to-slate-400/10 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute -bottom-12 -left-12 w-20 h-20 bg-gradient-to-r from-gray-300/10 to-gray-500/10 rounded-full blur-lg animate-pulse delay-1000"></div>
            <div className="absolute top-20 -right-6 w-16 h-16 bg-gradient-to-r from-slate-400/10 to-gray-400/10 rounded-full blur-lg animate-pulse delay-2000"></div>

            {/* Floating Icons */}
            <div className="absolute top-10 left-10 text-gray-400/40 animate-bounce">
              <PenTool className="h-8 w-8" />
            </div>
            <div className="absolute bottom-20 right-20 text-gray-300/40 animate-bounce delay-1000">
              <Layers className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 animate-bounce">
        <div className="flex flex-col items-center space-y-2">
          <div className="text-sm font-medium">Scroll to explore</div>
          <div className="w-1 h-8 bg-gradient-to-b from-white/60 to-transparent rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default ArtistHero;
