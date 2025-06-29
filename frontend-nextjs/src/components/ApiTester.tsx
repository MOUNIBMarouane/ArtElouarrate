"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Loader2, Wifi, WifiOff } from "lucide-react";

interface TestResult {
  name: string;
  url: string;
  status: "pending" | "success" | "error";
  data?: any;
  error?: string;
  responseTime?: number;
}

export default function ApiTester() {
  const [tests, setTests] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runApiTests = async () => {
    setIsRunning(true);
    setTests([]);

    // Test different possible endpoints
    const testEndpoints = [
      {
        name: "Backend Root",
        url: "https://artelouarrate-production.up.railway.app/",
      },
      {
        name: "API Root",
        url: "https://artelouarrate-production.up.railway.app/api",
      },
      {
        name: "Categories",
        url: "https://artelouarrate-production.up.railway.app/api/categories",
      },
      {
        name: "Categories (no /api)",
        url: "https://artelouarrate-production.up.railway.app/categories",
      },
      {
        name: "Health Check",
        url: "https://artelouarrate-production.up.railway.app/health",
      },
      {
        name: "Health Check (with /api)",
        url: "https://artelouarrate-production.up.railway.app/api/health",
      },
    ];

    for (const endpoint of testEndpoints) {
      const startTime = Date.now();

      setTests((prev) => [
        ...prev,
        {
          name: endpoint.name,
          url: endpoint.url,
          status: "pending",
        },
      ]);

      try {
        const response = await fetch(endpoint.url, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        const responseTime = Date.now() - startTime;

        if (response.ok) {
          const data = await response.json();

          setTests((prev) =>
            prev.map((test) =>
              test.name === endpoint.name
                ? {
                    ...test,
                    status: "success" as const,
                    data: data,
                    responseTime,
                  }
                : test
            )
          );
        } else {
          setTests((prev) =>
            prev.map((test) =>
              test.name === endpoint.name
                ? {
                    ...test,
                    status: "error" as const,
                    error: `HTTP ${response.status}: ${response.statusText}`,
                    responseTime,
                  }
                : test
            )
          );
        }
      } catch (error) {
        const responseTime = Date.now() - startTime;

        setTests((prev) =>
          prev.map((test) =>
            test.name === endpoint.name
              ? {
                  ...test,
                  status: "error" as const,
                  error:
                    error instanceof Error ? error.message : "Network error",
                  responseTime,
                }
              : test
          )
        );
      }
    }

    setIsRunning(false);
  };

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "pending":
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "error":
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: TestResult["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-blue-500/20 text-blue-400">Testing...</Badge>
        );
      case "success":
        return (
          <Badge className="bg-green-500/20 text-green-400">Success</Badge>
        );
      case "error":
        return <Badge className="bg-red-500/20 text-red-400">Failed</Badge>;
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Wifi className="w-5 h-5 text-amber-400" />
          <span>Backend API Endpoint Discovery</span>
        </CardTitle>
        <p className="text-slate-400">
          Testing different endpoint URLs to find what's available on your
          backend
        </p>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <Button
            onClick={runApiTests}
            disabled={isRunning}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white"
          >
            {isRunning ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Testing Endpoints...
              </>
            ) : (
              <>
                <Wifi className="w-4 h-4 mr-2" />
                Discover Available Endpoints
              </>
            )}
          </Button>

          {tests.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-white font-semibold">Test Results:</h3>

              {tests.map((test, index) => (
                <div key={index} className="p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(test.status)}
                      <span className="text-white font-medium">
                        {test.name}
                      </span>
                      {getStatusBadge(test.status)}
                    </div>

                    {test.responseTime && (
                      <span className="text-slate-400 text-sm">
                        {test.responseTime}ms
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-400 mb-2">{test.url}</div>

                  {test.error && (
                    <div className="text-red-400 text-sm">
                      Error: {test.error}
                    </div>
                  )}

                  {test.data && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-slate-300 hover:text-white text-sm">
                        View Response Data
                      </summary>
                      <pre className="mt-2 p-2 bg-slate-900 rounded text-xs text-slate-300 overflow-auto max-h-32">
                        {JSON.stringify(test.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}

              {/* Summary */}
              {tests.length > 0 && !isRunning && (
                <div className="mt-4 p-4 rounded-lg bg-slate-800/50">
                  {tests.some((test) => test.status === "success") ? (
                    <div className="text-green-400">
                      <CheckCircle className="w-5 h-5 inline mr-2" />
                      <span className="font-semibold">
                        Found working endpoints!
                      </span>
                      <div className="text-sm text-slate-300 mt-1">
                        The working endpoints show us what your backend API
                        structure is.
                      </div>
                    </div>
                  ) : (
                    <div className="text-red-400">
                      <WifiOff className="w-5 h-5 inline mr-2" />
                      <span className="font-semibold">
                        No working endpoints found
                      </span>
                      <div className="text-sm text-slate-300 mt-1">
                        Your backend might be using different routes or might
                        not be running.
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
