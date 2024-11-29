'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NavBar() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="bg-white/80 backdrop-blur-lg border-t border-neutral-100">
        <div className="max-w-md mx-auto px-6 h-20">
          <div className="flex justify-between items-center h-full">
            <Link href="/" className={`flex flex-col items-center gap-1 transition-all duration-300 ${pathname === '/' ? 'text-pink-600 scale-105' : 'text-neutral-400 hover:text-pink-600'}`}>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-50 to-white flex items-center justify-center shadow-sm">
                <Image
                  src="/images/Home.svg"
                  alt="Home"
                  width={24}
                  height={24}
                  className={pathname === '/' ? 'opacity-100' : 'opacity-70'}
                />
              </div>
              <span className="text-xs font-medium">Home</span>
            </Link>

            <Link href="/table-rows" className={`flex flex-col items-center gap-1 transition-all duration-300 ${pathname === '/table-rows' ? 'text-pink-600 scale-105' : 'text-neutral-400 hover:text-pink-600'}`}>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-50 to-white flex items-center justify-center shadow-sm">
                <Image
                  src="/images/Loans.svg"
                  alt="Loans"
                  width={24}
                  height={24}
                  className={pathname === '/table-rows' ? 'opacity-100' : 'opacity-70'}
                />
              </div>
              <span className="text-xs font-medium">Loans</span>
            </Link>

            <Link href="/history" className={`flex flex-col items-center gap-1 transition-all duration-300 ${pathname === '/history' ? 'text-pink-600 scale-105' : 'text-neutral-400 hover:text-pink-600'}`}>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-50 to-white flex items-center justify-center shadow-sm">
                <Image
                  src="/images/Timeline.svg"
                  alt="History"
                  width={24}
                  height={24}
                  className={pathname === '/history' ? 'opacity-100' : 'opacity-70'}
                />
              </div>
              <span className="text-xs font-medium">History</span>
            </Link>

            <Link href="/profile" className={`flex flex-col items-center gap-1 transition-all duration-300 ${pathname === '/profile' ? 'text-pink-600 scale-105' : 'text-neutral-400 hover:text-pink-600'}`}>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-50 to-white flex items-center justify-center shadow-sm">
                <Image
                  src="/images/Profile.svg"
                  alt="Profile"
                  width={24}
                  height={24}
                  className={pathname === '/profile' ? 'opacity-100' : 'opacity-70'}
                />
              </div>
              <span className="text-xs font-medium">Profile</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
