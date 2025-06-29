"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <div className="mb-6">
        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 shadow-lg">
          <Mail className="h-10 w-10 text-white" />
        </div>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-white mb-1">Reset Password</h1>
      <p className="text-slate-400 mb-8">
        We'll send you instructions to reset your password
      </p>

      {/* Card */}
      <div className="bg-slate-800 rounded-2xl p-8 shadow-xl w-full max-w-md border border-slate-700">
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-slate-300">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-2 rounded-md transition duration-200"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Sending...</span>
                </div>
              ) : (
                "Send Reset Instructions"
              )}
            </Button>
          </form>
        ) : (
          <div className="text-center py-6">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Check Your Email
            </h3>
            <p className="text-slate-400 mb-6">
              We've sent password reset instructions to:
              <br />
              <span className="text-amber-400 font-medium">{email}</span>
            </p>
            <Button
              onClick={() => router.push("/auth/login")}
              className="bg-slate-700 hover:bg-slate-600 text-white"
            >
              Back to Login
            </Button>
          </div>
        )}

        {!isSubmitted && (
          <div className="mt-6 text-center">
            <Link
              href="/auth/login"
              className="inline-flex items-center text-amber-400 hover:text-amber-300 text-sm"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
