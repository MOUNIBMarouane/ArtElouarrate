"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  Palette,
  Settings,
  User,
  LogOut,
  ChevronDown,
  ShoppingCart,
  Heart,
  Search,
  Bell,
} from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const { isAuthenticated, user, logout } = useAuth();

  // Handle scroll effect with throttling for better performance
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      logout();
      toast({
        title: "Success",
        description: "Logged out successfully",
      });
      router.push("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      });
    }
  };

  const handleNavigation = (path: string) => {
    router.prefetch(path); // Prefetch for better performance
    router.push(path);
    setIsMenuOpen(false);
  };

  // Navigation items with icons
  const navItems = [
    { name: "Home", path: "/", icon: null },
    { name: "Store", path: "/store", icon: null },
    { name: "Artist Profile", path: "/artist-profile", icon: null },
    { name: "Profile", path: "/profile", icon: User },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
          isScrolled
            ? "bg-slate-900/95 backdrop-blur-xl shadow-2xl border-b border-amber-500/30"
            : "bg-slate-900/80 backdrop-blur-lg"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo with enhanced animation */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="h-12 w-12 relative overflow-hidden rounded-xl bg-gradient-to-br from-amber-500/20 to-purple-600/20 backdrop-blur-sm border border-amber-500/30">
                  <Palette className="h-8 w-8 text-amber-400 absolute top-2 left-2 transform transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent rounded-xl"></div>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full animate-pulse"></div>
              </div>
              <div className="hidden sm:block">
                <div className="text-xl md:text-2xl font-bold bg-gradient-to-r from-amber-200 via-amber-300 to-amber-500 bg-clip-text text-transparent drop-shadow-lg">
                  PRO ART GALLERY
                </div>
                <div className="text-xs text-amber-300/80 tracking-[0.2em] -mt-1 font-medium">
                  PREMIUM COLLECTION
                </div>
              </div>
            </Link>

            {/* Desktop Navigation with enhanced styling */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.path ||
                  (item.path !== "/" && pathname.startsWith(item.path));
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg hover:bg-slate-800/50 ${
                      isActive
                        ? "text-amber-400 bg-slate-800/30"
                        : "text-slate-200 hover:text-amber-300"
                    }`}
                  >
                    <span className="flex items-center space-x-2">
                      {item.icon && <item.icon className="h-4 w-4" />}
                      <span>{item.name}</span>
                    </span>
                    {isActive && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-amber-400 rounded-full"></div>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Action Buttons */}
            <div className="hidden md:flex items-center space-x-2">
              {/* WhatsApp Contact Button */}
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-300 hover:text-green-400 hover:bg-green-500/10 rounded-full transition-all duration-300"
                onClick={() =>
                  window.open(
                    "https://wa.me/212658651060?text=Hello! I'm interested in your artwork.",
                    "_blank"
                  )
                }
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.515z" />
                </svg>
              </Button>

              {/* Search Button */}
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-300 hover:text-amber-400 hover:bg-slate-800/50 rounded-full transition-all duration-300"
                onClick={() => handleNavigation("/store?search=true")}
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Auth Section */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-2 ml-4">
                  {/* Notifications */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-slate-300 hover:text-amber-400 hover:bg-slate-800/50 rounded-full relative"
                  >
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-amber-500 rounded-full animate-pulse"></span>
                  </Button>

                  {/* User Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="flex items-center space-x-3 text-slate-200 hover:text-amber-400 hover:bg-slate-800/50 px-3 py-2 rounded-xl transition-all duration-300"
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {user?.firstName?.charAt(0) || "U"}
                        </div>
                        <span className="font-medium">
                          {user?.firstName || "User"}
                        </span>
                        <ChevronDown className="h-4 w-4 transition-transform duration-300" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="bg-slate-900/95 backdrop-blur-xl border border-amber-500/30 text-slate-200 shadow-2xl rounded-xl w-48"
                    >
                      <div className="px-3 py-2 border-b border-slate-700/50">
                        <p className="font-medium text-amber-400">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs text-slate-400">{user?.email}</p>
                      </div>
                      <DropdownMenuItem
                        onClick={() => handleNavigation("/profile")}
                        className="hover:bg-slate-800/50 hover:text-amber-400 rounded-lg mx-1 my-1"
                      >
                        <User className="mr-3 h-4 w-4" />
                        Profile
                      </DropdownMenuItem>
                      {user?.role === "ADMIN" && (
                        <DropdownMenuItem
                          onClick={() => handleNavigation("/admin/dashboard")}
                          className="hover:bg-slate-800/50 hover:text-amber-400 rounded-lg mx-1 my-1"
                        >
                          <Settings className="mr-3 h-4 w-4" />
                          Admin Dashboard
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator className="bg-slate-700/50" />
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="hover:bg-red-500/20 hover:text-red-400 rounded-lg mx-1 my-1"
                      >
                        <LogOut className="mr-3 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="flex items-center space-x-3 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleNavigation("/auth/login")}
                    className="text-slate-200 hover:text-amber-400 hover:bg-slate-800/50 rounded-lg transition-all duration-300"
                  >
                    Login
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleNavigation("/auth/register")}
                    className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-slate-200 hover:bg-slate-800/50 rounded-lg"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-out ${
            isMenuOpen
              ? "max-h-screen opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="bg-slate-900/95 backdrop-blur-xl border-t border-amber-500/30">
            <nav className="container mx-auto px-4 py-4 space-y-2">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.path ||
                  (item.path !== "/" && pathname.startsWith(item.path));
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                      isActive
                        ? "bg-amber-500/20 text-amber-400 border-l-4 border-amber-500"
                        : "text-slate-200 hover:bg-slate-800/50 hover:text-amber-300"
                    }`}
                  >
                    {item.icon && <item.icon className="h-5 w-5" />}
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}

              {/* Mobile Auth */}
              <div className="pt-4 border-t border-slate-700/50">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <div className="px-4 py-2">
                      <p className="font-medium text-amber-400">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-slate-400">{user?.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-red-500/20 rounded-lg transition-all duration-300"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/auth/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full px-4 py-3 text-center text-slate-200 hover:bg-slate-800/50 rounded-lg transition-all duration-300"
                    >
                      Login
                    </Link>
                    <Link
                      href="/auth/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full px-4 py-3 text-center bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-semibold rounded-lg transition-all duration-300"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Backdrop for mobile menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Header;
