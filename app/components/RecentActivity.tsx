'use client';

import React from 'react';
import { FaMoneyBillWave, FaUserEdit, FaChartLine } from 'react-icons/fa';

export default function RecentActivity() {
  const activities = [
    {
      id: 1,
      type: 'loan_request',
      title: 'Loan Request',
      amount: '₹50,000',
      status: 'Pending',
      date: '2024-03-15',
      icon: <FaMoneyBillWave className="text-blue-500" />
    },
    {
      id: 2,
      type: 'profile_update',
      title: 'Profile Updated',
      description: 'Contact information updated',
      date: '2024-03-14',
      icon: <FaUserEdit className="text-green-500" />
    },
    {
      id: 3,
      type: 'credit_check',
      title: 'Credit Check',
      description: 'Credit score checked',
      date: '2024-03-13',
      icon: <FaChartLine className="text-purple-500" />
    }
  ];

  return (
    <section className="recent-activity-section mt-[-20px]">
      <h2 className="font-['Gilroy-Medium'] font-bold text-lg leading-[135%] tracking-[0.01em] text-[#555555] mb-5 flex items-center">
        Recent Activity
      </h2>
      <div className="activity-list space-y-3">
        {activities.map((activity) => (
          <div 
            key={activity.id} 
            className="activity-item bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4 border border-gray-100"
          >
            <div className="activity-content flex items-start">
              <div className="activity-icon mr-4 p-2 bg-gray-50 rounded-full">
                {activity.icon}
              </div>
              <div className="flex-grow">
                <div className="activity-header flex justify-between items-center mb-2">
                  <span className="activity-title font-semibold text-sm text-gray-800">{activity.title}</span>
                  <span className="activity-date text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                    {new Date(activity.date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short'
                    })}
                  </span>
                </div>
                <div className="activity-details text-sm">
                  {activity.amount && (
                    <span className="activity-amount block text-blue-600 font-medium mb-1">{activity.amount}</span>
                  )}
                  {activity.status && (
                    <span className={`activity-status inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      activity.status.toLowerCase() === 'pending' 
                        ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' 
                        : 'bg-green-50 text-green-700 border border-green-200'
                    }`}>
                      {activity.status}
                    </span>
                  )}
                  {activity.description && (
                    <span className="activity-description block text-gray-600 mt-1 text-xs">{activity.description}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
