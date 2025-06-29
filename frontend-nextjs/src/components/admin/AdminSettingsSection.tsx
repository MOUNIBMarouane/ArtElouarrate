import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  Settings,
  Shield,
  Key,
  Eye,
  EyeOff,
  Smartphone,
  QrCode,
  Copy,
  CheckCircle,
  AlertCircle,
  Lock,
  User,
  Mail,
  Clock,
  RefreshCw,
  Save,
  Download,
  Upload,
} from "lucide-react";

interface AdminProfile {
  id: string;
  username: string;
  email: string;
  lastLogin?: string;
  createdAt: string;
  twoFactorEnabled: boolean;
}

const AdminSettingsSection = () => {
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [twoFactorSetup, setTwoFactorSetup] = useState({
    secret: "",
    qrCode: "",
    verificationCode: "",
    isSetupMode: false,
    backupCodes: [] as string[],
  });
  const [twoFactorLoading, setTwoFactorLoading] = useState(false);
  const { toast } = useToast();

  // Mock admin profile for demonstration
  const mockProfile: AdminProfile = {
    id: "admin-1",
    username: "admin",
    email: "admin@elouarate.art",
    lastLogin: "2024-01-15T10:30:00Z",
    createdAt: "2024-01-01T00:00:00Z",
    twoFactorEnabled: false,
  };

  // Fetch admin profile
  const fetchProfile = async () => {
    try {
      setLoading(true);
      // For now, use mock data. Replace with actual API call
      setTimeout(() => {
        setAdminProfile(mockProfile);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast({
        title: "Error",
        description: "Failed to load profile. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  // Change password
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "New password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    try {
      setPasswordLoading(true);

      const response = await fetch(
        "http://localhost:3000/api/auth/admin/change-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        toast({
          title: "Success",
          description:
            data.message ||
            "Password changed successfully. Please login again with your new password.",
        });

        // Optional: Logout user after password change for security
        setTimeout(() => {
          localStorage.removeItem("isAdminAuthenticated");
          localStorage.removeItem("adminToken");
          localStorage.removeItem("adminUser");
          window.location.href = "/admin/login";
        }, 2000);
      } else {
        throw new Error(data.message || "Failed to change password");
      }
    } catch (error: any) {
      console.error("Error changing password:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to change password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  // Setup 2FA
  const initiate2FASetup = async () => {
    try {
      setTwoFactorLoading(true);
      // Mock implementation for now
      setTimeout(() => {
        setTwoFactorSetup({
          ...twoFactorSetup,
          secret: "JBSWY3DPEHPK3PXP",
          qrCode:
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
          isSetupMode: true,
        });
        setTwoFactorLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error setting up 2FA:", error);
      toast({
        title: "Error",
        description: "Failed to setup 2FA. Please try again.",
        variant: "destructive",
      });
      setTwoFactorLoading(false);
    }
  };

  // Verify and enable 2FA
  const verify2FA = async () => {
    try {
      setTwoFactorLoading(true);
      // Mock implementation
      setTimeout(() => {
        setAdminProfile((prev) =>
          prev ? { ...prev, twoFactorEnabled: true } : null
        );
        setTwoFactorSetup({
          ...twoFactorSetup,
          isSetupMode: false,
          backupCodes: [
            "1a2b3c4d",
            "5e6f7g8h",
            "9i0j1k2l",
            "3m4n5o6p",
            "7q8r9s0t",
          ],
          verificationCode: "",
        });
        toast({
          title: "Success",
          description:
            "2FA has been enabled successfully. Save your backup codes!",
        });
        setTwoFactorLoading(false);
      }, 2000);
    } catch (error: any) {
      console.error("Error verifying 2FA:", error);
      toast({
        title: "Error",
        description:
          error.message || "Invalid verification code. Please try again.",
        variant: "destructive",
      });
      setTwoFactorLoading(false);
    }
  };

  // Disable 2FA
  const disable2FA = async () => {
    if (
      !confirm(
        "Are you sure you want to disable 2FA? This will make your account less secure."
      )
    ) {
      return;
    }
    try {
      setTwoFactorLoading(true);
      setTimeout(() => {
        setAdminProfile((prev) =>
          prev ? { ...prev, twoFactorEnabled: false } : null
        );
        setTwoFactorSetup({
          secret: "",
          qrCode: "",
          verificationCode: "",
          isSetupMode: false,
          backupCodes: [],
        });
        toast({
          title: "Success",
          description: "2FA has been disabled.",
        });
        setTwoFactorLoading(false);
      }, 1000);
    } catch (error: any) {
      console.error("Error disabling 2FA:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to disable 2FA. Please try again.",
        variant: "destructive",
      });
      setTwoFactorLoading(false);
    }
  };

  // Utility functions
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Text copied to clipboard",
    });
  };

  const downloadBackupCodes = () => {
    const codes = twoFactorSetup.backupCodes.join("\n");
    const blob = new Blob([codes], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "backup-codes.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Settings className="h-6 w-6 text-purple-600" />
        <h2 className="text-2xl font-bold text-gray-900">Admin Settings</h2>
      </div>
      <p className="text-gray-600">
        Manage your account settings and security preferences
      </p>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger value="2fa" className="flex items-center space-x-2">
            <Smartphone className="h-4 w-4" />
            <span>Two-Factor Auth</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Profile Information</span>
              </CardTitle>
              <CardDescription>
                View and manage your admin profile details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {adminProfile && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Username
                    </Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        value={adminProfile.username}
                        disabled
                        className="bg-gray-50"
                      />
                      <Badge variant="secondary">Admin</Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Email
                    </Label>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <Input
                        value={adminProfile.email}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Last Login
                    </Label>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <Input
                        value={
                          adminProfile.lastLogin
                            ? formatDate(adminProfile.lastLogin)
                            : "Never"
                        }
                        disabled
                        className="bg-gray-50"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Account Created
                    </Label>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <Input
                        value={formatDate(adminProfile.createdAt)}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Change Password</span>
              </CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="currentPassword"
                      type={showPasswords.current ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          currentPassword: e.target.value,
                        })
                      }
                      placeholder="Enter current password"
                      className="pl-10 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() =>
                        setShowPasswords({
                          ...showPasswords,
                          current: !showPasswords.current,
                        })
                      }
                    >
                      {showPasswords.current ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="newPassword"
                      type={showPasswords.new ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                      placeholder="Enter new password"
                      className="pl-10 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() =>
                        setShowPasswords({
                          ...showPasswords,
                          new: !showPasswords.new,
                        })
                      }
                    >
                      {showPasswords.new ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                      placeholder="Confirm new password"
                      className="pl-10 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() =>
                        setShowPasswords({
                          ...showPasswords,
                          confirm: !showPasswords.confirm,
                        })
                      }
                    >
                      {showPasswords.confirm ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={passwordLoading}
                >
                  {passwordLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Changing Password...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Change Password
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 2FA Tab */}
        <TabsContent value="2fa">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Smartphone className="h-5 w-5" />
                <span>Two-Factor Authentication</span>
                {adminProfile?.twoFactorEnabled && (
                  <Badge
                    variant="default"
                    className="bg-green-100 text-green-800"
                  >
                    Enabled
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Add an extra layer of security to your admin account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!adminProfile?.twoFactorEnabled ? (
                <div className="space-y-4">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Two-factor authentication is currently disabled. Enable it
                      to secure your account with an additional verification
                      step.
                    </AlertDescription>
                  </Alert>

                  {!twoFactorSetup.isSetupMode ? (
                    <Button
                      onClick={initiate2FASetup}
                      disabled={twoFactorLoading}
                      className="w-full"
                    >
                      {twoFactorLoading ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Setting up...
                        </>
                      ) : (
                        <>
                          <Shield className="mr-2 h-4 w-4" />
                          Enable Two-Factor Authentication
                        </>
                      )}
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-center space-y-4">
                        <div className="bg-white p-4 rounded-lg border inline-block">
                          <img
                            src={twoFactorSetup.qrCode}
                            alt="QR Code"
                            className="w-48 h-48"
                          />
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600">
                            Scan this QR code with your authenticator app
                          </p>
                          <div className="flex items-center space-x-2">
                            <Input
                              value={twoFactorSetup.secret}
                              readOnly
                              className="font-mono text-sm"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                copyToClipboard(twoFactorSetup.secret)
                              }
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="verificationCode">
                          Enter verification code from your app
                        </Label>
                        <Input
                          id="verificationCode"
                          type="text"
                          value={twoFactorSetup.verificationCode}
                          onChange={(e) =>
                            setTwoFactorSetup({
                              ...twoFactorSetup,
                              verificationCode: e.target.value,
                            })
                          }
                          placeholder="000000"
                          className="text-center text-lg tracking-widest"
                          maxLength={6}
                        />
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          onClick={verify2FA}
                          disabled={
                            twoFactorLoading ||
                            twoFactorSetup.verificationCode.length !== 6
                          }
                          className="flex-1"
                        >
                          {twoFactorLoading ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              Verifying...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Verify & Enable
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() =>
                            setTwoFactorSetup({
                              ...twoFactorSetup,
                              isSetupMode: false,
                              verificationCode: "",
                            })
                          }
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Two-factor authentication is enabled and protecting your
                      account.
                    </AlertDescription>
                  </Alert>

                  {twoFactorSetup.backupCodes.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Backup Codes</CardTitle>
                        <CardDescription>
                          Save these codes in a safe place. You can use them to
                          access your account if you lose your authenticator
                          device.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          {twoFactorSetup.backupCodes.map((code, index) => (
                            <div
                              key={index}
                              className="font-mono text-sm bg-gray-100 p-2 rounded text-center"
                            >
                              {code}
                            </div>
                          ))}
                        </div>
                        <Button
                          variant="outline"
                          onClick={downloadBackupCodes}
                          className="w-full"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download Backup Codes
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  <Button
                    variant="destructive"
                    onClick={disable2FA}
                    disabled={twoFactorLoading}
                    className="w-full"
                  >
                    {twoFactorLoading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Disabling...
                      </>
                    ) : (
                      <>
                        <AlertCircle className="mr-2 h-4 w-4" />
                        Disable Two-Factor Authentication
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettingsSection;
