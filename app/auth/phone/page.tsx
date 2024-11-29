"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PhoneInput } from "./components/PhoneInput";
import { OTPVerification } from "./components/OTPVerification";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../../lib/firebase";
import { cookies } from 'next/headers';

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
      
      // Get the token and log it
      const token = await user.getIdToken(true); // Force token refresh
      console.log('Firebase Auth Success');
      console.log('User ID:', user.uid);
      console.log('Phone:', user.phoneNumber);
      console.log('Firebase ID Token:', token);
      
      // Store token in localStorage and cookie
      localStorage.setItem('authToken', token);
      document.cookie = `authToken=${token}; path=/`;
      
      // Log the stored values
      console.log('Stored token in localStorage:', localStorage.getItem('authToken'));
      console.log('Current user after auth:', auth.currentUser?.uid);
      
      // Navigate to home page
      window.location.href = '/';
    } catch (err: any) {
      setError(err.message || "Invalid OTP");
      console.error("OTP verification error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div id="recaptcha-container"></div>
      <div className="auth-card">
        <h2 className="auth-title">
          {showOTP ? "Verify OTP" : "Welcome Back"}
        </h2>
        <p className="auth-subtitle">
          {showOTP 
            ? `Please enter the verification code sent to ${phoneNumber}` 
            : "Sign in with your phone number to continue"}
        </p>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4" role="alert">
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
