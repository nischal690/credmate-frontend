'use client';

import React from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, AlertCircle, Shield, Clock, CreditCard, Wallet, Activity } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function CreditReport() {
  const router = useRouter();
  const creditData = {
    score: 352,
    maxScore: 1000,
    status: "Fair",
    lastUpdated: "Jan 15, 2024",
    details: [
      {
        title: "Payment History",
        score: 85,
        description: "Your payment history shows consistent on-time payments",
        color: "#32BE39",
        icon: Activity,
        details: [
          { label: "On-time Payments", value: "95%" },
          { label: "Late Payments", value: "2" },
          { label: "Missed Payments", value: "0" }
        ]
      },
      {
        title: "Credit Utilization",
        score: 65,
        description: "You're using 35% of your available credit",
        color: "#A5C52A",
        icon: CreditCard,
        details: [
          { label: "Total Credit", value: "₹5,00,000" },
          { label: "Used Credit", value: "₹1,75,000" },
          { label: "Available Credit", value: "₹3,25,000" }
        ]
      },
      {
        title: "Credit Age",
        score: 45,
        description: "Average age of your credit accounts is 2 years",
        color: "#FFCB1F",
        icon: Clock,
        details: [
          { label: "Oldest Account", value: "4 years" },
          { label: "Newest Account", value: "6 months" },
          { label: "Average Age", value: "2 years" }
        ]
      },
      {
        title: "Total Accounts",
        score: 70,
        description: "You have a good mix of credit accounts",
        color: "#32BE39",
        icon: Wallet,
        details: [
          { label: "Credit Cards", value: "2" },
          { label: "Personal Loans", value: "1" },
          { label: "Other Accounts", value: "1" }
        ]
      }
    ],
    recentChanges: [
      {
        date: "2024-01-15",
        change: "+5",
        description: "Credit card payment recorded",
        impact: "Positive",
        details: "On-time payment of ₹25,000 to HDFC Credit Card"
      },
      {
        date: "2024-01-01",
        change: "-2",
        description: "New credit inquiry",
        impact: "Negative",
        details: "Hard inquiry from ABC Bank for Personal Loan"
      }
    ],
    recommendations: [
      {
        title: "Reduce Credit Utilization",
        description: "Try to keep your credit utilization below 30%",
        impact: "High",
        actionable: true
      },
      {
        title: "Maintain Payment Schedule",
        description: "Continue making payments on time to improve score",
        impact: "Medium",
        actionable: true
      }
    ]
  };

  const getScoreColor = (score: number) => {
    if (score < 300) return 'text-red-500';
    if (score < 500) return 'text-orange-500';
    if (score < 700) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="bg-white/80 backdrop-blur-lg border-b border-neutral-100">
          <div className="max-w-md mx-auto px-4 h-16 flex items-center">
            <button 
              onClick={() => router.back()}
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-300 active:scale-95 mr-4"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-semibold bg-gradient-to-r from-pink-700 to-pink-500 bg-clip-text text-transparent">
              Credit Report
            </h1>
          </div>
        </div>
      </div>

      {/* Scrollable Content Container */}
      <div className="h-screen overflow-y-auto pt-16 pb-6 scroll-smooth">
        {/* Main Content */}
        <div className="max-w-md mx-auto px-4">
          {/* Score Overview Card */}
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden mb-6 transform transition-transform hover:scale-[1.01]">
            {/* Top Gradient Banner */}
            <div className="h-3 bg-gradient-to-r from-pink-500 to-pink-600"></div>
            
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="inline-block p-8 rounded-full bg-gradient-to-br from-pink-50 to-white shadow-inner mb-4">
                  <div className={`text-6xl font-bold ${getScoreColor(creditData.score)}`}>
                    {creditData.score}
                  </div>
                </div>
                <div className="text-gray-500 mb-2">out of {creditData.maxScore}</div>
                <div className="flex items-center justify-center gap-2">
                  <div className="px-4 py-1 rounded-full bg-pink-100 text-pink-600 font-medium">
                    {creditData.status}
                  </div>
                  <div className="text-sm text-gray-500">
                    Updated {creditData.lastUpdated}
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-500">Monthly Change</div>
                  <div className="flex items-center justify-center mt-1 text-green-500">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span className="font-semibold">+15</span>
                  </div>
                </div>
                <div className="text-center border-x border-gray-100">
                  <div className="text-sm font-medium text-gray-500">Percentile</div>
                  <div className="mt-1 font-semibold text-pink-600">65%</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-500">Risk Level</div>
                  <div className="mt-1 font-semibold text-yellow-500">Medium</div>
                </div>
              </div>
            </div>
          </div>

          {/* Credit Factors */}
          <div className="bg-white rounded-3xl shadow-lg p-6 mb-6 transform transition-transform hover:scale-[1.01]">
            <h2 className="text-lg font-semibold mb-6 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-pink-500" />
              Credit Factors
            </h2>
            <div className="space-y-8">
              {creditData.details.map((detail, index) => {
                const Icon = detail.icon;
                return (
                  <div key={index} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Icon className="w-5 h-5 mr-3 text-pink-500" />
                        <div>
                          <span className="font-medium">{detail.title}</span>
                          <p className="text-sm text-gray-500 mt-0.5">{detail.description}</p>
                        </div>
                      </div>
                      <span className="text-lg font-semibold" style={{ color: detail.color }}>
                        {detail.score}%
                      </span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${detail.score}%`,
                          backgroundColor: detail.color
                        }}
                      />
                    </div>

                    {/* Detailed Metrics */}
                    <div className="grid grid-cols-3 gap-4 bg-gray-50 rounded-2xl p-4">
                      {detail.details.map((metric, idx) => (
                        <div key={idx} className="text-center">
                          <div className="text-sm font-medium text-gray-500">{metric.label}</div>
                          <div className="mt-1 font-semibold text-gray-700">{metric.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Changes */}
          <div className="bg-white rounded-3xl shadow-lg p-6 mb-6 transform transition-transform hover:scale-[1.01]">
            <h2 className="text-lg font-semibold mb-6 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-pink-500" />
              Recent Changes
            </h2>
            <div className="space-y-4">
              {creditData.recentChanges.map((change, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {change.impact === 'Positive' ? (
                        <TrendingUp className="w-5 h-5 text-green-500" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-red-500" />
                      )}
                      <div>
                        <div className="font-medium">{change.description}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(change.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>
                    <div className={`text-lg font-semibold ${
                      change.change.startsWith('+') ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {change.change}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 bg-white rounded-xl p-3">
                    {change.details}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-3xl shadow-lg p-6 transform transition-transform hover:scale-[1.01]">
            <h2 className="text-lg font-semibold mb-6 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-pink-500" />
              Recommendations
            </h2>
            <div className="space-y-4">
              {creditData.recommendations.map((rec, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-2xl">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{rec.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{rec.description}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      rec.impact === 'High' ? 'bg-red-100 text-red-600' :
                      rec.impact === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {rec.impact} Impact
                    </div>
                  </div>
                  {rec.actionable && (
                    <button className="mt-3 w-full py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-xl font-medium transition-colors">
                      Take Action
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
