'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NavBar() {
  const pathname = usePathname();

  const isActive = (path: string): boolean => pathname === path;

  return (
    <nav className="navbar">
      <Link href="/" className={`nav-item ${isActive('/') ? 'active' : ''}`}>
        <span
          className="material-icons"
          style={{ color: isActive('/') ? '#A2195E' : 'inherit' }}
        >
          home
        </span>
        <span style={{ color: isActive('/') ? '#A2195E' : 'inherit' }}>Home</span>
      </Link>
      <Link href="/table-rows" className={`nav-item ${isActive('/table-rows') ? 'active' : ''}`}>
        <Image
          src="/images/Loans.svg"
          alt="Table Rows"
          width={24}
          height={24}
          className="w-6 h-6"
          style={{ color: isActive('/table-rows') ? '#A2195E' : 'inherit' }}
        />
        <span style={{ color: isActive('/table-rows') ? '#A2195E' : 'inherit' }}>Table Rows</span>
      </Link>
      <Link href="/history" className={`nav-item ${isActive('/history') ? 'active' : ''}`}>
        <Image
          src="/images/Timeline.svg"
          alt="History"
          width={24}
          height={24}
          className="w-6 h-6"
          style={{ color: isActive('/history') ? '#A2195E' : 'inherit' }}
        />
        <span style={{ color: isActive('/history') ? '#A2195E' : 'inherit' }}>History</span>
      </Link>
      <Link href="/profile" className={`nav-item ${isActive('/profile') ? 'active' : ''}`}>
        <Image
          src="/images/Profile.svg"
          alt="Profile"
          width={24}
          height={24}
          className="w-6 h-6"
          style={{ color: isActive('/profile') ? '#A2195E' : 'inherit' }}
        />
        <span style={{ color: isActive('/profile') ? '#A2195E' : 'inherit' }}>Person</span>
      </Link>
    </nav>
  );
}
