import { Button } from "@/components/ui/button";
import { Palette, Brush, Image, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/50 py-24 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-purple-200/50 shadow-sm">
              <span className="text-purple-600 font-medium text-sm">
                ✨ Professional Art Studio
              </span>
            </div>

            <div className="space-y-6">
              <h1 className="text-6xl lg:text-7xl font-bold leading-tight">
                <span className="text-gray-900">Creating</span>
                <span className="block bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 bg-clip-text text-transparent">
                  Timeless Art
                </span>
                <span className="text-gray-900 text-5xl lg:text-6xl">
                  Through Passion
                </span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                Discover extraordinary paintings, bespoke portraits, and
                breathtaking landscapes. Each masterpiece is crafted with
                meticulous attention to detail and artistic excellence.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/artwork">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Explore Artwork
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50 px-8 py-4 text-lg font-semibold transition-all duration-300"
              >
                Commission Artwork
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center group">
                <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-4 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Palette className="h-8 w-8 text-purple-600" />
                </div>
                <p className="text-sm font-semibold text-gray-700">
                  Original Masterpieces
                </p>
              </div>
              <div className="text-center group">
                <div className="bg-gradient-to-br from-indigo-100 to-indigo-200 p-4 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Brush className="h-8 w-8 text-indigo-600" />
                </div>
                <p className="text-sm font-semibold text-gray-700">
                  Custom Commissions
                </p>
              </div>
              <div className="text-center group">
                <div className="bg-gradient-to-br from-purple-100 to-indigo-200 p-4 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Image className="h-8 w-8 text-purple-600" />
                </div>
                <p className="text-sm font-semibold text-gray-700">
                  Museum Quality
                </p>
              </div>
            </div>
          </div>

          {/* Right content - Featured Artwork */}
          <div className="relative lg:justify-self-end">
            <div className="relative group">
              {/* Main artwork frame */}
              <div className="bg-white rounded-3xl shadow-2xl p-8 transform hover:scale-105 transition-all duration-500 hover:shadow-3xl">
                <div className="relative overflow-hidden rounded-2xl">
                  <img
                    src="/lovable-uploads/adb447be-2f2a-4657-b75e-739e41add877.png"
                    alt="Village Life Harmony - Featured Painting"
                    className="w-full h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        Village Life Harmony
                      </h3>
                      <p className="text-purple-600 font-medium">
                        ELOUARATE ART Original
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-3xl font-bold text-gray-900">
                        $1,250
                      </span>
                      <p className="text-sm text-gray-500 line-through">
                        $1,500
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-600 leading-relaxed">
                    A captivating pastoral scene showcasing traditional
                    countryside harmony with exquisite detail.
                  </p>

                  <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300">
                    Add to Collection
                  </Button>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full opacity-20 blur-xl"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full opacity-15 blur-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
