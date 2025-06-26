import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Navigation,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Home,
  Eye,
  VolumeX,
  Volume2,
  Maximize,
  Info,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Move3D,
  Loader,
  Play,
  Pause,
} from "lucide-react";

const Ma3rid = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [currentView, setCurrentView] = useState("entrance");
  const [isRotating, setIsRotating] = useState(true);
  const canvasRef = useRef(null);

  // Gallery artworks data
  const artworks = [
    {
      id: 1,
      title: "The Soul's Reflection",
      year: 2023,
      medium: "Graphite on Paper",
      size: "50x70 cm",
      description:
        "A hyperrealistic portrait capturing the depth of human emotion through masterful shading techniques.",
      image: "/lovable-uploads/adb447be-2f2a-4657-b75e-739e41add877.png",
      position: "north-wall",
    },
    {
      id: 2,
      title: "Whispers of Time",
      year: 2023,
      medium: "Charcoal and Graphite",
      size: "40x60 cm",
      description:
        "An elderly face that tells stories of wisdom and experience through every line and wrinkle.",
      image: "/lovable-uploads/c47003b7-a74a-4460-85ef-d2574bdfc247.png",
      position: "east-wall",
    },
    {
      id: 3,
      title: "Childhood Dreams",
      year: 2022,
      medium: "Graphite on Paper",
      size: "35x50 cm",
      description:
        "The innocence and wonder of youth captured in stunning detail.",
      image: "/lovable-uploads/5632be5b-8b74-457c-8ea8-30f3985cae44.png",
      position: "south-wall",
    },
    {
      id: 4,
      title: "Desert Nomad",
      year: 2022,
      medium: "Graphite and Charcoal",
      size: "45x65 cm",
      description:
        "A powerful portrait showcasing the strength and resilience of desert culture.",
      image: "/lovable-uploads/932dc5ad-3774-42d4-a621-edbc74c310fb.png",
      position: "west-wall",
    },
  ];

  const instructions = [
    { key: "Click", action: "Navigate Gallery" },
    { key: "Arrows", action: "Move Around" },
    { key: "Space", action: "View Artwork" },
    { key: "ESC", action: "Exit View" },
  ];

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(loadingTimer);
  }, []);

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      canvasRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const resetView = () => {
    setCurrentView("entrance");
    setSelectedArtwork(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center space-y-8">
          <div className="relative">
            <div className="w-32 h-32 border-4 border-gray-600 rounded-full animate-spin border-t-white"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Eye className="h-12 w-12 text-white animate-pulse" />
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-white">
              Loading Virtual Gallery
            </h2>
            <p className="text-gray-400">
              Preparing your immersive art experience...
            </p>
            <div className="w-64 bg-gray-700 rounded-full h-2 mx-auto">
              <div
                className="bg-white h-2 rounded-full animate-pulse"
                style={{ width: "70%" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <Header />

      {/* Gallery Instructions Overlay */}
      {showInstructions && (
        <div className="absolute top-20 left-4 z-50 bg-black/90 backdrop-blur-sm text-white p-6 rounded-2xl border border-white/20 max-w-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold flex items-center">
              <Move3D className="h-5 w-5 mr-2" />
              Gallery Navigation
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowInstructions(false)}
              className="text-white hover:bg-white/20"
            >
              ×
            </Button>
          </div>
          <div className="space-y-3">
            {instructions.map((instruction, index) => (
              <div
                key={index}
                className="flex justify-between items-center text-sm"
              >
                <span className="bg-white/20 px-2 py-1 rounded text-xs font-mono">
                  {instruction.key}
                </span>
                <span className="text-gray-300 text-xs">
                  {instruction.action}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gallery Controls */}
      <div className="absolute top-20 right-4 z-50 flex flex-col space-y-2">
        <Button
          onClick={() => setShowInstructions(!showInstructions)}
          className="bg-black/80 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20"
          size="sm"
        >
          <Info className="h-4 w-4" />
        </Button>
        <Button
          onClick={resetView}
          className="bg-black/80 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20"
          size="sm"
        >
          <Home className="h-4 w-4" />
        </Button>
        <Button
          onClick={() => setIsRotating(!isRotating)}
          className="bg-black/80 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20"
          size="sm"
        >
          {isRotating ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
        <Button
          onClick={handleFullscreen}
          className="bg-black/80 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20"
          size="sm"
        >
          <Maximize className="h-4 w-4" />
        </Button>
        <Button
          onClick={() => setIsMuted(!isMuted)}
          className="bg-black/80 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20"
          size="sm"
        >
          {isMuted ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Virtual Gallery Environment */}
      <div
        ref={canvasRef}
        className="w-full h-screen relative"
        style={{
          background: `
            radial-gradient(circle at 50% 0%, rgba(30, 30, 30, 0.8) 0%, transparent 70%),
            radial-gradient(circle at 0% 50%, rgba(40, 40, 40, 0.6) 0%, transparent 70%),
            radial-gradient(circle at 100% 50%, rgba(35, 35, 35, 0.6) 0%, transparent 70%),
            linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)
          `,
        }}
      >
        {/* Gallery Floor Pattern */}
        <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-gray-800/50 to-transparent"></div>

        {/* Main Gallery Display */}
        <div className="absolute inset-0 flex items-center justify-center">
          {currentView === "entrance" && (
            <div className="text-center text-white space-y-8 max-w-4xl px-4">
              <div className="space-y-6">
                <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-4">
                  <Eye className="h-5 w-5 mr-2" />
                  <span className="font-medium">
                    Virtual Gallery Experience
                  </span>
                </div>

                <h1 className="text-6xl lg:text-8xl font-bold bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
                  معرض إلوارات
                </h1>
                <h2 className="text-3xl lg:text-4xl font-light">
                  ELOUARATE Gallery
                </h2>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                  Step into a world where pencil meets perfection. Experience
                  hyperrealistic art in an immersive virtual environment.
                </p>
              </div>

              {/* Gallery Navigation */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
                {artworks.map((artwork, index) => (
                  <Card
                    key={artwork.id}
                    className="bg-white/5 backdrop-blur-sm border-white/20 hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                    onClick={() => setCurrentView(artwork.position)}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="aspect-square bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg mb-4 overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Eye className="h-12 w-12 text-white/60 group-hover:text-white transition-colors" />
                        </div>
                        <div className="absolute bottom-2 left-2 right-2">
                          <div className="text-xs text-white/80 truncate">
                            {artwork.title}
                          </div>
                        </div>
                      </div>
                      <h4 className="font-semibold text-white mb-1">
                        {artwork.title}
                      </h4>
                      <p className="text-gray-400 text-sm">{artwork.year}</p>
                      <p className="text-gray-500 text-xs mt-1">
                        {artwork.position.replace("-", " ").toUpperCase()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Coming Soon Notice */}
              <div className="mt-16 bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <Move3D className="h-8 w-8 text-blue-400" />
                  <h3 className="text-2xl font-bold">
                    Full 3D Experience Coming Soon
                  </h3>
                </div>
                <p className="text-gray-400 mb-4">
                  We're developing a complete 3D virtual reality gallery
                  experience with Three.js
                </p>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>VR Navigation & Movement</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Interactive Artwork Frames</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span>Realistic Gallery Lighting</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    <span>Mobile VR Support</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Individual Artwork Views */}
          {currentView !== "entrance" && (
            <div className="text-center text-white space-y-8 max-w-4xl px-4">
              {(() => {
                const artwork = artworks.find(
                  (a) => a.position === currentView
                );
                return artwork ? (
                  <div className="space-y-6">
                    <Button
                      onClick={() => setCurrentView("entrance")}
                      className="mb-6 bg-white/10 hover:bg-white/20 text-white border border-white/20"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Gallery
                    </Button>

                    <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                      <div className="aspect-[4/3] bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl mb-6 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                        <Eye className="h-24 w-24 text-white/40" />
                        <div className="absolute bottom-4 left-4 right-4 text-left">
                          <div className="text-sm text-white/80">
                            Artwork Preview
                          </div>
                          <div className="text-xs text-white/60">
                            Full image loading in 3D mode
                          </div>
                        </div>
                      </div>

                      <h2 className="text-4xl font-bold mb-2">
                        {artwork.title}
                      </h2>
                      <p className="text-gray-400 text-lg mb-4">
                        {artwork.year} • {artwork.medium}
                      </p>
                      <p className="text-gray-300 leading-relaxed mb-6">
                        {artwork.description}
                      </p>

                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div className="bg-white/5 rounded-lg p-3">
                          <div className="text-gray-400 mb-1">Dimensions</div>
                          <div className="text-white font-semibold">
                            {artwork.size}
                          </div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3">
                          <div className="text-gray-400 mb-1">Medium</div>
                          <div className="text-white font-semibold">
                            {artwork.medium}
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-4 mt-6">
                        <Button
                          onClick={() => setSelectedArtwork(artwork)}
                          className="flex-1 bg-white text-black hover:bg-gray-100"
                        >
                          View Details
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 border-white/30 text-white hover:bg-white/10"
                        >
                          Commission Similar
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : null;
              })()}
            </div>
          )}
        </div>

        {/* Gallery Info Panel */}
        <div className="absolute bottom-4 left-4 z-40">
          <Card className="bg-black/80 backdrop-blur-sm border-white/20">
            <CardContent className="p-4">
              <div className="text-white space-y-2">
                <div className="flex items-center space-x-2">
                  <Eye className="h-5 w-5" />
                  <span className="font-semibold">ELOUARATE Gallery</span>
                </div>
                <div className="text-sm text-gray-400">
                  {artworks.length} Masterpieces • Pencil Art Collection
                </div>
                <div className="text-xs text-gray-500">
                  Virtual gallery experience • 3D mode coming soon
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Artwork Detail Modal */}
      {selectedArtwork && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="bg-white max-w-4xl w-full max-h-[90vh] overflow-auto">
            <CardContent className="p-0">
              <div className="grid lg:grid-cols-2">
                <div className="aspect-square lg:aspect-auto bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <div className="text-center space-y-4 p-8">
                    <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto flex items-center justify-center">
                      <Eye className="h-12 w-12 text-gray-600" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        {selectedArtwork.title}
                      </h3>
                      <p className="text-gray-600">Artwork Preview</p>
                      <p className="text-sm text-gray-500">
                        High-resolution artwork images will be available in the
                        full 3D gallery
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-8 space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900">
                        {selectedArtwork.title}
                      </h2>
                      <p className="text-gray-600">{selectedArtwork.year}</p>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => setSelectedArtwork(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Medium
                      </h3>
                      <p className="text-gray-700">{selectedArtwork.medium}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Dimensions
                      </h3>
                      <p className="text-gray-700">{selectedArtwork.size}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Description
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {selectedArtwork.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <Button className="flex-1 bg-gray-900 hover:bg-gray-800 text-white">
                      Commission Similar
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Download Info
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Ma3rid;
