"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  count: number;
}

const HorizontalCategoriesSection = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        if (data.success) {
          setCategories(data.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="animate-pulse">
              <div className="h-8 bg-slate-700 rounded-md w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-slate-700 rounded-md w-96 mx-auto"></div>
            </div>
          </div>
          <div className="flex gap-6 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-80">
                <div className="animate-pulse bg-slate-700 rounded-2xl h-64"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500/10 rounded-full border border-amber-500/20 mb-8">
            <span className="text-2xl">🎨</span>
            <span className="text-amber-400 font-semibold text-sm tracking-wide uppercase">
              Categories
            </span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            Explore by
            <span className="block bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent mt-2">
              Category
            </span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Discover our curated collection organized by artistic themes
          </p>
        </div>

        {/* Categories Container with Centered Layout */}
        <div className="relative">
          {/* Scroll Buttons - Only show when scrollable */}
          {categories.length > 3 && canScrollLeft && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-slate-800/90 hover:bg-slate-700 text-white border border-slate-600/50 rounded-full h-12 w-12 shadow-xl backdrop-blur-sm hover:scale-110 transition-all duration-200"
              onClick={scrollLeft}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}

          {categories.length > 3 && canScrollRight && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-slate-800/90 hover:bg-slate-700 text-white border border-slate-600/50 rounded-full h-12 w-12 shadow-xl backdrop-blur-sm hover:scale-110 transition-all duration-200"
              onClick={scrollRight}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          )}

          {/* Categories Container */}
          <div
            ref={scrollContainerRef}
            className={`${
              categories.length <= 3
                ? "flex justify-center gap-8"
                : "flex gap-8 overflow-x-auto scrollbar-hide pb-6"
            } ${categories.length > 3 ? "px-8" : ""}`}
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            onScroll={handleScroll}
          >
            {categories.map((category) => (
              <Card
                key={category.id}
                className={`${
                  categories.length <= 3 ? "w-96" : "flex-shrink-0 w-80"
                } bg-slate-800/30 border-slate-700/50 hover:border-amber-500/40 transition-all duration-500 cursor-pointer group hover:bg-slate-800/50 hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-2`}
              >
                <CardContent className="p-0">
                  {/* Featured Artwork Image */}
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Hover Action */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <span className="text-slate-900 font-semibold text-sm">
                          View Collection
                        </span>
                        <ArrowRight className="h-4 w-4 text-slate-900" />
                      </div>
                    </div>
                  </div>

                  {/* Category Info */}
                  <div className="p-8">
                    <div className="text-center space-y-4">
                      <div className="flex items-center justify-center gap-3 mb-4">
                        <h3 className="text-2xl font-bold text-white group-hover:text-amber-400 transition-colors duration-300">
                          {category.name}
                        </h3>
                      </div>

                      <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">
                        {category.description}
                      </p>

                      <div className="text-amber-500 text-sm font-medium">
                        {category.count} artworks
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center mt-16">
          <Link href="/gallery">
            <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-10 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-amber-500/25 hover:scale-105 text-lg">
              Browse All Artworks
              <ArrowRight className="ml-3 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HorizontalCategoriesSection;
