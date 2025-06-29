"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Palette,
  MapPin,
  Calendar,
  Award,
  Heart,
  Eye,
  MessageCircle,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  ArrowRight,
  Star,
  Quote,
  Brush,
  Camera,
  Pencil,
  Sparkles,
  Crown,
  Users,
  Zap,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import ImageWithFallbackPublic from "@/components/ImageWithFallbackPublic";

export default function ArtistProfile() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("about");

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const stats = [
    { label: "Artworks Created", value: "150+", icon: Palette },
    { label: "Years Experience", value: "12", icon: Calendar },
    { label: "Exhibitions", value: "25", icon: Award },
    { label: "Happy Collectors", value: "200+", icon: Heart },
  ];

  const skills = [
    { name: "Oil Painting", level: 95, icon: Brush },
    { name: "Watercolor", level: 88, icon: Palette },
    { name: "Mixed Media", level: 92, icon: Sparkles },
    { name: "Digital Art", level: 85, icon: Camera },
    { name: "Portraits", level: 90, icon: Users },
    { name: "Landscapes", level: 87, icon: Eye },
  ];

  const achievements = [
    {
      year: "2023",
      title: "Best Contemporary Artist",
      description: "Moroccan Art Awards",
      icon: Crown,
    },
    {
      year: "2022",
      title: "Featured Exhibition",
      description: "Casablanca Museum of Modern Art",
      icon: Award,
    },
    {
      year: "2021",
      title: "Rising Star Award",
      description: "International Art Festival",
      icon: Star,
    },
    {
      year: "2020",
      title: "Solo Exhibition",
      description: "Gallery of Fine Arts, Rabat",
      icon: Palette,
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "Paris, France",
      text: "The artwork I purchased exceeded all my expectations. The attention to detail and emotional depth is remarkable.",
      rating: 5,
      avatar: "/lovable-uploads/03bcb36b-2cef-49c5-bebf-3ee8f4c081d2.png",
    },
    {
      name: "Ahmed Hassan",
      location: "Dubai, UAE",
      text: "A truly talented artist with a unique vision. The piece I commissioned for my office has become the centerpiece.",
      rating: 5,
      avatar: "/lovable-uploads/1dcc313f-7f0b-4090-9dc3-42d07e5291bf.png",
    },
    {
      name: "Maria Rodriguez",
      location: "Madrid, Spain",
      text: "Professional, creative, and passionate about art. Working with this artist was an absolute pleasure.",
      rating: 5,
      avatar: "/lovable-uploads/2fbe62dd-237c-4c35-8bd4-b3c4d5d69c05.png",
    },
  ];

  const featuredWorks = [
    {
      id: "1",
      title: "Moroccan Dreams",
      medium: "Oil on Canvas",
      year: "2024",
      price: "$2,500",
      image: "/lovable-uploads/03bcb36b-2cef-49c5-bebf-3ee8f4c081d2.png",
      status: "Available",
    },
    {
      id: "2",
      title: "Desert Symphony",
      medium: "Acrylic Mixed Media",
      year: "2024",
      price: "$3,200",
      image: "/lovable-uploads/1dcc313f-7f0b-4090-9dc3-42d07e5291bf.png",
      status: "Sold",
    },
    {
      id: "3",
      title: "Ocean Breeze",
      medium: "Watercolor",
      year: "2023",
      price: "$1,800",
      image: "/lovable-uploads/2fbe62dd-237c-4c35-8bd4-b3c4d5d69c05.png",
      status: "Available",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 pt-20">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-purple-500/10 to-slate-900"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Artist Image */}
            <div className="relative">
              <div className="relative w-80 h-80 mx-auto lg:w-96 lg:h-96 rounded-3xl overflow-hidden shadow-2xl">
                <ImageWithFallbackPublic
                  src="/lovable-uploads/932dc5ad-3774-42d4-a621-edbc74c310fb.png"
                  alt="Artist Portrait"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 bg-amber-500 rounded-full p-4 shadow-lg animate-bounce">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <div
                className="absolute -bottom-6 -left-6 bg-purple-500 rounded-full p-4 shadow-lg animate-bounce"
                style={{ animationDelay: "0.5s" }}
              >
                <Brush className="w-6 h-6 text-white" />
              </div>
            </div>

            {/* Artist Info */}
            <div className="text-center lg:text-left">
              <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 mb-6">
                <Crown className="w-4 h-4 mr-2" />
                Professional Artist
              </Badge>

              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                Mohammed <span className="text-amber-400">Alaoui</span>
              </h1>

              <p className="text-xl text-slate-300 mb-6 flex items-center justify-center lg:justify-start">
                <MapPin className="w-5 h-5 mr-2 text-amber-400" />
                Casablanca, Morocco
              </p>

              <p className="text-lg text-slate-400 mb-8 max-w-2xl">
                Contemporary Moroccan artist specializing in oil paintings,
                watercolors, and mixed media. My work explores the intersection
                of traditional Moroccan culture with modern artistic expression,
                creating pieces that speak to both heritage and innovation.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  onClick={() =>
                    window.open(
                      "https://wa.me/212658651060?text=Hello! I'd like to discuss commissioning an artwork.",
                      "_blank"
                    )
                  }
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Commission Artwork
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-slate-600 text-slate-200 hover:bg-slate-800/50 px-8 py-3 rounded-xl"
                  onClick={() => setActiveTab("portfolio")}
                >
                  <Eye className="w-5 h-5 mr-2" />
                  View Portfolio
                </Button>
              </div>

              {/* Social Links */}
              <div className="flex items-center justify-center lg:justify-start space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-400 hover:text-white"
                >
                  <Instagram className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-400 hover:text-white"
                >
                  <Facebook className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-400 hover:text-white"
                >
                  <Twitter className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-400 hover:text-white"
                >
                  <Linkedin className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="py-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { id: "about", label: "About Me", icon: Users },
              { id: "portfolio", label: "Portfolio", icon: Palette },
              { id: "skills", label: "Skills", icon: Zap },
              { id: "achievements", label: "Achievements", icon: Award },
              { id: "testimonials", label: "Testimonials", icon: Quote },
              { id: "contact", label: "Contact", icon: MessageCircle },
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? "bg-amber-500 hover:bg-amber-600 text-white"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                } px-6 py-2 rounded-lg transition-all duration-300`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* About Tab */}
          {activeTab === "about" && (
            <div className="animate-fade-in-up">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-6">
                    My Artistic Journey
                  </h2>
                  <p className="text-slate-400 mb-6">
                    Born and raised in Casablanca, I discovered my passion for
                    art at an early age. My journey began with traditional
                    Moroccan motifs and patterns, which later evolved into a
                    unique contemporary style that bridges cultural heritage
                    with modern expression.
                  </p>
                  <p className="text-slate-400 mb-6">
                    After studying Fine Arts at the École Supérieure des
                    Beaux-Arts in Casablanca, I spent several years traveling
                    across Morocco, documenting landscapes, people, and
                    architectural marvels that continue to inspire my work
                    today.
                  </p>
                  <p className="text-slate-400">
                    Today, my artwork is collected internationally, and I
                    continue to explore new techniques and mediums while staying
                    true to my Moroccan roots. Each piece tells a story of
                    culture, emotion, and the beauty I see in everyday life.
                  </p>
                </div>

                <div className="space-y-6">
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold text-white mb-4">
                        Education
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <div className="text-amber-400 font-semibold">
                            Master of Fine Arts
                          </div>
                          <div className="text-slate-400">
                            École Supérieure des Beaux-Arts, Casablanca
                          </div>
                          <div className="text-sm text-slate-500">
                            2015 - 2017
                          </div>
                        </div>
                        <div>
                          <div className="text-amber-400 font-semibold">
                            Bachelor of Arts
                          </div>
                          <div className="text-slate-400">
                            University of Hassan II, Casablanca
                          </div>
                          <div className="text-sm text-slate-500">
                            2011 - 2015
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold text-white mb-4">
                        Artistic Philosophy
                      </h3>
                      <Quote className="w-8 h-8 text-amber-400 mb-3" />
                      <p className="text-slate-400 italic">
                        "Art should be a bridge between cultures, a universal
                        language that speaks to the heart while honoring the
                        traditions that shape our identity."
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {/* Portfolio Tab */}
          {activeTab === "portfolio" && (
            <div className="animate-fade-in-up">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Featured Artworks
                </h2>
                <p className="text-slate-400 max-w-2xl mx-auto">
                  A selection of my most celebrated pieces, each representing a
                  different aspect of my artistic journey and cultural
                  exploration.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredWorks.map((work, index) => (
                  <Card
                    key={work.id}
                    className="bg-slate-800/50 border-slate-700 overflow-hidden group hover:border-amber-500/50 transition-all duration-300"
                  >
                    <div className="relative aspect-square">
                      <ImageWithFallbackPublic
                        src={work.image}
                        alt={work.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      <Badge
                        className={`absolute top-3 right-3 ${
                          work.status === "Available"
                            ? "bg-green-500"
                            : "bg-red-500"
                        } text-white`}
                      >
                        {work.status}
                      </Badge>

                      <div className="absolute bottom-3 left-3 right-3 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <Button
                          size="sm"
                          className="w-full bg-green-600 hover:bg-green-700 text-white"
                          onClick={() =>
                            window.open(
                              `https://wa.me/212658651060?text=Hello! I'm interested in "${work.title}".`,
                              "_blank"
                            )
                          }
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Inquire
                        </Button>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {work.title}
                      </h3>
                      <div className="flex items-center justify-between text-sm text-slate-400 mb-3">
                        <span>{work.medium}</span>
                        <span>{work.year}</span>
                      </div>
                      <div className="text-amber-400 font-bold text-lg">
                        {work.price}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center mt-12">
                <Link href="/store">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-3 rounded-xl"
                  >
                    <Palette className="w-5 h-5 mr-2" />
                    View Complete Portfolio
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Skills Tab */}
          {activeTab === "skills" && (
            <div className="animate-fade-in-up">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Artistic Skills
                </h2>
                <p className="text-slate-400 max-w-2xl mx-auto">
                  Years of dedication and practice have honed these skills, each
                  representing a different facet of my artistic expression.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className="bg-slate-800/50 border border-slate-700 rounded-xl p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg flex items-center justify-center mr-3">
                          <skill.icon className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-white font-semibold">
                          {skill.name}
                        </span>
                      </div>
                      <span className="text-amber-400 font-bold">
                        {skill.level}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-amber-600 h-2 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === "achievements" && (
            <div className="animate-fade-in-up">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Recognition & Awards
                </h2>
                <p className="text-slate-400 max-w-2xl mx-auto">
                  Milestones in my artistic journey, each recognition fueling my
                  passion to continue creating meaningful art.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {achievements.map((achievement, index) => (
                  <Card
                    key={index}
                    className="bg-slate-800/50 border-slate-700 hover:border-amber-500/50 transition-all duration-300"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center">
                            <achievement.icon className="w-6 h-6 text-white" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="text-amber-400 font-semibold text-sm">
                            {achievement.year}
                          </div>
                          <h3 className="text-white font-bold text-lg mb-1">
                            {achievement.title}
                          </h3>
                          <p className="text-slate-400">
                            {achievement.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Testimonials Tab */}
          {activeTab === "testimonials" && (
            <div className="animate-fade-in-up">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">
                  What Collectors Say
                </h2>
                <p className="text-slate-400 max-w-2xl mx-auto">
                  Feedback from art collectors and enthusiasts who have
                  experienced the joy of owning one of my pieces.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                  <Card
                    key={index}
                    className="bg-slate-800/50 border-slate-700"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-1 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 text-amber-400 fill-current"
                          />
                        ))}
                      </div>

                      <Quote className="w-8 h-8 text-amber-400 mb-3" />
                      <p className="text-slate-400 mb-6 italic">
                        "{testimonial.text}"
                      </p>

                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                          <ImageWithFallbackPublic
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="text-white font-semibold">
                            {testimonial.name}
                          </div>
                          <div className="text-slate-400 text-sm">
                            {testimonial.location}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === "contact" && (
            <div className="animate-fade-in-up">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Let's Create Together
                </h2>
                <p className="text-slate-400 max-w-2xl mx-auto">
                  Whether you're interested in commissioning a custom piece,
                  purchasing existing artwork, or simply want to discuss art,
                  I'd love to hear from you.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Contact Methods */}
                <div className="lg:col-span-1 space-y-6">
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-6">
                      <h3 className="text-white font-semibold mb-4">
                        Contact Information
                      </h3>

                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <MessageCircle className="w-5 h-5 text-green-400" />
                          <div>
                            <div className="text-white font-medium">
                              WhatsApp
                            </div>
                            <div className="text-slate-400 text-sm">
                              +212 658 651 060
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <Phone className="w-5 h-5 text-blue-400" />
                          <div>
                            <div className="text-white font-medium">Phone</div>
                            <div className="text-slate-400 text-sm">
                              +212 658 651 060
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <Mail className="w-5 h-5 text-amber-400" />
                          <div>
                            <div className="text-white font-medium">Email</div>
                            <div className="text-slate-400 text-sm">
                              artist@example.com
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <MapPin className="w-5 h-5 text-red-400" />
                          <div>
                            <div className="text-white font-medium">
                              Location
                            </div>
                            <div className="text-slate-400 text-sm">
                              Casablanca, Morocco
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-6">
                      <h3 className="text-white font-semibold mb-4">
                        Services Offered
                      </h3>
                      <ul className="space-y-2 text-slate-400">
                        <li>• Custom Portrait Paintings</li>
                        <li>• Landscape Commissions</li>
                        <li>• Corporate Art Projects</li>
                        <li>• Art Consultation</li>
                        <li>• Private Art Lessons</li>
                        <li>• Exhibition Curation</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* Contact Actions */}
                <div className="lg:col-span-2">
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-8">
                      <h3 className="text-2xl font-bold text-white mb-6">
                        Ready to Start Your Art Journey?
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <Button
                          size="lg"
                          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-6 h-auto flex-col space-y-2"
                          onClick={() =>
                            window.open(
                              "https://wa.me/212658651060?text=Hello! I'm interested in commissioning a custom artwork.",
                              "_blank"
                            )
                          }
                        >
                          <MessageCircle className="w-8 h-8" />
                          <span className="text-lg font-semibold">
                            Commission Artwork
                          </span>
                          <span className="text-sm opacity-90">
                            Discuss your custom project
                          </span>
                        </Button>

                        <Button
                          size="lg"
                          variant="outline"
                          className="border-slate-600 text-slate-200 hover:bg-slate-700 p-6 h-auto flex-col space-y-2"
                          onClick={() =>
                            window.open(
                              "https://wa.me/212658651060?text=Hello! I'd like to learn more about available artworks.",
                              "_blank"
                            )
                          }
                        >
                          <Palette className="w-8 h-8" />
                          <span className="text-lg font-semibold">
                            Purchase Artwork
                          </span>
                          <span className="text-sm opacity-90">
                            Browse available pieces
                          </span>
                        </Button>
                      </div>

                      <div className="text-center">
                        <p className="text-slate-400 mb-4">
                          Response time: Usually within 2-4 hours during
                          business hours
                        </p>
                        <div className="flex items-center justify-center space-x-4">
                          <div className="flex items-center space-x-2 text-green-400">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-sm">
                              Available for commissions
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
