import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Filter,
  Grid3X3,
  Heart,
  Share2,
  Eye,
  Calendar,
  Palette,
  Star,
  ShoppingCart,
  ShoppingBag,
  Plus,
  Minus,
  X,
  ArrowUpDown,
  SlidersHorizontal,
  Truck,
  Shield,
  CreditCard,
  Package,
  Award,
  Crown,
  Sparkles,
  Flame,
  TrendingUp,
  MapPin,
  Clock,
  Info,
  Zap,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
  Filter as FilterIcon,
  SortAsc,
  Tag,
  Users,
  ThumbsUp,
  MessageCircle,
  Share,
  Bookmark,
  Phone,
} from "lucide-react";
import { useArtworks } from "@/hooks/useArtworks";
import { useCategories } from "@/hooks/useCategories";
import { ArtworkWithCategory } from "@/types/database";
import { cn, getImageUrl } from "@/lib/utils";
import { useSearchParams } from "react-router-dom";
import SEOHead from "@/components/SEO/SEOHead";
import {
  SEO_KEYWORDS,
  generateMetaDescription,
  generatePageTitle,
  generateArtworkStructuredData,
} from "@/utils/seo";

const Artwork = () => {
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArtwork, setSelectedArtwork] =
    useState<ArtworkWithCategory | null>(null);
  const [sortBy, setSortBy] = useState<
    "featured" | "newest" | "price" | "popularity"
  >("featured");
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cart, setCart] = useState<{ id: string; quantity: number }[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);

  const {
    data: artworks,
    isLoading: artworksLoading,
    error: artworksError,
  } = useArtworks(searchTerm);
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  // Handle URL parameters for category filtering
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setSelectedCategory(decodeURIComponent(categoryParam));
    }
  }, [searchParams]);

  // Handle smooth category transitions
  useEffect(() => {
    if (selectedCategory) {
      setIsFiltering(true);
      const timer = setTimeout(() => setIsFiltering(false), 150);
      return () => clearTimeout(timer);
    }
  }, [selectedCategory, searchTerm, sortBy]);

  // Handle ESC key for full-screen modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && fullScreenImage) {
        setFullScreenImage(null);
      }
    };

    if (fullScreenImage) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [fullScreenImage]);

  // Filter and sort artworks
  const filteredArtworks =
    artworks?.filter((artwork) => {
      const matchesCategory =
        selectedCategory === "all" ||
        artwork.category?.name === selectedCategory;
      const matchesSearch =
        artwork.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artwork.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artwork.medium.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPrice =
        artwork.price >= priceRange[0] && artwork.price <= priceRange[1];
      return (
        matchesCategory && matchesSearch && matchesPrice && artwork.isActive
      );
    }) || [];

  const sortedArtworks = [...filteredArtworks].sort((a, b) => {
    switch (sortBy) {
      case "featured":
        return Number(b.isFeatured) - Number(a.isFeatured);
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "price":
        return a.price - b.price;
      case "popularity":
        return b.viewCount - a.viewCount;
      default:
        return 0;
    }
  });

  const toggleWishlist = (artworkId: string) => {
    setWishlist((prev) =>
      prev.includes(artworkId)
        ? prev.filter((id) => id !== artworkId)
        : [...prev, artworkId]
    );
  };

  const addToCart = (artworkId: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === artworkId);
      if (existing) {
        return prev.map((item) =>
          item.id === artworkId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { id: artworkId, quantity: 1 }];
    });
  };

  const removeFromCart = (artworkId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== artworkId));
  };

  const updateCartQuantity = (artworkId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(artworkId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === artworkId ? { ...item, quantity } : item))
    );
  };

  // Convert USD to MAD for display
  const convertToMAD = (usdPrice: number) => Math.round(usdPrice * 10.5);
  const formatMADPrice = (usdPrice: number) => {
    const madPrice = convertToMAD(usdPrice);
    return `${madPrice.toLocaleString()} MAD`;
  };

  const getTotalCartItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalCartPrice = () => {
    return cart.reduce((total, item) => {
      const artwork = artworks?.find((a) => a.id === item.id);
      return total + (artwork ? artwork.price * item.quantity : 0);
    }, 0);
  };

  if (artworksError) {
    return (
      <div className="min-h-screen bg-slate-900">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="text-red-400 text-xl">
            Error loading artworks. Please try again later.
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Helmet>
        <title>
          Premium Moroccan Art Gallery - ELOUARATE ART | Authentic Oil Paintings
          & Artworks
        </title>
        <meta
          name="description"
          content={`Discover ${
            sortedArtworks.length
          }+ premium Moroccan paintings at ELOUARATE ART. Shop authentic oil paintings, custom portraits, and breathtaking landscapes. ${
            selectedCategory !== "all"
              ? `Browse ${selectedCategory} collection.`
              : ""
          } Free worldwide shipping on orders over 2000 MAD.`}
        />
        <meta
          name="keywords"
          content={`moroccan art gallery, ${
            selectedCategory !== "all" ? selectedCategory + " paintings," : ""
          } oil paintings morocco, authentic moroccan art, buy art online morocco, premium paintings, art collection, ${
            searchTerm ? searchTerm + " art," : ""
          } moroccan artists, handmade paintings, cultural art, berber art, islamic art, north african art, art for sale, collectible art, investment art, luxury paintings, artistic masterpieces, traditional moroccan art, contemporary moroccan art, landscape paintings morocco, portrait paintings, abstract art morocco, wall art, home decor art, fine art gallery, art marketplace morocco, art dealer morocco, original artworks, custom art commissions, art prints, canvas art, framed paintings, art gifts, moroccan culture art, heritage paintings, artisan art, handcrafted paintings, exclusive art, boutique art gallery, art connoisseur, art collector, art enthusiast, art lover, art appreciation, art history morocco, art exhibition, art showcase, art display, museum quality art, gallery art, studio art, workshop art, art education, art inspiration, art creativity, art beauty, art elegance, art sophistication, art refinement, art excellence, art quality, art authenticity, art originality, art uniqueness, art rarity, art value, art investment opportunity, art portfolio, art collection building, art market morocco, art business, art commerce, art trade, art sales, art purchase, art acquisition, art ownership, marrakech art, casablanca art, fez art, rabat art, tangier art, atlas mountains art, sahara desert art, medina art, kasbah art, riad art, mosque art, minaret art, zellige art, geometric art, calligraphy art`}
        />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta
          property="og:title"
          content={`Premium Moroccan Art Gallery - ${sortedArtworks.length} Authentic Paintings | ELOUARATE ART`}
        />
        <meta
          property="og:description"
          content={`Discover premium Moroccan paintings at ELOUARATE ART. Shop authentic oil paintings, custom portraits, and breathtaking landscapes. ${
            selectedCategory !== "all"
              ? `Browse ${selectedCategory} collection.`
              : ""
          } Free worldwide shipping.`}
        />
        <meta
          property="og:image"
          content="https://elouarateart.com/gallery-preview.jpg"
        />
        <meta
          property="og:url"
          content={`https://elouarateart.com/artwork${
            selectedCategory !== "all" ? `?category=${selectedCategory}` : ""
          }${
            searchTerm
              ? `${selectedCategory !== "all" ? "&" : "?"}search=${searchTerm}`
              : ""
          }`}
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`Premium Moroccan Art Gallery - ${sortedArtworks.length} Authentic Paintings | ELOUARATE ART`}
        />
        <meta
          name="twitter:description"
          content={`Discover premium Moroccan paintings at ELOUARATE ART. Shop authentic oil paintings, custom portraits, and breathtaking landscapes. ${
            selectedCategory !== "all"
              ? `Browse ${selectedCategory} collection.`
              : ""
          }`}
        />
        <meta
          name="twitter:image"
          content="https://elouarateart.com/gallery-preview.jpg"
        />
        <link
          rel="canonical"
          href={`https://elouarateart.com/artwork${
            selectedCategory !== "all" ? `?category=${selectedCategory}` : ""
          }${
            searchTerm
              ? `${selectedCategory !== "all" ? "&" : "?"}search=${searchTerm}`
              : ""
          }`}
        />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: `ELOUARATE ART Gallery - ${
              selectedCategory !== "all"
                ? selectedCategory
                : "Premium Moroccan Paintings"
            }`,
            description: `Collection of ${sortedArtworks.length} premium Moroccan artworks`,
            numberOfItems: sortedArtworks.length,
            itemListElement: sortedArtworks
              .slice(0, 10)
              .map((artwork, index) => ({
                "@type": "ListItem",
                position: index + 1,
                item: {
                  "@type": "VisualArtwork",
                  "@id": `https://elouarateart.com/artwork/${artwork.id}`,
                  name: artwork.name,
                  description: artwork.description,
                  image: getImageUrl(artwork.image || ""),
                  creator: {
                    "@type": "Person",
                    name: "ELOUARATE Artist",
                  },
                  artMedium: artwork.medium,
                  dateCreated: artwork.year,
                  width: artwork.dimensions?.split("x")[0]?.trim(),
                  height: artwork.dimensions?.split("x")[1]?.trim(),
                  offers: {
                    "@type": "Offer",
                    price: convertToMAD(artwork.price),
                    priceCurrency: "MAD",
                    availability:
                      artwork.status === "AVAILABLE"
                        ? "https://schema.org/InStock"
                        : "https://schema.org/OutOfStock",
                    seller: {
                      "@type": "Organization",
                      name: "ELOUARATE ART",
                    },
                  },
                },
              })),
          })}
        </script>
      </Helmet>
      <Header />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        {/* Subtle Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-amber-500/5" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/3 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-500/3 rounded-full blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4">
          <div className="text-center py-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="relative">
                {/* Professional Golden Title */}
                <h1 className="relative text-6xl md:text-8xl lg:text-9xl font-black leading-none tracking-tight">
                  {/* Subtle background glow */}
                  <span className="absolute inset-0 bg-gradient-to-r from-amber-400/20 via-yellow-300/25 to-amber-400/20 blur-2xl"></span>

                  {/* Main golden text with refined gradients */}
                  <span className="relative bg-gradient-to-br from-amber-200 via-yellow-300 to-amber-400 bg-clip-text text-transparent drop-shadow-lg">
                    Painting Gallery
                  </span>

                  {/* Subtle metallic shine */}
                  <span
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent bg-clip-text text-transparent opacity-60"
                    style={{
                      backgroundSize: "200% 100%",
                      animation: "shimmer 3s ease-in-out infinite",
                    }}
                  ></span>

                  {/* Refined text shadow */}
                  <span className="absolute inset-0 bg-gradient-to-br from-amber-600 via-yellow-500 to-amber-600 bg-clip-text text-transparent blur-sm opacity-40 transform translate-x-1 translate-y-1"></span>
                </h1>

                {/* Subtle Decorative elements */}
                <div className="absolute -top-4 -left-4 w-8 h-8 border-2 border-amber-400/40 rotate-45 animate-spin-slow"></div>
                <div className="absolute -top-2 -right-6 w-6 h-6 bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full animate-bounce delay-500 opacity-60"></div>
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gradient-to-r from-yellow-300 to-amber-400 rotate-45 animate-pulse delay-1000 opacity-50"></div>
              </div>

              {/* Refined underline */}
              <div className="flex justify-center mt-8 mb-4">
                <div className="relative">
                  {/* Main underline */}
                  <div className="h-1 w-32 bg-gradient-to-r from-transparent via-amber-400 to-transparent rounded-full"></div>

                  {/* Subtle glow */}
                  <div className="absolute inset-0 h-1 w-32 bg-gradient-to-r from-transparent via-amber-300 to-transparent rounded-full blur-sm opacity-60"></div>

                  {/* End dots */}
                  <div className="absolute -left-2 -top-1 w-3 h-3 bg-amber-400 rounded-full opacity-70"></div>
                  <div className="absolute -right-2 -top-1 w-3 h-3 bg-amber-400 rounded-full opacity-70"></div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Advanced Filters & Search Section */}
      <section className="sticky top-20 z-40 bg-slate-800/95 backdrop-blur-lg border-b border-slate-700/50 shadow-lg">
        <div className="container mx-auto px-4 py-5">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col xl:flex-row gap-4 items-center justify-between"
          >
            {/* Professional Search Bar */}
            <div className="flex-1 max-w-2xl">
              <div className="relative group">
                <div
                  className={cn(
                    "relative overflow-hidden rounded-lg transition-all duration-300",
                    searchFocused
                      ? "bg-slate-700/80 shadow-md ring-1 ring-amber-500/30"
                      : "bg-slate-700/60 shadow-sm"
                  )}
                >
                  {/* Search Icon */}
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                    <Search
                      className={cn(
                        "h-5 w-5 transition-colors duration-200",
                        searchFocused ? "text-amber-400" : "text-slate-400"
                      )}
                    />
                  </div>

                  {/* Input Field */}
                  <Input
                    placeholder="Search artworks by title, artist, medium..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    className="h-12 pl-12 pr-12 bg-transparent border-0 text-slate-100 placeholder:text-slate-400 focus:ring-0 focus:outline-none"
                  />

                  {/* Clear Button */}
                  {searchTerm && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 rounded-md bg-slate-600/50 hover:bg-slate-600/70 text-slate-300 hover:text-slate-200 transition-all duration-200"
                    >
                      <X className="h-4 w-4" />
                    </motion.button>
                  )}

                  {/* Search suggestions */}
                  {searchFocused && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-slate-800/95 backdrop-blur-lg rounded-lg border border-slate-700/50 shadow-xl p-3"
                    >
                      <div className="flex flex-wrap gap-2">
                        {[
                          "Abstract",
                          "Portrait",
                          "Landscape",
                          "Modern",
                          "Classical",
                          "Oil Painting",
                        ].map((suggestion) => (
                          <button
                            key={suggestion}
                            onClick={() => setSearchTerm(suggestion)}
                            className="px-3 py-1.5 text-sm bg-slate-700/50 hover:bg-slate-700/70 text-slate-300 hover:text-slate-200 rounded-md border border-slate-600/30 hover:border-slate-500/50 transition-all duration-200"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            {/* Professional Filter Controls */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Category Filter */}
              <div className="relative">
                <Select
                  value={selectedCategory}
                  onValueChange={(value) => {
                    setSelectedCategory(value);
                    // Add smooth transition feedback
                    setIsFiltering(true);
                  }}
                >
                  <SelectTrigger className="w-44 h-12 bg-slate-700/60 border-slate-600/50 text-slate-100 rounded-lg hover:bg-slate-700/80 transition-all duration-200 shadow-sm hover:border-amber-400/50 hover:shadow-md">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-amber-400" />
                      <SelectValue placeholder="All Categories" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800/95 backdrop-blur-lg border-slate-700/50 rounded-lg shadow-xl">
                    <SelectItem
                      value="all"
                      className="text-slate-100 hover:bg-slate-700/50"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-amber-400" />
                        All Categories
                      </div>
                    </SelectItem>
                    {categories?.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.name}
                        className="text-slate-100 hover:bg-slate-700/50"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                          {category.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Filter */}
              <div className="relative">
                <Select
                  value={sortBy}
                  onValueChange={(value: any) => {
                    setSortBy(value);
                    // Add smooth transition feedback
                    setIsFiltering(true);
                  }}
                >
                  <SelectTrigger className="w-44 h-12 bg-slate-700/60 border-slate-600/50 text-slate-100 rounded-lg hover:bg-slate-700/80 transition-all duration-200 shadow-sm hover:border-amber-400/50 hover:shadow-md">
                    <div className="flex items-center gap-2">
                      <ArrowUpDown className="h-4 w-4 text-amber-400" />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800/95 backdrop-blur-lg border-slate-700/50 rounded-lg shadow-xl">
                    <SelectItem
                      value="featured"
                      className="text-slate-100 hover:bg-slate-700/50"
                    >
                      <div className="flex items-center gap-2">
                        <Crown className="h-4 w-4 text-amber-400" />
                        Featured First
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="newest"
                      className="text-slate-100 hover:bg-slate-700/50"
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-blue-400" />
                        Newest First
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="price"
                      className="text-slate-100 hover:bg-slate-700/50"
                    >
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-400" />
                        Price: Low to High
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="popularity"
                      className="text-slate-100 hover:bg-slate-700/50"
                    >
                      <div className="flex items-center gap-2">
                        <Flame className="h-4 w-4 text-red-400" />
                        Most Popular
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Advanced Filters Sheet */}
              <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-12 px-4 bg-slate-700/60 border-slate-600/50 text-slate-200 hover:bg-slate-700/80 hover:border-slate-500/60 rounded-lg shadow-sm transition-all duration-200"
                  >
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent className="bg-slate-900/95 backdrop-blur-lg border-slate-700/50 w-80">
                  <SheetHeader>
                    <SheetTitle className="text-slate-100 flex items-center gap-2">
                      <SlidersHorizontal className="h-5 w-5 text-amber-400" />
                      Advanced Filters
                    </SheetTitle>
                    <SheetDescription className="text-slate-400">
                      Refine your search results
                    </SheetDescription>
                  </SheetHeader>
                  <div className="space-y-6 mt-6">
                    {/* Price Range */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-amber-400" />
                        <label className="text-sm font-medium text-slate-200">
                          Price Range (MAD)
                        </label>
                      </div>
                      <div className="px-4 py-4 bg-slate-800/50 rounded-lg border border-slate-700/30">
                        <Slider
                          value={priceRange}
                          onValueChange={setPriceRange}
                          max={50000}
                          min={0}
                          step={500}
                          className="mb-3"
                        />
                        <div className="flex justify-between text-sm text-slate-300">
                          <span className="bg-slate-700/50 px-2 py-1 rounded">
                            {formatMADPrice(priceRange[0])}
                          </span>
                          <span className="bg-slate-700/50 px-2 py-1 rounded">
                            {formatMADPrice(priceRange[1])}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Filters */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-amber-400" />
                        <label className="text-sm font-medium text-slate-200">
                          Quick Filters
                        </label>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { label: "Featured", icon: Crown, color: "amber" },
                          { label: "On Sale", icon: Tag, color: "red" },
                          { label: "Premium", icon: Award, color: "purple" },
                          {
                            label: "Trending",
                            icon: TrendingUp,
                            color: "green",
                          },
                        ].map((filter) => (
                          <button
                            key={filter.label}
                            className="flex items-center gap-2 p-2.5 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg border border-slate-700/30 hover:border-slate-600/50 text-slate-300 hover:text-slate-200 transition-all duration-200"
                          >
                            <filter.icon
                              className={`h-4 w-4 text-${filter.color}-400`}
                            />
                            <span className="text-sm">{filter.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </motion.div>

          {/* Professional Search Results Summary */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="mt-4 flex items-center justify-between border-t border-slate-700/30 pt-4"
          >
            <div className="flex items-center gap-3">
              <div className="text-slate-300">
                {artworksLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                    Loading artworks...
                  </span>
                ) : (
                  <>
                    <span className="font-semibold text-slate-100">
                      {sortedArtworks.length}
                    </span>{" "}
                    <span className="text-slate-400">
                      artwork{sortedArtworks.length !== 1 ? "s" : ""} found
                    </span>
                  </>
                )}
              </div>
              {wishlist.length > 0 && (
                <Badge
                  variant="outline"
                  className="text-red-400 border-red-400/40 bg-red-500/5"
                >
                  <Heart className="w-3 h-3 mr-1 fill-red-400" />
                  {wishlist.length} saved
                </Badge>
              )}
            </div>

            {/* Active Filters Display */}
            <div className="flex items-center gap-2">
              {selectedCategory !== "all" && (
                <Badge
                  variant="outline"
                  className="text-amber-400 border-amber-400/40 bg-amber-500/5 cursor-pointer"
                  onClick={() => setSelectedCategory("all")}
                >
                  {selectedCategory}
                  <X className="w-3 h-3 ml-1" />
                </Badge>
              )}
              {searchTerm && (
                <Badge
                  variant="outline"
                  className="text-blue-400 border-blue-400/40 bg-blue-500/5 cursor-pointer"
                  onClick={() => setSearchTerm("")}
                >
                  "{searchTerm}"
                  <X className="w-3 h-3 ml-1" />
                </Badge>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="container mx-auto px-4 py-12">
        {artworksLoading || categoriesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card
                key={i}
                className="bg-slate-800/50 border-slate-700 overflow-hidden"
              >
                <Skeleton className="aspect-[4/3] w-full bg-slate-700" />
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-3/4 mb-3 bg-slate-700" />
                  <Skeleton className="h-4 w-1/2 mb-3 bg-slate-700" />
                  <Skeleton className="h-8 w-full bg-slate-700" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : sortedArtworks.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-slate-400 mb-6">
              <Search className="h-20 w-20 mx-auto mb-6 text-amber-400/50" />
              <h3 className="text-3xl font-bold mb-4 text-amber-100">
                No artworks found
              </h3>
              <p className="text-lg text-amber-200/70 mb-8">
                Try adjusting your search terms or filters to discover more
                masterpieces
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setPriceRange([0, 50000]);
              }}
              className="border-amber-600/50 text-amber-200 hover:bg-amber-900/20 hover:border-amber-500 h-12 px-8 rounded-xl"
            >
              <X className="h-4 w-4 mr-2" />
              Clear All Filters
            </Button>
          </div>
        ) : (
          <div className="relative">
            {/* Smooth Filtering Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isFiltering ? 1 : 0 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm z-10 rounded-2xl pointer-events-none"
              style={{ display: isFiltering ? "block" : "none" }}
            >
              <div className="flex items-center justify-center h-full min-h-[200px]">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full"
                />
              </div>
            </motion.div>

            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              transition={{
                layout: {
                  type: "spring",
                  stiffness: 400,
                  damping: 40,
                  mass: 1,
                },
              }}
            >
              <AnimatePresence mode="popLayout">
                {sortedArtworks.map((artwork, index) => (
                  <motion.div
                    key={artwork.id}
                    layout
                    layoutId={`artwork-${artwork.id}`}
                    initial={{
                      opacity: 0,
                      scale: 0.8,
                      y: 20,
                      filter: "blur(4px)",
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      y: 0,
                      filter: "blur(0px)",
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.9,
                      y: -10,
                      filter: "blur(2px)",
                      transition: {
                        type: "spring",
                        stiffness: 500,
                        damping: 50,
                        mass: 0.8,
                        duration: 0.2,
                      },
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                      mass: 0.8,
                      layout: {
                        type: "spring",
                        stiffness: 400,
                        damping: 40,
                        mass: 1,
                      },
                    }}
                    whileInView={{
                      opacity: 1,
                      scale: 1,
                      transition: {
                        type: "spring",
                        stiffness: 200,
                        damping: 25,
                        mass: 0.5,
                      },
                    }}
                    viewport={{ once: false, margin: "0px 0px -100px 0px" }}
                    className="group relative overflow-hidden bg-gradient-to-br from-slate-800/60 via-slate-700/40 to-slate-800/60 backdrop-blur-lg rounded-2xl border border-amber-500/30 hover:border-amber-400/60 transition-all duration-700 hover:shadow-xl hover:shadow-amber-500/20 hover:transform hover:scale-[1.02]"
                  >
                    {/* Premium Artwork Card */}
                    <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl">
                      <img
                        src={getImageUrl(artwork.images?.[0]?.url)}
                        alt={artwork.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />

                      {/* Professional Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

                      {/* Premium Glow Effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="absolute inset-0 bg-gradient-to-t from-amber-500/20 via-transparent to-transparent" />
                        <div className="absolute inset-2 border border-amber-400/30 rounded-lg" />
                      </div>

                      {/* Image Count Badge */}
                      {artwork.images && artwork.images.length > 1 && (
                        <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-sm text-amber-100 px-3 py-1.5 rounded-lg text-xs font-medium border border-amber-500/30">
                          <Eye className="w-3 h-3 inline mr-1" />
                          {artwork.images.length} photos
                        </div>
                      )}

                      {/* Status Badges */}
                      <div className="absolute top-3 right-3 flex flex-col gap-2">
                        {artwork.isFeatured && (
                          <div className="bg-gradient-to-r from-amber-500 to-yellow-500 text-amber-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                            <Crown className="w-3 h-3 mr-1 inline" />
                            Featured
                          </div>
                        )}
                        {artwork.status === "SOLD" && (
                          <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                            Sold Out
                          </div>
                        )}
                        {artwork.originalPrice > artwork.price && (
                          <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                            {Math.round(
                              ((artwork.originalPrice - artwork.price) /
                                artwork.originalPrice) *
                                100
                            )}
                            % OFF
                          </div>
                        )}
                      </div>

                      {/* Enhanced Glass Effect Actions */}
                      <div className="absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                        <div className="bg-slate-900/70 backdrop-blur-md border-t border-amber-400/20 p-3">
                          <div className="flex gap-2">
                            {/* Quick View Details */}
                            <Button
                              variant="secondary"
                              size="sm"
                              className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium shadow-lg backdrop-blur-sm border border-white/20 hover:border-white/30 rounded-lg h-9 text-xs transition-all duration-300 hover:scale-105"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedArtwork(artwork);
                              }}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View Details
                            </Button>

                            {/* Full Screen Image */}
                            <Button
                              size="sm"
                              className="flex-1 bg-amber-500/80 hover:bg-amber-500 text-amber-900 font-medium shadow-lg backdrop-blur-sm border border-amber-400/30 hover:border-amber-400/50 rounded-lg h-9 text-xs transition-all duration-300 hover:scale-105"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (artwork.images?.[0]?.url) {
                                  setFullScreenImage(
                                    getImageUrl(artwork.images[0].url)
                                  );
                                }
                              }}
                            >
                              <Maximize2 className="h-3 w-3 mr-1" />
                              Full Screen
                            </Button>

                            {/* Wishlist */}
                            <Button
                              size="sm"
                              variant="secondary"
                              className="h-9 w-9 p-0 bg-slate-800/60 hover:bg-slate-700/80 shadow-lg backdrop-blur-sm border border-slate-600/30 hover:border-red-400/50 rounded-lg transition-all duration-300 hover:scale-105"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleWishlist(artwork.id);
                              }}
                            >
                              <Heart
                                className={cn(
                                  "h-3 w-3 transition-all duration-300",
                                  wishlist.includes(artwork.id)
                                    ? "fill-red-500 text-red-500"
                                    : "text-slate-300 hover:text-red-400"
                                )}
                              />
                            </Button>

                            {/* Share */}
                            <Button
                              size="sm"
                              variant="secondary"
                              className="h-9 w-9 p-0 bg-slate-800/60 hover:bg-slate-700/80 shadow-lg backdrop-blur-sm border border-slate-600/30 hover:border-blue-400/50 rounded-lg transition-all duration-300 hover:scale-105"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Share functionality
                                if (navigator.share) {
                                  navigator.share({
                                    title: artwork.name,
                                    text: `Check out this artwork: ${
                                      artwork.name
                                    } - ${formatMADPrice(artwork.price)}`,
                                    url: window.location.href,
                                  });
                                } else {
                                  // Fallback: copy to clipboard
                                  navigator.clipboard.writeText(
                                    `${artwork.name} - ${formatMADPrice(
                                      artwork.price
                                    )} - ${window.location.href}`
                                  );
                                }
                              }}
                            >
                              <Share2 className="h-3 w-3 text-slate-300 hover:text-blue-400 transition-colors" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Card Content */}
                    <div className="p-5 space-y-4">
                      {/* Category */}
                      {artwork.category && (
                        <div className="flex items-center gap-2">
                          <div
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: artwork.category.color }}
                          />
                          <span
                            className="text-xs font-medium uppercase tracking-wider"
                            style={{ color: artwork.category.color }}
                          >
                            {artwork.category.name}
                          </span>
                        </div>
                      )}

                      {/* Title */}
                      <h3 className="font-bold text-lg text-slate-100 group-hover:text-amber-200 transition-colors leading-tight line-clamp-2">
                        {artwork.name}
                      </h3>

                      {/* Artist & Details */}
                      <div className="flex items-center gap-3 text-sm text-slate-300">
                        <div className="flex items-center gap-1">
                          <Palette className="w-4 h-4 text-amber-400" />
                          <span className="font-medium">{artwork.medium}</span>
                        </div>
                        <div className="h-4 w-px bg-slate-600"></div>
                        <span className="font-medium">{artwork.year}</span>
                      </div>

                      {/* Price */}
                      <div className="space-y-3">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-bold text-amber-400">
                            {formatMADPrice(artwork.price)}
                          </span>
                          {artwork.originalPrice > artwork.price && (
                            <span className="text-base text-slate-400 line-through">
                              {formatMADPrice(artwork.originalPrice)}
                            </span>
                          )}
                          {artwork.originalPrice > artwork.price && (
                            <span className="text-sm font-bold text-green-400 bg-green-500/20 px-2 py-1 rounded-full">
                              Save{" "}
                              {Math.round(
                                ((artwork.originalPrice - artwork.price) /
                                  artwork.originalPrice) *
                                  100
                              )}
                              %
                            </span>
                          )}
                        </div>
                      </div>

                      {/* WhatsApp Contact */}
                      <div className="flex gap-3 pt-2">
                        <Button
                          onClick={() => {
                            const message = `Hi! I'm interested in "${
                              artwork.name
                            }" - ${formatMADPrice(
                              artwork.price
                            )}. Could you please provide more details?`;
                            const whatsappUrl = `https://wa.me/+212658651060?text=${encodeURIComponent(
                              message
                            )}`;
                            window.open(whatsappUrl, "_blank");
                          }}
                          disabled={artwork.status === "SOLD"}
                          className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-amber-900 font-semibold h-10 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Contact WhatsApp
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-10 w-10 p-0 border-slate-600/50 hover:border-amber-400 hover:bg-amber-400/10 rounded-lg"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(artwork.id);
                          }}
                        >
                          <Heart
                            className={cn(
                              "h-4 w-4 transition-all duration-300",
                              wishlist.includes(artwork.id)
                                ? "fill-red-500 text-red-500"
                                : "text-slate-400 hover:text-red-400"
                            )}
                          />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </section>

      {/* Advanced Artwork Details Dialog */}
      {selectedArtwork && (
        <Dialog
          open={!!selectedArtwork}
          onOpenChange={() => setSelectedArtwork(null)}
        >
          <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden bg-slate-900/95 backdrop-blur-lg border border-slate-700/50 shadow-2xl rounded-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              {/* Image Section */}
              <div className="relative">
                <div className="aspect-square overflow-hidden rounded-xl bg-slate-800/50">
                  <img
                    src={getImageUrl(selectedArtwork.images?.[0]?.url)}
                    alt={selectedArtwork.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />

                  {/* Image Overlay Actions */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-all duration-300 flex items-end justify-center p-4">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white"
                        onClick={() => {
                          if (selectedArtwork.images?.[0]?.url) {
                            setFullScreenImage(
                              getImageUrl(selectedArtwork.images[0].url)
                            );
                          }
                        }}
                      >
                        <Maximize2 className="h-4 w-4 mr-1" />
                        Full Screen
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white"
                        onClick={() => {
                          toggleWishlist(selectedArtwork.id);
                        }}
                      >
                        <Heart
                          className={cn(
                            "h-4 w-4 mr-1",
                            wishlist.includes(selectedArtwork.id)
                              ? "fill-red-500 text-red-500"
                              : "text-white"
                          )}
                        />
                        {wishlist.includes(selectedArtwork.id)
                          ? "Saved"
                          : "Save"}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Image Gallery Thumbnails */}
                {selectedArtwork.images &&
                  selectedArtwork.images.length > 1 && (
                    <div className="flex gap-2 mt-4 overflow-x-auto">
                      {selectedArtwork.images.map((image, index) => (
                        <div
                          key={index}
                          className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-slate-800/50 cursor-pointer hover:ring-2 hover:ring-amber-400/50 transition-all"
                        >
                          <img
                            src={getImageUrl(image.url)}
                            alt={`${selectedArtwork.name} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
              </div>

              {/* Details Section */}
              <div className="space-y-6">
                {/* Header */}
                <div className="space-y-2">
                  {/* Category Badge */}
                  {selectedArtwork.category && (
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: selectedArtwork.category.color,
                        }}
                      />
                      <span
                        className="text-sm font-medium uppercase tracking-wider"
                        style={{ color: selectedArtwork.category.color }}
                      >
                        {selectedArtwork.category.name}
                      </span>
                    </div>
                  )}

                  {/* Title */}
                  <h2 className="text-3xl font-bold text-slate-100 leading-tight">
                    {selectedArtwork.name}
                  </h2>

                  {/* Status Badges */}
                  <div className="flex gap-2 flex-wrap">
                    {selectedArtwork.isFeatured && (
                      <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-amber-900">
                        <Crown className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                    {selectedArtwork.status === "SOLD" && (
                      <Badge variant="destructive">Sold Out</Badge>
                    )}
                    {selectedArtwork.originalPrice > selectedArtwork.price && (
                      <Badge className="bg-gradient-to-r from-red-500 to-pink-500">
                        {Math.round(
                          ((selectedArtwork.originalPrice -
                            selectedArtwork.price) /
                            selectedArtwork.originalPrice) *
                            100
                        )}
                        % OFF
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Artwork Details */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center justify-center gap-8 p-4 bg-slate-800/30 rounded-xl border border-slate-700/20">
                    <div className="flex items-center gap-3 text-slate-300">
                      <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center">
                        <Palette className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 uppercase tracking-wider">
                          Medium
                        </span>
                        <p className="text-sm font-medium text-slate-200">
                          {selectedArtwork.medium}
                        </p>
                      </div>
                    </div>

                    <div className="w-px h-12 bg-slate-600/50"></div>

                    <div className="flex items-center gap-3 text-slate-300">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 uppercase tracking-wider">
                          Year
                        </span>
                        <p className="text-sm font-medium text-slate-200">
                          {selectedArtwork.year}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Pricing Section */}
                <div className="space-y-4 p-6 bg-gradient-to-br from-slate-800/50 to-slate-700/30 rounded-2xl border border-slate-600/30 shadow-lg">
                  <div className="text-center space-y-2">
                    <p className="text-xs text-slate-400 uppercase tracking-wider">
                      Price
                    </p>
                    <div className="flex items-baseline justify-center gap-3">
                      <span className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
                        {formatMADPrice(selectedArtwork.price)}
                      </span>
                      {selectedArtwork.originalPrice >
                        selectedArtwork.price && (
                        <span className="text-xl text-slate-400 line-through opacity-60">
                          {formatMADPrice(selectedArtwork.originalPrice)}
                        </span>
                      )}
                    </div>
                    {selectedArtwork.originalPrice > selectedArtwork.price && (
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full border border-green-500/30">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-sm text-green-400 font-medium">
                          Save{" "}
                          {formatMADPrice(
                            selectedArtwork.originalPrice -
                              selectedArtwork.price
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Enhanced Action Buttons */}
                <div className="space-y-4">
                  {/* Primary WhatsApp Contact */}
                  <Button
                    onClick={() => {
                      const message = `Hi! I'm interested in "${
                        selectedArtwork.name
                      }" - ${formatMADPrice(
                        selectedArtwork.price
                      )}. Could you please provide more details about this artwork?`;
                      const whatsappUrl = `https://wa.me/+212658651060?text=${encodeURIComponent(
                        message
                      )}`;
                      window.open(whatsappUrl, "_blank");
                    }}
                    disabled={selectedArtwork.status === "SOLD"}
                    className="w-full h-14 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    <Phone className="h-5 w-5 mr-3" />
                    Contact via WhatsApp
                  </Button>

                  {/* Secondary Actions */}
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      className="h-12 border-slate-600/50 text-slate-300 hover:border-amber-400/50 hover:text-amber-400 hover:bg-amber-400/5 rounded-xl transition-all duration-300"
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: selectedArtwork.name,
                            text: `Check out this artwork: ${selectedArtwork.name}`,
                            url: window.location.href,
                          });
                        } else {
                          navigator.clipboard.writeText(
                            `${selectedArtwork.name} - ${window.location.href}`
                          );
                        }
                      }}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button
                      variant="outline"
                      className="h-12 border-slate-600/50 text-slate-300 hover:border-red-400/50 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all duration-300"
                      onClick={() => toggleWishlist(selectedArtwork.id)}
                    >
                      <Heart
                        className={cn(
                          "h-4 w-4 mr-2",
                          wishlist.includes(selectedArtwork.id)
                            ? "fill-red-500 text-red-500"
                            : ""
                        )}
                      />
                      {wishlist.includes(selectedArtwork.id)
                        ? "Remove"
                        : "Save"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Advanced Full-Screen Image Modal */}
      {fullScreenImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setFullScreenImage(null)}
        >
          {/* Close Button */}
          <Button
            variant="secondary"
            size="sm"
            className="absolute top-4 right-4 z-60 h-12 w-12 rounded-full bg-slate-800/80 hover:bg-slate-700/90 border border-slate-600/50 hover:border-amber-400/50 shadow-xl backdrop-blur-sm transition-all duration-300"
            onClick={() => setFullScreenImage(null)}
          >
            <X className="h-5 w-5 text-slate-200 hover:text-amber-400" />
          </Button>

          {/* Image Container */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative max-w-[95vw] max-h-[95vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={fullScreenImage}
              alt="Full screen artwork"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              style={{ maxHeight: "90vh", maxWidth: "90vw" }}
            />

            {/* Image Controls */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3 bg-slate-900/80 backdrop-blur-md rounded-full px-6 py-3 border border-slate-700/50">
              {/* Download */}
              <Button
                variant="secondary"
                size="sm"
                className="h-10 w-10 rounded-full bg-slate-800/60 hover:bg-slate-700/80 border border-slate-600/30 hover:border-green-400/50 transition-all duration-300 hover:scale-110"
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = fullScreenImage;
                  link.download = "artwork.jpg";
                  link.click();
                }}
              >
                <Download className="h-4 w-4 text-slate-300 hover:text-green-400" />
              </Button>

              {/* Zoom */}
              <Button
                variant="secondary"
                size="sm"
                className="h-10 w-10 rounded-full bg-slate-800/60 hover:bg-slate-700/80 border border-slate-600/30 hover:border-blue-400/50 transition-all duration-300 hover:scale-110"
                onClick={() => {
                  window.open(fullScreenImage, "_blank", "noopener,noreferrer");
                }}
              >
                <ZoomIn className="h-4 w-4 text-slate-300 hover:text-blue-400" />
              </Button>

              {/* Share */}
              <Button
                variant="secondary"
                size="sm"
                className="h-10 w-10 rounded-full bg-slate-800/60 hover:bg-slate-700/80 border border-slate-600/30 hover:border-purple-400/50 transition-all duration-300 hover:scale-110"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: "Beautiful Artwork",
                      text: "Check out this amazing artwork!",
                      url: fullScreenImage,
                    });
                  } else {
                    navigator.clipboard.writeText(fullScreenImage);
                  }
                }}
              >
                <Share2 className="h-4 w-4 text-slate-300 hover:text-purple-400" />
              </Button>
            </div>
          </motion.div>

          {/* Instructions */}
          <div className="absolute bottom-4 left-4 text-slate-400 text-sm bg-slate-900/60 backdrop-blur-sm rounded-lg px-3 py-2 border border-slate-700/30">
            Press{" "}
            <kbd className="bg-slate-800 px-2 py-1 rounded text-xs">ESC</kbd> or
            click outside to close
          </div>
        </motion.div>
      )}

      <Footer />

      {/* Floating WhatsApp Contact */}
      <FloatingWhatsApp />
    </div>
  );
};

export default Artwork;
