'use client';

import React from 'react';

export default function RecentActivity() {
  const activities = [
    {
      id: 1,
      type: 'loan_request',
      title: 'Loan Request',
      amount: '₹50,000',
      status: 'Pending',
      date: '2024-03-15'
    },
    {
      id: 2,
      type: 'profile_update',
      title: 'Profile Updated',
      description: 'Contact information updated',
      date: '2024-03-14'
    },
    {
      id: 3,
      type: 'credit_check',
      title: 'Credit Check',
      description: 'Credit score checked',
      date: '2024-03-13'
    }
  ];

  return (
    <section className="recent-activity-section mt-[-20px] px-5">
      <h2 className="font-['Gilroy-Medium'] font-normal text-base leading-[135%] tracking-[0.01em] text-[#555555] mb-4">
        Recent Activity
      </h2>
      <div className="activity-list space-y-1"> {/* Reduced gap between activity cards */}
        {activities.map((activity) => (
          <div key={activity.id} className="activity-item bg-white rounded-lg shadow-sm p-4">
            <div className="activity-content">
              <div className="activity-header flex justify-between items-center mb-2">
                <span className="activity-title font-medium text-sm text-gray-800">{activity.title}</span>
                <span className="activity-date text-xs text-gray-500">
                  {new Date(activity.date).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short'
                  })}
                </span>
              </div>
              <div className="activity-details text-sm">
                {activity.amount && (
                  <span className="activity-amount block text-green-600 font-medium">{activity.amount}</span>
                )}
                {activity.status && (
                  <span className={`activity-status inline-block px-2 py-1 rounded-full text-xs ${
                    activity.status.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {activity.status}
                  </span>
                )}
                {activity.description && (
                  <span className="activity-description block text-gray-600 mt-1">{activity.description}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

