"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PhoneInput } from "./components/PhoneInput";
import { OTPVerification } from "./components/OTPVerification";


export default function PhoneAuthPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePhoneSubmit = async (phone: string) => {
    try {
      setLoading(true);
      setError("");
      // Send OTP to the phone number
      
      setPhoneNumber(phone);
      setShowOTP(true);
    } catch (err: any) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerification = async (otp: string) => {
    try {
      setLoading(true);
      setError("");
      // Verify OTP
      
      
      // Store the token
    
      
      // Redirect to home or dashboard
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {showOTP ? "Enter OTP" : "Sign in with Phone"}
          </h2>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {!showOTP ? (
          <PhoneInput onSubmit={handlePhoneSubmit} loading={loading} />
        ) : (
          <OTPVerification
            phoneNumber={phoneNumber}
            onVerify={handleOTPVerification}
            loading={loading}
            onBack={() => setShowOTP(false)}
          />
        )}
      </div>
    </div>
  );
}
