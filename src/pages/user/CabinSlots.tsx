// src/pages/user/CabinSlots.tsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { UserLayout } from "@/components/UserLayout";
import api from "@/lib/axios";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface AvailableSlots {
  cabin_name: string;
  available_slots: Record<string, string[]>;
  booked_slots: string[];  // ✅ Booked slots directly from the API
}

const CabinSlots = () => {
  const { cabinId } = useParams<{ cabinId: string }>();
  const [slots, setSlots] = useState<AvailableSlots | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  // ✅ Fetch Slots Function
  const fetchSlots = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/bookings/${cabinId}/available-slots`);
      setSlots(response.data);
    } catch (err) {
      setError("Failed to load available slots");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cabinId) fetchSlots();
  }, [cabinId]);

  // ✅ Calculate Current IST Time (Client-Side)
  const getCurrentISTTime = () => {
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in milliseconds
    return new Date(now.getTime() + istOffset - now.getTimezoneOffset() * 60 * 1000);
  };

  const handleBookSlot = async () => {
    if (!selectedSlot) return;

    try {
      await api.post(`/bookings/${cabinId}/book-selected-slot`, {
        selected_slot: selectedSlot
      });
      toast.success("Slot booked successfully!");
      setConfirming(false);
      setSelectedSlot(null);
      fetchSlots();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Failed to book the selected slot");
    }
  };

  const renderSlots = () => {
    if (!slots || Object.keys(slots.available_slots).length === 0) {
      return <p className="text-gray-500 text-lg">No available slots for today or tomorrow.</p>;
    }

    return Object.entries(slots.available_slots).map(([date, times]) => (
      <div key={date} className="mb-4">
        <h3 className="text-lg font-semibold">{date}</h3>
        <div className="flex flex-wrap gap-2 mt-2">
          {times.map((time) => {
            const isBooked = slots.booked_slots.includes(time.split(" ")[0] + " " + time.split(" ")[1]);
            const isPast = time.includes("(Past)");

            return (
              <button
                key={time}
                className={`nxtwave-btn transition duration-200 ${
                  isPast 
                    ? "bg-gray-200 text-gray-600 border-gray-400 cursor-not-allowed"
                    : isBooked 
                    ? "bg-blue-100 text-blue-700 border-blue-300 cursor-not-allowed"
                    : "bg-green-100 text-green-700 hover:bg-green-200"
                }`}
                onClick={() => {
                  if (!isPast && !isBooked) {
                    setSelectedSlot(time);
                    setConfirming(true);
                  }
                }}
                disabled={isPast || isBooked}
                title={isPast ? "Past Slot" : isBooked ? "Already Booked" : ""}
              >
                {time}
              </button>
            );
          })}
        </div>
      </div>
    ));
  };

  return (
    <UserLayout>
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-800">Available Slots</h1>
        {slots ? <h2 className="text-xl">{slots.cabin_name}</h2> : null}
        {loading ? <p>Loading slots...</p> : error ? <p className="text-red-500">{error}</p> : renderSlots()}

        {/* Confirmation Dialog */}
        <Dialog open={confirming} onOpenChange={setConfirming}>
          <DialogContent>
            <h2 className="text-xl font-semibold mb-4">Confirm Booking</h2>
            <p>Are you sure you want to book the slot at <strong>{selectedSlot}</strong>?</p>
            <DialogFooter>
              <Button onClick={() => setConfirming(false)} variant="outline">Cancel</Button>
              <Button onClick={handleBookSlot} className="nxtwave-btn">Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </UserLayout>
  );
};

export default CabinSlots;
