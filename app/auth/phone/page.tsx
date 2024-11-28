"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PhoneInput } from "./components/PhoneInput";
import { OTPVerification } from "./components/OTPVerification";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../../lib/firebase";

export default function PhoneAuthPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<any>(null);

  const setupRecaptcha = () => {
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {},
      });
    }
  };

  const handlePhoneSubmit = async (phone: string) => {
    try {
      setLoading(true);
      setError("");
      
      setupRecaptcha();
      const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
      const confirmation = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        (window as any).recaptchaVerifier
      );
      
      setConfirmationResult(confirmation);
      setPhoneNumber(phone);
      setShowOTP(true);
    } catch (err: any) {
      setError(err.message || "Failed to send OTP");
      console.error("Phone auth error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerification = async (otp: string) => {
    try {
      setLoading(true);
      setError("");
      
      if (!confirmationResult) {
        throw new Error("Please request OTP first");
      }

      const result = await confirmationResult.confirm(otp);
      const user = result.user;
      
      // You can store the user token or data here
      const token = await user.getIdToken();
      localStorage.setItem('authToken', token);
      
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Invalid OTP");
      console.error("OTP verification error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div id="recaptcha-container"></div>
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
