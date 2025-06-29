"use client";
import { useEffect, useState } from "react";
import { Trophy, Users, Palette, Globe, Star, Award } from "lucide-react";

const StatisticsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState({
    artworks: 0,
    clients: 0,
    exhibitions: 0,
    awards: 0,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const section = document.getElementById("statistics-section");
    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible) {
      const targets = {
        artworks: 150,
        clients: 500,
        exhibitions: 45,
        awards: 12,
      };
      const duration = 2000;
      const steps = 60;
      const interval = duration / steps;

      const incrementers: NodeJS.Timeout[] = [];

      Object.keys(targets).forEach((key) => {
        const target = targets[key as keyof typeof targets];
        const increment = target / steps;
        let current = 0;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          setCounts((prev) => ({ ...prev, [key]: Math.floor(current) }));
        }, interval);

        incrementers.push(timer);
      });

      return () => {
        incrementers.forEach(clearInterval);
      };
    }
  }, [isVisible]);

  const statistics = [
    {
      id: "artworks",
      icon: Palette,
      value: counts.artworks,
      label: "Original Artworks",
      suffix: "+",
      description: "Masterpieces created",
      color: "from-purple-500 to-indigo-600",
    },
    {
      id: "clients",
      icon: Users,
      value: counts.clients,
      label: "Happy Collectors",
      suffix: "+",
      description: "Worldwide satisfaction",
      color: "from-rose-500 to-pink-600",
    },
    {
      id: "exhibitions",
      icon: Globe,
      value: counts.exhibitions,
      label: "Global Exhibitions",
      suffix: "+",
      description: "International showcases",
      color: "from-orange-500 to-red-600",
    },
    {
      id: "awards",
      icon: Award,
      value: counts.awards,
      label: "Prestigious Awards",
      suffix: "",
      description: "Recognition received",
      color: "from-emerald-500 to-teal-600",
    },
  ];

  return (
    <section
      id="statistics-section"
      className="py-20 bg-gradient-to-br from-gray-50 via-white to-purple-50/30 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-purple-200/50 shadow-sm mb-6">
            <Star className="h-4 w-4 text-purple-600 mr-2" />
            <span className="text-purple-600 font-medium text-sm">
              Excellence in Numbers
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Creating Art That
            <span className="block bg-gradient-to-r from-purple-600 via-rose-600 to-orange-600 bg-clip-text text-transparent">
              Inspires Worldwideaa
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Years of dedication have resulted in extraordinary achievements and
            recognition across the global art community
          </p>
        </div>



        {/* Bottom Accent */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-8 px-8 py-4 bg-white/60 backdrop-blur-sm rounded-full border border-gray-200/50 shadow-sm">
            <div className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <span className="text-sm font-semibold text-gray-700">
                Award-Winning Artist
              </span>
            </div>
            <div className="w-1 h-6 bg-gray-300"></div>
            <div className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-semibold text-gray-700">
                Global Recognition
              </span>
            </div>
            <div className="w-1 h-6 bg-gray-300"></div>
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-purple-500" />
              <span className="text-sm font-semibold text-gray-700">
                Premium Quality
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;
