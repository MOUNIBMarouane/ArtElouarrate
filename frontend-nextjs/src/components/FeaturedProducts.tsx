import { Button } from "@/components/ui/button";
import { Star, ShoppingCart, Heart, Eye } from "lucide-react";
import { Link } from "react-router-dom";

const FeaturedProducts = () => {
  const products = [
    {
      id: 1,
      name: "Village Life Harmony",
      price: 1250,
      originalPrice: 1500,
      rating: 4.9,
      reviews: 24,
      image: "/lovable-uploads/adb447be-2f2a-4657-b75e-739e41add877.png",
      badge: "ELOUARATE ART",
      description:
        "Beautiful pastoral scene with farm animals and village life, showcasing traditional countryside harmony",
    },
    {
      id: 2,
      name: "Traditional Still Life",
      price: 950,
      originalPrice: 1200,
      rating: 4.8,
      reviews: 18,
      image: "/lovable-uploads/c47003b7-a74a-4460-85ef-d2574bdfc247.png",
      badge: "ELOUARATE ART",
      description:
        "Exquisite traditional Middle Eastern still life with ornate teapot and decorative objects on beautiful textiles",
    },
    {
      id: 3,
      name: "Moroccan Heritage",
      price: 1100,
      originalPrice: 1350,
      rating: 4.7,
      reviews: 32,
      image: "/lovable-uploads/5632be5b-8b74-457c-8ea8-30f3985cae44.png",
      badge: "ELOUARATE ART",
      description:
        "Stunning Moroccan traditional dress painting with intricate geometric patterns and architectural details",
    },
    {
      id: 4,
      name: "Desert Warriors",
      price: 1400,
      originalPrice: 1700,
      rating: 5.0,
      reviews: 15,
      image: "/lovable-uploads/932dc5ad-3774-42d4-a621-edbc74c310fb.png",
      badge: "ELOUARATE ART",
      description:
        "Dynamic painting of traditional horsemen in desert landscape, capturing movement and cultural heritage",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-purple-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-white rounded-full border border-purple-200 shadow-sm mb-6">
            <span className="text-purple-600 font-medium text-sm">
              🏆 Featured Collection
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Masterpieces by
            <span className="block bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              ELOUARATE ART
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Handpicked exceptional artworks from our exclusive collection, each
            piece telling its own unique story
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group hover:-translate-y-2 border border-gray-100"
            >
              <div className="relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Overlay with actions */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="rounded-full bg-white/90 backdrop-blur-sm hover:bg-white"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="rounded-full bg-white/90 backdrop-blur-sm hover:bg-white"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      size="sm"
                      className="rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg"
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg">
                    {product.badge}
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-300">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                    {product.description}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-2 font-medium">
                      ({product.reviews})
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="space-y-1">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-2xl font-bold text-gray-900">
                        ${product.price}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        ${product.originalPrice}
                      </span>
                    </div>
                    <div className="text-xs text-green-600 font-semibold">
                      Save ${product.originalPrice - product.price}
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300">
                  Add to Collection
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/artwork">
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-purple-300 hover:border-purple-400 hover:bg-purple-50 px-8 py-4 text-lg font-semibold"
            >
              View Complete Collection
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
