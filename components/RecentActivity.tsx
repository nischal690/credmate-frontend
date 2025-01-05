'use client';

import React from 'react';
import { FaMoneyBillWave, FaUserEdit, FaChartLine } from 'react-icons/fa';
import { RiHistoryLine } from 'react-icons/ri';

export default function RecentActivity() {
  const activities: any[] = [];

  return (
    <section className="recent-activity-section mt-[-20px]">
      <h2 className="font-['Gilroy-Medium'] font-bold text-lg leading-[135%] tracking-[0.01em] text-[#555555] mb-5 flex items-center">
        Recent Activity
      </h2>
      <div className="activity-list space-y-3">
        {activities.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center border border-gray-100">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                <RiHistoryLine className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700">No Recent Activity</h3>
              <p className="text-sm text-gray-500 max-w-xs">
                Your recent activities and transactions will appear here once you start using our services.
              </p>
            </div>
          </div>
        ) : (
          activities.map((activity) => (
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
                    <h3 className="text-md font-semibold text-gray-800">{activity.title}</h3>
                    {activity.amount && (
                      <span className="text-sm font-medium text-gray-600">{activity.amount}</span>
                    )}
                  </div>
                  <div className="activity-details">
                    {activity.description && (
                      <p className="text-sm text-gray-600">{activity.description}</p>
                    )}
                    {activity.status && (
                      <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
                        {activity.status}
                      </span>
                    )}
                    <p className="text-xs text-gray-500 mt-1">{activity.date}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
