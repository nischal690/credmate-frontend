"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface OTPVerificationProps {
  phoneNumber: string;
  onVerify: (otp: string) => void;
  onBack: () => void;
  loading?: boolean;
}

export function OTPVerification({
  phoneNumber,
  onVerify,
  onBack,
  loading,
}: OTPVerificationProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const setInputRef = useCallback((index: number, el: HTMLInputElement | null) => {
    inputRefs.current[index] = el;
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length === 6) {
      onVerify(otpString);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="otp-container">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => setInputRef(index, el)}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="otp-input"
          />
        ))}
      </div>

      <button
        type="submit"
        disabled={otp.join("").length !== 6 || loading}
        className="auth-button"
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <span className="loading-spinner"></span>
            Verifying...
          </span>
        ) : (
          "Verify"
        )}
      </button>

      <button
        type="button"
        onClick={onBack}
        className="back-button"
      >
        ← Change Phone Number
      </button>
    </form>
  );
}
