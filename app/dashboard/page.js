"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import DashboardTabs from "@/components/DashboardTabs";
import ListingManagement from "@/components/ListingManagement";
import EnquiryManagement from "@/components/EnquiryManagement";
import ProfileManagement from "@/components/ProfileManagement";
import { BiBuildingHouse } from "react-icons/bi";
import { FaHome, FaEnvelope, FaSpinner } from "react-icons/fa";

export default function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("listings");
  const [stats, setStats] = useState({
    totalListings: 0,
    newEnquiries: 0,
    loading: true
  });

  useEffect(() => {
    if (user) {
      fetchDashboardStats();
    }
  }, [user]);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch user's listings count
      const listingsResponse = await fetch('/api/listings/my-listings', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Fetch new enquiries count (pending status)
      const enquiriesResponse = await fetch('/api/enquiries/my-enquiries', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (listingsResponse.ok && enquiriesResponse.ok) {
        const listingsData = await listingsResponse.json();
        const enquiriesData = await enquiriesResponse.json();
        
        // Count new/pending enquiries
        const newEnquiriesCount = enquiriesData.received?.filter(
          enquiry => enquiry.status === 'pending'
        ).length || 0;
        
        setStats({
          totalListings: listingsData.length || 0,
          newEnquiries: newEnquiriesCount,
          loading: false
        });
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#050b2c] to-[#1a237e] text-white py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-[#ffa509] p-3 rounded-xl">
              <BiBuildingHouse className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
          </div>

          <DashboardTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-[#050b2c] to-[#1a237e] text-white p-6 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="bg-white/10 p-3 rounded-lg">
                  <FaHome className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-medium opacity-90">
                    Your Listings
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    {stats.loading ? (
                      <FaSpinner className="h-4 w-4 animate-spin" />
                    ) : (
                      <span className="text-2xl font-bold">{stats.totalListings}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div 
              className="bg-gradient-to-br from-[#ffa509] to-[#ff9100] text-white p-6 rounded-xl cursor-pointer hover:scale-105 transition-transform duration-300 hover:shadow-xl"
              onClick={() => {
                if (stats.newEnquiries > 0) {
                  setActiveTab("enquiries");
                }
              }}
            >
              <div className="flex items-center gap-4">
                <div className="bg-white/10 p-3 rounded-lg">
                  <FaEnvelope className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-medium opacity-90">
                    New Enquiries
                    {stats.newEnquiries > 0 && (
                      <span className="text-sm opacity-75 block">Click to view</span>
                    )}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    {stats.loading ? (
                      <FaSpinner className="h-4 w-4 animate-spin" />
                    ) : (
                      <span className="text-2xl font-bold">{stats.newEnquiries}</span>
                    )}
                    {!stats.loading && stats.newEnquiries > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                        New
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {activeTab === "listings" ? (
              <ListingManagement />
            ) : activeTab === "enquiries" ? (
              <EnquiryManagement initialFilter={activeTab === "enquiries" && stats.newEnquiries > 0 ? "pending" : null} />
            ) : (
              <ProfileManagement />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
