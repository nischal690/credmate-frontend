'use client';

import Image from "next/image";
import Link from "next/link";

export default function AppBar() {
  return (
    <div className="app-bar">
      <div className="app-bar-left">
        <button className="icon-button">
          <span className="material-icons">menu</span>
        </button>
      </div>
      <div className="app-bar-right">
        <button className="icon-button">
          <span className="material-icons">qr_code_scanner</span>
        </button>
        <button className="icon-button">
          <span className="material-icons">notifications</span>
        </button>
      </div>
    </div>
  );
}
