import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Palette,
  BarChart3,
  LogOut,
  UserPlus,
  Users,
  Image,
  Settings,
  Mail,
  MessageSquare,
  ShoppingCart,
  TrendingUp,
  Activity,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Filter,
  Download,
  Upload,
  Menu,
  X,
  Bell,
  User,
  ChevronDown,
  Home,
  FileText,
  Calendar,
  Star,
  Heart,
  DollarSign,
  Package,
  Globe,
} from "lucide-react";
import { useArtworks } from "@/hooks/useArtworks";
import { useCategories } from "@/hooks/useCategories";
import { useNavigate, Link } from "react-router-dom";
import StatisticsDashboard from "@/components/admin/StatisticsDashboard";
import ArtworkManagementSection from "@/components/admin/ArtworkManagementSection";
import CategoryManagementSection from "@/components/admin/CategoryManagementSection";
import UserManagementSection from "@/components/admin/UserManagementSection";
import AdminSettingsSection from "@/components/admin/AdminSettingsSection";
import ConnectionStatus from "@/components/ConnectionStatus";
import ApiTester from "@/components/ApiTester";

const Admin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const { data: artworks = [], isLoading: artworksLoading } =
    useArtworks(searchTerm);
  const { data: categories = [], isLoading: categoriesLoading } =
    useCategories();

  // Debug logging for categories
  console.log("🔍 Admin Page - Categories data:", {
    categories,
    length: categories?.length,
    isLoading: categoriesLoading,
    type: typeof categories,
    isArray: Array.isArray(categories),
    firstCategory: categories?.[0],
  });

  const handleLogout = () => {
    localStorage.removeItem("isAdminAuthenticated");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
  };

  // Mock data for comprehensive dashboard
  const dashboardStats = {
    totalArtworks: artworks.length || 47,
    totalUsers: 1234,
    totalOrders: 89,
    totalRevenue: 15420,
    monthlyGrowth: 12.5,
    pendingInquiries: 23,
    activeCategories: categories.length || 8,
    recentViews: 2847,
  };

  const recentActivities = [
    {
      id: 1,
      action: "New artwork uploaded",
      user: "Artist",
      time: "2 minutes ago",
      type: "artwork",
    },
    {
      id: 2,
      action: "User registered",
      user: "John Doe",
      time: "5 minutes ago",
      type: "user",
    },
    {
      id: 3,
      action: "Order completed",
      user: "Jane Smith",
      time: "15 minutes ago",
      type: "order",
    },
    {
      id: 4,
      action: "Inquiry received",
      user: "Mike Johnson",
      time: "1 hour ago",
      type: "inquiry",
    },
    {
      id: 5,
      action: "Category updated",
      user: "Admin",
      time: "2 hours ago",
      type: "category",
    },
  ];

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3, count: null },
    {
      id: "artworks",
      label: "Artworks",
      icon: Palette,
      count: dashboardStats.totalArtworks,
    },
    {
      id: "categories",
      label: "Categories",
      icon: Package,
      count: dashboardStats.activeCategories,
    },
    {
      id: "users",
      label: "Users",
      icon: Users,
      count: dashboardStats.totalUsers,
    },
    {
      id: "orders",
      label: "Orders",
      icon: ShoppingCart,
      count: dashboardStats.totalOrders,
    },
    {
      id: "inquiries",
      label: "Inquiries",
      icon: MessageSquare,
      count: dashboardStats.pendingInquiries,
    },
    { id: "analytics", label: "Analytics", icon: TrendingUp, count: null },
    { id: "settings", label: "Settings", icon: Settings, count: null },
  ];

  if (artworksLoading || categoriesLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-72" : "w-20"
        } transition-all duration-300 bg-slate-800 border-r border-slate-700 flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-pink-500 via-violet-500 to-cyan-500 rounded-xl">
                  <Palette className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">ELOUARATE</h1>
                  <p className="text-xs text-slate-400">Admin Dashboard</p>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-slate-400 hover:text-white hover:bg-slate-700"
            >
              {sidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                activeTab === item.id
                  ? "bg-gradient-to-r from-pink-500/20 via-violet-500/20 to-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-700"
              }`}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {sidebarOpen && (
                <>
                  <span className="font-medium">{item.label}</span>
                  {item.count !== null && (
                    <Badge
                      variant="secondary"
                      className="ml-auto bg-slate-600 text-slate-200"
                    >
                      {item.count}
                    </Badge>
                  )}
                </>
              )}
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-700">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-violet-500 rounded-full flex items-center justify-center mr-3">
                  <User className="h-4 w-4 text-white" />
                </div>
                {sidebarOpen && (
                  <>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium">Admin User</p>
                      <p className="text-xs text-slate-400">
                        admin@elouarate.art
                      </p>
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-slate-800 border-slate-700"
            >
              <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-700">
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-700">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-700" />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white capitalize">
                {activeTab === "dashboard" ? "Dashboard Overview" : activeTab}
              </h1>
              <p className="text-slate-400 text-sm">
                {activeTab === "dashboard"
                  ? "Welcome back! Here's what's happening with your art gallery."
                  : `Manage your ${activeTab} efficiently`}
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search..."
                  className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-cyan-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="text-slate-400 hover:text-white"
              >
                <Bell className="h-5 w-5" />
              </Button>

              <Link to="/admin/register">
                <Button className="bg-gradient-to-r from-pink-600 via-violet-600 to-cyan-600 hover:from-pink-700 hover:via-violet-700 hover:to-cyan-700">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Admin
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">
          {/* Connection Status - Always visible */}
          <ConnectionStatus className="mb-4" />

          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-400 text-sm font-medium">
                          Total Artworks
                        </p>
                        <p className="text-3xl font-bold text-white">
                          {dashboardStats.totalArtworks}
                        </p>
                      </div>
                      <div className="p-3 bg-pink-500/20 rounded-full">
                        <Palette className="h-6 w-6 text-pink-400" />
                      </div>
                    </div>
                    <div className="flex items-center mt-4 text-sm">
                      <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                      <span className="text-green-400">+12%</span>
                      <span className="text-slate-400 ml-1">
                        from last month
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-400 text-sm font-medium">
                          Total Users
                        </p>
                        <p className="text-3xl font-bold text-white">
                          {dashboardStats.totalUsers.toLocaleString()}
                        </p>
                      </div>
                      <div className="p-3 bg-violet-500/20 rounded-full">
                        <Users className="h-6 w-6 text-violet-400" />
                      </div>
                    </div>
                    <div className="flex items-center mt-4 text-sm">
                      <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                      <span className="text-green-400">+8%</span>
                      <span className="text-slate-400 ml-1">
                        from last month
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-400 text-sm font-medium">
                          Total Orders
                        </p>
                        <p className="text-3xl font-bold text-white">
                          {dashboardStats.totalOrders}
                        </p>
                      </div>
                      <div className="p-3 bg-cyan-500/20 rounded-full">
                        <ShoppingCart className="h-6 w-6 text-cyan-400" />
                      </div>
                    </div>
                    <div className="flex items-center mt-4 text-sm">
                      <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                      <span className="text-green-400">+15%</span>
                      <span className="text-slate-400 ml-1">
                        from last month
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-400 text-sm font-medium">
                          Revenue
                        </p>
                        <p className="text-3xl font-bold text-white">
                          ${dashboardStats.totalRevenue.toLocaleString()}
                        </p>
                      </div>
                      <div className="p-3 bg-emerald-500/20 rounded-full">
                        <DollarSign className="h-6 w-6 text-emerald-400" />
                      </div>
                    </div>
                    <div className="flex items-center mt-4 text-sm">
                      <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                      <span className="text-green-400">
                        +{dashboardStats.monthlyGrowth}%
                      </span>
                      <span className="text-slate-400 ml-1">
                        from last month
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Activity className="h-5 w-5 mr-2" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivities.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-center space-x-3 p-3 bg-slate-700/50 rounded-lg"
                        >
                          <div
                            className={`p-2 rounded-full ${
                              activity.type === "artwork"
                                ? "bg-pink-500/20"
                                : activity.type === "user"
                                ? "bg-violet-500/20"
                                : activity.type === "order"
                                ? "bg-cyan-500/20"
                                : activity.type === "inquiry"
                                ? "bg-amber-500/20"
                                : "bg-slate-500/20"
                            }`}
                          >
                            {activity.type === "artwork" && (
                              <Palette className="h-4 w-4 text-pink-400" />
                            )}
                            {activity.type === "user" && (
                              <Users className="h-4 w-4 text-violet-400" />
                            )}
                            {activity.type === "order" && (
                              <ShoppingCart className="h-4 w-4 text-cyan-400" />
                            )}
                            {activity.type === "inquiry" && (
                              <MessageSquare className="h-4 w-4 text-amber-400" />
                            )}
                            {activity.type === "category" && (
                              <Package className="h-4 w-4 text-slate-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-white text-sm font-medium">
                              {activity.action}
                            </p>
                            <p className="text-slate-400 text-xs">
                              {activity.user} • {activity.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2" />
                      Quick Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Eye className="h-5 w-5 text-blue-400" />
                          <span className="text-white">Page Views</span>
                        </div>
                        <span className="text-white font-semibold">
                          {dashboardStats.recentViews.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <MessageSquare className="h-5 w-5 text-amber-400" />
                          <span className="text-white">Pending Inquiries</span>
                        </div>
                        <Badge variant="destructive">
                          {dashboardStats.pendingInquiries}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Package className="h-5 w-5 text-green-400" />
                          <span className="text-white">Active Categories</span>
                        </div>
                        <span className="text-white font-semibold">
                          {dashboardStats.activeCategories}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Globe className="h-5 w-5 text-purple-400" />
                          <span className="text-white">Website Status</span>
                        </div>
                        <Badge className="bg-green-500/20 text-green-400">
                          Online
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "artworks" && (
            <ArtworkManagementSection
              artworks={artworks}
              categories={categories}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
          )}

          {activeTab === "categories" && (
            <CategoryManagementSection categories={categories} />
          )}

          {activeTab === "users" && <UserManagementSection />}

          {activeTab === "settings" && (
            <div className="space-y-6">
              <AdminSettingsSection />
              <ApiTester />
            </div>
          )}

          {(activeTab === "orders" ||
            activeTab === "inquiries" ||
            activeTab === "analytics") && (
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="p-4 bg-slate-700/50 rounded-full w-fit mx-auto mb-6">
                    <Settings className="h-12 w-12 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2 capitalize">
                    {activeTab} Management
                  </h3>
                  <p className="text-slate-400 mb-6">
                    This section is under development. Advanced {activeTab}{" "}
                    management features will be available soon.
                  </p>
                  <Button className="bg-gradient-to-r from-pink-600 via-violet-600 to-cyan-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New {activeTab.slice(0, -1)}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
};

export default Admin;
