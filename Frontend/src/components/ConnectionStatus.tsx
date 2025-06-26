import React, { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle, CheckCircle, RefreshCw } from "lucide-react";
import api from "@/lib/api";

interface ConnectionStatusProps {
  className?: string;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  className = "",
}) => {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [error, setError] = useState<string>("");

  const checkConnection = async () => {
    setIsChecking(true);
    setError("");

    try {
      console.log("🔍 Checking server connection...");
      const healthResponse = await api.health();
      console.log("✅ Server connection successful:", healthResponse);

      setIsOnline(true);
      setLastChecked(new Date());
    } catch (err: any) {
      console.error("❌ Server connection failed:", err);
      setIsOnline(false);
      setError(err.message || "Unable to connect to server");
    } finally {
      setIsChecking(false);
    }
  };

  // Check connection on component mount
  useEffect(() => {
    checkConnection();

    // Set up periodic health checks every 30 seconds
    const interval = setInterval(checkConnection, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = () => {
    if (isChecking) {
      return (
        <Badge variant="secondary" className="gap-2">
          <Loader2 className="h-3 w-3 animate-spin" />
          Checking...
        </Badge>
      );
    }

    if (isOnline === true) {
      return (
        <Badge variant="success" className="gap-2 bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3" />
          Connected
        </Badge>
      );
    }

    if (isOnline === false) {
      return (
        <Badge variant="destructive" className="gap-2">
          <AlertCircle className="h-3 w-3" />
          Disconnected
        </Badge>
      );
    }

    return (
      <Badge variant="outline" className="gap-2">
        <Loader2 className="h-3 w-3 animate-spin" />
        Initializing...
      </Badge>
    );
  };

  const getStatusAlert = () => {
    if (isOnline === false && error) {
      return (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <div>
              <strong>Backend Server Error:</strong> {error}
              {lastChecked && (
                <div className="text-xs mt-1 opacity-75">
                  Last checked: {lastChecked.toLocaleTimeString()}
                </div>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={checkConnection}
              disabled={isChecking}
              className="ml-4"
            >
              {isChecking ? (
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
              ) : (
                <RefreshCw className="h-3 w-3 mr-1" />
              )}
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      );
    }

    return null;
  };

  return (
    <div className={className}>
      {getStatusAlert()}

      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Server Status:</span>
        {getStatusBadge()}

        <Button
          variant="ghost"
          size="sm"
          onClick={checkConnection}
          disabled={isChecking}
          className="h-6 w-6 p-0"
        >
          <RefreshCw
            className={`h-3 w-3 ${isChecking ? "animate-spin" : ""}`}
          />
        </Button>

        {lastChecked && (
          <span className="text-xs text-gray-500">
            {lastChecked.toLocaleTimeString()}
          </span>
        )}
      </div>
    </div>
  );
};

export default ConnectionStatus;
