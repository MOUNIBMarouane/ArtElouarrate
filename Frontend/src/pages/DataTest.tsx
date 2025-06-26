import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Database,
  Users,
  Package,
  ShoppingCart,
  MessageCircle,
  Search,
  Activity,
  BarChart3,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
} from "lucide-react";
import api, {
  User,
  Artwork,
  Category,
  Order,
  Customer,
  Inquiry,
  DashboardStats,
  Activity as ActivityType,
} from "@/lib/api";

const DataTest: React.FC = () => {
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [data, setData] = useState<{ [key: string]: any }>({});
  const [error, setError] = useState<{ [key: string]: string }>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any>(null);

  // Generic data fetcher
  const fetchData = async (key: string, fetchFunction: () => Promise<any>) => {
    setLoading((prev) => ({ ...prev, [key]: true }));
    setError((prev) => ({ ...prev, [key]: "" }));

    try {
      const response = await fetchFunction();
      setData((prev) => ({ ...prev, [key]: response.data }));
      console.log(`✅ ${key} data:`, response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError((prev) => ({ ...prev, [key]: errorMessage }));
      console.error(`❌ ${key} error:`, err);
    } finally {
      setLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  // Test database connection
  const testConnection = async () => {
    await fetchData("connection", api.health);
  };

  // Fetch all data types
  const fetchAllUsers = () => fetchData("users", api.users.getAll);
  const fetchAllArtworks = () => fetchData("artworks", api.artworks.getAll);
  const fetchAllCategories = () =>
    fetchData("categories", api.categories.getAll);
  const fetchAllOrders = () => fetchData("orders", api.orders.getAll);
  const fetchAllCustomers = () => fetchData("customers", api.customers.getAll);
  const fetchAllInquiries = () => fetchData("inquiries", api.inquiries.getAll);
  const fetchDashboardStats = () => fetchData("stats", api.dashboard.getStats);
  const fetchRecentActivity = () =>
    fetchData("activity", api.dashboard.getActivity);

  // Search functionality
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading((prev) => ({ ...prev, search: true }));
    try {
      const response = await api.search(searchQuery);
      setSearchResults(response.data);
      console.log("🔍 Search results:", response);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading((prev) => ({ ...prev, search: false }));
    }
  };

  // Load initial data
  useEffect(() => {
    testConnection();
    fetchDashboardStats();
  }, []);

  const DataSection: React.FC<{
    title: string;
    description: string;
    icon: React.ReactNode;
    dataKey: string;
    onFetch: () => void;
    renderData: (data: any) => React.ReactNode;
  }> = ({ title, description, icon, dataKey, onFetch, renderData }) => (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          {icon}
          {title}
        </CardTitle>
        <CardDescription className="text-slate-300">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={onFetch}
          disabled={loading[dataKey]}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {loading[dataKey] ? (
            <RefreshCw className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Database className="w-4 h-4 mr-2" />
          )}
          Fetch {title}
        </Button>

        {error[dataKey] && (
          <Alert className="border-red-500 bg-red-500/10">
            <XCircle className="h-4 w-4" />
            <AlertDescription className="text-red-400">
              {error[dataKey]}
            </AlertDescription>
          </Alert>
        )}

        {data[dataKey] && (
          <div className="bg-slate-900 rounded-lg p-4 max-h-96 overflow-y-auto">
            {renderData(data[dataKey])}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">
            SQL Server Data Testing
          </h1>
          <p className="text-slate-300 text-lg">
            Comprehensive testing of ELOUARATE ART database APIs
          </p>

          {/* Connection Status */}
          {data.connection && (
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-green-400">
                Database Connected: {data.connection.database}
              </span>
            </div>
          )}
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="data">Data Tables</TabsTrigger>
            <TabsTrigger value="search">Search</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {data.stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-blue-500">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm font-medium">
                          Total Users
                        </p>
                        <p className="text-white text-3xl font-bold">
                          {data.stats.users.total}
                        </p>
                        <p className="text-blue-200 text-xs flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />+
                          {data.stats.users.growth}% growth
                        </p>
                      </div>
                      <Users className="w-8 h-8 text-blue-200" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-600 to-purple-700 border-purple-500">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100 text-sm font-medium">
                          Artworks
                        </p>
                        <p className="text-white text-3xl font-bold">
                          {data.stats.artworks.total}
                        </p>
                        <p className="text-purple-200 text-xs flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />+
                          {data.stats.artworks.growth}% growth
                        </p>
                      </div>
                      <Package className="w-8 h-8 text-purple-200" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-600 to-green-700 border-green-500">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100 text-sm font-medium">
                          Orders
                        </p>
                        <p className="text-white text-3xl font-bold">
                          {data.stats.orders.total}
                        </p>
                        <p className="text-green-200 text-xs flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />+
                          {data.stats.orders.growth}% growth
                        </p>
                      </div>
                      <ShoppingCart className="w-8 h-8 text-green-200" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-600 to-orange-700 border-orange-500">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-100 text-sm font-medium">
                          Revenue
                        </p>
                        <p className="text-white text-3xl font-bold">
                          ${data.stats.revenue.total.toLocaleString()}
                        </p>
                        <p className="text-orange-200 text-xs">
                          Total earnings
                        </p>
                      </div>
                      <BarChart3 className="w-8 h-8 text-orange-200" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <Button
              onClick={fetchDashboardStats}
              disabled={loading.stats}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
            >
              {loading.stats ? (
                <RefreshCw className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Refresh Statistics
            </Button>
          </TabsContent>

          {/* Data Tables Tab */}
          <TabsContent value="data" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DataSection
                title="Users"
                description="Registered users from SQL Server database"
                icon={<Users className="w-5 h-5" />}
                dataKey="users"
                onFetch={fetchAllUsers}
                renderData={(users: User[]) => (
                  <div className="space-y-2">
                    <p className="text-slate-300 text-sm">
                      Found {users.length} users
                    </p>
                    {users.slice(0, 5).map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-2 bg-slate-800 rounded"
                      >
                        <div>
                          <p className="text-white font-medium">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-slate-400 text-sm">{user.email}</p>
                        </div>
                        <Badge
                          variant={user.isActive ? "default" : "secondary"}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              />

              <DataSection
                title="Artworks"
                description="Art pieces from SQL Server database"
                icon={<Package className="w-5 h-5" />}
                dataKey="artworks"
                onFetch={fetchAllArtworks}
                renderData={(artworks: Artwork[]) => (
                  <div className="space-y-2">
                    <p className="text-slate-300 text-sm">
                      Found {artworks.length} artworks
                    </p>
                    {artworks.slice(0, 5).map((artwork) => (
                      <div
                        key={artwork.id}
                        className="flex items-center justify-between p-2 bg-slate-800 rounded"
                      >
                        <div>
                          <p className="text-white font-medium">
                            {artwork.name}
                          </p>
                          <p className="text-slate-400 text-sm">
                            {artwork.medium} - {artwork.year}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-green-400 font-bold">
                            ${artwork.price}
                          </p>
                          <Badge
                            variant={
                              artwork.status === "AVAILABLE"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {artwork.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              />

              <DataSection
                title="Categories"
                description="Art categories from SQL Server database"
                icon={<Package className="w-5 h-5" />}
                dataKey="categories"
                onFetch={fetchAllCategories}
                renderData={(categories: Category[]) => (
                  <div className="space-y-2">
                    <p className="text-slate-300 text-sm">
                      Found {categories.length} categories
                    </p>
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className="flex items-center justify-between p-2 bg-slate-800 rounded"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                          <div>
                            <p className="text-white font-medium">
                              {category.name}
                            </p>
                            <p className="text-slate-400 text-sm">
                              {category.description}
                            </p>
                          </div>
                        </div>
                        <Badge>{category.artworkCount} artworks</Badge>
                      </div>
                    ))}
                  </div>
                )}
              />

              <DataSection
                title="Orders"
                description="Customer orders from SQL Server database"
                icon={<ShoppingCart className="w-5 h-5" />}
                dataKey="orders"
                onFetch={fetchAllOrders}
                renderData={(orders: Order[]) => (
                  <div className="space-y-2">
                    <p className="text-slate-300 text-sm">
                      Found {orders.length} orders
                    </p>
                    {orders.slice(0, 5).map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-2 bg-slate-800 rounded"
                      >
                        <div>
                          <p className="text-white font-medium">
                            #{order.orderNumber}
                          </p>
                          <p className="text-slate-400 text-sm">
                            {order.customer?.firstName}{" "}
                            {order.customer?.lastName}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-green-400 font-bold">
                            ${order.totalAmount}
                          </p>
                          <Badge
                            variant={
                              order.status === "COMPLETED"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              />

              <DataSection
                title="Customers"
                description="Customer data from SQL Server database"
                icon={<Users className="w-5 h-5" />}
                dataKey="customers"
                onFetch={fetchAllCustomers}
                renderData={(customers: Customer[]) => (
                  <div className="space-y-2">
                    <p className="text-slate-300 text-sm">
                      Found {customers.length} customers
                    </p>
                    {customers.slice(0, 5).map((customer) => (
                      <div
                        key={customer.id}
                        className="flex items-center justify-between p-2 bg-slate-800 rounded"
                      >
                        <div>
                          <p className="text-white font-medium">
                            {customer.firstName} {customer.lastName}
                          </p>
                          <p className="text-slate-400 text-sm">
                            {customer.email}
                          </p>
                        </div>
                        <Badge>{customer.orderCount} orders</Badge>
                      </div>
                    ))}
                  </div>
                )}
              />

              <DataSection
                title="Inquiries"
                description="Customer inquiries from SQL Server database"
                icon={<MessageCircle className="w-5 h-5" />}
                dataKey="inquiries"
                onFetch={fetchAllInquiries}
                renderData={(inquiries: Inquiry[]) => (
                  <div className="space-y-2">
                    <p className="text-slate-300 text-sm">
                      Found {inquiries.length} inquiries
                    </p>
                    {inquiries.slice(0, 5).map((inquiry) => (
                      <div
                        key={inquiry.id}
                        className="p-2 bg-slate-800 rounded"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-white font-medium">
                            {inquiry.subject}
                          </p>
                          <Badge
                            variant={
                              inquiry.status === "NEW" ? "default" : "secondary"
                            }
                          >
                            {inquiry.status}
                          </Badge>
                        </div>
                        <p className="text-slate-400 text-sm">
                          From: {inquiry.name} ({inquiry.email})
                        </p>
                        <p className="text-slate-300 text-sm mt-1 truncate">
                          {inquiry.message}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              />
            </div>
          </TabsContent>

          {/* Search Tab */}
          <TabsContent value="search" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Search className="w-5 h-5" />
                  Database Search
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Search across artworks, categories, and users in SQL Server
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter search query..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-slate-900 border-slate-600 text-white"
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  />
                  <Button
                    onClick={handleSearch}
                    disabled={loading.search || !searchQuery.trim()}
                    className="bg-gradient-to-r from-cyan-600 to-blue-600"
                  >
                    {loading.search ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                {searchResults && (
                  <div className="space-y-4">
                    {searchResults.artworks &&
                      searchResults.artworks.length > 0 && (
                        <div>
                          <h4 className="text-white font-semibold mb-2">
                            Artworks ({searchResults.artworks.length})
                          </h4>
                          <div className="space-y-2">
                            {searchResults.artworks.map((artwork: Artwork) => (
                              <div
                                key={artwork.id}
                                className="p-3 bg-slate-900 rounded"
                              >
                                <p className="text-white font-medium">
                                  {artwork.name}
                                </p>
                                <p className="text-slate-400 text-sm">
                                  {artwork.description}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge>{artwork.medium}</Badge>
                                  <span className="text-green-400 font-bold">
                                    ${artwork.price}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {searchResults.categories &&
                      searchResults.categories.length > 0 && (
                        <div>
                          <h4 className="text-white font-semibold mb-2">
                            Categories ({searchResults.categories.length})
                          </h4>
                          <div className="space-y-2">
                            {searchResults.categories.map(
                              (category: Category) => (
                                <div
                                  key={category.id}
                                  className="p-3 bg-slate-900 rounded flex items-center gap-2"
                                >
                                  <div
                                    className="w-4 h-4 rounded-full"
                                    style={{ backgroundColor: category.color }}
                                  />
                                  <div>
                                    <p className="text-white font-medium">
                                      {category.name}
                                    </p>
                                    <p className="text-slate-400 text-sm">
                                      {category.description}
                                    </p>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Activity className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Latest activities from SQL Server database
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={fetchRecentActivity}
                  disabled={loading.activity}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {loading.activity ? (
                    <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Activity className="w-4 h-4 mr-2" />
                  )}
                  Load Recent Activity
                </Button>

                {data.activity && (
                  <div className="space-y-3">
                    {data.activity.map(
                      (activity: ActivityType, index: number) => (
                        <div
                          key={activity.id}
                          className="flex items-start gap-3 p-3 bg-slate-900 rounded"
                        >
                          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            {activity.type === "user_registered" && (
                              <Users className="w-4 h-4 text-white" />
                            )}
                            {activity.type === "order_created" && (
                              <ShoppingCart className="w-4 h-4 text-white" />
                            )}
                            {activity.type === "inquiry_received" && (
                              <MessageCircle className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-white font-medium">
                              {activity.title}
                            </p>
                            <p className="text-slate-400 text-sm">
                              {activity.description}
                            </p>
                            <p className="text-slate-500 text-xs flex items-center gap-1 mt-1">
                              <Clock className="w-3 h-3" />
                              {new Date(activity.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DataTest;
