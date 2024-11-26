'use client';

import React from 'react';

export default function RecentActivity() {
  // Example activity data
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
    <section className="recent-activity-section">
      <h2 className="section-title">Recent Activity</h2>
      <div className="activity-list">
        {activities.map((activity) => (
          <div key={activity.id} className="activity-item">
            <div className="activity-content">
              <div className="activity-header">
                <span className="activity-title">{activity.title}</span>
                <span className="activity-date">
                  {new Date(activity.date).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short'
                  })}
                </span>
              </div>
              <div className="activity-details">
                {activity.amount && (
                  <span className="activity-amount">{activity.amount}</span>
                )}
                {activity.status && (
                  <span className={`activity-status status-${activity.status.toLowerCase()}`}>
                    {activity.status}
                  </span>
                )}
                {activity.description && (
                  <span className="activity-description">{activity.description}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
