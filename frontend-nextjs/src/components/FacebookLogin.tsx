"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

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
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Load Facebook SDK
    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s) as HTMLScriptElement;
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode?.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");

    // Initialize Facebook SDK
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: "v18.0",
      });
    };
  }, []);

  const handleFacebookLogin = () => {
    window.FB.login(
      async (response: any) => {
        if (response.authResponse) {
          try {
            // Call your backend API with the access token
            const result = await fetch("/api/auth/facebook", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                accessToken: response.authResponse.accessToken,
              }),
            });

            const data = await result.json();

            if (data.success) {
              toast({
                title: "Success",
                description: "Logged in successfully with Facebook",
              });
              onSuccess?.(data);
              router.push("/profile");
            } else {
              throw new Error(data.message || "Failed to authenticate");
            }
          } catch (error) {
            console.error("Facebook login error:", error);
            toast({
              title: "Error",
              description: "Failed to login with Facebook",
              variant: "destructive",
            });
            onError?.(error);
          }
        } else {
          console.log("User cancelled login or did not fully authorize.");
          toast({
            title: "Info",
            description: "Facebook login was cancelled",
          });
        }
      },
      { scope: "public_profile,email" }
    );
  };

  return (
    <Button
      variant="outline"
      type="button"
      onClick={handleFacebookLogin}
      className={`w-full flex items-center justify-center gap-2 ${className}`}
    >
      <svg
        className="w-5 h-5 fill-[#1877F2]"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
      Continue with Facebook
    </Button>
  );
};

export default FacebookLogin;
