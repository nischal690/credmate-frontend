'use client'

import Profile from '../components/Profile'
import NavBar from '../components/NavBar'

export default function ProfilePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1 overflow-y-auto">
        <div className="px-6 pt-16 pb-24 bg-gradient-to-br from-white to-pink-50 min-h-full">
          <div className="max-w-md mx-auto">
            <Profile />
          </div>
        </div>
      </main>
      <NavBar />
    </div>
  )
}
