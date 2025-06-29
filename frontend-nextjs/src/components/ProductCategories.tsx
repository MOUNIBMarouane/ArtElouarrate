
import { Palette, Image, Brush, PaintBucket } from 'lucide-react';

const ProductCategories = () => {
  const categories = [
    {
      icon: Palette,
      title: "Original Paintings",
      description: "Unique handcrafted masterpieces",
      count: "50+ pieces",
      image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop",
      gradient: "from-purple-500 to-indigo-600"
    },
    {
      icon: Image,
      title: "Custom Portraits",
      description: "Personalized portrait commissions",
      count: "Made to order",
      image: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=400&h=300&fit=crop",
      gradient: "from-indigo-500 to-purple-600"
    },
    {
      icon: Brush,
      title: "Landscapes",
      description: "Breathtaking nature and scenery",
      count: "30+ paintings",
      image: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=400&h=300&fit=crop",
      gradient: "from-purple-600 to-pink-500"
    },
    {
      icon: PaintBucket,
      title: "Art Supplies",
      description: "Professional painting materials",
      count: "100+ items",
      image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop",
      gradient: "from-indigo-600 to-purple-500"
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-purple-50 rounded-full border border-purple-200 mb-6">
            <span className="text-purple-600 font-medium text-sm">🎨 Art Collections</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Explore Our
            <span className="block bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Artistic Universe
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover our diverse range of artistic creations, from traditional masterpieces to contemporary expressions
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category, index) => (
            <div 
              key={index}
              className="group cursor-pointer bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-gray-100"
            >
              <div className="relative overflow-hidden">
                <img 
                  src={category.image} 
                  alt={category.title}
                  className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent group-hover:from-black/20 transition-all duration-300"></div>
                
                {/* Floating icon */}
                <div className={`absolute top-4 right-4 bg-gradient-to-br ${category.gradient} rounded-xl p-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <category.icon className="h-6 w-6 text-white" />
                </div>
                
                {/* Count badge */}
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                  <span className="text-sm font-semibold text-gray-800">{category.count}</span>
                </div>
              </div>
              
              <div className="p-6 space-y-3">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors duration-300">
                  {category.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{category.description}</p>
                
                {/* Explore link */}
                <div className="pt-2">
                  <span className="text-purple-600 font-semibold text-sm group-hover:text-indigo-600 transition-colors duration-300">
                    Explore Collection →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductCategories;
