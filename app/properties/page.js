"use client";

import { useState, useEffect, Suspense } from "react";
import PropertyCard from "@/components/PropertyCard";
import { useRouter, useSearchParams } from "next/navigation";
import { FaHome, FaMapMarkerAlt, FaMoneyBillWave, FaBuilding, FaSearch, FaSort, FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";

const ITEMS_PER_PAGE = 9;
const PROPERTY_TYPES = [
  "House",
  "Apartment",
  "Condo",
  "Townhouse",
  "Land",
  "Commercial",
];

function PropertiesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State for properties and pagination
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  // State for filters
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    propertyType: searchParams.get("propertyType") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    location: searchParams.get("location") || "",
    sortBy: searchParams.get("sortBy") || "createdAt",
    order: searchParams.get("order") || "desc",
  });

  // State for advanced filters dropdown
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Effect to fetch properties when filters or page changes
  useEffect(() => {
    fetchProperties();
  }, [filters, currentPage]);

  const fetchProperties = async () => {
    try {
      setLoading(true);

      // Build query string from filters
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        ...filters,
      });

      // Remove empty filters
      for (let [key, value] of queryParams.entries()) {
        if (!value) queryParams.delete(key);
      }

      const res = await fetch(`/api/properties?${queryParams}`);
      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setProperties(data.properties);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      setError("Error fetching properties");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProperties();
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050b2c] to-[#0a1854] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Compact Header Section */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Find Your Perfect Property</h1>
            <p className="text-gray-300">Search through our extensive collection of properties</p>
          </div>
          
          {/* Quick Search Bar */}
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Search by location, title, description..."
                  className="w-full bg-white/10 border-2 border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-[#ffa509] focus:ring-[#ffa509] backdrop-blur-lg"
                />
                <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              <button
                type="submit"
                className="bg-[#ffa509] text-white px-6 py-3 rounded-xl hover:bg-[#ff9100] transition-colors duration-200 flex items-center justify-center gap-2 font-semibold"
              >
                <FaSearch />
                Search
              </button>
            </form>
          </div>
        </div>

        {/* Properties Header with Advanced Filters Dropdown */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <FaHome className="text-[#ffa509]" />
              Available Properties
            </h2>
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-colors duration-200 flex items-center gap-2 backdrop-blur-lg border border-white/20"
            >
              <FaSort className="text-[#ffa509]" />
              Advanced Filters
              <svg 
                className={`w-4 h-4 transition-transform duration-200 ${showAdvancedFilters ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          
          {/* Collapsible Advanced Filters */}
          {showAdvancedFilters && (
            <form onSubmit={handleSearch}>
              <div className="backdrop-blur-lg bg-white/10 rounded-xl p-6 shadow-xl space-y-6 border border-white/20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Search Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2 flex items-center gap-2">
                      <FaSearch className="text-[#ffa509]" />
                      Search
                    </label>
                    <input
                      type="text"
                      name="search"
                      value={filters.search}
                      onChange={handleFilterChange}
                      placeholder="Search properties..."
                      className="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-2 focus:border-[#ffa509] focus:ring-[#ffa509] text-white placeholder-gray-400"
                    />
                  </div>

                  {/* Property Type Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2 flex items-center gap-2">
                      <FaBuilding className="text-[#ffa509]" />
                      Property Type
                    </label>
                    <select
                      name="propertyType"
                      value={filters.propertyType}
                      onChange={handleFilterChange}
                      className="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-2 focus:border-[#ffa509] focus:ring-[#ffa509] text-white"
                    >
                      <option value="">All Property Types</option>
                      {PROPERTY_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Location Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2 flex items-center gap-2">
                      <FaMapMarkerAlt className="text-[#ffa509]" />
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={filters.location}
                      onChange={handleFilterChange}
                      placeholder="Enter location..."
                      className="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-2 focus:border-[#ffa509] focus:ring-[#ffa509] text-white placeholder-gray-400"
                    />
                  </div>

                  {/* Price Range Filters */}
                  <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-2 flex items-center gap-2">
                        <FaMoneyBillWave className="text-[#ffa509]" />
                        Min Price
                      </label>
                      <input
                        type="number"
                        name="minPrice"
                        value={filters.minPrice}
                        onChange={handleFilterChange}
                        placeholder="Enter minimum price"
                        className="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-2 focus:border-[#ffa509] focus:ring-[#ffa509] text-white placeholder-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-2 flex items-center gap-2">
                        <FaMoneyBillWave className="text-[#ffa509]" />
                        Max Price
                      </label>
                      <input
                        type="number"
                        name="maxPrice"
                        value={filters.maxPrice}
                        onChange={handleFilterChange}
                        placeholder="Enter maximum price"
                        className="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-2 focus:border-[#ffa509] focus:ring-[#ffa509] text-white placeholder-gray-400"
                      />
                    </div>
                  </div>

                  {/* Sort Options */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-200 mb-2 flex items-center gap-2">
                      <FaSort className="text-[#ffa509]" />
                      Sort By
                    </label>
                    <div className="flex gap-4">
                      <select
                        name="sortBy"
                        value={filters.sortBy}
                        onChange={handleFilterChange}
                        className="flex-1 bg-white/10 border border-gray-600 rounded-lg px-4 py-2 focus:border-[#ffa509] focus:ring-[#ffa509] text-white"
                      >
                        <option value="createdAt">Date Added</option>
                        <option value="price">Price</option>
                        <option value="title">Title</option>
                      </select>
                      <select
                        name="order"
                        value={filters.order}
                        onChange={handleFilterChange}
                        className="flex-1 bg-white/10 border border-gray-600 rounded-lg px-4 py-2 focus:border-[#ffa509] focus:ring-[#ffa509] text-white"
                      >
                        <option value="desc">Descending</option>
                        <option value="asc">Ascending</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center mt-6">
                  <button
                    type="submit"
                    className="bg-[#ffa509] text-white px-8 py-3 rounded-lg hover:bg-[#ff9100] transition-colors duration-200 flex items-center gap-2 font-semibold"
                  >
                    <FaSearch />
                    Apply Filters
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ffa509] mx-auto"></div>
            <p className="text-white mt-4">Loading properties...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="bg-red-500/20 backdrop-blur-lg border border-red-500 text-red-100 px-6 py-4 rounded-lg inline-block">
              {error}
            </div>
          </div>
        )}

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-6 mt-12">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-6 py-2 rounded-lg flex items-center gap-2 ${
                currentPage === 1
                  ? "bg-gray-600/50 cursor-not-allowed text-gray-400"
                  : "bg-[#ffa509] hover:bg-[#ff9100] text-white transition-colors duration-200"
              }`}
            >
              <FaSortAmountUp className="rotate-90" />
              Previous
            </button>
            <span className="text-white font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-6 py-2 rounded-lg flex items-center gap-2 ${
                currentPage === totalPages
                  ? "bg-gray-600/50 cursor-not-allowed text-gray-400"
                  : "bg-[#ffa509] hover:bg-[#ff9100] text-white transition-colors duration-200"
              }`}
            >
              Next
              <FaSortAmountDown className="rotate-90" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Properties() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-[#050b2c] to-[#0a1854] py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ffa509] mx-auto"></div>
          <p className="text-white mt-4">Loading properties...</p>
        </div>
      </div>
    }>
      <PropertiesContent />
    </Suspense>
  );
}
