import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

declare global {
  interface Window {
    FB: any;
    fbAsyncInit: () => void;
  }
}

interface FacebookLoginProps {
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
  className?: string;
}

const FacebookLogin: React.FC<FacebookLoginProps> = ({
  onSuccess,
  onError,
  className,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const { toast } = useToast();
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Load Facebook SDK
    if (!window.FB) {
      window.fbAsyncInit = function () {
        window.FB.init({
          appId: process.env.REACT_APP_FACEBOOK_APP_ID || "1234567890123456", // Replace with your Facebook App ID
          cookie: true,
          xfbml: true,
          version: "v18.0",
        });
        setIsSDKLoaded(true);
      };

      // Load SDK script
      const script = document.createElement("script");
      script.id = "facebook-jssdk";
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      script.async = true;
      script.defer = true;
      script.crossOrigin = "anonymous";

      const firstScript = document.getElementsByTagName("script")[0];
      firstScript.parentNode?.insertBefore(script, firstScript);
    } else {
      setIsSDKLoaded(true);
    }
  }, []);

  const handleFacebookLogin = () => {
    if (!window.FB || !isSDKLoaded) {
      toast({
        title: "Error",
        description: "Facebook SDK not loaded. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    window.FB.login(
      (response: any) => {
        if (response.authResponse) {
          // User logged in successfully
          window.FB.api(
            "/me",
            { fields: "name,email,first_name,last_name" },
            async (userResponse: any) => {
              try {
                // Register user with Facebook data
                const userData = {
                  firstName:
                    userResponse.first_name || userResponse.name.split(" ")[0],
                  lastName:
                    userResponse.last_name ||
                    userResponse.name.split(" ").slice(1).join(" "),
                  email: userResponse.email,
                  password: `fb_${userResponse.id}_${Date.now()}`, // Generate a random password for Facebook users
                  facebookId: userResponse.id,
                };

                await register(userData);

                toast({
                  title: "Success",
                  description: "Successfully logged in with Facebook!",
                });

                if (onSuccess) {
                  onSuccess(userResponse);
                }

                navigate("/");
              } catch (error: any) {
                // If registration fails (user exists), try to login
                if (error.message?.includes("already exists")) {
                  toast({
                    title: "Info",
                    description:
                      "Account exists. Please use regular login or contact support.",
                    variant: "default",
                  });
                } else {
                  toast({
                    title: "Error",
                    description:
                      "Failed to authenticate with Facebook. Please try again.",
                    variant: "destructive",
                  });
                }

                if (onError) {
                  onError(error);
                }
              }
              setIsLoading(false);
            }
          );
        } else {
          // User cancelled login
          setIsLoading(false);
          if (onError) {
            onError(new Error("Facebook login cancelled"));
          }
        }
      },
      { scope: "email,public_profile" }
    );
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleFacebookLogin}
      disabled={isLoading || !isSDKLoaded}
      className={`w-full bg-[#1877f2] hover:bg-[#166fe5] text-white border-[#1877f2] hover:border-[#166fe5] transition-all duration-200 ${className}`}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Connecting...</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          <span>Continue with Facebook</span>
        </div>
      )}
    </Button>
  );
};

export default FacebookLogin;
