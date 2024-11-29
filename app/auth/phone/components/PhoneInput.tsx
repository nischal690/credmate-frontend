"use client";

import { useState } from "react";

interface PhoneInputProps {
  onSubmit: (phone: string) => void;
  loading?: boolean;
}

export function PhoneInput({ onSubmit, loading }: PhoneInputProps) {
  const [phone, setPhone] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length >= 10) {
      onSubmit(phone);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="phone" className="sr-only">
          Phone Number
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          className="phone-input"
          placeholder="Enter your phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/[^\d+]/g, ""))}
          pattern="[\d+]+"
        />
      </div>

      <button
        type="submit"
        disabled={phone.length < 10 || loading}
        className="auth-button"
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <span className="loading-spinner"></span>
            Processing...
          </span>
        ) : (
          "Continue"
        )}
      </button>
    </form>
  );
}
