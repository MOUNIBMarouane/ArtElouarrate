"use client";

import { useState } from "react";
import {
  BarChart,
  Users,
  Package,
  FileText,
  Settings,
  AlertCircle,
  RefreshCw,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function AdminDashboard() {
  const [isConnected, setIsConnected] = useState(false);

  const handleRetry = () => {
    // Simulate connection attempt
    setTimeout(() => {
      setIsConnected(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-slate-800 min-h-screen p-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-purple-600 rounded-md flex items-center justify-center">
              <span className="text-white text-xl">🎨</span>
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">ELOUARATE</h2>
              <p className="text-slate-400 text-xs">Admin Dashboard</p>
            </div>
            <button className="ml-auto text-slate-400 hover:text-white">
              <span className="sr-only">Close sidebar</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          <nav className="space-y-1">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-3 px-3 py-2 bg-slate-700 text-white rounded-md"
            >
              <BarChart className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>

            <Link
              href="/admin/artworks"
              className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-slate-700 hover:text-white rounded-md"
            >
              <Package className="w-5 h-5" />
              <span>Artworks</span>
              <span className="ml-auto bg-slate-600 text-xs px-2 py-1 rounded-full">
                47
              </span>
            </Link>

            <Link
              href="/admin/categories"
              className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-slate-700 hover:text-white rounded-md"
            >
              <FileText className="w-5 h-5" />
              <span>Categories</span>
              <span className="ml-auto bg-slate-600 text-xs px-2 py-1 rounded-full">
                8
              </span>
            </Link>

            <Link
              href="/admin/users"
              className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-slate-700 hover:text-white rounded-md"
            >
              <Users className="w-5 h-5" />
              <span>Users</span>
              <span className="ml-auto bg-slate-600 text-xs px-2 py-1 rounded-full">
                1234
              </span>
            </Link>

            <Link
              href="/admin/orders"
              className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-slate-700 hover:text-white rounded-md"
            >
              <Package className="w-5 h-5" />
              <span>Orders</span>
              <span className="ml-auto bg-slate-600 text-xs px-2 py-1 rounded-full">
                89
              </span>
            </Link>

            <Link
              href="/admin/inquiries"
              className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-slate-700 hover:text-white rounded-md"
            >
              <FileText className="w-5 h-5" />
              <span>Inquiries</span>
              <span className="ml-auto bg-slate-600 text-xs px-2 py-1 rounded-full">
                23
              </span>
            </Link>

            <Link
              href="/admin/analytics"
              className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-slate-700 hover:text-white rounded-md"
            >
              <BarChart className="w-5 h-5" />
              <span>Analytics</span>
            </Link>

            <Link
              href="/admin/settings"
              className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-slate-700 hover:text-white rounded-md"
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </Link>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Dashboard Overview
              </h1>
              <p className="text-slate-400">
                Welcome back! Here's what's happening with your art gallery.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-slate-800 text-white rounded-lg px-4 py-2 pl-10 w-64 border border-slate-700 focus:outline-none focus:border-purple-500"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute left-3 top-2.5 text-slate-400"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>

              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <span>Add Admin</span>
              </button>
            </div>
          </div>

          {/* Error Alert */}
          {!isConnected && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-lg mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                <span>
                  Backend Server Error: Unable to connect to server. Please
                  check your connection and try again.
                </span>
              </div>
              <Button
                onClick={handleRetry}
                variant="outline"
                className="border-red-500/30 text-red-400 hover:bg-red-500/20"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          )}

          {/* Server Status */}
          <div className="mb-6">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Server Status:</span>
              <div className="flex items-center gap-2 bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span>Disconnected</span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <Card className="bg-slate-800/30 border-slate-700/50 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-slate-400 mb-1">Total Artworks</h3>
                  <p className="text-4xl font-bold text-white">47</p>
                  <div className="flex items-center gap-1 text-green-500 text-sm mt-2">
                    <ChevronUp className="h-4 w-4" />
                    <span>+12% from last month</span>
                  </div>
                </div>
                <div className="bg-purple-500/20 p-3 rounded-full">
                  <Package className="h-6 w-6 text-purple-500" />
                </div>
              </div>
            </Card>

            <Card className="bg-slate-800/30 border-slate-700/50 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-slate-400 mb-1">Total Users</h3>
                  <p className="text-4xl font-bold text-white">1,234</p>
                  <div className="flex items-center gap-1 text-green-500 text-sm mt-2">
                    <ChevronUp className="h-4 w-4" />
                    <span>+8% from last month</span>
                  </div>
                </div>
                <div className="bg-indigo-500/20 p-3 rounded-full">
                  <Users className="h-6 w-6 text-indigo-500" />
                </div>
              </div>
            </Card>

            <Card className="bg-slate-800/30 border-slate-700/50 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-slate-400 mb-1">Total Orders</h3>
                  <p className="text-4xl font-bold text-white">89</p>
                  <div className="flex items-center gap-1 text-green-500 text-sm mt-2">
                    <ChevronUp className="h-4 w-4" />
                    <span>+15% from last month</span>
                  </div>
                </div>
                <div className="bg-teal-500/20 p-3 rounded-full">
                  <Package className="h-6 w-6 text-teal-500" />
                </div>
              </div>
            </Card>

            <Card className="bg-slate-800/30 border-slate-700/50 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-slate-400 mb-1">Revenue</h3>
                  <p className="text-4xl font-bold text-white">$15,420</p>
                  <div className="flex items-center gap-1 text-green-500 text-sm mt-2">
                    <ChevronUp className="h-4 w-4" />
                    <span>+12.5% from last month</span>
                  </div>
                </div>
                <div className="bg-green-500/20 p-3 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-green-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
              </div>
            </Card>
          </div>

          {/* Activity and Stats Sections */}
          <div className="grid grid-cols-2 gap-6">
            <Card className="bg-slate-800/30 border-slate-700/50 p-6">
              <div className="flex items-center gap-2 mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-slate-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
                <h2 className="text-xl font-bold text-white">
                  Recent Activity
                </h2>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-slate-800/50 rounded-lg">
                  <div className="flex items-start gap-4">
                    <div className="bg-purple-500/20 p-2 rounded-full">
                      <Package className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">
                        New artwork uploaded
                      </h4>
                      <p className="text-slate-400 text-sm">
                        Artist • 2 minutes ago
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-800/50 rounded-lg">
                  <div className="flex items-start gap-4">
                    <div className="bg-indigo-500/20 p-2 rounded-full">
                      <Users className="h-5 w-5 text-indigo-500" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">
                        User registered
                      </h4>
                      <p className="text-slate-400 text-sm">
                        John Doe • 5 minutes ago
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-800/50 rounded-lg">
                  <div className="flex items-start gap-4">
                    <div className="bg-teal-500/20 p-2 rounded-full">
                      <Package className="h-5 w-5 text-teal-500" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">
                        Order completed
                      </h4>
                      <p className="text-slate-400 text-sm">
                        Jane Smith • 15 minutes ago
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-800/50 rounded-lg">
                  <div className="flex items-start gap-4">
                    <div className="bg-amber-500/20 p-2 rounded-full">
                      <FileText className="h-5 w-5 text-amber-500" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">
                        Inquiry received
                      </h4>
                      <p className="text-slate-400 text-sm">
                        Michael Johnson • 25 minutes ago
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-slate-800/30 border-slate-700/50 p-6">
              <div className="flex items-center gap-2 mb-6">
                <BarChart className="h-5 w-5 text-slate-400" />
                <h2 className="text-xl font-bold text-white">Quick Stats</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    <span className="text-white">Page Views</span>
                  </div>
                  <span className="font-bold text-white">2,847</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-amber-400" />
                    <span className="text-white">Pending Inquiries</span>
                  </div>
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    23
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-purple-400" />
                    <span className="text-white">Active Categories</span>
                  </div>
                  <span className="font-bold text-white">8</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="m8 12 2 2 4-4" />
                    </svg>
                    <span className="text-white">Website Status</span>
                  </div>
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    Online
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
