// src/pages/user/MyBookings.tsx
import { useState, useEffect } from "react";
import { UserLayout } from "@/components/UserLayout";
import api from "@/lib/axios";
import { useUserAuth } from "@/contexts/UserAuthContext";
import { toast } from "sonner";

interface Booking {
  id: number;
  cabin_id: number;
  user_id: number;
  slot_time: string;
  duration: number;
  status: string;
  cabin_name?: string;
}

const MyBookings = () => {
  const { user } = useUserAuth();
  const [activeBookings, setActiveBookings] = useState<Booking[]>([]);
  const [pastBookings, setPastBookings] = useState<Booking[]>([]);
  const [isCancelling, setIsCancelling] = useState(false);
  
  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      const response = await api.get("/bookings/my-bookings");
      const { active_bookings, past_bookings } = response.data;

      setActiveBookings(active_bookings);
      setPastBookings(past_bookings);
    } catch (error) {
      toast.error("Failed to load bookings. Please try again.");
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    setIsCancelling(true);

    try {
      await api.delete(`/bookings/${bookingId}/cancel`);
      toast.success("Booking cancelled successfully");
      fetchBookings(); // Refresh bookings after cancellation
    } catch (error) {
      toast.error("Failed to cancel the booking. Please try again.");
    } finally {
      setIsCancelling(false);
    }
  };

  const renderBookingCard = (booking: Booking, isActive: boolean) => (
    <div key={booking.id} className="nxtwave-card mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{booking.cabin_name || "Unknown Cabin"}</h3>
          <p className="text-gray-700 mb-2">Slot: {new Date(booking.slot_time).toLocaleString()}</p>
          <p className="text-sm text-gray-500">Booking ID: {booking.id}</p>
          <span className={`text-sm px-2 py-1 rounded-full inline-block mt-2 ${
            booking.status === "Active" 
              ? "bg-green-100 text-green-800" 
              : "bg-red-100 text-red-800"
          }`}>
            {booking.status}
          </span>
        </div>
        
        {isActive && (
          <button
            onClick={() => handleCancelBooking(booking.id)}
            disabled={isCancelling}
            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 text-sm"
          >
            {isCancelling ? "Cancelling..." : "Cancel Booking"}
          </button>
        )}
      </div>
    </div>
  );
  
  return (
    <UserLayout>
      <div className="animate-fade-in">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Bookings</h1>
          <p className="text-gray-600">
            View and manage all your cabin bookings
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Active bookings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Active Bookings</h2>
            {activeBookings.length === 0 ? (
              <p className="text-gray-600">You have no active bookings.</p>
            ) : (
              activeBookings.map(booking => renderBookingCard(booking, true))
            )}
          </div>
          
          {/* Past bookings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Past Bookings</h2>
            {pastBookings.length === 0 ? (
              <p className="text-gray-600">You have no past bookings.</p>
            ) : (
              pastBookings.map(booking => renderBookingCard(booking, false))
            )}
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default MyBookings;
