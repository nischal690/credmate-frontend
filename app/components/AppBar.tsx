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
    <div className="app-bar">
      <div className="app-bar-left">
        <button className="icon-button" onClick={handleMenuClick}>
          <Image 
            src="/images/List.svg" 
            alt="Menu"
            width={24}
            height={24}
          />
        </button>
      </div>
      <div className="app-bar-right">
        <button className="icon-button" onClick={handleQRScan}>
          <Image 
            src="/images/QRcode.svg" 
            alt="QR Code Scanner"
            width={24}
            height={24}
          />
        </button>
        <button className="icon-button" onClick={handleNotifications}>
          <Image 
            src="/images/Bell.svg" 
            alt="Notifications"
            width={24}
            height={24}
          />
        </button>
      </div>
    </div>
  );
}