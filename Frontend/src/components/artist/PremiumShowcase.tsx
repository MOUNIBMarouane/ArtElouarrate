import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Sparkles, Eye, Heart, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

const PremiumShowcase = () => {
  const premiumArtworks = [
    {
      id: 1,
      name: "Golden Heritage Collection",
      price: 2500,
      originalPrice: 3200,
      image: "/lovable-uploads/5632be5b-8b74-457c-8ea8-30f3985cae44.png",
      category: "Exclusive Collection",
      description:
        "Limited edition masterpiece featuring traditional Moroccan artistry with gold leaf accents",
      tags: ["Limited Edition", "Gold Leaf", "Museum Quality"],
      discount: 22,
      inStock: 3,
    },
    {
      id: 2,
      name: "Timeless Elegance",
      price: 1800,
      originalPrice: 2400,
      image: "/lovable-uploads/c47003b7-a74a-4460-85ef-d2574bdfc247.png",
      category: "Premium Series",
      description:
        "Exquisite still life composition with intricate details and premium materials",
      tags: ["Handcrafted", "Premium Materials", "Collector's Choice"],
      discount: 25,
      inStock: 2,
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-500/5 to-indigo-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 backdrop-blur-sm rounded-full border border-yellow-400/30 shadow-lg mb-8">
            <Crown className="h-5 w-5 text-yellow-400 mr-2" />
            <span className="text-yellow-400 font-semibold text-sm">
              Exclusive Premium Collection
            </span>
            <Sparkles className="h-4 w-4 text-yellow-400 ml-2" />
          </div>

          <h2 className="text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-white">Masterpieces of</span>
            <br />
            <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 bg-clip-text text-transparent">
              Extraordinary Beauty
            </span>
          </h2>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Discover our most coveted artworks, each piece representing the
            pinnacle of artistic excellence and craftsmanship
          </p>
        </div>

        {/* Premium Artworks Grid */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {premiumArtworks.map((artwork, index) => (
            <div
              key={artwork.id}
              className="group relative bg-white/5 backdrop-blur-lg rounded-3xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-500 hover:transform hover:scale-105"
            >
              {/* Discount Badge */}
              <div className="absolute top-6 left-6 z-10">
                <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 px-3 py-1.5 text-sm font-bold shadow-lg">
                  -{artwork.discount}% OFF
                </Badge>
              </div>

              {/* Premium Badge */}
              <div className="absolute top-6 right-6 z-10">
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black border-0 px-3 py-1.5 text-sm font-bold shadow-lg">
                  <Crown className="h-3 w-3 mr-1" />
                  PREMIUM
                </Badge>
              </div>

              {/* Image Container */}
              <div className="relative overflow-hidden">
                <img
                  src={artwork.image}
                  alt={artwork.name}
                  className="w-full h-80 lg:h-96 object-cover group-hover:scale-110 transition-transform duration-700"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-3">
                        <Button
                          size="sm"
                          className="rounded-full bg-white/20 backdrop-blur-sm border-0 text-white hover:bg-white/30"
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          className="rounded-full bg-white/20 backdrop-blur-sm border-0 text-white hover:bg-white/30"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        size="sm"
                        className="rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold px-6"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Stock Indicator */}
                <div className="absolute bottom-4 left-4">
                  <div className="bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-white text-xs font-medium">
                      Only {artwork.inStock} left in stock
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 space-y-6">
                <div>
                  <div className="text-sm text-purple-400 font-medium mb-2">
                    {artwork.category}
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4 group-hover:text-yellow-400 transition-colors duration-300">
                    {artwork.name}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {artwork.description}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {artwork.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs text-gray-300 border border-white/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Pricing */}
                <div className="flex items-center justify-between pt-6 border-t border-white/20">
                  <div className="space-y-1">
                    <div className="flex items-baseline space-x-3">
                      <span className="text-3xl font-bold text-white">
                        ${artwork.price}
                      </span>
                      <span className="text-lg text-gray-400 line-through">
                        ${artwork.originalPrice}
                      </span>
                    </div>
                    <div className="text-sm text-green-400 font-semibold">
                      Save ${artwork.originalPrice - artwork.price}
                    </div>
                  </div>

                  <Button className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-black font-bold px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300">
                    Acquire Now
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="inline-flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link to="/artwork">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                View Complete Premium Collection
              </Button>
            </Link>
            <div className="text-gray-400 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Limited time exclusive pricing available</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PremiumShowcase;
