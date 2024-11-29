'use client';

import Image from "next/image";

export default function AppBar() {
  const handleMenuClick = () => {
    console.log('Menu clicked !');
  };

  const handleQRScan = () => {
    console.log('QR scan clicked');
  };

  const handleNotifications = () => {
    console.log('Notifications clicked');
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="bg-white/80 backdrop-blur-lg border-b border-neutral-100">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/images/credmate-logo.svg"
              alt="Credmate Logo"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <h1 className="text-lg font-semibold bg-gradient-to-r from-pink-700 to-pink-500 bg-clip-text text-transparent">
              Credmate
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-300 active:scale-95" onClick={handleMenuClick}>
              <Image 
                src="/images/List.svg" 
                alt="Menu"
                width={20}
                height={20}
                className="opacity-70"
              />
            </button>
            <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-300 active:scale-95" onClick={handleQRScan}>
              <Image 
                src="/images/QRcode.svg" 
                alt="QR Code Scanner"
                width={20}
                height={20}
                className="opacity-70"
              />
            </button>
            <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-300 active:scale-95" onClick={handleNotifications}>
              <Image 
                src="/images/Bell.svg" 
                alt="Notifications"
                width={20}
                height={20}
                className="opacity-70"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}