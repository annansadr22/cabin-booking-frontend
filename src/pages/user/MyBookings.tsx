import { useState, useEffect } from "react";
import { UserLayout } from "@/components/UserLayout";
import api from "@/lib/axios";
import { useUserAuth } from "@/contexts/UserAuthContext";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
  const [confirming, setConfirming] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "cancelled">("all");

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

      const now = new Date();
      const combined = [...active_bookings, ...past_bookings];

      const filtered = combined
        .filter((booking: Booking) => {
          const slotTime = new Date(booking.slot_time);
          const isCancelled = booking.status === "Cancelled";
          const isPastActive = booking.status === "Active" && slotTime < now;
          return isCancelled || isPastActive;
        })
        .sort((a, b) => new Date(b.slot_time).getTime() - new Date(a.slot_time).getTime());

      setPastBookings(filtered);
    } catch (error) {
      toast.error("Failed to load bookings. Please try again.");
    }
  };

  const handleCancelBooking = async () => {
    if (!bookingToCancel) return;

    setIsCancelling(true);

    try {
      await api.delete(`/bookings/${bookingToCancel.id}/cancel`);
      toast.success("Booking cancelled successfully");
      setConfirming(false);
      fetchBookings();
    } catch (error) {
      toast.error("Failed to cancel the booking. Please try again.");
    } finally {
      setIsCancelling(false);
      setBookingToCancel(null);
    }
  };

  const filteredPastBookings = pastBookings.filter((booking) => {
    const slotDateISO = new Date(booking.slot_time).toISOString().slice(0, 10);

    if (selectedDate && slotDateISO !== selectedDate) return false;
    if (statusFilter === "active" && booking.status !== "Active") return false;
    if (statusFilter === "cancelled" && booking.status !== "Cancelled") return false;

    return true;
  });

  const renderBookingCard = (booking: Booking, isActive: boolean) => (
    <div key={booking.id} className="nxtwave-card mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{booking.cabin_name || "Unknown Cabin"}</h3>
          <p className="text-gray-700 mb-1">
            Slot: {new Date(booking.slot_time).toLocaleString()}
          </p>
          <p className="text-gray-700 mb-1">Duration: {booking.duration} min</p>
          <span
            className={`text-sm px-2 py-1 rounded-full inline-block mt-2 ${
              booking.status === "Active"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {booking.status}
          </span>
        </div>

        {isActive && (
          <button
            onClick={() => {
              setBookingToCancel(booking);
              setConfirming(true);
            }}
            disabled={isCancelling}
            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 text-sm"
          >
            Cancel Booking
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
          <p className="text-gray-600">View and manage all your cabin bookings</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Active bookings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Active Bookings</h2>
            {activeBookings.length === 0 ? (
              <p className="text-gray-600">You have no active bookings.</p>
            ) : (
              activeBookings.map((booking) => renderBookingCard(booking, true))
            )}
          </div>

          {/* Past bookings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-3">
              <h2 className="text-xl font-semibold">Past Bookings</h2>
              <div className="flex gap-2 items-center">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="border rounded px-3 py-1 text-sm"
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="border rounded px-3 py-1 text-sm"
                >
                  <option value="all">All</option>
                  <option value="active">Only Active</option>
                  <option value="cancelled">Only Cancelled</option>
                </select>
              </div>
            </div>
            {filteredPastBookings.length === 0 ? (
              <p className="text-gray-600">No bookings found for selected filter.</p>
            ) : (
              filteredPastBookings.map((booking) => renderBookingCard(booking, false))
            )}
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={confirming} onOpenChange={setConfirming}>
        <DialogContent>
          <h2 className="text-xl font-semibold mb-4">Cancel Booking</h2>
          <p>
            Are you sure you want to cancel your booking for{" "}
            <strong>{bookingToCancel?.cabin_name}</strong> at{" "}
            <strong>{new Date(bookingToCancel?.slot_time || "").toLocaleString()}</strong>?
          </p>
          <DialogFooter>
            <Button onClick={() => setConfirming(false)} variant="outline">
              No, keep it
            </Button>
            <Button
              className="nxtwave-btn bg-red-500 hover:bg-red-600"
              onClick={handleCancelBooking}
              disabled={isCancelling}
            >
              {isCancelling ? "Cancelling..." : "Yes, cancel it"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </UserLayout>
  );
};

export default MyBookings;