import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, XCircle, Play } from "lucide-react";
import api from "@/lib/api";

interface TestResult {
  name: string;
  endpoint: string;
  status: "pending" | "success" | "error";
  message: string;
  duration?: number;
  data?: any;
}

export const ApiTester: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);

  const tests = [
    {
      name: "Health Check",
      endpoint: "/health",
      test: () => api.health(),
    },
    {
      name: "Get Categories",
      endpoint: "/categories",
      test: () => api.categories.getAll(),
    },
    {
      name: "Get Artworks",
      endpoint: "/artworks",
      test: () => api.artworks.getAll(),
    },
    {
      name: "Dashboard Stats",
      endpoint: "/dashboard/stats",
      test: () => api.dashboard.getStats(),
    },
  ];

  const runTests = async () => {
    setIsRunning(true);
    setResults([]);

    for (const testCase of tests) {
      const startTime = Date.now();

      // Add pending result
      setResults((prev) => [
        ...prev,
        {
          name: testCase.name,
          endpoint: testCase.endpoint,
          status: "pending",
          message: "Testing...",
        },
      ]);

      try {
        const data = await testCase.test();
        const duration = Date.now() - startTime;

        // Update with success
        setResults((prev) =>
          prev.map((result) =>
            result.name === testCase.name
              ? {
                  ...result,
                  status: "success" as const,
                  message: "Test passed successfully",
                  duration,
                  data,
                }
              : result
          )
        );
      } catch (error: any) {
        const duration = Date.now() - startTime;

        // Update with error
        setResults((prev) =>
          prev.map((result) =>
            result.name === testCase.name
              ? {
                  ...result,
                  status: "error" as const,
                  message: error.message || "Test failed",
                  duration,
                }
              : result
          )
        );
      }

      // Small delay between tests
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    setIsRunning(false);
  };

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "pending":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: TestResult["status"]) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Running</Badge>;
      case "success":
        return (
          <Badge variant="success" className="bg-green-100 text-green-800">
            Success
          </Badge>
        );
      case "error":
        return <Badge variant="destructive">Failed</Badge>;
    }
  };

  const successCount = results.filter((r) => r.status === "success").length;
  const errorCount = results.filter((r) => r.status === "error").length;
  const totalTests = tests.length;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="h-5 w-5" />
          API Endpoint Tester
        </CardTitle>
        <CardDescription>
          Test all API endpoints to verify backend connectivity and
          functionality
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Controls */}
        <div className="flex items-center justify-between">
          <Button onClick={runTests} disabled={isRunning} className="gap-2">
            {isRunning ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            {isRunning ? "Running Tests..." : "Run All Tests"}
          </Button>

          {results.length > 0 && (
            <div className="flex gap-2">
              <Badge variant="outline" className="gap-1">
                <CheckCircle className="h-3 w-3 text-green-500" />
                {successCount} passed
              </Badge>
              <Badge variant="outline" className="gap-1">
                <XCircle className="h-3 w-3 text-red-500" />
                {errorCount} failed
              </Badge>
              <Badge variant="outline">
                {results.length}/{totalTests} completed
              </Badge>
            </div>
          )}
        </div>

        {/* Results Summary */}
        {results.length > 0 && (
          <Alert
            className={`${
              successCount === totalTests
                ? "border-green-500 bg-green-50"
                : errorCount > 0
                ? "border-red-500 bg-red-50"
                : "border-blue-500 bg-blue-50"
            }`}
          >
            <AlertDescription>
              {isRunning && (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>
                    Running API tests... ({results.length}/{totalTests})
                  </span>
                </div>
              )}
              {!isRunning && successCount === totalTests && (
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="h-4 w-4" />
                  <span>All tests passed! Backend is fully functional.</span>
                </div>
              )}
              {!isRunning && errorCount > 0 && (
                <div className="flex items-center gap-2 text-red-700">
                  <XCircle className="h-4 w-4" />
                  <span>
                    {errorCount} test{errorCount > 1 ? "s" : ""} failed. Check
                    the backend server status.
                  </span>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Test Results */}
        <div className="space-y-3">
          {results.map((result, index) => (
            <div
              key={result.name}
              className="flex items-center justify-between p-4 border rounded-lg bg-gray-50"
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(result.status)}
                <div>
                  <p className="font-medium">{result.name}</p>
                  <p className="text-sm text-gray-600">
                    {result.endpoint}
                    {result.duration && (
                      <span className="ml-2 text-gray-400">
                        ({result.duration}ms)
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {getStatusBadge(result.status)}
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Results */}
        {results.some((r) => r.status === "error") && (
          <div className="space-y-2">
            <h4 className="font-medium text-red-700">Error Details:</h4>
            {results
              .filter((r) => r.status === "error")
              .map((result) => (
                <div
                  key={result.name}
                  className="p-3 bg-red-50 border border-red-200 rounded"
                >
                  <p className="text-sm font-medium text-red-800">
                    {result.name}
                  </p>
                  <p className="text-sm text-red-600">{result.message}</p>
                  <p className="text-xs text-red-500 mt-1">
                    Endpoint: {result.endpoint}
                  </p>
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApiTester;
