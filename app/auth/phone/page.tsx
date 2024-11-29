"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../../lib/firebase";
import Image from 'next/image';

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

  const isValidPhoneNumber = phoneNumber.length === 10;

  const handleSendOTP = () => {
    handlePhoneSubmit(phoneNumber);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1 overflow-y-auto">
        <div className="px-6 pt-16 pb-24 bg-gradient-to-br from-white to-pink-50 min-h-full">
          <div className="max-w-md mx-auto pt-12">
            <div className="flex justify-center mb-8">
              <Image
                src="/images/logo 1 (6).svg"
                alt="Credmate Logo"
                width={180}
                height={48}
                className="w-[180px] h-12"
              />
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-8 border border-pink-100">
              <h1 className="text-2xl font-bold text-neutral-800 mb-3 bg-gradient-to-r from-pink-700 to-pink-500 bg-clip-text text-transparent">
                {showOTP ? "Verify OTP" : "Welcome Back"}
              </h1>
              <p className="text-base text-neutral-600 mb-8">
                {showOTP 
                  ? `Please enter the verification code sent to ${phoneNumber}` 
                  : "Enter your phone number to continue"}
              </p>

              <div className="space-y-6">
                {!showOTP ? (
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        id="phone"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Enter your phone number"
                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-pink-500 focus:ring focus:ring-pink-200 transition-all duration-300 text-neutral-800 placeholder-neutral-400"
                        maxLength={10}
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label htmlFor="otp" className="block text-sm font-medium text-neutral-700 mb-2">
                      OTP
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        id="otp"
                        value={''}
                        onChange={(e) => handleOTPVerification(e.target.value)}
                        placeholder="Enter OTP"
                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-pink-500 focus:ring focus:ring-pink-200 transition-all duration-300 text-neutral-800 placeholder-neutral-400"
                        maxLength={6}
                      />
                    </div>
                  </div>
                )}

                {!showOTP ? (
                  <button
                    onClick={handleSendOTP}
                    disabled={!isValidPhoneNumber || loading}
                    className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                      isValidPhoneNumber && !loading
                        ? 'bg-gradient-to-r from-pink-600 to-pink-500 text-white hover:from-pink-700 hover:to-pink-600 active:scale-[0.98] shadow-sm'
                        : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                    }`}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Sending OTP...</span>
                      </div>
                    ) : (
                      'Continue'
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => setShowOTP(false)}
                    className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-300 bg-neutral-100 text-neutral-400 cursor-pointer`}
                  >
                    Back
                  </button>
                )}

                {error && (
                  <div className="p-4 rounded-lg bg-red-50 border border-red-100">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}
              </div>
            </div>

            <p className="mt-8 text-center text-sm text-neutral-500">
              By continuing, you agree to our{' '}
              <a href="#" className="text-pink-600 hover:text-pink-700">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-pink-600 hover:text-pink-700">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
