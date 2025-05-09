// src/pages/admin/ManageBookings.tsx
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import api from "@/lib/axios";
import { formatDateTimeRange } from "@/utils/dateUtils";
import { toast } from "sonner";

interface Booking {
  id: number;
  user_id: number;
  cabin_id: number;
  slot_time: string;
  duration: number;
  status: string;
  user_name?: string;
  cabin_name?: string;
}

const ManageBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter states
  const [userFilter, setUserFilter] = useState("");
  const [cabinFilter, setCabinFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // ✅ Fetch All Bookings from Backend (Admin Only)
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get("/bookings/admin/all-bookings");
        setBookings(response.data.all_bookings);
        setFilteredBookings(response.data.all_bookings);
      } catch (error) {
        toast.error("Failed to load bookings. Please try again.");
      }
    };
    fetchBookings();
  }, []);

  // ✅ Apply Filters Dynamically
  useEffect(() => {
    let result = bookings;

    if (userFilter) {
      result = result.filter((booking) =>
        booking.user_name?.toLowerCase().includes(userFilter.toLowerCase())
      );
    }

    if (cabinFilter) {
      result = result.filter((booking) =>
        booking.cabin_name?.toLowerCase().includes(cabinFilter.toLowerCase())
      );
    }

    if (statusFilter) {
      result = result.filter((booking) => booking.status === statusFilter);
    }

    if (dateFilter) {
      const filterDate = new Date(dateFilter).toDateString();
      result = result.filter((booking) => {
        const bookingDate = new Date(booking.slot_time).toDateString();
        return bookingDate === filterDate;
      });
    }

    setFilteredBookings(result);
  }, [bookings, userFilter, cabinFilter, statusFilter, dateFilter]);

  // ✅ Handle Booking Deletion (Admin Only)
  const handleDeleteBooking = async (bookingId: number) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;

    setIsDeleting(true);
    try {
      await api.delete(`/bookings/admin/${bookingId}/delete`);
      setBookings((prev) => prev.filter((booking) => booking.id !== bookingId));
      toast.success("Booking deleted successfully");
    } catch (error) {
      toast.error("Failed to delete booking. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleResetFilters = () => {
    setUserFilter("");
    setCabinFilter("");
    setStatusFilter("");
    setDateFilter("");
  };

  return (
    <AdminLayout>
      <div className="animate-fade-in">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Manage Bookings</h1>
          <p className="text-gray-600">View and manage all cabin bookings</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Filter Bookings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <input
                type="text"
                className="form-input"
                placeholder="Filter by User"
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
              />
            </div>
            <div>
              <input
                type="text"
                className="form-input"
                placeholder="Filter by Cabin"
                value={cabinFilter}
                onChange={(e) => setCabinFilter(e.target.value)}
              />
            </div>
            <div>
              <select
                className="form-input"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <input
                type="date"
                className="form-input"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Bookings List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">
            All Bookings ({filteredBookings.length})
          </h2>

          {filteredBookings.length === 0 ? (
            <p className="text-gray-600 py-4 text-center">
              No bookings found with the current filters.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>User</th>
                    <th>Cabin</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td>{booking.id}</td>
                      <td>{booking.user_name || "Unknown User"}</td>
                      <td>{booking.cabin_name || "Unknown Cabin"}</td>
                      <td>{new Date(booking.slot_time).toLocaleString()}</td>
                      <td>{booking.status}</td>
                      <td>
                        <button
                          onClick={() => handleDeleteBooking(booking.id)}
                          disabled={isDeleting}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageBookings;
