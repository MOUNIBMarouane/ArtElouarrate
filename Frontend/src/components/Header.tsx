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
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { isAuthenticated, user, logout } = useAuth();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      logout();

      toast({
        title: "Success",
        description: "Logged out successfully",
      });

      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Error",
        description: "Logout failed, but you've been signed out locally",
        variant: "destructive",
      });
      navigate("/");
    }
  };

  const isActiveLink = (path: string) => location.pathname === path;

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/artwork", label: "Artwork" },
    { path: "/profile", label: "Profile" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-slate-900/95 backdrop-blur-xl shadow-2xl border-b border-slate-700/50"
          : "bg-slate-900/80 backdrop-blur-lg"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="p-3 bg-gradient-to-br from-pink-500 via-violet-500 to-cyan-500 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <Palette className="h-7 w-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full animate-pulse"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent tracking-wide">
                ELOUARATE
              </span>
              <span className="text-xs text-slate-400 font-medium tracking-widest -mt-1">
                ART STUDIO
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-slate-800/50 ${
                  isActiveLink(link.path)
                    ? "text-cyan-400 bg-slate-800/30"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Show Manage Art only for admin users */}
            {isAuthenticated && user?.role === "ADMIN" && (
              <Link
                to="/art-management"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-slate-800/50 ${
                  isActiveLink("/art-management")
                    ? "text-cyan-400 bg-slate-800/30"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                <Settings className="h-4 w-4" />
                <span>Manage Art</span>
              </Link>
            )}
          </nav>

          {/* Desktop Authentication Controls */}
          <div className="hidden lg:flex items-center space-x-4">
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2 text-slate-300 hover:text-white hover:bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 transition-all duration-200"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-violet-500 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-medium">
                      {user.firstName} {user.lastName}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-slate-800/95 backdrop-blur-lg border-slate-700/50 text-slate-200"
                >
                  <DropdownMenuItem className="hover:bg-slate-700/50 focus:bg-slate-700/50">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  {user?.role === "ADMIN" && (
                    <>
                      <DropdownMenuSeparator className="bg-slate-700/50" />
                      <Link to="/admin">
                        <DropdownMenuItem className="hover:bg-slate-700/50 focus:bg-slate-700/50 text-cyan-400">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Admin Dashboard</span>
                        </DropdownMenuItem>
                      </Link>
                      <Link to="/art-management">
                        <DropdownMenuItem className="hover:bg-slate-700/50 focus:bg-slate-700/50 text-cyan-400">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Manage Art</span>
                        </DropdownMenuItem>
                      </Link>
                    </>
                  )}
                  <DropdownMenuSeparator className="bg-slate-700/50" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="hover:bg-slate-700/50 focus:bg-slate-700/50 text-red-400 hover:text-red-300"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button
                    variant="ghost"
                    className="text-slate-300 hover:text-white hover:bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 transition-all duration-200"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-gradient-to-r from-pink-600 via-violet-600 to-cyan-600 hover:from-pink-700 hover:via-violet-700 hover:to-cyan-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-300 hover:text-white hover:bg-slate-800/50"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-6 border-t border-slate-700/50 bg-slate-900/95 backdrop-blur-xl">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                    isActiveLink(link.path)
                      ? "text-cyan-400 bg-slate-800/30"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {/* Show Manage Art only for admin users in mobile */}
              {isAuthenticated && user?.role === "ADMIN" && (
                <Link
                  to="/art-management"
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                    isActiveLink("/art-management")
                      ? "text-cyan-400 bg-slate-800/30"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Settings className="h-5 w-5" />
                  <span>Manage Art</span>
                </Link>
              )}

              {/* Mobile Authentication Controls */}
              <div className="pt-6 border-t border-slate-700/50 space-y-3">
                {isAuthenticated && user ? (
                  <>
                    <div className="flex items-center space-x-3 px-4 py-3 text-slate-300 bg-slate-800/30 rounded-lg">
                      <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-violet-500 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-slate-400">{user.email}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={handleLogout}
                      className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <LogOut className="mr-2 h-5 w-5" />
                      Log out
                    </Button>
                  </>
                ) : (
                  <div className="space-y-3">
                    <Link
                      to="/login"
                      className="block"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800/50"
                      >
                        Sign In
                      </Button>
                    </Link>
                    <Link
                      to="/register"
                      className="block"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Button className="w-full bg-gradient-to-r from-pink-600 via-violet-600 to-cyan-600 hover:from-pink-700 hover:via-violet-700 hover:to-cyan-700 text-white font-medium">
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
