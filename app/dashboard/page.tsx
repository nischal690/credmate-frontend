'use client'

import { AppHeader } from '../components/ui/app-header'
import { useRouter } from 'next/navigation'
import NavBar from '../components/NavBar'
import { useEffect, useState } from 'react'

interface LoanRequest {
  id: string
  status: string
  amount: number
  date: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [requests, setRequests] = useState<LoanRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchRequests = async () => {
      try {
        // Simulated data for now
        const mockData: LoanRequest[] = [
          { id: '1', status: 'Pending', amount: 5000, date: '2024-01-15' },
          { id: '2', status: 'Approved', amount: 10000, date: '2024-01-14' },
          { id: '3', status: 'Rejected', amount: 7500, date: '2024-01-13' },
        ]
        setRequests(mockData)
      } catch (error) {
        console.error('Error fetching requests:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-white to-pink-50">
      <AppHeader 
        title="Dashboard" 
        onBackClick={() => router.back()} 
      />

      <main className="flex-1 pt-16 pb-20 px-4 max-w-md mx-auto w-full">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div
                key={request.id}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Loan ID: {request.id}</p>
                    <p className="font-medium">₹{request.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      request.status === 'Approved' ? 'bg-green-100 text-green-800' :
                      request.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {request.status}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Requested on {new Date(request.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>

      <NavBar />
    </div>
  )
}
