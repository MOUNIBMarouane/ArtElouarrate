import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  PenTool,
  Award,
  Calendar,
  MapPin,
  Eye,
  Users,
  Star,
  Palette,
  Layers,
  Camera,
  Heart,
  BookOpen,
  Trophy,
  Globe,
  Mail,
  Phone,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("about");

  const skills = [
    { name: "Hyperrealistic Portraits", level: 98, color: "bg-gray-600" },
    { name: "Graphite Techniques", level: 95, color: "bg-slate-600" },
    { name: "Shading & Lighting", level: 97, color: "bg-gray-700" },
    { name: "Texture Details", level: 94, color: "bg-slate-700" },
    { name: "Composition", level: 92, color: "bg-gray-800" },
    { name: "Character Expression", level: 96, color: "bg-black" },
  ];

  const achievements = [
    {
      year: "2023",
      title: "International Pencil Art Championship",
      award: "First Place - Hyperrealistic Category",
      location: "Paris, France",
      icon: Trophy,
    },
    {
      year: "2022",
      title: "Middle East Art Excellence Award",
      award: "Outstanding Artist of the Year",
      location: "Dubai, UAE",
      icon: Award,
    },
    {
      year: "2021",
      title: "Global Drawing Competition",
      award: "Best Portrait Artist",
      location: "London, UK",
      icon: Star,
    },
    {
      year: "2020",
      title: "Moroccan Art Heritage Prize",
      award: "Cultural Ambassador through Art",
      location: "Rabat, Morocco",
      icon: Globe,
    },
  ];

  const timeline = [
    {
      year: "2008",
      title: "Artistic Awakening",
      description:
        "Discovered passion for pencil drawing while studying architecture. First sketches showed natural talent.",
      icon: PenTool,
    },
    {
      year: "2012",
      title: "First Exhibition",
      description:
        'Debut solo exhibition "Faces of Morocco" featured 25 portraits showcasing local culture and tradition.',
      icon: Eye,
    },
    {
      year: "2015",
      title: "International Recognition",
      description:
        "Work featured in European galleries. Developed signature hyperrealistic style.",
      icon: Globe,
    },
    {
      year: "2018",
      title: "Master Certification",
      description:
        "Completed advanced studies in fine arts and obtained master certification in graphite techniques.",
      icon: BookOpen,
    },
    {
      year: "2021",
      title: "Digital Presence",
      description:
        "Launched online gallery and began offering worldwide commissions.",
      icon: Camera,
    },
    {
      year: "2024",
      title: "Virtual Gallery",
      description:
        "Pioneered 3D virtual gallery experience, making art accessible globally.",
      icon: Layers,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-gray-900 via-slate-800 to-black text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gray-300 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Profile Info */}
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-white/10 text-white border-white/20">
                  Master Pencil Artist
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold">ELOUARATE</h1>
                <p className="text-xl text-gray-300 leading-relaxed">
                  Transforming moments into timeless art through the mastery of
                  graphite. Every stroke tells a story, every shadow holds
                  emotion.
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold">200+</div>
                  <div className="text-sm text-gray-400">Drawings Created</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">15+</div>
                  <div className="text-sm text-gray-400">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">500+</div>
                  <div className="text-sm text-gray-400">Happy Clients</div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <span>Casablanca, Morocco</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <span>Born 1985 • Age 39</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <span>contact@elouarate.art</span>
                </div>
              </div>
            </div>

            {/* Right - Profile Image */}
            <div className="relative">
              <div className="relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="ELOUARATE - Master Pencil Artist"
                  className="w-full h-96 lg:h-[500px] object-cover rounded-3xl shadow-2xl"
                />

                {/* Floating Achievement */}
                <div className="absolute -bottom-6 -left-6 bg-white text-black p-6 rounded-2xl shadow-xl">
                  <div className="flex items-center space-x-3">
                    <Trophy className="h-8 w-8 text-yellow-600" />
                    <div>
                      <div className="font-bold">Latest Achievement</div>
                      <div className="text-sm text-gray-600">
                        International Champion 2023
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {[
              { id: "about", label: "About", icon: Users },
              { id: "skills", label: "Skills", icon: PenTool },
              { id: "achievements", label: "Achievements", icon: Award },
              { id: "journey", label: "Journey", icon: Calendar },
              { id: "contact", label: "Contact", icon: Mail },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* About Tab */}
          {activeTab === "about" && (
            <div className="space-y-12">
              <div className="text-center">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  About ELOUARATE
                </h2>
              </div>

              <div className="grid lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    The Artist's Vision
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    Born in the vibrant city of Casablanca, ELOUARATE discovered
                    his passion for art at a young age. What began as casual
                    sketches during architecture studies evolved into a
                    life-defining pursuit of photorealistic pencil artistry.
                  </p>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    His work transcends mere representation, capturing the soul
                    and essence of his subjects through meticulous attention to
                    detail and profound understanding of light, shadow, and
                    human emotion.
                  </p>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    Today, ELOUARATE is recognized internationally for his
                    hyperrealistic portraits that blur the line between
                    photography and drawing, creating timeless pieces that speak
                    to the heart.
                  </p>
                </div>

                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Philosophy & Approach
                  </h3>
                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <Heart className="h-6 w-6 text-red-500 mt-1" />
                          <div>
                            <h4 className="font-semibold">
                              Emotional Connection
                            </h4>
                            <p className="text-gray-600 text-sm">
                              Every drawing must capture the subject's essence
                              and evoke genuine emotion
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Eye className="h-6 w-6 text-blue-500 mt-1" />
                          <div>
                            <h4 className="font-semibold">
                              Perfect Observation
                            </h4>
                            <p className="text-gray-600 text-sm">
                              Studying light, shadow, and texture until every
                              detail is understood
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Layers className="h-6 w-6 text-green-500 mt-1" />
                          <div>
                            <h4 className="font-semibold">
                              Patient Craftsmanship
                            </h4>
                            <p className="text-gray-600 text-sm">
                              Building each piece layer by layer with patience
                              and precision
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {/* Skills Tab */}
          {activeTab === "skills" && (
            <div className="space-y-12">
              <div className="text-center">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Technical Mastery
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Years of dedicated practice have honed these essential skills
                  to perfection
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {skills.map((skill, index) => (
                  <Card
                    key={index}
                    className="p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-lg">{skill.name}</h3>
                        <span className="text-2xl font-bold text-gray-800">
                          {skill.level}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`${skill.color} h-3 rounded-full transition-all duration-1000 ease-out`}
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === "achievements" && (
            <div className="space-y-12">
              <div className="text-center">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Awards & Recognition
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {achievements.map((achievement, index) => (
                  <Card
                    key={index}
                    className="p-8 hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <achievement.icon className="h-8 w-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="text-2xl font-bold text-yellow-600">
                            {achievement.year}
                          </div>
                          <div className="font-semibold text-gray-900">
                            {achievement.title}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-lg font-semibold text-gray-800">
                          {achievement.award}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-1" />
                          {achievement.location}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Journey Tab */}
          {activeTab === "journey" && (
            <div className="space-y-12">
              <div className="text-center">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Artistic Journey
                </h2>
              </div>

              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300 hidden md:block"></div>

                <div className="space-y-12">
                  {timeline.map((event, index) => (
                    <div
                      key={index}
                      className="relative flex items-start space-x-8 group"
                    >
                      {/* Timeline Dot */}
                      <div className="relative z-10 w-16 h-16 bg-gradient-to-br from-gray-700 to-black rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <event.icon className="h-8 w-8 text-white" />
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <Card className="p-6 group-hover:shadow-lg transition-shadow">
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                              <Badge
                                variant="outline"
                                className="text-lg font-bold"
                              >
                                {event.year}
                              </Badge>
                              <h3 className="text-xl font-bold text-gray-900">
                                {event.title}
                              </h3>
                            </div>
                            <p className="text-gray-700 leading-relaxed">
                              {event.description}
                            </p>
                          </div>
                        </Card>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === "contact" && (
            <div className="space-y-12">
              <div className="text-center">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Get In Touch
                </h2>
                <p className="text-xl text-gray-600">
                  Ready to commission your masterpiece?
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-12">
                <Card className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Contact Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-6 w-6 text-gray-600" />
                      <span className="text-lg">contact@elouarate.art</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-6 w-6 text-gray-600" />
                      <span className="text-lg">+212 6XX XXX XXX</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-6 w-6 text-gray-600" />
                      <span className="text-lg">Casablanca, Morocco</span>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      Follow My Work
                    </h4>
                    <div className="flex space-x-4">
                      <Button variant="outline" size="lg" className="p-3">
                        <Instagram className="h-6 w-6" />
                      </Button>
                      <Button variant="outline" size="lg" className="p-3">
                        <Facebook className="h-6 w-6" />
                      </Button>
                      <Button variant="outline" size="lg" className="p-3">
                        <Twitter className="h-6 w-6" />
                      </Button>
                    </div>
                  </div>
                </Card>

                <Card className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Commission Request
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Project Description
                      </label>
                      <textarea
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        placeholder="Describe your commission idea..."
                      ></textarea>
                    </div>
                    <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white">
                      Send Commission Request
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Profile;
