import { Card, CardContent } from "@/components/ui/card";
import {
  Brush,
  Heart,
  Star,
  Users,
  Award,
  Clock,
  Target,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const AboutSection = () => {
  const achievements = [
    {
      icon: Award,
      title: "International Recognition",
      description:
        "Winner of prestigious art competitions across Europe and Middle East",
      color: "from-yellow-500 to-orange-600",
    },
    {
      icon: Users,
      title: "500+ Satisfied Clients",
      description:
        "Collectors and art enthusiasts worldwide trust our artistic vision",
      color: "from-purple-500 to-indigo-600",
    },
    {
      icon: Clock,
      title: "20+ Years Experience",
      description:
        "Two decades of mastering traditional and contemporary techniques",
      color: "from-rose-500 to-pink-600",
    },
    {
      icon: Target,
      title: "Museum Quality",
      description:
        "Every piece crafted to museum standards with premium materials",
      color: "from-emerald-500 to-teal-600",
    },
  ];

  const values = [
    {
      icon: Heart,
      title: "Passion",
      description:
        "Every brushstroke is guided by deep passion for artistic expression",
    },
    {
      icon: Star,
      title: "Excellence",
      description:
        "Uncompromising commitment to the highest standards of quality",
    },
    {
      icon: Brush,
      title: "Authenticity",
      description:
        "Creating original works that tell genuine stories and emotions",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-white via-purple-50/30 to-indigo-50/20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-40 h-40 bg-purple-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-indigo-300 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-rose-300 rounded-full blur-xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-purple-200/50 shadow-sm mb-6">
            <Sparkles className="h-4 w-4 text-purple-600 mr-2" />
            <span className="text-purple-600 font-medium text-sm">
              About the Artist
            </span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Crafting Beauty Through
            <span className="block bg-gradient-to-r from-purple-600 via-rose-600 to-orange-600 bg-clip-text text-transparent">
              Artistic Mastery
            </span>
          </h2>

          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            With over 20 years of experience in fine arts, I specialize in
            creating emotionally resonant paintings that bridge traditional
            techniques with contemporary vision. Each piece is a journey through
            culture, emotion, and the timeless beauty of human experience.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Left - Artist Story */}
          <div className="space-y-8">
            <div className="relative">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 shadow-lg border border-gray-100/50">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Heart className="h-6 w-6 text-rose-500 mr-3" />
                  My Artistic Journey
                </h3>

                <div className="space-y-6 text-gray-700 leading-relaxed">
                  <p>
                    Born with a natural affinity for colors and forms, my
                    artistic journey began in the vibrant streets of Morocco,
                    where traditional craftsmanship and modern expression
                    converge. This cultural richness became the foundation of my
                    unique artistic voice.
                  </p>

                  <p>
                    Through years of dedicated study and practice, I've
                    developed a distinctive style that captures the essence of
                    human emotion while celebrating the beauty of our shared
                    cultural heritage. Each painting tells a story, preserving
                    moments of beauty for generations to come.
                  </p>

                  <p className="font-semibold text-purple-600">
                    "Art is not what you see, but what you make others see." -
                    This philosophy guides every brushstroke in my work.
                  </p>
                </div>
              </div>

              {/* Decorative Quote */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-purple-100 to-indigo-200 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-2xl">"</span>
              </div>
            </div>
          </div>

          {/* Right - Artist Image */}
          <div className="relative">
            <div className="relative group">
              <div className="overflow-hidden rounded-3xl shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1578662996442-6f7ffbecf5b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Artist creating masterpiece"
                  className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-700"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-gray-100/50">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-gray-700">
                    Currently Creating
                  </span>
                </div>
              </div>

              <div className="absolute -top-6 -right-6 bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-4 rounded-2xl shadow-xl">
                <div className="text-center">
                  <div className="text-2xl font-bold">150+</div>
                  <div className="text-xs font-medium">Masterpieces</div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-gradient-to-r from-rose-400/20 to-pink-400/20 rounded-full blur-lg"></div>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {achievements.map((achievement, index) => (
            <Card
              key={index}
              className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/80 backdrop-blur-sm"
            >
              <CardContent className="p-8 text-center space-y-4">
                <div
                  className={`w-16 h-16 mx-auto bg-gradient-to-br ${achievement.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  <achievement.icon className="h-8 w-8 text-white" />
                </div>

                <h4 className="font-bold text-lg text-gray-900 group-hover:text-purple-600 transition-colors duration-300">
                  {achievement.title}
                </h4>

                <p className="text-gray-600 text-sm leading-relaxed">
                  {achievement.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Values Section */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-12 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2"></div>
          </div>

          <div className="relative">
            <div className="text-center mb-12">
              <h3 className="text-3xl lg:text-4xl font-bold mb-4">
                Core Values That Guide My Art
              </h3>
              <p className="text-purple-100 text-lg max-w-2xl mx-auto">
                These fundamental principles shape every creation and
                interaction with my collectors
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <div key={index} className="text-center group">
                  <div className="w-20 h-20 mx-auto mb-6 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition-all duration-300 border border-white/20">
                    <value.icon className="h-10 w-10 text-white" />
                  </div>

                  <h4 className="text-xl font-bold mb-3">{value.title}</h4>
                  <p className="text-purple-100 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-50 font-bold px-8 py-4 rounded-full shadow-lg transition-all duration-300"
              >
                Discover My Collection
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
