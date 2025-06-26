import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Shield,
} from "lucide-react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token");
    }
  }, [token]);

  useEffect(() => {
    const password = formData.newPassword;
    setPasswordStrength({
      hasMinLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  }, [formData.newPassword]);

  const getPasswordStrengthScore = () => {
    return Object.values(passwordStrength).filter(Boolean).length;
  };

  const getPasswordStrengthLabel = () => {
    const score = getPasswordStrengthScore();
    if (score <= 2) return { label: "Weak", color: "text-red-600" };
    if (score <= 3) return { label: "Fair", color: "text-orange-600" };
    if (score <= 4) return { label: "Good", color: "text-blue-600" };
    return { label: "Strong", color: "text-green-600" };
  };

  const isPasswordValid = () => {
    return (
      getPasswordStrengthScore() >= 4 &&
      formData.newPassword === formData.confirmPassword &&
      formData.newPassword.length >= 8
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setError("Invalid reset token");
      return;
    }

    if (!isPasswordValid()) {
      setError(
        "Please ensure your password meets all requirements and passwords match"
      );
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:3000/api/auth/admin/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            newPassword: formData.newPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        console.log("✅ Password reset successful");

        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/admin/login");
        }, 3000);
      } else {
        setError(data.message || "Failed to reset password");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-0">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Password Reset Successful!
              </CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                Your password has been securely updated
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 text-center">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Your admin password has been successfully reset. You can now log
                in with your new password.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Redirecting to login page in 3 seconds...
              </p>

              <Link to="/admin/login">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Continue to Login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-0">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Invalid Reset Link
              </CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                This reset link is invalid or has expired
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="text-center space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                The password reset link is missing or invalid. Please request a
                new one.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Link to="/admin/forgot-password">
                <Button className="w-full">Request New Reset Link</Button>
              </Link>

              <Link to="/admin/login">
                <Button variant="ghost" className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const strengthInfo = getPasswordStrengthLabel();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-purple-600" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Reset Your Password
            </CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              Enter your new secure password
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your new password"
                  value={formData.newPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, newPassword: e.target.value })
                  }
                  required
                  disabled={isLoading}
                  className="h-12 pr-12"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {formData.newPassword && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Password strength:
                    </span>
                    <span
                      className={`text-sm font-medium ${strengthInfo.color}`}
                    >
                      {strengthInfo.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-5 gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`h-2 rounded-full ${
                          i <= getPasswordStrengthScore()
                            ? i <= 2
                              ? "bg-red-500"
                              : i <= 3
                              ? "bg-orange-500"
                              : i <= 4
                              ? "bg-blue-500"
                              : "bg-green-500"
                            : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="space-y-1 text-xs">
                    {[
                      { key: "hasMinLength", label: "At least 8 characters" },
                      { key: "hasUpperCase", label: "One uppercase letter" },
                      { key: "hasLowerCase", label: "One lowercase letter" },
                      { key: "hasNumber", label: "One number" },
                      { key: "hasSpecialChar", label: "One special character" },
                    ].map(({ key, label }) => (
                      <div
                        key={key}
                        className={`flex items-center space-x-2 ${
                          passwordStrength[key as keyof typeof passwordStrength]
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        <div
                          className={`w-3 h-3 rounded-full border ${
                            passwordStrength[
                              key as keyof typeof passwordStrength
                            ]
                              ? "bg-green-500 border-green-500"
                              : "border-gray-300"
                          }`}
                        />
                        <span>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your new password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                  disabled={isLoading}
                  className="h-12 pr-12"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {formData.confirmPassword && (
                <div className="flex items-center space-x-2 text-xs">
                  {formData.newPassword === formData.confirmPassword ? (
                    <div className="flex items-center space-x-1 text-green-600">
                      <CheckCircle className="w-3 h-3" />
                      <span>Passwords match</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1 text-red-600">
                      <AlertCircle className="w-3 h-3" />
                      <span>Passwords don't match</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading || !isPasswordValid()}
              className="w-full h-12 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Resetting...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>Reset Password</span>
                </div>
              )}
            </Button>

            <div className="text-center">
              <Link
                to="/admin/login"
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                <ArrowLeft className="w-4 h-4 inline mr-1" />
                Back to Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
